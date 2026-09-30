# AI Usage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the AI ledger from charging quota for work that never happened, remove the duplicated provider transport, make prompt changes impossible to land silently, and refuse an unusable tutor answer instead of returning an empty one.

**Architecture:** Four independent slices. The first adds the missing caller for an SQL function that already exists and is already correct. The second extracts only the transport — HTTP request, status mapping, timeout — leaving every policy decision in the adapter that owns it. The third anchors the assembled prompt in tests. The fourth validates the provider's output with zod at home, keeping the native tools and `json_object` format that streaming will later need.

**Tech Stack:** TypeScript, Next.js 16 on vinext + Cloudflare Workers, Drizzle + Neon Postgres, zod, vitest with PGlite, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-30-dsm-atlas-ai-usage-design.md`

## Global Constraints

- Run commands from `atlas/`. Package manager is pnpm via `corepack pnpm`.
- Never run `pnpm test` (its `pretest` builds) or `pnpm build`. Use `corepack pnpm exec vitest run <path>`.
- Typecheck: `corepack pnpm exec tsc --noEmit`. Four errors in the generated `.next/types/validator.ts` are expected and pre-existing; filter them with `grep -v '^\.next/'`.
- Project rule: no one-line wrapper functions; a static string-keyed lookup is `Readonly<Record<K, V>>`, never a `Set`.
- These four behaviors are load-bearing and no task may change them: a `429` is never retried, not even on the fallback model; a timeout is an unknown outcome whose reservation stays charged; a public `5xx` tries the fallback model exactly once; an auth failure never exposes the key or the provider body.
- Portuguese for user-facing copy. Comments explain *why*, in the voice of the surrounding code.
- The existing suite (41 files / 372 tests) must stay green.

## Frozen interfaces

- `usage-ledger.ts` exports `createUsageLedger`, `runSponsoredTurn`, and the type `UsageLedger` whose `expireStaleReservations(): Promise<number>` already exists and already works (proved by `usage-ledger.test.ts:395-427`).
- `public-tutor-ai.ts` exports `TutorProviderError`, `TutorProviderFailure`, `FAILURE_MESSAGES`, `PublicTutorAi`.
- `admin-classifier-ai.ts` exports `createGroqAdminClassifierAi`, `GROQ_ADMIN_BASE_URL`.
- `groq-public-tutor-ai.ts` exports `createGroqPublicTutorAi`, `createByokGroqPublicTutorAi`, `GROQ_BASE_URL`, `parseGroqAnswer`.
- Test harness in `usage-ledger.test.ts`: `clockAt(iso)` with `advance(seconds)`, `ledgerWith(clock, policies?, query?)`, `countingExecutor()` which records every SQL statement text, `windowRows(scope, subject, kind)`, `reservationRow(id)`.

---

### Task 1: Release expired reservations before asking for budget

**Files:**
- Modify: `atlas/src/modules/tutor/usage-ledger.ts` (`runSponsoredTurn`)
- Test: `atlas/src/modules/tutor/usage-ledger.test.ts`

**Interfaces:**
- Consumes: `UsageLedger.expireStaleReservations(): Promise<number>`
- Produces: no new API. `runSponsoredTurn` gains a side effect and its ordering is now part of the contract.

**Why it matters:** `expire_ai_reservations` has no caller anywhere in `atlas/src`, and `wrangler.jsonc` declares no `triggers.crons`. A reservation left `unknown` by a timeout keeps its worst-case 5.000 tokens charged against the global day window until something calls it. The window is what `reserve_ai_budget` compares against, so thirty such reservations deny the rest of the day.

- [ ] **Step 1: Write the failing test**

Add to `usage-ledger.test.ts`, inside the `usage reconciliation` describe:

```ts
it("admits a turn that the previous timeout would have denied", async () => {
  // A ceiling two turns wide, so the first failed reservation alone is enough
  // to close the door on the second.
  const tight: UsagePolicy = { ...USAGE_POLICIES.public, globalTokensPerDay: 6_000 };
  const clock = clockAt("2026-09-28T10:15:00.000Z");
  const ledger = ledgerWith(clock, { public: tight });

  const failed = await runSponsoredTurn(ledger, { scope: "public", subjectKey: "device-a" }, async () => {
    throw new Error("provider exploded");
  }).catch(() => "threw");
  expect(failed).toBe("threw");

  clock.advance(31);

  const second = await runSponsoredTurn(ledger, { scope: "public", subjectKey: "device-b" }, async () => ({ output: "ok" }));

  expect(second.decision.type).toBe("reserved");
});

