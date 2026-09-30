# DSM Atlas — Uso de IA (eixo 2)

**Status:** diagnóstico e desenho das fatias 1–3 completos; §4.4 revelou-se acoplada a D3;
fatias condicionais aguardam D1–D3
**Data:** 30 de setembro de 2026
**Escopo:** tutor público e classificação administrativa — custo, qualidade, confiabilidade e latência
**Fora de escopo:** eixo 1 (visualização de materiais), já entregue e verificado

## 1. Diagnóstico

### 1.1 O recurso escasso não é a qualidade, é a cota

`usage-policy.ts` dá ao app **inteiro** 30 turnos patrocinados por dia e 150.000 tokens
diários; por visitante, 5/hora e 15/dia. A spec do provedor (§2.1) chegou a esses números
a partir do tier gratuito do Groq (1.000 RPD, 200.000 TPD por organização) e adoptou o teto
de **tokens** como o limite que manda — cada turno consome até 4.000 de entrada e 1.000 de
saída.

Consequência: qualquer trabalho neste eixo tem de se justificar em **perguntas úteis por
dia**, não em capacidade do modelo. Um turno que falha e mesmo assim segura orçamento custa
o mesmo que um turno que respondeu.

### 1.2 Reservas presas: mecanismo certo, sem instância observada

O ledger reserva o **pior caso** antes de chamar o provedor e reconcilia depois:

```sql
-- reserve_ai_budget (0006_ai_usage.sql:41)
-- "Every turn reserves its worst-case tokens, so the global day row always
--  knows the committed spend; a turn that would push it past the ceiling is denied."
```

Um timeout grava `outcome: "unknown"` (`route.ts:176`), e o próprio código documenta a
consequência (`public-tutor-ai.ts:60-61`): *"a `timeout` is an unknown outcome whose
reservation stays charged"*.

`expire_ai_reservations` existe justamente para desfazer isso — devolve
`reserved_input_tokens`/`reserved_output_tokens` à janela quando `expires_at <= now()` e o
status é `reserved` ou `unknown`. **Ela não tem chamador:** não existe `triggers.crons` no
`wrangler.jsonc` nem handler `scheduled` em lugar nenhum do `atlas/src`.

Com 5.000 tokens reservados por turno e teto global de 150.000, **30 reservas presas fecham
o dia**, e os alunos são recusados pelo resto dele com a mensagem de cota esgotada.

**O que exatamente apodrece, e o que se cura sozinho.** A reserva nasce com prazo curto:
`v_expires_at := p_now + make_interval(secs => deadline_seconds)`, e o prazo do escopo
público é 30 segundos (`usage-policy.ts`). Isso divide o dano em dois:

| Portão | Fonte do `reserved_*` | Expira sozinho? |
|---|---|---|
| Concorrência (`maxConcurrentTurns`) | conta linhas com `expires_at > p_now` | **sim** — 30 s e a linha deixa de bloquear |
| Teto de tokens do dia | soma `reserved_input + reserved_output + input + output` da janela global | **não** — só `expire_ai_reservations` devolve |

`read_ai_quota` soma os `reserved_*` da janela global do dia, então uma reserva presa
**infla o consumo até o fim do dia** mesmo tendo expirado há horas. O portão de concorrência
se recupera sozinho; o de tokens não. É por isso que o defeito é grave mesmo com prazo de
30 segundos: o prazo existe, o que não existe é quem o leia.

Detalhe que uma reimplementação ingênua erraria: a função credita a janela derivada de
`reservation.created_at`, não de `p_now` — uma reserva criada 23h59 UTC precisa ser devolvida
ao balde daquele dia, não ao de hoje.

**Medição honesta:** consultei o banco real apontado pelo `.dev.vars`, e as duas tabelas do
ledger estão **vazias** — 0 reservas, 0 janelas. O tutor ainda não serviu um turno real
nessa branch. Então isto é um defeito **latente**, com mecanismo certo e nenhuma instância
observada; corrigir é barato e evita uma drenagem garantida assim que houver uso. Não é
"está drenando sua cota agora".

### 1.3 Cache de prompt: é grátis, é automático, e hoje rende pouco

Verificado na documentação do provedor (Prompt Caching):

- Funciona sozinho, sem código e sem taxa, **só** em `openai/gpt-oss-120b` e `-20b` — os
  nossos dois modelos públicos.
- Casamento é por **prefixo exato**; expira em 2 h sem uso; 50% de desconto nos tokens em
  cache.
- *"Cached tokens do not count towards your rate limits. However, cached tokens are
  subtracted from your limits after processing, so it's still possible to hit your limits if
  you are sending a large number of input tokens in parallel requests."*

Nossa política já responde à cauda: `maxConcurrentTurns: 1` no escopo público é exatamente o
que impede a subtração tardia de estourar o teto. **Não mexer nesse valor.**

