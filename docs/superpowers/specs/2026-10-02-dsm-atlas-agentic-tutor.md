# DSM Atlas — Tutor agentivo: modos chat/agente, capacidades e harness restrito

**Status:** desenho aprovado em 2 de outubro de 2026 (abordagem 2: um orquestrador,
capacidades como interruptores)
**Data:** 2 de outubro de 2026
**Escopo:** modos `chat`/`agente` do tutor do visitante, capacidades ligáveis,
harness de skills/MCP restrito, orçamento consentido
**Depende de:** `2026-09-30-dsm-atlas-ai-usage-design.md` (ledger, reserva, transporte),
`2026-09-28-dsm-atlas-public-ai-provider.md` (política do provedor público)
**Fora de escopo:** embeddings/busca vetorial (D1 segue aberta, spec §7 do provedor
continua valendo), edição de materiais pela IA, qualquer ação que publique ou
confirme lote, busca web patrocinada (decisão D-web abaixo)

## 1. Decisões tomadas

- **D-modo (aprovada):** um orquestrador só; o modo é configuração de quais
  capacidades vêm ligadas. `chat` = só `retrieve` (comportamento e custo de hoje).
  `agente` = o visitante liga/desliga cada capacidade. Trocar de modo no meio da
  conversa não apaga o histórico — só muda o que a IA pode fazer dali em diante.
- **D-gasto (aprovada):** nada age sem turno do usuário. Ligar uma capacidade =
  aceitar o custo dela dentro da reserva que o ledger já faz. Sem gasto fantasma.
- **D-harness (aprovada):** a IA tem acesso a skills e MCPs **restritos** —
  curadoria do Atlas, não do visitante. O visitante **vê** a IA usando (verbos no
  stream + ferramentas citadas na resposta), mas **não pode adicionar** skills,
  MCPs ou ferramentas próprias. A superfície é fechada por allowlist no código.
- **D-web (aberta):** busca web no primeiro corte entra **desligada por padrão**;
  se ligada, **só no BYOK** até haver evidência de custo. Pesquisa de 2/10/2026:
  existem tiers gratuitos (Brave Search API tem plano gratuito voltado a IA;
  Tavily tem créditos gratuitos mensais), mas nenhum foi medido contra um turno
  real do Atlas — latência, cobertura em português e custo por turno são
  desconhecidos. Medir antes de patrocinar.

## 2. Capacidades (cada uma = uma ferramenta + um toggle)

| Capacidade | Ferramenta | Default no agente | Custo |
|---|---|---|---|
| Materiais do Atlas | `retrieve` (existe) | ligada | patrocinado, como hoje |
| Memória da conversa | resumo do histórico entre turnos (novo) | ligada | +tokens de entrada por turno |
| Plano multi-etapas | decompor tarefa, mostrar progresso (novo) | ligada | +chamadas no mesmo turno |
| Harness restrito | skills/MCPs da curadoria via allowlist (novo) | ligada | conforme a ferramenta |
| Busca web | API de busca + leitura de páginas (nova) | **desligada** | BYOK até D-web fechar |

O seletor de modo + toggles vive no painel do tutor. A escolha viaja como campo
do turno (contrato validado, como o schema `.strict()` da rota já exige) e o
orquestrador aplica o conjunto de chaves correspondente. Capacidade desligada =
ferramenta fora do allowlist daquele turno = o modelo nem a vê.

## 3. Harness restrito — o que "restrito" significa em código

1. **Allowlist fechada:** o orquestrador só executa ferramentas nomeadas em
   `TUTOR_TOOL_ALLOWLIST` (hoje só `retrieve`). Skills/MCPs novos entram **por
   commit**, nunca por configuração do visitante, upload ou prompt.
2. **Visível, não editável:** cada chamada aparece no stream como verbo
   ("buscando nos materiais", "consultando a web") e as ferramentas usadas são
   citáveis na resposta. Não existe endpoint, campo de turno ou UI que registre
   ferramenta nova.
3. **Conteúdo externo é evidência, nunca instrução:** saída de skill/MCP/web
   entra delimitada como os uploads de arquivo já entram (invariante vigente) e
   a resposta é validada contra schema antes de qualquer uso.
4. **Sem escrita fora do caderno:** a única escrita que o harness pode fazer é a
   proposta inerte ao caderno, confirmada pelo clique do visitante (regra vigente).

## 4. Orçamento — como cada capacidade paga a conta

- Cada capacidade ligada **aumenta o teto do turno** (mais `maxToolCalls`, mais
  `maxInputTokens`) dentro da reserva prévia do ledger; a reserva continua sendo
  o portão ("a resposta só é transmitida depois de a reserva ter sucesso").
- Tetos por modo, não um teto só: `chat` mantém os números de hoje; `agente` tem
  tetos próprios maiores, **baixáveis sem evidência, só subíveis com evidência
  de custo medida** (regra vigente).
- `429` não repete em nenhum modo; timeout é desconhecido e não repete; `5xx` no
  público tenta uma vez o modelo menor (política vigente, inalterada).

## 5. Streaming e verbos — reaproveitar, não reinventar

O SSE e o extrator de `status`/`answer` já entregam o que o modo agente precisa:
o modelo escreve `status` primeiro ("buscando nos materiais…", "consultando a
web…", "montando o plano…") e a UI mostra enquanto a resposta ainda é escrita.
Nada novo no transporte; o contrato reordenado (citações antes da resposta)
continua valendo nos dois modos.

## 6. Auto-validação (o que prova que funciona)

1. **Testes de allowlist:** turno com capacidade desligada não expõe a ferramenta
   ao modelo (o input do adaptador não a contém); turno com modo `chat` nunca
   contém ferramenta além de `retrieve`.
2. **Testes de orçamento:** turno agente com tudo ligado reserva mais que o chat;
   reserva negada recusa antes de qualquer chamada ao provedor.
3. **Teste de harness fechado:** nenhum campo do turno, endpoint ou UI registra
   ferramenta; fuzz de nomes desconhecidos é ignorado.
4. **Prova viva por capacidade nova:** cada ferramenta nova (memória, plano, web)
   entra com um teste contra o caminho real do adaptador, não só contra dublê —
   a lição do `MISSING_FIELD`/`json mode cannot be combined` continua valendo.
5. **Medida D-web:** antes de patrocinar a busca web, um teste com turno de
   tamanho real registra latência, tokens e custo; o resultado decide D-web.

## 7. Fora de escopo neste corte

Embeddings, edição de materiais, publicação/confirmação por IA, busca web
patrocinada, skills/MCPs contribuídos pelo visitante.
