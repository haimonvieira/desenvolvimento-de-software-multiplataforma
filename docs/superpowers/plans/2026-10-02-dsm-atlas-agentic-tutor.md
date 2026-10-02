# Plano — Tutor agentivo (modos chat/agente + harness restrito)

**Spec:** `../specs/2026-10-02-dsm-atlas-agentic-tutor.md`
**Ordem:** cada fatia é testável e entra sozinha em produção; parar após qualquer
fatia deixa o app melhor do que antes.

## Fatia 1 — Modos como configuração (sem ferramenta nova)

- Adicionar `mode: "chat" | "agent"` + `capabilities` ao contrato do turno
  (schema `.strict()`; desconhecido é rejeitado, nunca ignorado).
- `chat` = allowlist de hoje (`retrieve`); `agent` com tudo desligado comporta-se
  como `chat`.
- Seletor de modo no painel do tutor; a escolha viaja no turno.
- **Aceitação:** teste de allowlist — input do adaptador em modo `chat` nunca
  contém ferramenta além de `retrieve`; trocar de modo não apaga o histórico.

## Fatia 2 — Memória da conversa

- Resumo do histórico entre turnos como contexto (não o log cru: resumo
  limitado em tokens, referências tipo "naquele capítulo" resolvidas contra ele).
- Teto de tokens do resumo fixo e contado dentro da reserva do turno.
- **Aceitação:** "e nesse outro capítulo?" após pergunta sobre um material usa o
  contexto sem re-perguntar; teste com turno de tamanho real mede o custo.

## Fatia 3 — Plano multi-etapas visível

- Decompor tarefa em passos, emitir progresso via `status` no stream existente
  ("buscando nos materiais…", "comparando fontes…", "montando a resposta…").
- Propostas inertes ao caderno continuam exigindo o clique (regra vigente).
- **Aceitação:** tarefa em 2+ fontes mostra os verbos em ordem e a resposta cita
  cada fonte; sem ferramenta nova no transporte.

## Fatia 4 — Harness restrito (skills/MCPs da curadoria)

- Registro de ferramentas por commit (allowlist em código); teste de harness
  fechado (fatia 4 da auto-validação da spec: nenhum campo/endpoint/UI registra
  ferramenta; nomes desconhecidos ignorados).
- Cada ferramenta nova entra com prova viva contra o caminho real do adaptador.
- **Aceitação:** o visitante vê a IA usando (verbos + ferramentas citadas), mas
  não existe caminho para adicionar ferramenta.

## Fatia 5 — Busca web (desligada por padrão, BYOK primeiro)

- Pré-requisito: medir latência/tokens/custo com turno real (fecha D-web).
- Só depois da medida: ligar atrás de toggle, BYOK primeiro; patrocinada só com
  teto próprio e evidência de custo.
- Saída da web como evidência delimitada, nunca instrução.
- **Aceitação:** medida registrada; teste de orçamento recusa antes de chamar o
  provedor quando a reserva nega.

## O que NÃO entra

Embeddings (D1), edição de materiais, publicação por IA, ferramenta contribuída
pelo visitante.