O ganho depende de prefixo reaproveitável, e hoje ele é pequeno. O prompt é montado assim
(`groq-public-tutor-ai.ts:147-168`):

```
system: <5 linhas fixas de persona/contrato/formato>
user:   "Pergunta: <pergunta>\n\nTrechos recuperados:\n<trechos>"
```

Os trechos mudam a cada pergunta, então o que fica elegível a cache é só o prompt de sistema
e o schema da ferramenta. Aproveitar de verdade exige **mover o contexto do material para
antes da pergunta**, como bloco estável — e isso briga com o teto de 4.000 tokens de entrada
e com a relevância da recuperação. O ganho só existe quando **o mesmo material é estudado
repetidamente**: o caso normal de uma turma na mesma disciplina, e o caso raro de um aluno
sozinho alternando materiais.

### 1.4 Streaming não é uma tarde

`answerStream` é código morto — confirmado por busca: aparece só na declaração da interface
(`:429`), na definição (`:481`) e no objeto exportado (`:498`). A rota usa `answer`.

Duas razões pelas quais ligá-lo não é trivial:

1. **Um turno do usuário pode ser N requisições ao provedor.** O adaptador faz uma
   requisição por vez; o loop de tool-calls vive no orquestrador
   (`study-tutor.ts`, que reenvia os resultados recuperados como novas mensagens). Streamar
   exige decidir o que fazer com as rodadas intermediárias.
2. **O cliente não sabe consumir stream.** `tutor-panel.tsx:92-121` faz
   `await response.json()` de uma vez, trata `429` como estado "cota esgotada" e só conhece
   `proposedNotebookActions` no fim. Não há SSE nem `ReadableStream` em nenhum ponto do
   cliente.

### 1.5 Dois seams de provedor duplicando transporte

`PublicTutorAi` (`public-tutor-ai.ts:54-56`) e `AdminClassifierAi`
(`admin-classifier-ai.ts:110-112`) são interfaces separadas que compartilham apenas
`TutorProviderError`. Fetch, mapeamento de status, timeout e parse estão duplicados nos dois
adaptadores.

Isso importa porque as **políticas deliberadamente diferem** e precisam continuar diferindo:

| | público | administrativo |
|---|---|---|
| `429` | não repete (os dois modelos partilham o teto da organização) | não repete |
| timeout | resultado **desconhecido**, nunca repete | igual |
| `5xx` | tenta **uma vez** o modelo menor | falha fechado, sem repetição |
| saída | `json_object` (`groq-public-tutor-ai.ts:444`) | `json_schema` estrito (`admin-classifier-ai.ts:326`) |

Um "adaptador genérico de provedor" que apague essas diferenças seria um retrocesso. O que
se pode unificar com segurança é só o **transporte** (fetch, classificação de status,
AbortError → timeout, leitura de corpo), deixando cada política explícita no seu adaptador.

### 1.6 Prompts são literais inline e não têm teste

Não há arquivo de prompts, constante de versão nem id de template. O texto vive dentro dos
adaptadores e nenhum teste afirma o prompt completo — só *substring* no lado administrativo.
Uma regressão silenciosa de prompt não falha nada.

### 1.7 Não existe cache de resposta, e não há infra para um

O app não usa a API `caches`, não tem binding de KV (`wrangler.jsonc` só declara `ASSETS` e
`vars`). Os únicos `cache:` no código são dublês de teste do transporte do GitHub. Um cache
de resposta teria de viver no Neon, que o ledger já usa.

### 1.8 Resumo

| # | Achado | Estado | Evidência |
|---|---|---|---|
| 1 | `expire_ai_reservations` sem chamador; sem cron | defeito latente | `usage-ledger.ts:42`, `wrangler.jsonc` sem `crons`, tabelas vazias |
| 2 | `answerStream` morto, sem chamador | peso morto | grep: `:429`, `:481`, `:498` |
| 3 | Transporte duplicado em dois seams | dívida | `public-tutor-ai.ts:54`, `admin-classifier-ai.ts:110` |
| 4 | Prompts sem teste de conteúdo | risco silencioso | `groq-public-tutor-ai.ts:147-164` |
| 5 | Contrato de saída frouxo no público | risco de parse | `:444` vs `admin-classifier-ai.ts:326` |
| 6 | Prefixo cacheável pequeno | oportunidade | §1.3 |
| 7 | Sem cache de resposta nem infra | oportunidade | §1.7 |
| 8 | Nenhuma avaliação contra modelo real | risco | só dublês roteirizados |

## 2. Invariantes que não podem quebrar

Extraídos das duas specs de provedor já aprovadas. Qualquer mudança neste eixo os preserva:

- Credencial administrativa **nunca** é a pública; o caminho público nunca dispara gasto
  administrativo.
