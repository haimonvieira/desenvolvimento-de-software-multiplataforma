/**
 * Incremental reader for the streaming JSON document the tutor model returns.
 *
 * The model streams one JSON object, in the order the prompt demands —
 * `status`, `citations`, `answer`, `proposedNotebookActions`. A caller that
 * forwarded the raw deltas to a student would show them the document, not the
 * readable text. This walks the document as it arrives and emits the decoded
 * text of the top-level `"status"` and `"answer"` string values — `status`
 * first, so the UI can show what the model is doing while the answer is still
 * being written — plus the raw JSON text of `"citations"` the moment that
 * value closes, so the caller can `JSON.parse` it, validate the citations
 * against the turn's excerpts, and only then let the answer reach the student.
 *
 * It is a scanner, not a JSON parser: it tracks just enough structure (nesting
 * depth, string state, the depth-1 key being read) to know which string belongs
 * to which field. Anything else is ignored — the same words inside another
 * key's value, or a tracked key nested deeper, must not be mistaken for it.
 * Malformed or non-JSON input never throws: the extractor simply emits nothing.
 */

/** The depth-1 string fields the tutor streams, in document order. */
export type TutorStreamField = "status" | "answer";

const TRACKED: Readonly<Record<string, TutorStreamField>> = Object.freeze({
  status: "status",
  answer: "answer",
});

/**
 * The one depth-1 field whose *raw JSON text* the caller needs. `citations` is
 * an array of objects, not a string, so it is recorded verbatim (brackets,
 * quotes, escapes) rather than decoded — the caller parses and validates it.
 */
const RAW_TRACKED: Readonly<Record<string, true>> = Object.freeze({
  citations: true,
});

const ESCAPES: Readonly<Record<string, string>> = Object.freeze({
  '"': '"',
  "\\": "\\",
  "/": "/",
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
});

const HEX = /^[0-9a-fA-F]$/;

/** The readable text of each field that became available in one chunk. */
export type TutorStreamDelta = Readonly<{
  status?: string;
  answer?: string;
  /** The raw JSON text of the depth-1 `citations` value, once it has closed. */
  citations?: string;
}>;

