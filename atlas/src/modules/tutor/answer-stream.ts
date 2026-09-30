/**
 * Incremental reader for the streaming JSON document the tutor model returns.
 *
 * The model streams one JSON object (`{"answer": "...", "citations": [...]}`);
 * a caller that forwarded the raw deltas to a student would show them the
 * document, not the answer. This walks the document as it arrives and emits the
 * decoded text of the top-level `"answer"` string value.
 *
 * It is a scanner, not a JSON parser: it tracks just enough structure (nesting
 * depth, string state, the depth-1 key being read) to know which string is the
 * answer. Anything else is ignored — the same words inside another key's value,
 * or an `"answer"` key nested deeper, must not be mistaken for it. Malformed or
 * non-JSON input never throws: the extractor simply emits nothing.
 */

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

export function createAnswerExtractor(): {
  /** Feed the next raw chunk of the streaming JSON document; returns the answer text that became readable. */
  push(chunk: string): string;
  /** The answer accumulated so far. */
  readonly answer: string;
} {
  let depth = 0; // open arrays/objects, relative to the top-level document
  let inString = false; // inside any string literal
  let escaped = false; // the previous character inside a string was a backslash
  let readingKey = false; // the open string is a depth-1 object key
  let expectKey = false; // the next string at depth 1 is a key
  let keyMatch = false; // the last depth-1 key read was "answer"
  let keyBuf = "";
  let capturing = false; // the open string is the answer value
  let unicode: string | null = null; // hex digits collected for a \u escape
  let captured = "";

  function push(chunk: string): string {
    let out = "";
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
          out += decoded;
          captured += decoded;
          unicode = null;
        }
        continue;
      }
      if (inString) {
        if (escaped) {
          escaped = false;
          if (capturing) {
            if (ch === "u") unicode = "";
            else {
              const decoded = ESCAPES[ch] ?? ch;
              out += decoded;
              captured += decoded;
            }
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
            keyMatch = keyBuf === "answer";
            keyBuf = "";
          } else if (capturing) {
            capturing = false;
          }
          continue;
        }
        if (readingKey) {
          keyBuf += ch;
          continue;
        }
        if (capturing) {
          out += ch;
          captured += ch;
        }
        continue;
      }
      switch (ch) {
        case '"':
          inString = true;
          if (depth === 1 && expectKey) {
            readingKey = true;
            keyBuf = "";
          } else if (depth === 1 && keyMatch) {
            capturing = true;
          }
          break;
        case "{":
        case "[":
          depth += 1;
          // Entering the top-level object: its first string is a key.
          if (depth === 1) {
            expectKey = true;
            keyMatch = false;
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
    get answer() {
      return captured;
    },
  };
}
