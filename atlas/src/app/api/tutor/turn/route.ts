import { env } from "cloudflare:workers";
import { z } from "zod";

import { turnstileGateFromEnv } from "../../../../integrations/cloudflare/turnstile-gate";
import type { PublicTutorAi } from "../../../../integrations/ai/public-tutor-ai";
import { TutorProviderError } from "../../../../integrations/ai/provider-failure";
import { createByokGroqPublicTutorAi, createGroqPublicTutorAi } from "../../../../integrations/ai/groq-public-tutor-ai";
import { createSqlExecutor } from "../../../../integrations/neon/db";
import { readByokKey, resolveByokBaseUrl, type ByokProvider } from "../../../../modules/tutor/byok";
import { createContentRetriever } from "../../../../modules/tutor/content-retriever";
import type { ContentRetriever } from "../../../../modules/tutor/model";
import { createStudyTutor, TUTOR_CONTEXT_LIMIT, type StudyTutor, type TutorTurnRequest } from "../../../../modules/tutor/study-tutor";
import { createUsageLedger, deriveSubjectKey, readClientIp, type UsageLedger } from "../../../../modules/tutor/usage-ledger";

export const tutorTurnSchema = z.object({
  question: z.string().trim().min(1).max(500),
  context: z.array(z.object({ path: z.string().min(1).max(500), commitSha: z.string().min(1).max(160) })).min(1).max(TUTOR_CONTEXT_LIMIT),
  mode: z.enum(["sponsored", "byok"]).default("sponsored"),
  turnstileToken: z.string().max(2048).optional(),
  /**
   * The BYOK provider descriptor. A body field, not a header, because the
   * schema is `.strict()`: the descriptor is the one deliberate widening of the
   * validated contract, and an invented `X-Provider-Base-Url` header would hide
   * an input this consequential from the parse. The key stays out of it — it is
   * read from `Authorization` only. Absent, BYOK keeps today's Groq endpoint.
   */
  provider: z.object({
    baseUrl: z.string().trim().min(1).max(2048),
    model: z.string().trim().min(1).max(200),
  }).strict().optional(),
}).strict();

export type TutorTurnDependencies = Readonly<{
  retriever: ContentRetriever;
  /** Sponsored mode only: the quota ledger and the anonymous subject derivation. */
  ledger?: UsageLedger;
  subjectKey?(request: Request): Promise<string>;
  /**
   * Gates the first sponsored turn with Turnstile. Absent means the turn fails
   * closed for subjects without sponsored history.
   */
  firstUseGate?(input: Readonly<{ request: Request; turnstileToken: string | null }>): Promise<boolean>;
  /**
   * The provider bindings. Production supplies both (the Groq adapters); while
   * either is absent the route fails closed with `PROVIDER_UNBOUND` and never
   * silently substitutes a provider.
   */
  sponsoredAi?: PublicTutorAi;
  /** BYOK adapter for the request; `provider` is present only when the visitor
   * sent a valid descriptor, and absent means the default endpoint. */
  byokAi?(key: string, provider?: ByokProvider): PublicTutorAi;
}>;

function error(code: string, message: string, status: number): Response {
  return Response.json({ error: { code, message } }, { status });
}

function quotaDenied(reason: string, resetsAt: string): Response {
  return Response.json({
    error: { code: "QUOTA_DENIED", message: "Sua cota de estudo patrocinado terminou." },
    decision: { reason, resetsAt },
  }, { status: 429 });
}

async function respond(tutor: StudyTutor, request: TutorTurnRequest): Promise<Response> {
  const outcome = await tutor.answerTurn(request);
  if (outcome.type === "denied") return quotaDenied(outcome.reason, outcome.resetsAt);
  return Response.json({ result: outcome.result });
}

const encoder = new TextEncoder();