export function createTutorFieldExtractor(): {
  /** Feed the next raw chunk; returns the field text that became readable. */
  push(chunk: string): TutorStreamDelta;
  /** The `status` text accumulated so far. */
  readonly status: string;
  /** The `answer` text accumulated so far. */
  readonly answer: string;
  /** The raw JSON text of the `citations` value; empty until it closes. */
  readonly citations: string;
  /** Whether the depth-1 `citations` value has closed. */
  readonly citationsClosed: boolean;
} {
  let depth = 0; // open arrays/objects, relative to the top-level document
  let inString = false; // inside any string literal
  let escaped = false; // the previous character inside a string was a backslash
  let readingKey = false; // the open string is a depth-1 object key
  let expectKey = false; // the next string at depth 1 is a key
  let keyMatch: TutorStreamField | null = null; // the last depth-1 key read, if tracked
  let keyBuf = "";
  let capturing: TutorStreamField | null = null; // the open string is a tracked value
  let unicode: string | null = null; // hex digits collected for a \u escape
  const captured: Record<TutorStreamField, string> = { status: "", answer: "" };

  let rawArmed = false; // the last depth-1 key was `citations`; its value comes next
  let rawActive = false; // currently inside that value
  let rawKind: "structured" | "string" | "scalar" = "scalar";
  let rawBuf = "";
  let citationsText = "";
  let citationsClosed = false;
  let citationsJustClosed = false; // report the close exactly once

  function finishRaw(): void {
    citationsText = rawBuf;
    citationsClosed = true;
    citationsJustClosed = true;
    rawActive = false;
    rawBuf = "";
    rawKind = "scalar";
  }

  function push(chunk: string): TutorStreamDelta {
    const out: { status?: string; answer?: string; citations?: string } = {};
    const emit = (field: TutorStreamField, text: string) => {
      out[field] = (out[field] ?? "") + text;
      captured[field] += text;
    };
    for (const ch of chunk) {
      if (unicode !== null) {
        // A \u escape whose hex digits may land in later chunks.
        if (!HEX.test(ch)) {
          unicode = null;
          continue;
        }
        unicode += ch;
        if (rawActive) rawBuf += ch;
        if (unicode.length === 4) {
          const decoded = String.fromCharCode(parseInt(unicode, 16));
          if (capturing) emit(capturing, decoded);
          unicode = null;
        }
        continue;
      }
      if (inString) {
        if (escaped) {
          escaped = false;
          if (rawActive) rawBuf += ch;
          if (capturing) {
            if (ch === "u") unicode = "";
            else emit(capturing, ESCAPES[ch] ?? ch);
          }
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          if (rawActive) rawBuf += ch;
          continue;
        }
        if (ch === '"') {
          inString = false;
          if (rawActive) {
            // The closing quote of the raw value (kind "string") or of a
            // string nested inside it (kind "structured").
            rawBuf += ch;
            if (rawKind === "string") finishRaw();
            continue;
          }
          if (readingKey) {
            readingKey = false;
            expectKey = false;
            keyMatch = TRACKED[keyBuf] ?? null;
            rawArmed = RAW_TRACKED[keyBuf] === true;
            keyBuf = "";
          } else if (capturing) {
            capturing = null;
          }
          continue;
        }
        if (readingKey) {
          keyBuf += ch;
          continue;
        }
        if (rawActive) {
          rawBuf += ch;
          continue;
        }
        if (capturing) emit(capturing, ch);
        continue;
      }
      switch (ch) {
        case '"':
          inString = true;
          if (rawActive) {
            rawBuf += ch; // a string nested in the raw citations value
          } else if (depth === 1 && rawArmed) {
            rawActive = true;
            rawKind = "string";
            rawBuf = ch;
            rawArmed = false;
          } else if (depth === 1 && expectKey) {
            readingKey = true;
            keyBuf = "";
          } else if (depth === 1 && keyMatch) {
            capturing = keyMatch;
          }
          break;
        case "{":
        case "[":
          if (rawActive) {
            rawBuf += ch;
          } else if (depth === 1 && rawArmed) {
            rawActive = true;
            rawKind = "structured";
            rawBuf = ch;
            rawArmed = false;
          }
          depth += 1;
          // Entering the top-level object: its first string is a key.
          if (depth === 1) {
            expectKey = true;
            keyMatch = null;
          }
          break;
        case "}":
        case "]":
          if (rawActive) {
            rawBuf += ch;
            depth = Math.max(0, depth - 1);
            if (rawKind === "structured" && depth === 1) finishRaw();
          } else {
            depth = Math.max(0, depth - 1);
          }
          if (depth === 1) expectKey = false;
          rawArmed = false;
          break;
        case ",":
          if (rawActive && rawKind === "scalar") finishRaw();
          else if (rawActive) rawBuf += ch; // a comma inside the raw value
          rawArmed = false;
          if (depth === 1) expectKey = true;
          break;
        default:
          if (rawActive) {
            rawBuf += ch; // whitespace, colons, digits — the raw text is verbatim
          } else if (depth === 1 && rawArmed && ch !== ":" && !" \t\r\n".includes(ch)) {
            // The value opens straight after the colon.
            rawActive = true;
            rawKind = "scalar";
            rawBuf = ch;
            rawArmed = false;
          }
          break;
      }
    }
    if (citationsJustClosed) {
      out.citations = citationsText;
      citationsJustClosed = false;
    }
    return out;
  }

  return {
    push,
    get status() {
      return captured.status;
    },
    get answer() {
      return captured.answer;
    },
    get citations() {
      return citationsText;
    },
    get citationsClosed() {
      return citationsClosed;
    },
  };
}
