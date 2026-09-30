import { describe, expect, it } from "vitest";

import { createTutorFieldExtractor } from "./answer-stream";

/** Drives the extractor one chunk at a time and returns each field's concatenated deltas. */
function extract(chunks: readonly string[]): { status: string; answer: string } {
  const extractor = createTutorFieldExtractor();
  let status = "";
  let answer = "";
  for (const chunk of chunks) {
    const delta = extractor.push(chunk);
    status += delta.status ?? "";
    answer += delta.answer ?? "";
  }
  return { status, answer };
}

const doc = JSON.stringify({
  status: "analisando a lógica",
  answer: "A lógica estuda o raciocínio.",
  citations: [{ path: "p.md", quote: "linha" }],
  proposedNotebookActions: [],
});

describe("createTutorFieldExtractor", () => {
  it("reads both fields from a document delivered whole", () => {
    expect(extract([doc])).toEqual({ status: "analisando a lógica", answer: "A lógica estuda o raciocínio." });
  });

  it("reads both fields when they arrive one character at a time", () => {
    expect(extract([...doc])).toEqual({ status: "analisando a lógica", answer: "A lógica estuda o raciocínio." });
  });

  it("names which field produced the readable text", () => {
    const extractor = createTutorFieldExtractor();
    expect(extractor.push('{"status": "ok"')).toEqual({ status: "ok" });
    expect(extractor.push(', "answer": "sim"')).toEqual({ answer: "sim" });
    expect(extractor.status).toBe("ok");
    expect(extractor.answer).toBe("sim");
  });

  it("reads the answer when it is not the first tracked key", () => {
    const document = `{"citations": [], "status": "buscando", "answer": "resposta", "proposedNotebookActions": []}`;
    expect(extract([...document])).toEqual({ status: "buscando", answer: "resposta" });
  });

  it("keeps status and answer apart across a chunk boundary that lands between them", () => {
    // The chunk ends on the comma closing the status value; the answer key and
    // value arrive whole in the next chunk. status must not leak into answer.
    const document = '{"status": "analisando", "answer": "verdadeira resposta"}';
    const split = ['{"status": "analisando"', ', "answer": "verdadeira resposta"}'];
    expect(split.join("")).toBe(document);
    expect(extract(split)).toEqual({ status: "analisando", answer: "verdadeira resposta" });
  });

  it("keeps the status value from swallowing the answer when split mid-key", () => {
    const document = '{"status": "comparando as listas", "answer": "iguais"}';
    const split = ['{"status": "comparando as listas", "ans', 'wer": "igu', 'ais"}'];
    expect(split.join("")).toBe(document);
    expect(extract(split)).toEqual({ status: "comparando as listas", answer: "iguais" });
  });

  it("does not read words from one tracked field into the other", () => {
    const document = `{"status": "answer: nada, é só o status", "answer": "a resposta de verdade"}`;
    expect(extract([...document])).toEqual({ status: "answer: nada, é só o status", answer: "a resposta de verdade" });
  });

  it("emits nothing for status when the document has no status key", () => {
    const document = `{"answer": "resposta", "citations": []}`;
    expect(extract([...document])).toEqual({ status: "", answer: "resposta" });
  });

  it("decodes escapes split across a chunk boundary", () => {
    // The value is `a\\b"c\nd\te\u00e9f`; each escape pair is split mid-sequence
    // so the backslash lands at the end of one chunk and its partner at the
    // start of the next. `\u00e9` is split between the `u` and its hex digits.
    const document = '{"answer": "a\\\\b\\"c\\nd\\te\\u00e9f"}';
    const split = ["{\"answer\": \"a\\", "\\b\\", "\"c\\n", "d\\t", "e\\u00", "e9f\"}"];
    expect(split.join("")).toBe(document);
    expect(extract(split).answer).toBe('a\\b"c\nd\te\u00e9f');
  });

  it("decodes escapes split across a chunk boundary inside status", () => {
    const document = '{"status": "an\\u00e1lise", "answer": "x"}';
    const split = ['{"status": "an\\', 'u00', 'e1lise", "answer": "x"}'];
    expect(split.join("")).toBe(document);
    expect(extract(split)).toEqual({ status: "análise", answer: "x" });
  });

  it("keeps a \\\" inside the value from terminating it", () => {
    const document = '{"answer": "ele disse \\"oi\\" e saiu", "citations": []}';
    expect(extract([...document]).answer).toBe('ele disse "oi" e saiu');
  });

  it("does not emit the same words found in another key's value before the answer", () => {
    const document = `{"note": "answer: a lógica estuda o raciocínio.", "answer": "verdadeira resposta"}`;
    expect(extract([...document]).answer).toBe("verdadeira resposta");
  });

  it("does not read a tracked key nested below the top level", () => {
    const document = `{"meta": {"answer": "aninhada", "status": "aninhado"}, "answer": "topo", "status": "superfície"}`;
    expect(extract([...document])).toEqual({ status: "superfície", answer: "topo" });
  });

  it("emits what is readable from a document that never closes, then stops", () => {
    const extractor = createTutorFieldExtractor();
    expect(extractor.push('{"status": "buscando", "answer": "par')).toEqual({ status: "buscando", answer: "par" });
    expect(extractor.status).toBe("buscando");
    expect(extractor.answer).toBe("par");
    expect(extractor.push("cial")).toEqual({ answer: "cial" });
    expect(extractor.answer).toBe("parcial");
    expect(extractor.push("")).toEqual({});
  });

  it("emits nothing and never throws for input that is not JSON", () => {
    expect(() => extract(["not json at all", "{broken", '"answer": sem chaves'])).not.toThrow();
    expect(extract(["not json at all", "{broken"])).toEqual({ status: "", answer: "" });
  });

  it("emits nothing for a JSON document with no tracked key", () => {
    expect(extract([`{"citations": [], "note": "sem resposta"}`])).toEqual({ status: "", answer: "" });
  });

  it("emits nothing when a tracked value is not a string", () => {
    expect(extract([`{"status": 42, "answer": null, "citations": []}`])).toEqual({ status: "", answer: "" });
  });

  it("reports the citations field closing and its raw JSON text", () => {
    const extractor = createTutorFieldExtractor();
    expect(extractor.citationsClosed).toBe(false);
    expect(extractor.citations).toBe("");

    const delta = extractor.push(`{"status": "buscando", "citations": [{"path": "p.md", "quote": "linha"}], "answer": "ok"}`);

    expect(delta.citations).toBe(`[{"path": "p.md", "quote": "linha"}]`);
    expect(delta.answer).toBe("ok");
    expect(extractor.citations).toBe(`[{"path": "p.md", "quote": "linha"}]`);
    expect(extractor.citationsClosed).toBe(true);
  });

  it("reports the citations close once, with its text, across chunk boundaries", () => {
    const extractor = createTutorFieldExtractor();
    expect(extractor.push(`{"citations": [{"path": "p.md"`).citations).toBeUndefined();
    expect(extractor.citationsClosed).toBe(false);

    const delta = extractor.push(`, "quote": "a]b"}], "answer": "x"}`);

    // The `]` inside the quoted text must not close the array early; the raw
    // text is the whole value, verbatim.
    expect(delta.citations).toBe(`[{"path": "p.md", "quote": "a]b"}]`);
    expect(delta.answer).toBe("x");
    expect(extractor.citationsClosed).toBe(true);
    expect(extractor.push("")).toEqual({});
  });

  it("never reports a citations close for a document that ends first", () => {
    const extractor = createTutorFieldExtractor();
    extractor.push(`{"citations": [{"path": "p.md"`);
    expect(extractor.citationsClosed).toBe(false);
    expect(extractor.citations).toBe("");
  });

  it("reports an empty citations array as closed", () => {
    const extractor = createTutorFieldExtractor();
    expect(extractor.push(`{"citations": []}`).citations).toBe("[]");
    expect(extractor.citationsClosed).toBe(true);
  });
});
