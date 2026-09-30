/**
 * Incremental reader for the streaming JSON document the tutor model returns.
 *
 * The model streams one JSON object (`{"status": "...", "answer": "...",
 * "citations": [...]}`); a caller that forwarded the raw deltas to a student
 * would show them the document, not the readable text. This walks the document
 * as it arrives and emits the decoded text of the top-level `"status"` and
 * `"answer"` string values — `status` first in the document, so the UI can show
 * what the model is doing while the answer is still being written.
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
export type TutorStreamDelta = Readonly<Partial<Record<TutorStreamField, string>>>;

export function createTutorFieldExtractor(): {
  /** Feed the next raw chunk; returns the field text that became readable. */
  push(chunk: string): TutorStreamDelta;
  /** The `status` text accumulated so far. */
  readonly status: string;
  /** The `answer` text accumulated so far. */
  readonly answer: string;
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

  function push(chunk: string): TutorStreamDelta {
    const out: Partial<Record<TutorStreamField, string>> = {};
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
          if (capturing) {
            if (ch === "u") unicode = "";
            else emit(capturing, ESCAPES[ch] ?? ch);
          }
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === '"') {
          inString = false;
          if (readingKey) {
            readingKey = false;
            expectKey = false;
            keyMatch = TRACKED[keyBuf] ?? null;
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
        if (capturing) emit(capturing, ch);
        continue;
      }
      switch (ch) {
        case '"':
          inString = true;
          if (depth === 1 && expectKey) {
            readingKey = true;
            keyBuf = "";
          } else if (depth === 1 && keyMatch) {
            capturing = keyMatch;
          }
          break;
        case "{":
        case "[":
          depth += 1;
          // Entering the top-level object: its first string is a key.
          if (depth === 1) {
            expectKey = true;
            keyMatch = null;
          }
          break;
        case "}":
        case "]":
          depth = Math.max(0, depth - 1);
          if (depth === 1) expectKey = false;
          break;
        case ",":
          if (depth === 1) expectKey = true;
          break;
        default:
          break;
      }
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
  };
}