- `429` não gera repetição, **nem no modelo de degradação**.
- Timeout é resultado desconhecido: não repete, e a reserva permanece até expirar.
- `5xx` no público: uma tentativa no modelo menor; falha fechado se ele também falhar.
- Erro de autenticação falha fechado e nunca expõe chave nem corpo do provedor.
- Conteúdo de arquivo enviado entra como **evidência delimitada**, nunca como instrução; a
  saída é validada contra schema antes de qualquer uso.
- Nenhuma IA altera o estado de um lote para confirmado, nem publica.
- Baixar tetos é permitido; **subir** exige evidência de custo medida.
- A resposta só é transmitida depois de a reserva de orçamento ter sucesso.

## 3. Decisões pendentes

**D1 — Embeddings / busca vetorial.** A spec do provedor público (§7) diz: *"Busca vetorial
ou embeddings: continua fora do primeiro corte."* (a) manter fora; (b) reabrir o §7.

**D2 — O que este eixo otimiza.** (a) mais perguntas úteis por dia com o mesmo teto;
(b) qualidade e confiança das respostas; (c) latência e a experiência da espera; (d) os três,
em fases. A evidência (§1.1, §1.2) aponta (a) como o que tem efeito garantido.

**D3 — Streaming.** (a) streamar só a rodada final; (b) SSE em todas as rodadas; (c) largar o
streaming e deletar o `answerStream` morto, mantendo o foco em cota.

**D3 está acoplada à §4.4, e isso não é óbvio pela pergunta.** O provedor documenta que
*"streaming and tool use are not currently supported with Structured Outputs"*. Escolher
streaming implica abrir mão da decodificação restrita no tutor público (§4.4, desenho A);
escolher restrição implica abrir mão do streaming (desenho B). Não são decisões independentes
e devem ser tomadas juntas.

## 4. Desenho

§4.1 a §4.3 não dependem de D1–D3. §4.4 começou como independente e **deixou de ser** quando
a documentação do provedor mostrou que restrição de schema e streaming se excluem; ela agora
é uma consequência de D3, e está escrita para ser lida junto dele.

### 4.1 Fechar o vazamento de reservas

**Onde chamar.** `runSponsoredTurn` (`usage-ledger.ts:154`) é descrito pelo próprio código
como "the one seam that decides whether inference may happen at all". A varredura entra
**imediatamente antes** de `ledger.reserve(input)`:

```ts
// Liberar reservas vencidas antes de pedir orçamento: uma reserva de timeout
// continua inflando a janela global do dia, e é esta a hora em que isso importa.
await ledger.expireStaleReservations().catch(() => undefined);
const decision = await ledger.reserve(input);
```

- **Antes, não depois:** a liberação precisa acontecer na mesma requisição que avalia o teto,
  senão o primeiro turno após uma falha ainda é recusado.
- **Falha engolida:** um erro na varredura não pode negar um turno. O pior caso é repetir o
  vazamento por mais uma requisição; o outro caminho derruba o tutor inteiro.
- **Por que não um cron:** o `wrangler.jsonc` não declara `triggers.crons` e o `main` do
  Worker é o `fetch-handler` do vinext, que não expõe um `scheduled` evidente. Um cron seria
  infra nova sobre um gancho não comprovado, e a varredura preguiçosa não precisa de nenhuma
  — ela roda exatamente quando há capacidade em jogo.
- **Custo:** uma consulta indexada por requisição. O índice `ai_reservation_expiry_idx`
  (`status`, `expires_at`) cobre o filtro, e com as tabelas em dia ela não encontra nada.

**Invariantes do comportamento a preservar:** a devolução credita a janela derivada de
`created_at` (§1.2), soma `GREATEST(0, …)` (nunca negativo) e marca `status = 'expired'`.
Nada disso é reimplementado no TypeScript — a função SQL já está certa; falta o chamador.

### 4.2 Unificar só o transporte, nunca a política

O que sai duplicado de `groq-public-tutor-ai.ts` e `admin-classifier-ai.ts` para um módulo
comum: montagem da requisição HTTP, `fetch` com prazo, mapeamento status→falha
(`429`/`401`/`403`/`400`/`422`/`5xx`), AbortError→`timeout`, descarte do corpo do upstream e
leitura do JSON de resposta.

O que **fica** em cada adaptador, explícito: a tabela de política da §1.5. Um adaptador
genérico de provedor que apagasse as diferenças seria retrocesso, e a aceitação desta fatia
é justamente a prova de que não mudaram: **os testes de caminho de falha existentes passam
sem alteração** (`groq-public-tutor-ai.test.ts`, `admin-classifier-ai.test.ts`). Se um deles
precisar ser editado, a fatia errou.

### 4.3 Ancorar os prompts em teste