it("sweeps expired reservations before reserving, not after", async () => {
  const clock = clockAt("2026-09-28T10:15:00.000Z");
  const ledger = ledgerWith(clock, undefined, countingExecutor());

  await runSponsoredTurn(ledger, { scope: "public", subjectKey: "device-a" }, async () => ({ output: "ok" }));

  const sweep = queries.findIndex((text) => text.includes("expire_ai_reservations"));
  const reserve = queries.findIndex((text) => text.includes("reserve_ai_budget"));
  expect(sweep).toBeGreaterThanOrEqual(0);
  expect(sweep).toBeLessThan(reserve);
});
```

- [ ] **Step 2: Run and watch them fail**

Run: `corepack pnpm exec vitest run src/modules/tutor/usage-ledger.test.ts`
Expected: the first fails because `second.decision.type` is `"denied"`; the second fails because `sweep` is `-1`.

- [ ] **Step 3: Implement**

In `runSponsoredTurn`, immediately before the reservation:

```ts
export async function runSponsoredTurn<T>(
  ledger: UsageLedger,
  input: Readonly<{ scope: UsageScope; subjectKey: string }>,
  turn: (budget: ReservedBudget) => Promise<SponsoredTurnResult<T>>,
): Promise<Readonly<{ decision: BudgetDecision; output?: T }>> {
  // Release reservations that expired before asking for more budget. A timeout
  // leaves its worst-case tokens charged until something releases them, and this
  // is the only moment where that matters: the ceiling is evaluated below.
  // A failure here must never deny a turn — the worst case is leaking one more
  // request, while propagating would take the tutor down.
  await ledger.expireStaleReservations().catch(() => undefined);

  const decision = await ledger.reserve(input);
  …
```

- [ ] **Step 4: Run and watch them pass**

Run: `corepack pnpm exec vitest run src/modules/tutor/usage-ledger.test.ts`
Expected: all pass, including the three pre-existing expiry tests.

- [ ] **Step 5: Typecheck and commit**

```bash
corepack pnpm exec tsc --noEmit 2>&1 | grep -v '^\.next/'
git add atlas/src/modules/tutor/usage-ledger.ts atlas/src/modules/tutor/usage-ledger.test.ts
git commit -m "fix(atlas): release expired reservations before asking for budget"
```

---

### Task 2: Share the transport, keep the policies apart

**Files:**
- Create: `atlas/src/integrations/ai/provider-failure.ts`
- Create: `atlas/src/integrations/ai/groq-transport.ts`
- Modify: `atlas/src/integrations/ai/public-tutor-ai.ts`, `admin-classifier-ai.ts`, `groq-public-tutor-ai.ts`, `atlas/src/app/api/tutor/turn/route.ts`
- Modify (imports only): `atlas/src/integrations/ai/admin-classifier-ai.test.ts`, `groq-public-tutor-ai.test.ts`

**Interfaces:**
- Produces:
```ts
// provider-failure.ts
export type TutorProviderFailure = … // moved verbatim from public-tutor-ai.ts
export const FAILURE_MESSAGES: Readonly<Record<TutorProviderFailure["kind"], string>>;
export class TutorProviderError extends Error { readonly failure: TutorProviderFailure; }
```
```ts
// groq-transport.ts
export async function throwForGroqStatus(response: Response): Promise<never>;
export async function postGroqChatCompletions(options: {
  baseUrl: string;
  apiKey: string;
  body: Record<string, unknown>;
  fetchImpl: GroqFetch;
  timeoutMs: number;
}): Promise<Response>;
```
- `public-tutor-ai.ts` stops defining the error and re-exports nothing: every importer moves to `provider-failure.ts` (route.ts, both adapters, both adapter tests).

**Acceptance, and the point of the task:** `groq-public-tutor-ai.test.ts` and `admin-classifier-ai.test.ts` must pass **without any behavioral edit**. If a failure-path assertion needs changing, the transport extraction changed a policy and the task is wrong.

- [ ] **Step 1: Move the failure taxonomy**

Cut `TutorProviderFailure`, `FAILURE_MESSAGES` and `TutorProviderError` from `public-tutor-ai.ts` into `provider-failure.ts` unchanged, add the import back in `public-tutor-ai.ts`, and update the four importers. Run the two adapter suites and `tests/api-tutor-turn.test.ts`; all three pass, proving the move is inert.

- [ ] **Step 2: Write the failing test for the shared transport**

Create `atlas/src/integrations/ai/groq-transport.test.ts`. The behavior worth pinning is the mapping, since both adapters depend on it and neither will own it any more:

```ts
it("maps a 429 with retry-after onto rate_limited", async () => {
  const spy = vi.fn(async () => new Response(null, { status: 429, headers: { "retry-after": "12" } }));
  await expect(throwForGroqStatus(await spy())).rejects.toMatchObject({
    failure: { kind: "rate_limited", retryAfterSeconds: 12 },
  });
});
it("maps 401 and 403 onto auth, 400 and 422 onto invalid, and the rest onto unavailable", …);
it("turns an abort into timeout and a transport failure into unavailable", …);
```

- [ ] **Step 3: Implement the transport**

Move `throwForStatus` (rename to `throwForGroqStatus`), `postChatCompletions` and the `GroqFetch` type into `groq-transport.ts`, parameterizing the base URL. Delete `throwForAdminStatus` and admin's inline AbortController block, replacing them with the shared calls. `GROQ_ADMIN_BASE_URL` and `GROQ_BASE_URL` hold the same value — keep both names for their owners, or collapse to one constant if both adapters read the same; do not leave two definitions of the same string.

- [ ] **Step 4: Run the two adapter suites unedited, then typecheck and commit**

```bash
corepack pnpm exec vitest run src/integrations/ai
corepack pnpm exec tsc --noEmit 2>&1 | grep -v '^\.next/'
git commit -m "refactor(atlas): one Groq transport, two unchanged policies"
```

---

### Task 3: Anchor the assembled prompt

**Files:**
- Modify: `atlas/src/integrations/ai/groq-public-tutor-ai.test.ts`, `admin-classifier-ai.test.ts`

**Interfaces:**
- Consumes: the transport double each suite already installs, which records `body` per request.
- Produces: nothing. This task adds assertions only.

**Why:** no test asserts the prompt text. The existing checks are substring matches on the admin side, so an edit to the system prompt or the output contract changes model behavior and fails nothing.

- [ ] **Step 1: Assert the public prompt exactly**

The suite already records every request body. Add a case that asserts `body.messages` with `toEqual` against the full literal:

```ts
it("sends exactly this prompt and output contract", async () => {
  const transport = groqTransport([groqAnswer("{}")]);
  const ai = createGroqPublicTutorAi({ apiKey: "k", fetchImpl: transport.fetch });

  await ai.answer({ question: "o que é lógica?", context: pageContext }, budget);

  expect(transport.requests[0]!.body.messages).toEqual([
    { role: "system", content: /* the five lines verbatim */ },
    { role: "user", content: "Pergunta: o que é lógica?\n\nTrechos recuperados:\n…" },
  ]);
});
```

Fill in both literals from the current implementation, not from memory: read `buildMessages` and copy the strings. A wrong literal here is exactly the failure this task exists to catch, so the test must fail first and be corrected against the source.

- [ ] **Step 2: Do the same for the admin classifier**, asserting the full system text, the evidence fence framing, and the user message.

- [ ] **Step 3: Run, then prove the anchor works**

Run: `corepack pnpm exec vitest run src/integrations/ai`
Then change one word in the public system prompt, re-run, and confirm the test fails. Revert the word and confirm it passes. A test that cannot fail is not an anchor.

- [ ] **Step 4: Commit** — `test(atlas): anchor both provider prompts to their exact text`

---

### Task 4: Refuse an unusable answer, and charge only what was spent

**Files:**
- Create: `atlas/src/modules/tutor/tutor-output.ts` (the zod schema and its parse)
- Modify: `atlas/src/integrations/ai/provider-failure.ts` (add the `unusable` kind and its message)
- Modify: `atlas/src/integrations/ai/groq-public-tutor-ai.ts` (validate after parse)
- Modify: `atlas/src/modules/tutor/usage-ledger.ts` (`runSponsoredTurn` reconciles a measured spend as settled)
- Test: `atlas/src/modules/tutor/tutor-output.test.ts`, `usage-ledger.test.ts`, `groq-public-tutor-ai.test.ts`

**Interfaces:**
- Produces:
```ts
export const tutorOutputSchema: z.ZodType<…>;
export function parseTutorOutput(raw: ParsedAnswer): TutorModelOutput | null;
```
- `TutorProviderError` gains an optional `usage?: TokenUsage`.

**Why the reconciliation changes:** a schema violation happens *after* the provider answered, so the spend is real and the usage is known. `runSponsoredTurn` currently reconciles every thrown error as `unknown`, which would hold the worst case — 5.000 tokens — instead of what was actually spent. That is the same fail-closed pessimism a timeout deserves and a measured spend does not.

- [ ] **Step 1: Write the failing ledger test**

```ts
it("reconciles a measured spend as settled even when the turn failed", async () => {
  const clock = clockAt("2026-09-28T10:15:00.000Z");
  const ledger = ledgerWith(clock);

  await runSponsoredTurn(ledger, { scope: "public", subjectKey: "device-a" }, async () => {
    throw new TutorProviderError({ kind: "unusable", usage: { inputTokens: 900, outputTokens: 120 } });
  }).catch(() => undefined);

  expect(await windowRows("public", "device-a", "hour")).toEqual([
    expect.objectContaining({ reserved_input_tokens: 0, input_tokens: 900, output_tokens: 120 }),
  ]);
});
```

- [ ] **Step 2: Run it and watch it fail** — expected: `reserved_input_tokens` stays 4.000 and `input_tokens` stays 0.

- [ ] **Step 3: Implement the reconciliation branch**

```ts
  } catch (error) {
    // A timeout is an unknown outcome: the reservation stays charged until it
    // expires, so a retry cannot spend twice for the same slot. An error that
    // carries measured usage is not unknown — the provider answered and we know
    // what it cost, so the reservation settles at that amount.
    const usage = error instanceof TutorProviderError ? error.usage : undefined;
    await ledger.reconcile(
      usage
        ? { reservationId: decision.reservationId, outcome: "settled", usage }
        : { reservationId: decision.reservationId, outcome: "unknown" },
    ).catch(() => undefined);
    throw error;
  }
