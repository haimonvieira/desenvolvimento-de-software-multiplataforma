import { env } from "cloudflare:workers";

import catalog from "../../../../generated/catalog.json";
import type { CatalogData, Material } from "../../../../modules/catalog/model";
import { contentTypeFor, rawGitHubUrl, type AssetDisposition } from "../../../../modules/catalog/material-asset";
import { materialPathCandidates } from "../../../../modules/catalog/material-path";
import { GITHUB_USER_AGENT } from "../../../../integrations/github/github-material-source";

type RuntimeEnv = Readonly<{ GITHUB_REPOSITORY?: string }>;

type MaterialAssetDependencies = Readonly<{
  catalog: CatalogData;
  repositoryUrl: string;
  fetchAsset(url: string, init: { headers: Record<string, string> }): Promise<Response>;
}>;

/**
 * Both parts are needed: the ASCII `filename` keeps old clients working, the
 * RFC 5987 `filename*` is the only form that survives a name like
 * `LISTAS DE EXERCÍCIOS` (a bare quoted header would ship raw bytes).
 */
function contentDispositionFor(disposition: AssetDisposition, name: string): string {
  const ascii = name.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
  return `${disposition}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

export function createMaterialAssetHandler({ catalog, repositoryUrl, fetchAsset }: MaterialAssetDependencies) {
  const byPath = new Map(catalog.materials.map((material) => [material.ref.path, material]));

  return async function handler(
    request: Request,
    context: { params: Promise<{ path: string[] }> },
  ): Promise<Response> {
    const segments = (await context.params).path;
    const material: Material | undefined = materialPathCandidates(segments)
      .map((path) => byPath.get(path))
      .find(Boolean);
    // The catalogue is the only authority: an uncatalogued path never reaches
    // the network, so a crafted path cannot make us fetch anything.
    if (!material) return new Response("Material não catalogado.", { status: 404 });

    const url = new URL(request.url);
    const disposition: AssetDisposition =
      url.searchParams.get("disposition") === "attachment" ? "attachment" : "inline";
    const range = request.headers.get("range");
    const upstream = await fetchAsset(
      rawGitHubUrl(repositoryUrl, material.ref.commitSha, material.ref.path),
      { headers: { "user-agent": GITHUB_USER_AGENT, accept: "*/*", ...(range ? { range } : {}) } },
    );

    if (!upstream.ok && upstream.status !== 206) {
      // Release the body before answering: an upstream 500 page must not ride
      // along in our response, and the connection is freed either way.
      await upstream.body?.cancel();
      return new Response("Arquivo indisponível no repositório.", { status: 502 });
    }

    const headers = new Headers({
      // Our content type, not the CDN's: raw.githubusercontent.com serves PDFs
      // as application/octet-stream with nosniff, which makes them download.
      "content-type": contentTypeFor(material.extension),
      "content-disposition": contentDispositionFor(disposition, material.name),
      "cache-control": "public, max-age=31536000, immutable",
      "etag": `"${material.ref.commitSha}-${material.extension}-${material.size}"`,
      "x-content-type-options": "nosniff",
      "accept-ranges": "bytes",
    });
    for (const name of ["content-length", "content-range"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }

    return new Response(upstream.body, { status: upstream.status === 206 ? 206 : 200, headers });
  };
}

const runtimeEnv = env as RuntimeEnv;

export const GET = createMaterialAssetHandler({
  catalog: catalog as CatalogData,
  repositoryUrl: `https://github.com/${runtimeEnv.GITHUB_REPOSITORY ?? ""}`,
  fetchAsset: (url, init) => fetch(url, init),
});
