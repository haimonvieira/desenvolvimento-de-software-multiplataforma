# DSM Atlas — Uso de IA (eixo 2)

**Status:** diagnóstico completo; seções 4+ aguardam as decisões D1–D3
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
