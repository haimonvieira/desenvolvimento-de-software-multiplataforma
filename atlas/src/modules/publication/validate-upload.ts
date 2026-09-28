export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_BATCH_BYTES = 25 * 1024 * 1024;
export const BATCH_TTL_MS = 24 * 60 * 60 * 1000;

export type UploadCandidate = Readonly<{
  destination: string;
  mimeType: string;
  size: number;
}>;

export type UploadRejection = Readonly<{
  destination: string;
  reason: string;
}>;

export type UploadValidation =
  | Readonly<{ ok: true; totalBytes: number }>
  | Readonly<{ ok: false; rejections: readonly UploadRejection[] }>;

const EXECUTABLE_EXTENSIONS: Record<string, true> = {
  exe: true,
  dll: true,
  bat: true,
  cmd: true,
  com: true,
  scr: true,
  msi: true,
  ps1: true,
  vbs: true,
  js: true,
  jar: true,
  apk: true,
};

const RESERVED_BASENAMES: Record<string, true> = {
  con: true,
  prn: true,
  aux: true,
  nul: true,
  com1: true,
  com2: true,
  com3: true,
  com4: true,
  com5: true,
  com6: true,
  com7: true,
  com8: true,
  com9: true,
  lpt1: true,
  lpt2: true,
  lpt3: true,
  lpt4: true,
  lpt5: true,
  lpt6: true,
  lpt7: true,
  lpt8: true,
  lpt9: true,
};

const EXTENSION_MIME: Readonly<Record<string, readonly string[]>> = {
  pdf: ["application/pdf"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  pptx: [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  zip: ["application/zip"],
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  gif: ["image/gif"],
  webp: ["image/webp"],
  svg: ["image/svg+xml"],
  txt: ["text/plain"],
  md: ["text/markdown", "text/plain"],
  ts: ["text/typescript", "application/typescript"],
  py: ["text/x-python", "text/plain"],
  java: ["text/x-java-source", "text/plain"],
  c: ["text/x-csrc", "text/plain"],
  json: ["application/json"],
  csv: ["text/csv"],
};

function hasControlChars(value: string): boolean {
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code <= 0x1f || code === 0x7f) return true;
  }
  return false;
}

function normalizedDestination(destination: string): string | null {
  if (hasControlChars(destination)) return null;
  let decoded = destination;
  try {
    decoded = decodeURIComponent(destination);
    if (decodeURIComponent(decoded) !== decoded) return null;
  } catch {
    return null;
  }
  if (/\\/.test(decoded)) return null;
  if (decoded.startsWith("/") || /^[A-Za-z]:[\\/]/.test(decoded)) return null;
  const segments = decoded.split("/");
  if (
    segments.some(
      (segment) => segment === "" || segment === "." || segment === "..",
    )
  )
    return null;
  return segments.join("/").toLowerCase();
}

function validateOne(candidate: UploadCandidate): string | null {
  const normalized = normalizedDestination(candidate.destination);
  if (normalized === null) {
    return hasControlChars(candidate.destination)
      ? "control-characters"
      : "path-traversal";
  }
  const leaf = candidate.destination.split("/").pop() ?? "";
  const dot = leaf.lastIndexOf(".");
  const extension = dot <= 0 ? "" : leaf.slice(dot + 1).toLowerCase();
  const segments = candidate.destination.split("/");
  for (const segment of segments) {
    const dot = segment.lastIndexOf(".");
    const stem = (dot <= 0 ? segment : segment.slice(0, dot)).toLowerCase();
    if (RESERVED_BASENAMES[stem]) return "reserved-name";
  }
  if (!extension) return "missing-extension";
  if (EXECUTABLE_EXTENSIONS[extension]) return "executable";
  const allowed = EXTENSION_MIME[extension];
  if (!allowed) return "unsupported-extension";
  if (!allowed.includes(candidate.mimeType.toLowerCase()))
    return "mime-mismatch";
  if (!Number.isInteger(candidate.size) || candidate.size <= 0)
    return "empty-file";
  if (candidate.size > MAX_FILE_BYTES) return "file-too-large";
  return null;
}

export function validateUploadBatch(
  candidates: readonly UploadCandidate[],
): UploadValidation {
  if (candidates.length === 0) {
    return {
      ok: false,
      rejections: [{ destination: "", reason: "empty-batch" }],
    };
  }
  const rejections: UploadRejection[] = [];
  const seen = new Set<string>();
  let totalBytes = 0;
  for (const candidate of candidates) {
    const reason = validateOne(candidate);
    if (reason) {
      rejections.push({ destination: candidate.destination, reason });
      continue;
    }
    const normalized = normalizedDestination(candidate.destination) as string;
    if (seen.has(normalized)) {
      rejections.push({
        destination: candidate.destination,
        reason: "duplicate-destination",
      });
      continue;
    }
    seen.add(normalized);
    totalBytes += candidate.size;
  }
  if (totalBytes > MAX_BATCH_BYTES) {
    return {
      ok: false,
      rejections: [{ destination: "", reason: "batch-too-large" }],
    };
  }
  if (rejections.length > 0) return { ok: false, rejections };
  return { ok: true, totalBytes };
}
