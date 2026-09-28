import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
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

function isExcludedPath(path: string, mode: string): boolean {
  const segments = path.split("/");
  const name = segments.at(-1) ?? "";
  return mode.endsWith("755")
    || segments.some((segment) => EXCLUDED_DIRECTORIES.has(segment))
    || name === ".env"
    || name.startsWith(".env.")
    || EXCLUDED_EXTENSIONS.has(extname(name).toLowerCase());
}

type GitTreeEntry = Readonly<{
  mode: string;
  type: string;
  size: number | null;
  path: string;
}>;

function listGitTree(repositoryRoot: string, commitSha: string): GitTreeEntry[] {
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
    const [mode, type, , size] = record.slice(0, separator).trim().split(/\s+/);
    return {
      mode,
      type,
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
  const catalog = await buildCatalog(repositoryRoot, commitSha);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const atlasRoot = resolve(dirname(scriptPath), "..");
  const repositoryRoot = resolve(atlasRoot, "..");
  await writeCatalog(repositoryRoot, resolve(atlasRoot, "src/generated/catalog.json"));
}
