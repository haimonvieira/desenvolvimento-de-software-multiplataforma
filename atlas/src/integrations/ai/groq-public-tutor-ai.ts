import { z } from "zod";

import type {
  ProposedNotebookAction,
  PublicTutorAi,
  TutorModelInput,
  TutorModelOutput,
  TutorToolResult,
} from "./public-tutor-ai";
import { TutorProviderError } from "./provider-failure";
import { postGroqChatCompletions, throwForGroqStatus, type GroqFetch } from "./groq-transport";
import { createTutorFieldExtractor } from "../../modules/tutor/answer-stream";
import type { ReservedBudget } from "../../modules/tutor/usage-ledger";
import { promptCharBudget, TRUNCATION_MARKER } from "./prompt-budget";

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
 *
 * Degradation: `openai/gpt-oss-20b` is tried once, and only when the primary is
 * *unavailable* (5xx or a transport failure). A 429 is never repeated — the
 * fallback shares the same organization limits, and spec §6 requires the quota
 * message with `retry-after` instead of a second provider call.
 */

export const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
export const GROQ_PRIMARY_MODEL = "openai/gpt-oss-120b";
export const GROQ_FALLBACK_MODEL = "openai/gpt-oss-20b";

const GROQ_TIMEOUT_MS = 25_000;

export type GroqAdapterOptions = Readonly<{
  /** Server-side key (sponsored) or the visitor's key (BYOK, header-only). */
  apiKey: string;
  /** Endpoint override; BYOK points it at the visitor's provider. Defaults to Groq. */
  baseUrl?: string;
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

/**
 * Renders excerpt lines within `budgetChars`, ending with a marker when the
 * overflow is dropped instead of sent. A retrieval chunk is bounded by lines,
 * not characters, so one long line can carry most of a 400 KB file; without this
 * the accumulated excerpts would blow past the reserved per-turn input budget.
 */
function boundedExcerpts(
  excerpts: readonly TutorModelInput["excerpts"][number][],
  budgetChars: number,
): string {
  const separator = "\n\n---\n\n";
  let out = "";
  for (const excerpt of excerpts) {
    const lead = out.length > 0 ? separator : "";
    const line = excerptLine(excerpt);
    if (out.length + lead.length + line.length <= budgetChars) {
      out += `${lead}${line}`;
      continue;
    }
    const room = budgetChars - out.length - lead.length - TRUNCATION_MARKER.length;
    if (room > 0) out += `${lead}${line.slice(0, room)}${TRUNCATION_MARKER}`;
    break;
  }
  return out;
}

function boundedHistory(toolResults: readonly TutorToolResult[], budgetChars: number): string {
  const parts: string[] = [];
  let remaining = budgetChars;
  for (const [index, result] of toolResults.entries()) {
    if (remaining <= 0) break;
    const share = Math.floor(remaining / (toolResults.length - index));
    const label = `Busca "${result.query.slice(0, 200)}" retornou:\n`;
    const body = boundedExcerpts(result.excerpts, Math.max(0, share - label.length - (parts.length > 0 ? 2 : 0))) || "(nada)";
    const block = `${parts.length > 0 ? "\n\n" : ""}${label}${body}`;
    remaining -= block.length;
    parts.push(block);
  }
  return parts.join("");
}

function buildMessages(input: TutorModelInput, budget: ReservedBudget): GroqMessage[] {
  const system = [
    "Você é o tutor de estudo do DSM Atlas. Responda em português.",
    "Use APENAS os trechos recuperados abaixo. Se eles não sustentarem a resposta, diga exatamente: Não encontrei isso nos materiais.",
    "Responda sempre em JSON com o formato: {\"status\": string, \"answer\": string, \"citations\": [{\"path\": string, \"commitSha\": string, \"locator\": {\"type\": \"lines\", \"start\": number, \"end\": number} | {\"type\": \"page\", \"page\": number} | {\"type\": \"excerpt\", \"hash\": string}, \"quote\": string}], \"proposedNotebookActions\": [{\"type\": \"note\", \"title\": string, \"body\": string, \"source\": {\"path\": string, \"commitSha\": string}} | {\"type\": \"flashcard\", \"front\": string, \"back\": string, \"source\": {\"path\": string, \"commitSha\": string}}], \"toolCalls\": [{\"name\": \"retrieve\", \"query\": string}]}.",
    "O campo status, primeiro do JSON, é uma frase curta em português, no gerúndio, dizendo o que você está fazendo com o material (ex.: \"analisando o algoritmo\", \"comparando as duas listas\"). Não repita a pergunta nem a resposta.",
    "Cada citação deve copiar um trecho recuperado palavra por palavra no campo quote, com path/commitSha/locator iguais aos do trecho. toolCalls só pode pedir a ferramenta \"retrieve\" com uma pergunta de busca; no máximo o número restante informado.",
    `Chamadas de ferramenta restantes: ${input.remainingToolCalls}.`,
  ].join("\n");
  const questionLead = `Pergunta: ${input.question}\n\nTrechos recuperados:\n`;
  const historyLead = "Resultados das buscas anteriores:\n";
  // Everything except the excerpts is fixed overhead; the excerpts share what
  // remains of the reserved input budget, across the whole accumulated set.
  const evidenceBudget = Math.max(0, promptCharBudget(budget) - system.length - questionLead.length);
  const contextBlock = boundedExcerpts(input.excerpts, evidenceBudget);
  const context = contextBlock.length > 0 ? contextBlock : "(nenhum trecho recuperado)";
  const history = input.toolResults.length > 0
    ? boundedHistory(input.toolResults, Math.max(0, evidenceBudget - contextBlock.length - historyLead.length))
    : null;
  const messages: GroqMessage[] = [
    { role: "system", content: system },
    { role: "user", content: `${questionLead}${context}` },
  ];
  if (history) messages.push({ role: "user", content: `${historyLead}${history}` });
  return messages;
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

const wireLocatorSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("lines"), start: z.number(), end: z.number() }),
  z.object({ type: z.literal("page"), page: z.number() }),
  z.object({ type: z.literal("excerpt"), hash: z.string() }),
]);

