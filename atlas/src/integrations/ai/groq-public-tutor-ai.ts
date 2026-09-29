import type {
  ProposedNotebookAction,
  PublicTutorAi,
  TutorModelInput,
  TutorModelOutput,
  TutorToolResult,
} from "./public-tutor-ai";
import { TutorProviderError } from "./public-tutor-ai";
import type { ReservedBudget } from "../../modules/tutor/usage-ledger";

/**
 * Groq binding for the public study tutor (`https://api.groq.com/openai/v1`,
 * OpenAI-compatible chat completions).
 *
 * SDK-versus-fetch decision: native `fetch`. The official `groq-sdk`
 * (Stainless) lists Cloudflare Workers as supported, but it pulls the whole
 * Stainless core (retries with backoff, proxy helpers, Node shims) into the
 * Worker bundle and — critically — retries 429/5xx/timeouts automatically
 * (2 retries by default). The provider spec §6 forbids auto-retry on 429
 * (report `retry-after` instead) and treats timeouts as unknown outcomes that
 * must stay charged, not as permission to resend. Reproducing that policy on
 * top of the SDK means disabling its retry/timeout machinery and reaching for
 * `.asResponse()` anyway; at that point the SDK buys nothing over ~40 lines of
 * typed `fetch`. One code path, no dependency, full control of the failure
 * policy. Sources: console.groq.com/docs/openai (base URL), /docs/rate-limits
 * (429 + `retry-after`, org-level limits), /docs/tool-use (tool payload),
 * /docs/text-chat (SSE streaming, `stream_options.include_usage`),
 * /docs/errors (`{"error":{"message","type"}}`), groq-typescript README
 * (default retries/timeouts, Workers support).
 */

export const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
export const GROQ_PRIMARY_MODEL = "openai/gpt-oss-120b";
export const GROQ_FALLBACK_MODEL = "openai/gpt-oss-20b";

const GROQ_TIMEOUT_MS = 25_000;

export type GroqFetch = (url: string, init: RequestInit) => Promise<Response>;

export type GroqAdapterOptions = Readonly<{
  /** Server-side key (sponsored) or the visitor's key (BYOK, header-only). */
  apiKey: string;
  model?: string;
  fallbackModel?: string;
  fetchImpl?: GroqFetch;
  /** Per-request override; the orchestrator's reserved deadline is the ceiling. */
  timeoutMs?: number;
}>;

type GroqMessage =
  | Readonly<{ role: "system"; content: string }>
  | Readonly<{ role: "user"; content: string }>
  | Readonly<{ role: "assistant"; content: string | null; tool_calls?: readonly GroqWireToolCall[] }>
  | Readonly<{ role: "tool"; tool_call_id: string; name: string; content: string }>;

type GroqWireToolCall = Readonly<{
  id: string;
  type: "function";
  function: Readonly<{ name: string; arguments: string }>;
}>;

type GroqChatResponse = Readonly<{
  choices?: readonly Readonly<{
    finish_reason?: string | null;
    message?: Readonly<{
      content?: string | null;
      refusal?: string | null;
      tool_calls?: readonly GroqWireToolCall[];
    }>;
  }>[];
  usage?: Readonly<{ prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }>;
}>;

type GroqStreamChunk = Readonly<{
  choices?: readonly Readonly<{
    finish_reason?: string | null;
    delta?: Readonly<{
      content?: string | null;
      tool_calls?: readonly Readonly<{
        index?: number;
        id?: string;
        type?: string;
        function?: Readonly<{ name?: string; arguments?: string }>;
      }>[];
    }>;
  }>[];
  usage?: GroqChatResponse["usage"];
}>;

function excerptLine(excerpt: TutorModelInput["excerpts"][number]): string {
  const locator = excerpt.locator;
  const where = locator.type === "lines"
    ? `linhas ${locator.start}-${locator.end}`
    : locator.type === "page"
      ? `página ${locator.page}`
      : `trecho ${locator.hash}`;
  return `[${excerpt.material.path} · ${where}]\n${excerpt.text}`;
}