Hoje nenhum teste afirma o texto do prompt, então uma edição silenciosa muda o comportamento
sem falhar nada. A fatia adiciona, nos dois adaptadores, uma asserção do **conjunto completo
de mensagens montado** (system + user), não de um trecho.

Consequência deliberada: qualquer edição de prompt passa a exigir uma alteração de teste
visível no diff — que é o ponto. Não entra versionamento semântico de prompt nesta fatia; se
a §1.3 for adiante, um `PROMPT_VERSION` entra junto com ela.

### 4.4 Contrato de saída no tutor público — e por que não é só trocar uma linha

O público usa `response_format: { type: "json_object" }` (`:444`) enquanto o administrativo
usa `json_schema` estrito (`:326`), e o parse do público é tolerante: `parseGroqAnswer`
devolve objeto vazio quando não entende, em vez de recusar.

A leitura ingênua seria igualar ao administrativo. **A documentação do provedor proíbe:**

> *"Streaming and tool use are not currently supported with Structured Outputs."*

E o tutor público depende de tool use: ele envia
`tools: [retrieveToolSchema()]`, `tool_choice: "auto"` (`:442-443`) **junto** com o
`response_format`. Trocar para `json_schema` estrito mantendo as ferramentas violaria a
incompatibilidade documentada e derrubaria a recuperação de trechos — que é o que ancora a
resposta no material.

Além disso, o modo estrito exige que **todos** os campos sejam `required` e que todo objeto
tenha `additionalProperties: false`. O contrato do tutor tem `citations`, `proposedNotebookActions`
e `toolCalls` que legitimamente vêm vazios, e uniões aninhadas (locator `lines | page | excerpt`;
ação `note | flashcard`) cujo suporte a `oneOf`/`anyOf` não está documentado.

**Consequência dura: D3 e esta fatia não podem ser ambas satisfeitas neste provedor.**
Escolher streaming é abrir mão da decodificação restrita no tutor público; escolher restrição
é abrir mão do streaming.

Três desenhos possíveis, a decidir junto com D3:

| | Desenho | Garantia | Custo |
|---|---|---|---|
| A | Manter `tools`, manter `json_object`, **validar em casa** com zod (já é dependência) e **descartar** a resposta que não conforma | Adesão verificada por nós, não pelo decodificador | Uma validação; nenhum ganho de garantia na geração |
| B | Largar o `tools` nativo e usar `json_schema` estrito, confiando no `toolCalls` **inline** que o prompt já descreve e o código já lê (`:275-280`) | Decodificação restrita de verdade | Reverte o desenho de ferramentas; inviabiliza streaming |
| C | Manter como está e só endurecer o parse (recusar em vez de devolver vazio) | Mínima | Não resolve o contrato frouxo na origem |

O caminho que preserva as duas ambições é **A** quando D3 = streaming, e **B** quando D3 =
sem streaming. O que não se pode ter é o texto atual da fatia, que promete restrição no
provedor e ao mesmo tempo manteria as duas coisas.

## 5. Fatiamento

Independentes entre si e de D1–D3:

| Fatia | Entrega | Aceitação |
|---|---|---|
| 1 | Varredura antes da reserva | Com uma reserva `unknown` vencida segurando 5.000 tokens, um turno que seria recusado passa a ser admitido; a devolução cai na janela que foi cobrada |
| 2 | Transporte compartilhado | Testes de falha existentes passam **sem edição**; nenhum comportamento de política muda |
| 3 | Prompts ancorados | Editar o prompt sem editar o teste falha a suíte |
| 4 | Contrato de saída do público | A resposta fora do contrato é descartada, nunca completada por suposição. O desenho (A/B/C da §4.4) sai de D3 — a fatia não começa antes disso |

Dependentes de decisão: prefixo estável para cache (§1.3, depende de D2), streaming
(depende de D3), harness de avaliação (depende de D2 — se o eixo for cota, o harness é
instrumento de medição e não uma suíte de qualidade), embeddings (depende de D1).

## 6. Verificação

Nada aqui se prova só por leitura. O que cada fatia exige:

- **Fatias 1–3:** suíte de unidade, contra o banco quando a fatia toca o ledger. A fatia 1
  precisa de um teste que **falhe antes** da correção — reserva presa, turno recusado — porque
  é a única prova de que o vazamento era real e não teórico.
- **Fatia 4 e o harness:** exigem o provedor real e portanto **consomem cota**, que é o recurso
  escasso desta spec. Têm de rodar fora do orçamento patrocinado — chave e escopo próprios,
  nunca `GROQ_API_KEY` — e ser opt-in, nunca em CI.
- **Fim a fim:** o turno real do tutor contra o Worker, com uma reserva vencida plantada, para
  provar que o aluno deixa de ser recusado. É a mesma verificação que a §1.2 pede: medir o
  `read_ai_quota` antes e depois.
