/**
 * Single source of truth for how a catalogued material becomes bytes on the
 * wire: the content type the browser must see, and the URL our own origin
 * exposes for it.
 *
 * Both the build script and the asset route read this module, so a format can
 * never be previewable in one place and mislabelled in the other. Before this
 * existed the preview pointed straight at GitHub, which serves PDFs as
 * `application/octet-stream` with `X-Content-Type-Options: nosniff` — the
 * browser then downloads instead of rendering, and no client change could fix
 * that.
 */

export type AssetDisposition = "inline" | "attachment";

/** Extensions we serve as inert text (never executed, never sniffed). */
export const TEXT_PREVIEW_EXTENSIONS: Readonly<Record<string, true>> = {
  "": true, ".alg": true, ".c": true, ".cpp": true, ".cs": true, ".css": true,
  ".dev": true, ".ejs": true, ".form": true, ".h": true, ".htm": true,
  ".html": true, ".ini": true, ".java": true, ".js": true, ".json": true,
  ".jsonl": true, ".jsx": true, ".layout": true, ".md": true, ".mf": true,
  ".pas": true, ".php": true, ".properties": true, ".py": true, ".rb": true,
  ".rs": true, ".sql": true, ".ts": true, ".tsx": true, ".txt": true,
  ".xml": true, ".yaml": true, ".yml": true,
};

/** Extensions the Office Online viewer renders, given a reachable URL. */
export const OFFICE_PREVIEW_EXTENSIONS: Readonly<Record<string, true>> = {
  ".doc": true, ".docx": true, ".ods": true, ".odt": true, ".pps": true,
  ".ppsx": true, ".ppt": true, ".pptx": true, ".xls": true, ".xlsx": true,
};

const IMAGE_CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const BINARY_CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".gz": "application/gzip",
};

/**
 * Every catalogue extension is lowercased before it reaches here. Text wins
 * over the image table so a `.svg` stays an image while a `.html` is text.
 */
export function contentTypeFor(extension: string): string {
  if (TEXT_PREVIEW_EXTENSIONS[extension]) return "text/plain; charset=utf-8";
  return IMAGE_CONTENT_TYPES[extension] ?? BINARY_CONTENT_TYPES[extension] ?? "application/octet-stream";
}

function encodeMaterialPath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

/**
 * Our own URL for the bytes. `inline` feeds previews (`<img>`, `<object>`,
 * the Office iframe); `attachment` is the "Baixar arquivo" action. Both are
 * the same route — the disposition is the only difference.
 */
export function materialAssetPath(path: string, disposition: AssetDisposition): string {
  return `/api/material/${encodeMaterialPath(path)}?disposition=${disposition}`;
}

/**
 * Where the route fetches from. `raw.githubusercontent.com` is the CDN behind
 * github.com's `/raw/` redirect, reached directly to skip a redirect hop that
 * would otherwise repeat for every ranged PDF request.
 */
export function rawGitHubUrl(repositoryUrl: string, commitSha: string, path: string): string {
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/.exec(repositoryUrl);
  if (!match) throw new Error(`Unsupported repository URL: ${repositoryUrl}`);
  const [, owner, repository] = match;
  return `https://raw.githubusercontent.com/${owner}/${repository}/${commitSha}/${encodeMaterialPath(path)}`;
}
