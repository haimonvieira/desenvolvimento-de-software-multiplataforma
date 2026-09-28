import { describe, expect, it } from "vitest";

import {
  MAX_BATCH_BYTES,
  MAX_FILE_BYTES,
  validateUploadBatch,
  type UploadCandidate,
} from "./validate-upload";

function candidate(overrides: Partial<UploadCandidate> = {}): UploadCandidate {
  return {
    destination: "DSM1/ALP/aula-01.pdf",
    mimeType: "application/pdf",
    size: 1024,
    ...overrides,
  };
}

describe("upload trust-boundary validation", () => {
  it.each([
    ["parent traversal", "../secret.pdf"],
    ["nested traversal", "DSM1/../../etc/passwd"],
    ["absolute path", "/DSM1/ALP/aula.pdf"],
    ["backslash separator", "DSM1\\ALP\\aula.pdf"],
    ["dot segment", "DSM1/./ALP/aula.pdf"],
    ["empty segment", "DSM1//ALP/aula.pdf"],
    ["drive letter", "C:/DSM1/aula.pdf"],
    ["encoded traversal", "DSM1/%2e%2e/secret.pdf"],
  ])("rejects path traversal: %s", (_name, destination) => {
    expect(validateUploadBatch([candidate({ destination })]).ok).toBe(false);
  });

  it.each([
    ["NUL byte", "DSM1/ALP/aula\0.pdf"],
    ["control character", "DSM1/ALP/aul\x01a.pdf"],
    ["DEL character", "DSM1/ALP/aula\x7f.pdf"],
    ["newline", "DSM1/ALP/aula\n.pdf"],
  ])("rejects control characters: %s", (_name, destination) => {
    expect(validateUploadBatch([candidate({ destination })]).ok).toBe(false);
  });

  it.each([
    ["CON", "DSM1/ALP/CON.pdf"],
    ["NUL", "DSM1/ALP/nul.txt"],
    ["COM1", "DSM1/COM1/aula.pdf"],
    ["LPT9", "DSM1/ALP/lpt9.md"],
    ["AUX bare", "AUX"],
  ])("rejects reserved names: %s", (_name, destination) => {
    expect(validateUploadBatch([candidate({ destination })]).ok).toBe(false);
  });

  it.each(["exe", "dll", "bat", "cmd", "com", "scr", "msi", "ps1", "vbs"])(
    "rejects executable extension: %s",
    (extension) => {
      expect(
        validateUploadBatch([
          candidate({
            destination: `DSM1/ALP/setup.${extension}`,
            mimeType: "application/octet-stream",
          }),
        ]).ok,
      ).toBe(false);
    },
  );

  it.each([
    ["pdf served as html", "aula.pdf", "text/html"],
    ["docx served as zip", "aula.docx", "application/zip"],
    ["png served as pdf", "aula.png", "application/pdf"],
    ["txt served as javascript", "aula.txt", "text/javascript"],
  ])("rejects MIME/extension mismatch: %s", (_name, destination, mimeType) => {
    expect(validateUploadBatch([candidate({ destination, mimeType })]).ok).toBe(false);
  });

  it("rejects duplicate normalized destinations", () => {
    const result = validateUploadBatch([
      candidate({ destination: "DSM1/ALP/aula.pdf" }),
      candidate({ destination: "dsm1/alp/AULA.pdf", mimeType: "application/pdf" }),
    ]);
    expect(result.ok).toBe(false);
  });

  it("rejects a 0-byte file", () => {
    expect(validateUploadBatch([candidate({ size: 0 })]).ok).toBe(false);
  });

  it("rejects a file one byte above 10 MiB", () => {
    expect(validateUploadBatch([candidate({ size: MAX_FILE_BYTES + 1 })]).ok).toBe(false);
  });

  it("rejects a batch one byte above 25 MiB", () => {
    const size = Math.floor(MAX_BATCH_BYTES / 2) + 1;
    expect(
      validateUploadBatch([candidate({ size }), candidate({ size })]).ok,
    ).toBe(false);
  });

  it("rejects an empty batch", () => {
    expect(validateUploadBatch([]).ok).toBe(false);
  });

  it("accepts exactly 10 MiB and exactly 25 MiB totals", () => {
    const pdf = (size: number, destination: string): UploadCandidate => ({
      destination,
      mimeType: "application/pdf",
      size,
    });
    expect(validateUploadBatch([pdf(MAX_FILE_BYTES, "DSM1/ALP/big.pdf")]).ok).toBe(true);
    const half = MAX_BATCH_BYTES - 2 * MAX_FILE_BYTES;
    expect(
      validateUploadBatch([
        pdf(MAX_FILE_BYTES, "DSM1/ALP/a.pdf"),
        pdf(MAX_FILE_BYTES, "DSM1/ALP/b.pdf"),
        pdf(half, "DSM1/ALP/c.pdf"),
      ]).ok,
    ).toBe(true);
  });

  it.each([
    ["PDF", "DSM1/ALP/aula-01.pdf", "application/pdf"],
    ["DOCX", "DSM1/ALP/aula-01.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    ["PPTX", "DSM1/ALP/aula-01.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    ["ZIP", "DSM1/ALP/material.zip", "application/zip"],
    ["PNG image", "DSM1/ALP/diagrama.png", "image/png"],
    ["JPEG image", "DSM1/ALP/foto.jpg", "image/jpeg"],
    ["plain text", "DSM1/ALP/notas.txt", "text/plain"],
    ["markdown", "DSM1/ALP/notas.md", "text/markdown"],
    ["TypeScript source", "DSM1/ALP/exemplo.ts", "text/typescript"],
    ["Python source", "DSM1/ALP/exemplo.py", "text/x-python"],
  ])("accepts representative %s", (_name, destination, mimeType) => {
    expect(validateUploadBatch([candidate({ destination, mimeType })]).ok).toBe(true);
  });
});