function buildMessages(input: TutorModelInput): GroqMessage[] {
  const context = input.excerpts.length > 0
    ? input.excerpts.map(excerptLine).join("\n\n---\n\n")
    : "(nenhum trecho recuperado)";
  const history = input.toolResults.length > 0
    ? input.toolResults
      .map((result: TutorToolResult) =>
        `Busca "${result.query}" retornou:\n${result.excerpts.map(excerptLine).join("\n\n") || "(nada)"}`)
      .join("\n\n")
    : null;
  const messages: GroqMessage[] = [
    {
      role: "system",
      content: [
        "Você é o tutor de estudo do DSM Atlas. Responda em português.",
        "Use APENAS os trechos recuperados abaixo. Se eles não sustentarem a resposta, diga exatamente: Não encontrei isso nos materiais.",
        "Responda sempre em JSON com o formato: {\"answer\": string, \"citations\": [{\"path\": string, \"commitSha\": string, \"locator\": {\"type\": \"lines\", \"start\": number, \"end\": number} | {\"type\": \"page\", \"page\": number} | {\"type\": \"excerpt\", \"hash\": string}, \"quote\": string}], \"proposedNotebookActions\": [{\"type\": \"note\", \"title\": string, \"body\": string, \"source\": {\"path\": string, \"commitSha\": string}} | {\"type\": \"flashcard\", \"front\": string, \"back\": string, \"source\": {\"path\": string, \"commitSha\": string}}], \"toolCalls\": [{\"name\": \"retrieve\", \"query\": string}]}.",
        "Cada citação deve copiar um trecho recuperado palavra por palavra no campo quote, com path/commitSha/locator iguais aos do trecho. toolCalls só pode pedir a ferramenta \"retrieve\" com uma pergunta de busca; no máximo o número restante informado.",
        `Chamadas de ferramenta restantes: ${input.remainingToolCalls}.`,
      ].join("\n"),
    },
    { role: "user", content: `Pergunta: ${input.question}\n\nTrechos recuperados:\n${context}` },
  ];
  if (history) messages.push({ role: "user", content: `Resultados das buscas anteriores:\n${history}` });
  return messages;
}

function retrieveToolSchema() {
  return {
    type: "function",
    function: {
      name: "retrieve",
      description: "Busca trechos dos materiais em estudo para sustentar a resposta.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Pergunta de busca nos materiais em estudo." },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  } as const;
}

function parseToolCalls(raw: readonly GroqWireToolCall[] | undefined): TutorModelOutput["toolCalls"] {
  if (!raw || raw.length === 0) return undefined;
  const calls = raw.flatMap((call) => {
    if (call?.function?.name !== "retrieve") return [];
    let query = "";
    try {
      const parsed = JSON.parse(call.function.arguments ?? "{}") as { query?: unknown };
      if (typeof parsed.query === "string") query = parsed.query;
    } catch {
      return [];
    }
    return query.trim() ? [{ name: "retrieve" as const, query: query.trim() }] : [];
  });
  return calls.length > 0 ? calls : undefined;
}

type ParsedAnswer = {
  answer: string;
  citations: TutorModelOutput["citations"];
  proposedNotebookActions: TutorModelOutput["proposedNotebookActions"];
  toolCalls?: TutorModelOutput["toolCalls"];
};

function toExcerpt(candidate: {
  path?: unknown; commitSha?: unknown; locator?: unknown; quote?: unknown;
}): TutorModelOutput["citations"][number] | null {
  if (typeof candidate.path !== "string" || typeof candidate.commitSha !== "string" || typeof candidate.quote !== "string") return null;
  const locator = candidate.locator as { type?: unknown; start?: unknown; end?: unknown; page?: unknown; hash?: unknown } | null;
  if (!locator || typeof locator !== "object") return null;
  if (locator.type === "lines" && typeof locator.start === "number" && typeof locator.end === "number") {
    return { material: { path: candidate.path, commitSha: candidate.commitSha }, locator: { type: "lines", start: locator.start, end: locator.end }, text: candidate.quote, score: 1 };
  }
  if (locator.type === "page" && typeof locator.page === "number") {
    return { material: { path: candidate.path, commitSha: candidate.commitSha }, locator: { type: "page", page: locator.page }, text: candidate.quote, score: 1 };
  }
  if (locator.type === "excerpt" && typeof locator.hash === "string") {
    return { material: { path: candidate.path, commitSha: candidate.commitSha }, locator: { type: "excerpt", hash: locator.hash }, text: candidate.quote, score: 1 };
  }
  return null;
}

