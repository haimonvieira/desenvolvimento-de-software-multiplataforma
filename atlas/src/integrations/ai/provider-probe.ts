import { z } from "zod";

import type { GroqFetch } from "./groq-transport";

export type ProviderProbeVerdict =
  | Readonly<{ ok: true; models: readonly string[] }>
  | Readonly<{
      ok: false;
      reason:
        | "bad-url"
        | "unreachable"
        | "not-openai"
        | "auth"
        | "model-not-subscribed"
        | "no-json-mode"
        | "bad-shape";
    }>;

const DEFAULT_TIMEOUT_MS = 10_000;

/** The catalogue shape only an OpenAI-compatible `/models` answers with. */
const catalogueSchema = z.object({ data: z.array(z.object({ id: z.string() })) });

/** We only read the first choice's text; anything else is not our shape. */
const completionSchema = z.object({
  choices: z.array(z.object({ message: z.object({ content: z.string() }) })).min(1),
});

const answerSchema = z.object({ answer: z.string() });

/**
 * A BYOK provider can be validated only by asking it. Its `/models` catalogue
 * says nothing about structured output — measured: a provider's `capabilities`
 * field carried vision/image/file_upload and nothing about `response_format` —
 * and a provider that answers conversationally while ignoring JSON mode would
 * look perfectly healthy until every tutor turn failed. So the probe runs the
 * narrow contract the tutor actually needs: OpenAI-compatible chat completions
 * honouring `response_format: {type:"json_object"}` with a body of our shape.
 * Native tool calling is not required and is therefore never probed.
 */
export function createProviderProbe(
  dependencies: Readonly<{ fetchImpl: GroqFetch }>,
): (
  input: Readonly<{ baseUrl: string; apiKey: string; model: string; timeoutMs?: number }>,
) => Promise<ProviderProbeVerdict> {
  return async function probe(
    input: Readonly<{ baseUrl: string; apiKey: string; model: string; timeoutMs?: number }>,
  ): Promise<ProviderProbeVerdict> {
    // The key has not been sent anywhere yet, and this ordering is deliberate:
    // a URL that is not an absolute https:// endpoint is refused before a
    // single byte — least of all the visitor's key — leaves the app.
    let parsed: URL;
    try {
      parsed = new URL(input.baseUrl);
    } catch {
      return { ok: false, reason: "bad-url" };
    }
    if (parsed.protocol !== "https:") return { ok: false, reason: "bad-url" };
    const base = input.baseUrl.replace(/\/+$/, "");

    const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    const request = async (url: string, init: RequestInit): Promise<Response> => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await dependencies.fetchImpl(url, { ...init, signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
    };

    try {
      // Model discovery is keyless: the catalogue is public, and handing the
      // key to a host before it has proven itself is exactly what the probe is
      // here to avoid.
      const modelsResponse = await request(`${base}/models`, { method: "GET" });
      if (!modelsResponse.ok) return { ok: false, reason: "not-openai" };
      let catalogueRaw: unknown;
      try {
        catalogueRaw = await modelsResponse.json();
      } catch {
        return { ok: false, reason: "not-openai" };
      }
      const catalogue = catalogueSchema.safeParse(catalogueRaw);
      if (!catalogue.success) return { ok: false, reason: "not-openai" };
      const models = catalogue.data.data.map((entry) => entry.id);

      // One tiny JSON-mode turn with the key. It costs the visitor a single
      // turn of their own quota, so the prompt asks for the smallest object it
      // can and the cap is 32 tokens.
      const chatResponse = await request(`${base}/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${input.apiKey}` },
        body: JSON.stringify({
          model: input.model,
          messages: [
            { role: "system", content: 'Responda somente com JSON: {"answer": string}.' },
            { role: "user", content: "Ping" },
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 32,
          temperature: 0,
          stream: false,
        }),
      });

      if (chatResponse.status === 401) return { ok: false, reason: "auth" };
      // 403 is its own reason: "no subscription for the requested model" is a
      // different remedy from a bad key, and telling the visitor to fix the key
      // would be wrong.
      if (chatResponse.status === 403) return { ok: false, reason: "model-not-subscribed" };
      if (chatResponse.status === 400) {
        let body = "";
        try {
          body = await chatResponse.text();
        } catch {
          // The status alone already tells the story; keep going to the branch.
        }
        return { ok: false, reason: body.includes("response_format") ? "no-json-mode" : "unreachable" };
      }
      if (!chatResponse.ok) return { ok: false, reason: "unreachable" };

      let payloadRaw: unknown;
      try {
        payloadRaw = await chatResponse.json();
      } catch {
        return { ok: false, reason: "bad-shape" };
      }
      const completion = completionSchema.safeParse(payloadRaw);
      if (!completion.success) return { ok: false, reason: "bad-shape" };
      let answerRaw: unknown;
      try {
        answerRaw = JSON.parse(completion.data.choices[0]!.message.content);
      } catch {
        return { ok: false, reason: "bad-shape" };
      }
      // The check that matters: a provider that ignores `response_format` and
      // answers in prose passed every earlier step and lands right here.
      if (!answerSchema.safeParse(answerRaw).success) return { ok: false, reason: "bad-shape" };

      return { ok: true, models };
    } catch {
      // Transport failure or our own abort: the outcome is unknown and the
      // provider body — which could carry the key — is never surfaced.
      return { ok: false, reason: "unreachable" };
    }
  };
}