const wireCitationSchema = z.object({
  path: z.string(),
  // Not required from the model: the commit sha is an opaque identifier it has
  // no reason to echo, and a model that omits it used to lose every citation to
  // the equality check downstream. We already know the sha — it is on the
  // excerpt we handed over — so the validator stamps it back in.
  commitSha: z.string().optional(),
  locator: wireLocatorSchema,
  quote: z.string(),
});

const wireActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("note"),
    title: z.string(),
    body: z.string(),
    source: z.object({ path: z.string(), commitSha: z.string().optional() }),
  }),
  z.object({
    type: z.literal("flashcard"),
    front: z.string(),
    back: z.string(),
    source: z.object({ path: z.string(), commitSha: z.string().optional() }),
  }),
]);

/**
 * The wire shape the system prompt demands, validated as it arrives. `answer`,
 * `citations` and `proposedNotebookActions` are required because the prompt
 * mandates them; `toolCalls` is optional because Groq may instead deliver the
 * calls as native `tool_calls` on the message. Unknown extra keys are stripped,
 * not refused: an extra field is not lost evidence, a dropped citation is.
 */
const wireAnswerSchema = z.object({
  // Optional on purpose: a model that omits `status` must not lose the whole
  // answer. The nicety is a bonus; absence means "no status event", nothing
  // more. Required here, a missing status would make `validateGroqAnswer`
  // refuse an otherwise correct answer — the exact failure this project already
  // paid for once.
  status: z.string().optional(),
  answer: z.string(),
  citations: z.array(wireCitationSchema),
  proposedNotebookActions: z.array(wireActionSchema),
  toolCalls: z.array(z.object({ name: z.string(), query: z.string() })).optional(),
});

type WireCitation = z.infer<typeof wireCitationSchema>;
type WireAction = z.infer<typeof wireActionSchema>;

