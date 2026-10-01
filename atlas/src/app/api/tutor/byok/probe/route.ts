import { z } from "zod";

import { createProviderProbe, type ProviderProbeVerdict } from "../../../../../integrations/ai/provider-probe";
import { readByokKey, resolveByokBaseUrl } from "../../../../../modules/tutor/byok";

const probeBodySchema = z.object({
  baseUrl: z.string().trim().min(1).max(2048),
  model: z.string().trim().min(1).max(200),
}).strict();

export type ByokProbeDependencies = Readonly<{
  fetchImpl: (url: string, init: RequestInit) => Promise<Response>;
  timeoutMs?: number;
}>;

/**
 * Runs the JSON-mode probe against a visitor-supplied provider and returns
 * only the verdict. The key is read from the `Authorization` header — never
 * from the body — and neither the key nor the provider's body is ever returned
 * or logged. The URL gate refuses before the key is used, so a rejected URL
 * never sees the credential.
 */
export function createByokProbeHandler(dependencies: ByokProbeDependencies) {
  return async function POST(request: Request): Promise<Response> {
    const parsed = probeBodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: { code: "INVALID_BYOK_PROVIDER", message: "Provedor BYOK inválido." } }, { status: 400 });
    const baseUrl = resolveByokBaseUrl(parsed.data.baseUrl);
    if (!baseUrl) return Response.json({ error: { code: "INVALID_BYOK_PROVIDER", message: "Provedor BYOK inválido." } }, { status: 400 });
    const key = readByokKey(request);
    if (!key) return Response.json({ error: { code: "BYOK_KEY_REQUIRED", message: "Informe sua chave de API." } }, { status: 401 });
    const probe = createProviderProbe({ fetchImpl: dependencies.fetchImpl });
    const verdict: ProviderProbeVerdict = await probe({
      baseUrl,
      apiKey: key,
      model: parsed.data.model,
      ...(dependencies.timeoutMs !== undefined ? { timeoutMs: dependencies.timeoutMs } : {}),
    });
    return Response.json(verdict);
  };
}

export async function POST(request: Request): Promise<Response> {
  return createByokProbeHandler({ fetchImpl: fetch })(request);
}

export { POST as post };
