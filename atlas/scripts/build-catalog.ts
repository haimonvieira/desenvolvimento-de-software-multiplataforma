import { execFileSync, spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  CatalogData,
  Discipline,
  Material,
  MaterialKind,
  PreviewKind,
  Semester,
} from "../src/modules/catalog/model";

const REPOSITORY_URL = "https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma";
const SEMESTER_NAMES: Readonly<Record<string, string>> = {
  DSM1: "1º semestre",
  DSM2: "2º semestre",
  DSM3: "3º semestre",
  DSM4: "4º semestre",
  DSM5: "5º semestre",
  DSM6: "6º semestre",
};
const DISCIPLINE_NAMES: Readonly<Record<string, string>> = {
  ALP: "Algoritmos e Lógica de Programação",
  DD: "Design Digital",
  DW1: "Desenvolvimento Web I",
  ES1: "Engenharia de Software I",
  MBD: "Modelagem de Banco de Dados",
  PI: "Projeto Integrador",
  SORC1: "Sistemas Operacionais e Redes",
  BD2: "Banco de Dados II",
  DW2: "Desenvolvimento Web II",
  ED1: "Estrutura de Dados",
  ES2: "Engenharia de Software II",
  MPC: "Matemática para Computação",
  TPI: "Técnica de Programação I",
  BDNR: "Banco de Dados Não Relacional",
  DW3: "Desenvolvimento Web III",
  GAPS: "Gestão Ágil de Projetos de Software",
  ING1: "Inglês I",
  TP2: "Técnica de Programação II",
};
const EXCLUDED_DIRECTORIES = new Set([
  ".cache",
  ".idea",
  ".git",
  ".next",
  ".vinext",
  ".wrangler",
  "__pycache__",
  "bin",
  "build",
  "coverage",
  "dist",
  "generated",
  "node_modules",
  "out",
  "private",
  "target",
]);
const EXCLUDED_EXTENSIONS = new Set([
  ".bat",
  ".cmd",
  ".class",
  ".dll",
  ".dylib",
  ".exe",
  ".o",
  ".obj",
  ".pyc",
  ".so",
]);
const CODE_EXTENSIONS = new Set([
  ".c", ".cpp", ".css", ".html", ".java", ".js", ".json", ".jsx",
  ".php", ".py", ".sql", ".ts", ".tsx", ".xml", ".yaml", ".yml",
]);
const DOCUMENT_EXTENSIONS = new Set([".csv", ".doc", ".docx", ".md", ".odt", ".pdf", ".ppt", ".pptx", ".txt", ".xls", ".xlsx"]);
const IMAGE_EXTENSIONS = new Set([".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);
const ARCHIVE_EXTENSIONS = new Set([".7z", ".gz", ".rar", ".tar", ".zip"]);
const PREVIEW_LIMIT = 200_000;
const REVIEWED_PREVIEW_PATHS = new Set([
  "DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/telaprin.html",
  "DSM2/DW2/dw2-nodejs-express/exercicios-js/arrays-e-objetos/script.js",
]);
export const SECRET_MARKER = /(?:api[_-]?key|authorization\s*[:=]|client[_-]?secret|jwt[_-]?secret|jwtsecret|mongodb(?:\+srv)?:\/\/|password\s*[:=]|private[_ -]?key|secret\s*[:=]|senha\s*[:=]|session[_-]?secret|token\s*[:=])/i;

function classify(extension: string): { kind: MaterialKind; previewKind: PreviewKind } {
  if (IMAGE_EXTENSIONS.has(extension)) return { kind: "image", previewKind: "image" };
  if (extension === ".pdf") return { kind: "document", previewKind: "pdf" };
  if (CODE_EXTENSIONS.has(extension) || extension === ".md" || extension === ".txt") {
    return { kind: CODE_EXTENSIONS.has(extension) ? "code" : "document", previewKind: "text" };
  }
  if (DOCUMENT_EXTENSIONS.has(extension)) return { kind: "document", previewKind: "none" };
  if (ARCHIVE_EXTENSIONS.has(extension)) return { kind: "archive", previewKind: "none" };
  return { kind: "other", previewKind: "none" };
}

export function isExcludedPath(path: string, mode: string): boolean {
  const segments = path.split("/");
  const name = segments.at(-1) ?? "";
  return mode !== "100644"
    || segments.some((segment) => EXCLUDED_DIRECTORIES.has(segment))
    || name === ".env"
    || name.startsWith(".env.")
    || EXCLUDED_EXTENSIONS.has(extname(name).toLowerCase());
}

export type GitTreeEntry = Readonly<{
  mode: string;
  type: string;
  oid: string;
  size: number | null;
  path: string;
}>;

export function listGitTree(repositoryRoot: string, commitSha: string): GitTreeEntry[] {
  const output = execFileSync("git", [
    "ls-tree", "-r", "-z", "-l", commitSha, "--",
    "DSM1", "DSM2", "DSM3", "DSM4", "DSM5", "DSM6",
  ], {
    cwd: repositoryRoot,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });

  return output.split("\0").filter(Boolean).map((record) => {
    const separator = record.indexOf("\t");
    const [mode, type, oid, size] = record.slice(0, separator).trim().split(/\s+/);
    return {
      mode,
      type,
      oid,
      size: size === "-" ? null : Number(size),
      path: record.slice(separator + 1).replace(/\\/g, "/"),
    };
  });
}

export function resolveCommitSha(repositoryRoot: string): string {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  if (process.env.CF_PAGES_COMMIT_SHA) return process.env.CF_PAGES_COMMIT_SHA;
  return execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  }).trim();
}