function toProposal(candidate: {
  type?: unknown; title?: unknown; body?: unknown; front?: unknown; back?: unknown; source?: unknown;
}): ProposedNotebookAction | null {
  const source = candidate.source as { path?: unknown; commitSha?: unknown } | null;
  if (!source || typeof source.path !== "string" || typeof source.commitSha !== "string") return null;
  const ref = { path: source.path, commitSha: source.commitSha };
  if (candidate.type === "note" && typeof candidate.title === "string" && typeof candidate.body === "string") {
    return { type: "note", title: candidate.title, body: candidate.body, source: ref };
  }
  if (candidate.type === "flashcard" && typeof candidate.front === "string" && typeof candidate.back === "string") {
    return { type: "flashcard", front: candidate.front, back: candidate.back, source: ref };
  }
  return null;
}

/**
 * Parses the model's JSON answer. Anything unparseable or off-shape becomes an
 * empty answer with no citations — the orchestrator then collapses it to the
 * explicit unsupported message instead of guessing.
 */
export function parseGroqAnswer(content: string | null | undefined, wireToolCalls?: readonly GroqWireToolCall[]): ParsedAnswer {
  const empty: ParsedAnswer = { answer: "", citations: [], proposedNotebookActions: [], toolCalls: parseToolCalls(wireToolCalls) };
  if (!content) return empty;
  let parsed: { answer?: unknown; citations?: unknown; proposedNotebookActions?: unknown; toolCalls?: unknown };
  try {
    parsed = JSON.parse(content) as typeof parsed;
  } catch {
    return empty;
  }
  if (typeof parsed.answer !== "string") return empty;
  const citations = Array.isArray(parsed.citations)
    ? parsed.citations.flatMap((candidate) => {
      const excerpt = toExcerpt(candidate as Parameters<typeof toExcerpt>[0]);
      return excerpt ? [excerpt] : [];
    })
    : [];
  const proposedNotebookActions = Array.isArray(parsed.proposedNotebookActions)
    ? parsed.proposedNotebookActions.flatMap((candidate) => {
      const proposal = toProposal(candidate as Parameters<typeof toProposal>[0]);
      return proposal ? [proposal] : [];
    })
    : [];
  const inlineCalls = Array.isArray(parsed.toolCalls)
    ? (parsed.toolCalls as readonly { name?: unknown; query?: unknown }[]).flatMap((call) =>
      call?.name === "retrieve" && typeof call.query === "string" && call.query.trim()
        ? [{ name: "retrieve" as const, query: call.query.trim() }]
        : [])
    : [];
  const toolCalls = inlineCalls.length > 0 ? inlineCalls : parseToolCalls(wireToolCalls);
  return { answer: parsed.answer, citations, proposedNotebookActions, toolCalls };
}

/**
 * Maps a Groq failure onto the shared `TutorProviderError` (provider spec §6).
 * Always fail closed: no automatic quota refund, and the message never carries
 * the key or the provider body.
 */
async function throwForStatus(response: Response): Promise<never> {
  // The body is consumed (so the socket can be reused) and then discarded:
  // provider error payloads never reach the visitor and never reach logs.
  await response.body?.cancel().catch(() => undefined);
  const retryAfter = response.headers.get("retry-after");
  const seconds = retryAfter !== null && retryAfter.trim() !== "" ? Number(retryAfter.trim()) : Number.NaN;
  if (response.status === 429) {
    // 429 is never retried: the visitor is told the quota is exhausted and when
    // it resets, using `retry-after` when the provider sent it.
    throw new TutorProviderError({
      kind: "rate_limited",
      retryAfterSeconds: Number.isFinite(seconds) && seconds >= 0 ? Math.floor(seconds) : null,
    });
  }
  if (response.status === 401 || response.status === 403) throw new TutorProviderError({ kind: "auth" });
  if (response.status === 400 || response.status === 422) throw new TutorProviderError({ kind: "invalid" });
  throw new TutorProviderError({ kind: "unavailable" });
}

