import { z } from "zod";

import { listProviderModels } from "../../../../../integrations/ai/provider-probe";
import { resolveByokBaseUrl } from "../../../../../modules/tutor/byok";

const modelsQuerySchema = z.object({ baseUrl: z.string().trim().min(1).max(2048) });

export type ByokModelsDependencies = Readonly<{
  fetchImpl: (url: string, init: RequestInit) => Promise<Response>;
  timeoutMs?: number;
}>;

/**
 * The keyless model catalogue for a visitor-supplied provider. The base URL is
 * validated by the shared SSRF gate before anything is fetched, and no
 * `Authorization` header is ever attached — the endpoint answers without one,
 * and asking for the key before the URL is validated would put a credential on
 * the wire for nothing. The provider body is never echoed: the catalogue ids
 * are the only thing returned.
 */
export function createByokModelsHandler(dependencies: ByokModelsDependencies) {
  return async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const parsed = modelsQuerySchema.safeParse({ baseUrl: url.searchParams.get("baseUrl") ?? "" });
    if (!parsed.success) return Response.json({ error: { code: "INVALID_BYOK_PROVIDER", message: "Provedor BYOK inválido." } }, { status: 400 });
    const baseUrl = resolveByokBaseUrl(parsed.data.baseUrl);
    if (!baseUrl) return Response.json({ error: { code: "INVALID_BYOK_PROVIDER", message: "Provedor BYOK inválido." } }, { status: 400 });
    const catalogue = await listProviderModels({ baseUrl, fetchImpl: dependencies.fetchImpl, timeoutMs: dependencies.timeoutMs });
    if (!catalogue.ok) {
      if (catalogue.reason === "bad-url") return Response.json({ error: { code: "INVALID_BYOK_PROVIDER", message: "Provedor BYOK inválido." } }, { status: 400 });
      if (catalogue.reason === "not-openai") {
        return Response.json({ error: { code: "NOT_OPENAI_PROVIDER", message: "Este endereço não responde como um provedor compatível." } }, { status: 502 });
      }
      return Response.json({ error: { code: "PROVIDER_UNREACHABLE", message: "Não foi possível alcançar o provedor." } }, { status: 502 });
    }
    return Response.json({ models: catalogue.models });
  };
}

export async function GET(request: Request): Promise<Response> {
  return createByokModelsHandler({ fetchImpl: fetch })(request);
}

export { GET as get };