function readBlobPrefix(repositoryRoot: string, oid: string): Promise<Buffer> {
  const { promise, resolve: resolveBlob, reject: rejectBlob } = Promise.withResolvers<Buffer>();
  const child = spawn("git", ["cat-file", "blob", oid], { cwd: repositoryRoot, stdio: ["ignore", "pipe", "pipe"] });
  const chunks: Buffer[] = [];
  let size = 0;
  let error = "";
  child.stdout.on("data", (chunk: Buffer) => {
    const remaining = PREVIEW_LIMIT - size;
    if (remaining <= 0) return;
    const bounded = chunk.subarray(0, remaining);
    chunks.push(bounded);
    size += bounded.byteLength;
    if (size === PREVIEW_LIMIT) child.kill();
  });
  child.stderr.setEncoding("utf8").on("data", (chunk: string) => { error += chunk; });
  child.on("error", rejectBlob);
  child.on("close", (code) => code === 0 || size === PREVIEW_LIMIT
    ? resolveBlob(Buffer.concat(chunks, size))
    : rejectBlob(new Error(error || `git show exited ${code}`)));
  return promise;
}

async function writeTextPreviews(repositoryRoot: string, outputRoot: string, catalog: CatalogData, oidByPath: ReadonlyMap<string, string>): Promise<CatalogData> {
  await rm(outputRoot, { recursive: true, force: true });
  const materials: Material[] = [];
  for (const material of catalog.materials) {
    const canPreview = material.previewKind === "text" && REVIEWED_PREVIEW_PATHS.has(material.ref.path);
    if (!canPreview) {
      materials.push(material);
      continue;
    }
    const oid = oidByPath.get(material.ref.path);
    if (!oid) throw new Error(`Missing Git blob for ${material.ref.path}`);
    const content = await readBlobPrefix(repositoryRoot, oid);
    if (SECRET_MARKER.test(content.toString("utf8"))) {
      materials.push(material);
      continue;
    }
    const previewUrl = `/material-previews/${material.ref.path.split("/").map(encodeURIComponent).join("/")}.txt`;
    const outputPath = resolve(outputRoot, ...material.ref.path.split("/").slice(0, -1), `${basename(material.ref.path)}.txt`);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content);
    materials.push({ ...material, previewUrl });
  }
  return { ...catalog, materials };
}

export async function buildCatalog(repositoryRoot: string, commitSha: string): Promise<CatalogData> {
  const entries = listGitTree(repositoryRoot, commitSha).sort((left, right) => left.path.localeCompare(right.path));
  const roots = new Set<string>();
  const disciplineKeys = new Set<string>();
  const materials: Material[] = [];

  for (const entry of entries) {
    const [semesterCode, disciplineCode] = entry.path.split("/");
    if (!/^DSM[1-6]$/.test(semesterCode)) continue;
    roots.add(semesterCode);
    if (!disciplineCode || EXCLUDED_DIRECTORIES.has(disciplineCode)) continue;
    disciplineKeys.add(`${semesterCode}/${disciplineCode}`);
    if (entry.type !== "blob" || entry.size === null || isExcludedPath(entry.path, entry.mode)) continue;
    const extension = extname(entry.path).toLowerCase();
    const classification = classify(extension);
    materials.push({
      ref: { path: entry.path, commitSha },
      name: basename(entry.path),
      extension,
      size: entry.size,
      disciplineCode,
      semesterCode,
      ...classification,
      downloadUrl: `${REPOSITORY_URL}/raw/${encodeURIComponent(commitSha)}/${entry.path.split("/").map(encodeURIComponent).join("/")}`,
    });
  }

  const semesters: Semester[] = [...roots].sort().map((code) => ({ code, name: SEMESTER_NAMES[code] }));
  const disciplines: Discipline[] = [...disciplineKeys].sort().map((key) => {
    const [semesterCode, code] = key.split("/");
    return { code, name: DISCIPLINE_NAMES[code] ?? code, semesterCode };
  });

  return { commitSha, semesters, disciplines, materials };
}

export async function writeCatalog(repositoryRoot: string, outputPath: string, commitSha = resolveCommitSha(repositoryRoot)): Promise<void> {
  const entries = listGitTree(repositoryRoot, commitSha);
  const catalog = await buildCatalog(repositoryRoot, commitSha);
  await mkdir(dirname(outputPath), { recursive: true });
  const oidByPath = new Map(entries.map((entry) => [entry.path, entry.oid]));
  const publicCatalog = await writeTextPreviews(repositoryRoot, resolve(dirname(outputPath), "../../public/material-previews"), catalog, oidByPath);
  await writeFile(outputPath, `${JSON.stringify(publicCatalog, null, 2)}\n`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const atlasRoot = resolve(dirname(scriptPath), "..");
  const repositoryRoot = resolve(atlasRoot, "..");
  await writeCatalog(repositoryRoot, resolve(atlasRoot, "src/generated/catalog.json"));
}