async function postChatCompletions(options: {
  apiKey: string;
  body: Record<string, unknown>;
  fetchImpl: GroqFetch;
  timeoutMs: number;
}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  try {
    return await options.fetchImpl(`${GROQ_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${options.apiKey}` },
      body: JSON.stringify(options.body),
      signal: controller.signal,
    });
  } catch (error) {
    // Abort (our timeout) and any transport failure are unknown outcomes: the
    // caller reconciles the reservation as `unknown`, never as a refund.
    if (error instanceof Error && error.name === "AbortError") throw new TutorProviderError({ kind: "timeout" });
    throw new TutorProviderError({ kind: "unavailable" });
  } finally {
    clearTimeout(timer);
  }
}

function accumulateStreamDeltas(): {
  onChunk(chunk: GroqStreamChunk): void;
  result(): { content: string; toolCalls: GroqWireToolCall[]; usage: GroqChatResponse["usage"] | undefined };
} {
  let content = "";
  const callFragments: Record<number, { id: string; name: string; arguments: string }> = {};
  let usage: GroqChatResponse["usage"] | undefined;
  return {
    onChunk(chunk) {
      if (chunk.usage) usage = chunk.usage;
      const delta = chunk.choices?.[0]?.delta;
      if (typeof delta?.content === "string") content += delta.content;
      for (const call of delta?.tool_calls ?? []) {
        const index = call.index ?? 0;
        const slot = callFragments[index] ?? { id: "", name: "", arguments: "" };
        if (call.id) slot.id = call.id;
        if (call.function?.name) slot.name += call.function.name;
        if (call.function?.arguments) slot.arguments += call.function.arguments;
        callFragments[index] = slot;
      }
    },
    result() {
      return {
        content,
        toolCalls: Object.values(callFragments)
          .filter((call) => call.id && call.name)
          .map((call) => ({ id: call.id, type: "function" as const, function: { name: call.name, arguments: call.arguments || "{}" } })),
        usage,
      };
    },
  };
}

/**
 * Reads an SSE stream (`data: {...}` frames ending in `data: [DONE]`), joining
 * content deltas and tool-call argument fragments. Groq sends the totals in a
 * final usage chunk when `stream_options.include_usage` is set.
 */