function toExcerpt(citation: WireCitation): TutorModelOutput["citations"][number] {
  const locator = citation.locator;
  return {
    // The sha here is whatever the model echoed, possibly nothing. It is
    // provisional: `validateCitations` replaces the whole entry with the excerpt
    // that actually matched, so the sha that survives is ours.
    material: { path: citation.path, commitSha: citation.commitSha ?? "" },
    locator: locator.type === "lines"
      ? { type: "lines", start: locator.start, end: locator.end }
      : locator.type === "page"
        ? { type: "page", page: locator.page }
        : { type: "excerpt", hash: locator.hash },
    text: citation.quote,
    score: 1,
  };
}

function toProposal(action: WireAction): ProposedNotebookAction {
  const source = { path: action.source.path, commitSha: action.source.commitSha ?? "" };
  return action.type === "note"
    ? { type: "note", title: action.title, body: action.body, source }
    : { type: "flashcard", front: action.front, back: action.back, source };
}

export type GroqAnswerValidation =
  | Readonly<{ ok: true; output: TutorModelOutput }>
  | Readonly<{ ok: false }>;

/**
 * Validates the model's JSON answer against the documented wire shape and maps
 * it onto the internal contract. A violation is a refusal, not a filter: a
 * malformed citation is dropped today while the rest of the answer is returned,
 * which is worse than refusing because the answer's claim may rest on exactly
 * the evidence that was dropped and nothing downstream can tell. The caller
 * turns `ok: false` into an `unusable` failure carrying the measured usage.
 */
export function validateGroqAnswer(
  content: string | null | undefined,
  wireToolCalls?: readonly GroqWireToolCall[],
): GroqAnswerValidation {
  if (!content) return { ok: false };
  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    return { ok: false };
  }
  const parsed = wireAnswerSchema.safeParse(raw);
  if (!parsed.success) return { ok: false };
  const inlineCalls = (parsed.data.toolCalls ?? []).flatMap((call) =>
    call.name === "retrieve" && call.query.trim() ? [{ name: "retrieve" as const, query: call.query.trim() }] : []);
  const toolCalls = inlineCalls.length > 0 ? inlineCalls : parseToolCalls(wireToolCalls);
  return {
    ok: true,
    output: {
      answer: parsed.data.answer,
      citations: parsed.data.citations.map(toExcerpt),
      proposedNotebookActions: parsed.data.proposedNotebookActions.map(toProposal),
      ...(toolCalls ? { toolCalls } : {}),
    },
  };
}