function sseEvent(name: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${name}\ndata: ${JSON.stringify(data)}\n\n`);
}

/** The failure vocabulary the JSON path already uses, applied to a mid-stream error. */
function streamFailure(failure: unknown): { code: string; message: string } {
  if (failure instanceof TutorProviderError && failure.failure.kind === "rate_limited") {
    return { code: "PROVIDER_QUOTA", message: failure.message };
  }
  return { code: "TUTOR_TURN_FAILED", message: "Não foi possível responder agora." };
}

/**
 * Streams a turn as Server-Sent Events. The first event is pulled before the
 * response is built: a denied reservation is decided before the provider call,
 * so a denied turn is answered with the same 429 JSON as the non-streaming
 * path, never a stream that opens and then dies. After that point every failure
 * — including a provider failure mid-stream — arrives as an `error` event
 * rather than a broken socket.
 */
async function respondStream(tutor: StudyTutor, request: TutorTurnRequest): Promise<Response> {
  const events = tutor.answerTurnStream(request);
  const first = await events.next();
  if (!first.done && first.value.type === "denied") {
    return quotaDenied(first.value.reason, first.value.resetsAt);
  }
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let step = first;
        while (!step.done) {
          if (step.value.type === "status") controller.enqueue(sseEvent("status", { status: step.value.status }));
          else if (step.value.type === "answer") controller.enqueue(sseEvent("answer", { delta: step.value.delta }));
          else if (step.value.type === "result") controller.enqueue(sseEvent("done", { result: step.value.result }));
          step = await events.next();
        }
      } catch (failure) {
        controller.enqueue(sseEvent("error", { error: streamFailure(failure) }));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(body, {
    headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-store" },
  });
}

/**
 * Content negotiation, not a body field: the turn schema is `.strict()`, so a
 * `stream: true` body would either be rejected or widen the validated contract
 * for every caller. `Accept` is the HTTP-native way to ask for a stream.
 */
function wantsStream(request: Request): boolean {
  return request.headers.get("accept")?.includes("text/event-stream") === true;
}

/**
 * The tutor turn contract. The visitor's question and the materials being
 * studied are the only inputs; the orchestrator retrieves, enforces the tool
 * allowlist and the reserved budget, and returns an answer with validated
 * citations plus inert notebook proposals.
 */
export function createTutorTurnHandler(dependencies: TutorTurnDependencies) {
  return async function POST(request: Request): Promise<Response> {
    const parsed = tutorTurnSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return error("INVALID_TUTOR_TURN", "Pergunta inválida.", 400);
    const { question, context, mode } = parsed.data;
    const stream = wantsStream(request);

    try {
      if (mode === "byok") {
        const key = readByokKey(request);
        if (!key) return error("BYOK_KEY_REQUIRED", "Informe sua chave de API.", 401);
        let provider: ByokProvider | undefined;
        if (parsed.data.provider) {
          // The descriptor is refused before the adapter exists, so a rejected
          // URL never reaches a fetch and the key is never offered to it.
          const baseUrl = resolveByokBaseUrl(parsed.data.provider.baseUrl);
          if (!baseUrl) return error("INVALID_BYOK_PROVIDER", "Provedor BYOK inválido.", 400);
          provider = { baseUrl, model: parsed.data.provider.model };
        }
        const ai = dependencies.byokAi?.(key, provider);
        if (!ai) return error("PROVIDER_UNBOUND", "Provedor BYOK ainda não configurado.", 503);
        const tutor = createStudyTutor({ retriever: dependencies.retriever, ai });
        const turnRequest: TutorTurnRequest = { question, context, mode: { type: "byok" } };
        return stream ? await respondStream(tutor, turnRequest) : await respond(tutor, turnRequest);
      }

      const subjectKey = dependencies.subjectKey;
      if (!dependencies.sponsoredAi || !dependencies.ledger || !subjectKey) {
        return error("PROVIDER_UNBOUND", "Provedor patrocinado ainda não configurado.", 503);
      }
      const ledger = dependencies.ledger;
      const key = await subjectKey(request);
      if (ledger.policy("public").enabled && !(await ledger.hasSponsoredHistory({ scope: "public", subjectKey: key }))) {
        const verified = dependencies.firstUseGate
          ? await dependencies.firstUseGate({ request, turnstileToken: parsed.data.turnstileToken ?? null })
          : false;
        if (!verified) return error("TURNSTILE_REQUIRED", "Verificação necessária.", 403);
      }
      const tutor = createStudyTutor({ retriever: dependencies.retriever, ai: dependencies.sponsoredAi, ledger });
      const turnRequest: TutorTurnRequest = { question, context, mode: { type: "sponsored", subjectKey: key } };
      return stream ? await respondStream(tutor, turnRequest) : await respond(tutor, turnRequest);
    } catch (failure) {
      // Provider failures are never echoed: a BYOK key can appear inside a
      // provider message, and this route neither returns nor logs it. A 429 is
      // a spent quota with a retry hint; everything else fails closed.
      if (failure instanceof TutorProviderError && failure.failure.kind === "rate_limited") {
        return Response.json(
          { error: { code: "PROVIDER_QUOTA", message: failure.message }, retryAfterSeconds: failure.failure.retryAfterSeconds },
          { status: 429, headers: failure.failure.retryAfterSeconds !== null ? { "retry-after": String(failure.failure.retryAfterSeconds) } : {} },
        );
      }
      return error("TUTOR_TURN_FAILED", "Não foi possível responder agora.", 502);
    }
  };
}

type TutorTurnEnv = {
  DATABASE_URL?: string;
  TUTOR_SUBJECT_SECRET?: string;
  GROQ_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
};

const MINIMUM_SECRET_BYTES = 32;

/**
 * Sponsored mode needs the ledger, the subject secret and the Groq key. BYOK
 * needs nothing from env: the visitor's key arrives per request in the
 * `Authorization` header and is bound to a Groq adapter for that request only.
 */
function handler(): ((request: Request) => Promise<Response>) | null {
  const { DATABASE_URL: databaseUrl, TUTOR_SUBJECT_SECRET: secret, GROQ_API_KEY: groqKey } = env as TutorTurnEnv;
  if (!databaseUrl || !secret || new TextEncoder().encode(secret).byteLength < MINIMUM_SECRET_BYTES) return null;
  if (!groqKey) return null;
  const sponsoredAi = createGroqPublicTutorAi({ apiKey: groqKey });
  return createTutorTurnHandler({
    retriever: createContentRetriever(),
    ledger: createUsageLedger({ query: createSqlExecutor(databaseUrl).query }),
    subjectKey: (request) =>
      deriveSubjectKey(secret, {
        clientIp: readClientIp(request),
        deviceToken: request.headers.get("x-device-token"),
      }),
    firstUseGate: turnstileGateFromEnv(),
    sponsoredAi,
    byokAi: (key, provider) => createByokGroqPublicTutorAi(key, provider ?? {}),
  });
}

export async function POST(request: Request): Promise<Response> {
  const post = handler();
  return post ? post(request) : error("UNCONFIGURED", "Tutor indisponível.", 503);
}

export { POST as post };