export async function readGroqStream(response: Response): Promise<{
  content: string;
  toolCalls: GroqWireToolCall[];
  usage: GroqChatResponse["usage"] | undefined;
}> {
  const accumulator = accumulateStreamDeltas();
  const reader = response.body?.getReader();
  if (!reader) return { ...accumulator.result(), usage: undefined };
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split("\n");
      buffer = frames.pop() ?? "";
      for (const frame of frames) {
        const data = frame.replace(/^data:\s?/, "").trim();
        if (!data || data === "[DONE]") continue;
        try {
          accumulator.onChunk(JSON.parse(data) as GroqStreamChunk);
        } catch {
          continue;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
  return accumulator.result();
}

function usageOf(response: GroqChatResponse): { inputTokens: number; outputTokens: number } {
  return {
    inputTokens: Math.max(0, Math.floor(response.usage?.prompt_tokens ?? 0)),
    outputTokens: Math.max(0, Math.floor(response.usage?.completion_tokens ?? 0)),
  };
}

/**
 * The bound public provider. One `answer` call maps to one non-streaming Groq
 * chat completion on the primary model, with a single degradation attempt on
 * the fallback model when the primary is rate-limited (429) or unavailable
 * (5xx). The orchestrator's tool allowlist stays in code: `retrieve` is the
 * only function definition sent, and anything else the model returns is
 * dropped by `parseToolCalls`. Citations and proposals travel inside the
 * model's JSON answer; `validateCitations` in the orchestrator still decides
 * what counts as supported.
 *
 * Streaming (`answerStream`) is the same request with `stream: true`; the
 * response is only streamed after the caller reserved budget, and the final
 * usage chunk feeds reconciliation.
 */
export function createGroqPublicTutorAi(options: GroqAdapterOptions): PublicTutorAi & Readonly<{
  answerWithUsage(input: TutorModelInput, budget: ReservedBudget): Promise<{ output: TutorModelOutput; usage: { inputTokens: number; outputTokens: number } }>;
  answerStream(input: TutorModelInput, budget: ReservedBudget, onToken: (token: string) => void): Promise<{ output: TutorModelOutput; usage: { inputTokens: number; outputTokens: number } }>;
}> {
  const { apiKey } = options;
  if (!apiKey) throw new Error("A Groq API key is required");
  const primary = options.model ?? GROQ_PRIMARY_MODEL;
  const fallback = options.fallbackModel ?? GROQ_FALLBACK_MODEL;
  const fetchImpl = options.fetchImpl ?? ((url, init) => fetch(url, init));
  const timeoutMs = options.timeoutMs ?? GROQ_TIMEOUT_MS;

  function requestBody(input: TutorModelInput, budget: ReservedBudget, model: string, stream: boolean): Record<string, unknown> {
    return {
      model,
      messages: buildMessages(input),
      tools: [retrieveToolSchema()],
      tool_choice: "auto",
      response_format: { type: "json_object" },
      max_completion_tokens: Math.min(1_000, Math.max(1, budget.maxOutputTokens)),
      temperature: 0.2,
      top_p: 1,
      n: 1,
      stream,
      ...(stream ? { stream_options: { include_usage: true } } : {}),
    };
  }

  async function complete(input: TutorModelInput, budget: ReservedBudget, model: string): Promise<{ output: TutorModelOutput; usage: { inputTokens: number; outputTokens: number } }> {
    const response = await postChatCompletions({ apiKey, body: requestBody(input, budget, model, false), fetchImpl, timeoutMs });
    if (!response.ok) await throwForStatus(response);
    const payload = (await response.json()) as GroqChatResponse;
    const message = payload.choices?.[0]?.message;
    const parsed = parseGroqAnswer(message?.content, message?.tool_calls);
    return { output: { answer: parsed.answer, citations: parsed.citations, proposedNotebookActions: parsed.proposedNotebookActions, ...(parsed.toolCalls ? { toolCalls: parsed.toolCalls } : {}) }, usage: usageOf(payload) };
  }

  async function answerWithUsage(input: TutorModelInput, budget: ReservedBudget) {
    try {
      return await complete(input, budget, primary);
    } catch (error) {
      // Degradation only: a spent quota (429) or an unavailable primary gets
      // one attempt on the smaller model, which shares the same org limits but
      // may still have headroom on per-model counters. Auth, invalid-shape and
      // timeout errors never fall through — a timeout must stay unknown.
      if (
        error instanceof TutorProviderError
        && (error.failure.kind === "rate_limited" || error.failure.kind === "unavailable")
        && fallback !== primary
      ) {
        return await complete(input, budget, fallback);
      }
      throw error;
    }
  }

  async function answerStream(input: TutorModelInput, budget: ReservedBudget, onToken: (token: string) => void) {
    const response = await postChatCompletions({ apiKey, body: requestBody(input, budget, primary, true), fetchImpl, timeoutMs });
    if (!response.ok) await throwForStatus(response);
    const { content, toolCalls, usage } = await readGroqStream(response);
    for (const token of content.match(/\S+\s*/g) ?? []) onToken(token);
    const parsed = parseGroqAnswer(content, toolCalls);
    return {
      output: { answer: parsed.answer, citations: parsed.citations, proposedNotebookActions: parsed.proposedNotebookActions, ...(parsed.toolCalls ? { toolCalls: parsed.toolCalls } : {}) },
      usage: { inputTokens: Math.max(0, Math.floor(usage?.prompt_tokens ?? 0)), outputTokens: Math.max(0, Math.floor(usage?.completion_tokens ?? 0)) },
    };
  }

  return Object.freeze({
    async answer(input: TutorModelInput, budget: ReservedBudget): Promise<TutorModelOutput> {
      return (await answerWithUsage(input, budget)).output;
    },
    answerWithUsage,
    answerStream,
  });
}

/**
 * BYOK adapter factory. The key travels in the `Authorization` header of the
 * single Groq request and lives only in this closure for the request duration:
 * it is never persisted, logged, synchronized, cached or echoed. BYOK turns
 * skip the sponsored ledger (the visitor spends their own key) but keep the
 * same retrieval/citation/proposal discipline via the shared orchestrator.
 */
export function createByokGroqPublicTutorAi(
  key: string,
  options: Readonly<Omit<GroqAdapterOptions, "apiKey">> = {},
): PublicTutorAi {
  const trimmed = key.trim();
  if (!trimmed) throw new Error("A BYOK key is required");
  return createGroqPublicTutorAi({ ...options, apiKey: trimmed });
}