function accumulateStreamDeltas(onContent?: (delta: string) => void): {
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
      if (typeof delta?.content === "string") {
        content += delta.content;
        onContent?.(delta.content);
      }
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
export async function readGroqStream(
  response: Response,
  onContent?: (delta: string) => void,
): Promise<{
  content: string;
  toolCalls: GroqWireToolCall[];
  usage: GroqChatResponse["usage"] | undefined;
}> {
  const accumulator = accumulateStreamDeltas(onContent);
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
 * the fallback model only when the primary is unavailable (5xx or transport
 * failure). A 429 is never repeated — not even on the fallback — and ends the
 * turn on the primary with `retry-after` so the visitor sees the quota state.
 * The orchestrator's tool allowlist stays in code: `retrieve` is the
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
  answerStream(input: TutorModelInput, budget: ReservedBudget, onToken: (token: string) => void, onStatus?: (status: string) => void): Promise<{ output: TutorModelOutput; usage: { inputTokens: number; outputTokens: number } }>;
}> {
  const { apiKey } = options;
  if (!apiKey) throw new Error("A Groq API key is required");
  const baseUrl = options.baseUrl ?? GROQ_BASE_URL;
  const primary = options.model ?? GROQ_PRIMARY_MODEL;
  const fallback = options.fallbackModel ?? GROQ_FALLBACK_MODEL;
  const fetchImpl = options.fetchImpl ?? ((url, init) => fetch(url, init));
  const timeoutMs = options.timeoutMs ?? GROQ_TIMEOUT_MS;

  function requestBody(input: TutorModelInput, budget: ReservedBudget, model: string, stream: boolean): Record<string, unknown> {
    return {
      model,
      messages: buildMessages(input, budget),
      // No `tools`/`tool_choice`: Groq refuses the combination outright —
      // "json mode cannot be combined with tool/function calling" — and that
      // 400 was failing every sponsored turn while every test passed, because
      // the tests double the transport. Retrieval travels through the inline
      // `toolCalls` field the prompt already documents and the validator reads.
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
    const response = await postGroqChatCompletions({ baseUrl, apiKey, body: requestBody(input, budget, model, false), fetchImpl, timeoutMs });
    if (!response.ok) await throwForGroqStatus(response);
    const payload = (await response.json()) as GroqChatResponse;
    const usage = usageOf(payload);
    const message = payload.choices?.[0]?.message;
    const validation = validateGroqAnswer(message?.content, message?.tool_calls);
    // A violation is a refusal that still cost real tokens: throw with the
    // measured usage so the ledger settles the spend instead of holding the
    // worst case until the reservation expires.
    if (!validation.ok) throw new TutorProviderError({ kind: "unusable" }, usage);
    return { output: validation.output, usage };
  }

  async function answerWithUsage(input: TutorModelInput, budget: ReservedBudget) {
    try {
      return await complete(input, budget, primary);
    } catch (error) {
      // Degradation is for availability only: an unavailable primary (5xx or a
      // transport failure) gets one attempt on the smaller model, which shares
      // the same organization limits but may still have headroom. A 429 must
      // NOT be repeated (spec §6) — the fallback shares the same limits, so a
      // second call would spend quota the visitor was just told is gone. Auth,
      // invalid-shape and timeout errors never fall through either; a timeout
      // stays an unknown outcome.
      if (error instanceof TutorProviderError && error.failure.kind === "unavailable" && fallback !== primary) {
        return await complete(input, budget, fallback);
      }
      throw error;
    }
  }

  async function answerStream(input: TutorModelInput, budget: ReservedBudget, onToken: (token: string) => void, onStatus?: (status: string) => void) {
    const response = await postGroqChatCompletions({ baseUrl, apiKey, body: requestBody(input, budget, primary, true), fetchImpl, timeoutMs });
    if (!response.ok) await throwForGroqStatus(response);
    // The raw deltas are fragments of the answer JSON, not the answer: the
    // extractor decodes the top-level `"status"` and `"answer"` strings so the
    // caller forwards readable text to the student — status first, then answer.
    // A document that never closes just stops emitting; the validated output is
    // still built from the full content.
    const extractor = createTutorFieldExtractor();
    const { content, toolCalls, usage } = await readGroqStream(response, (delta) => {
      const readable = extractor.push(delta);
      if (readable.status) onStatus?.(readable.status);
      if (readable.answer) onToken(readable.answer);
    });
    const measured = usageOf({ usage });
    const validation = validateGroqAnswer(content, toolCalls);
    if (!validation.ok) throw new TutorProviderError({ kind: "unusable" }, measured);
    return { output: validation.output, usage: measured };
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
 *
 * A visitor's provider serves one model, so degradation is disabled for it: the
 * default fallback names a Groq model the provider does not have. The key-only
 * Groq path keeps today's fallback untouched.
 */
export function createByokGroqPublicTutorAi(
  key: string,
  options: Readonly<Omit<GroqAdapterOptions, "apiKey">> = {},
): PublicTutorAi {
  const trimmed = key.trim();
  if (!trimmed) throw new Error("A BYOK key is required");
  const providerModel = options.baseUrl !== undefined && options.fallbackModel === undefined ? options.model : undefined;
  return createGroqPublicTutorAi({
    ...options,
    ...(providerModel !== undefined ? { fallbackModel: providerModel } : {}),
    apiKey: trimmed,
  });
}
