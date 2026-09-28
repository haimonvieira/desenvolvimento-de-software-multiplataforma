import { execFileSync } from "node:child_process";
import { readdir, stat, writeFile, mkdir } from "node:fs/promises";
import { basename, dirname, extname, relative, resolve, sep } from "node:path";
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

function isExcludedFile(name: string): boolean {
  return name === ".env" || name.startsWith(".env.") || EXCLUDED_EXTENSIONS.has(extname(name).toLowerCase());
}

async function academicRoots(repositoryRoot: string): Promise<Array<{ code: string; disciplines: string[] }>> {
  const roots = (await readdir(repositoryRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^DSM[1-6]$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  return Promise.all(roots.map(async (code) => ({
    code,
    disciplines: (await readdir(resolve(repositoryRoot, code), { withFileTypes: true }))
      .filter((entry) => entry.isDirectory() && !EXCLUDED_DIRECTORIES.has(entry.name))
      .map((entry) => entry.name)
      .sort(),
  })));
}

async function collectFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  const entries = (await readdir(directory, { withFileTypes: true }))
    .sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRECTORIES.has(entry.name)) files.push(...await collectFiles(path));
    } else if (entry.isFile() && !isExcludedFile(entry.name)) {
      files.push(path);
    }
  }
  return files;
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
  const roots = await academicRoots(repositoryRoot);
  const paths = (await Promise.all(roots.map(({ code }) => collectFiles(resolve(repositoryRoot, code)))))
    .flat()
    .map((path) => relative(repositoryRoot, path).split(sep).join("/"))
    .sort();
  const disciplineKeys = new Set(roots.flatMap(({ code, disciplines }) =>
    disciplines.map((discipline) => `${code}/${discipline}`),
  ));
  const materials: Material[] = [];

  for (const path of paths) {
    const [semesterCode, disciplineCode] = path.split("/");
    if (!disciplineCode) continue;
    disciplineKeys.add(`${semesterCode}/${disciplineCode}`);
    const extension = extname(path).toLowerCase();
    const classification = classify(extension);
    materials.push({
      ref: { path, commitSha },
      name: basename(path),
      extension,
      size: (await stat(resolve(repositoryRoot, ...path.split("/")))).size,
      disciplineCode,
      semesterCode,
      ...classification,
      downloadUrl: `${REPOSITORY_URL}/raw/${encodeURIComponent(commitSha)}/${path.split("/").map(encodeURIComponent).join("/")}`,
    });
  }

  const semesters: Semester[] = roots.map(({ code }) => ({ code, name: SEMESTER_NAMES[code] }));
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
