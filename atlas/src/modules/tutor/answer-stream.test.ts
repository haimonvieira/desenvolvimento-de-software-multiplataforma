import { describe, expect, it } from "vitest";

import { createAnswerExtractor } from "./answer-stream";

/** Drives the extractor one chunk at a time and returns the concatenated output. */
function extract(chunks: readonly string[]): { emitted: string; answer: string } {
  const extractor = createAnswerExtractor();
  let emitted = "";
  for (const chunk of chunks) emitted += extractor.push(chunk);
  return { emitted, answer: extractor.answer };
}

const doc = JSON.stringify({
  answer: "A lógica estuda o raciocínio.",
  citations: [{ path: "p.md", quote: "linha" }],
  proposedNotebookActions: [],
});

describe("createAnswerExtractor", () => {
  it("reads the answer from a document delivered whole", () => {
    expect(extract([doc]).emitted).toBe("A lógica estuda o raciocínio.");
  });

  it("reads the answer when it arrives one character at a time", () => {
    const { emitted, answer } = extract([...doc]);
    expect(emitted).toBe("A lógica estuda o raciocínio.");
    expect(answer).toBe("A lógica estuda o raciocínio.");
  });

  it("reads the answer when it is not the first key", () => {
    const document = `{"citations": [], "answer": "resposta", "proposedNotebookActions": []}`;
    expect(extract([...document]).emitted).toBe("resposta");
  });

  it("decodes escapes split across a chunk boundary", () => {
    // The value is `a\\b"c\nd\te\u00e9f`; each escape pair is split mid-sequence
    // so the backslash lands at the end of one chunk and its partner at the
    // start of the next. `\u00e9` is split between the `u` and its hex digits.
    const document = '{"answer": "a\\\\b\\"c\\nd\\te\\u00e9f"}';
    const split = ["{\"answer\": \"a\\", "\\b\\", "\"c\\n", "d\\t", "e\\u00", "e9f\"}"];
    expect(split.join("")).toBe(document);
    expect(extract(split).emitted).toBe('a\\b"c\nd\te\u00e9f');
  });

  it("keeps a \\\" inside the value from terminating it", () => {
    const document = '{"answer": "ele disse \\"oi\\" e saiu", "citations": []}';
    expect(extract([...document]).emitted).toBe('ele disse "oi" e saiu');
  });

  it("does not emit the same words found in another key's value before the answer", () => {
    const document = `{"note": "answer: a lógica estuda o raciocínio.", "answer": "verdadeira resposta"}`;
    expect(extract([...document]).emitted).toBe("verdadeira resposta");
  });

  it("does not read an answer key nested below the top level", () => {
    const document = `{"meta": {"answer": "aninhada"}, "answer": "topo"}`;
    expect(extract([...document]).emitted).toBe("topo");
  });

  it("emits what is readable from a document that never closes, then stops", () => {
    const extractor = createAnswerExtractor();
    expect(extractor.push('{"answer": "parcial')).toBe("parcial");
    expect(extractor.answer).toBe("parcial");
    expect(extractor.push("")).toBe("");
  });

  it("emits nothing and never throws for input that is not JSON", () => {
    expect(() => extract(["not json at all", "{broken", '"answer": sem chaves'])).not.toThrow();
    expect(extract(["not json at all", "{broken"]).emitted).toBe("");
  });

  it("emits nothing for a JSON document with no answer key", () => {
    expect(extract([`{"citations": [], "note": "sem resposta"}`]).emitted).toBe("");
  });

  it("emits nothing when the answer value is not a string", () => {
    expect(extract([`{"answer": 42, "citations": []}`]).emitted).toBe("");
  });
});