```

- [ ] **Step 4: Write the failing output test**

```ts
it("rejects an answer whose citations are not the documented shape", () => {
  expect(parseTutorOutput({ answer: "x", citations: [{ path: 1 }], proposedNotebookActions: [], toolCalls: [] })).toBeNull();
});
it("accepts an answer with empty citations and no tool calls", …);
it("accepts each locator variant and each notebook action variant", …);
```

- [ ] **Step 5: Implement the schema and validate in the adapter**

Define the zod schema mirroring the contract the prompt already states (`answer: string`; `citations: {path, commitSha, locator: lines | page | excerpt, quote}[]`; `proposedNotebookActions: (note | flashcard)[]`; `toolCalls: {name: "retrieve", query: string}[]`). In `createGroqPublicTutorAi`, after `parseGroqAnswer`, validate; on failure throw `new TutorProviderError({ kind: "unusable", usage })` carrying the usage already parsed from the payload. Replace the silent-empty behavior at the throw site only — `parseGroqAnswer` keeps its current signature so its own tests stay valid.

- [ ] **Step 6: Run everything, typecheck, commit**

```bash
corepack pnpm exec vitest run
corepack pnpm exec tsc --noEmit 2>&1 | grep -v '^\.next/'
git commit -m "feat(atlas): refuse an unusable tutor answer and charge only the measured spend"
```

---

## Verification (lead, after all four tasks land)

- `corepack pnpm exec vitest run` — the full suite, no `pretest`.
- `corepack pnpm exec tsc --noEmit 2>&1 | grep -v '^\.next/'` — no real errors.
- **The leak, measured end to end:** with the preview Worker running, plant an expired `unknown` reservation holding tokens against the public global window, then drive one real turn through `/api/tutor/turn` and read `read_ai_quota` before and after. The turn must be admitted and the window's `reserved_*` must drop. This is the only check that proves the defect was real rather than theoretical.
- The four provider behaviors in Global Constraints, re-confirmed by the adapter suites passing without behavioral edits.
