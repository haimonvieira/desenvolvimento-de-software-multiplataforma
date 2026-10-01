---
target: home do catálogo (mapa)
total_score: 34
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 0
p2_count: 2
p3_count: 3
timestamp: 2026-09-30T19-29-20Z
slug: atlas-src-app-page-tsx
---
# Critique — DSM Atlas home (mapa do catálogo)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:---:|---|
| 1 | Visibility of System Status | 3 | Busca sem feedback ao digitar: painel só aparece após Enter (`?q=` na URL); sem aria-live |
| 2 | Match System / Real World | 4 | Metáfora de mapa consistente (linha, estação, "Você está aqui"); PT-BR natural |
| 3 | User Control and Freedom | 3 | Voltar/limpar busca OK; sem atalho p/ limpar filtro ativo além de apagar texto |
| 4 | Consistency and Standards | 4 | Tokens únicos; padrões idênticos nas 4 páginas; detector 0 achados |
| 5 | Error Prevention | 3 | Busca vazia não previne Enter; sem erro real (só leitura) |
| 6 | Recognition Rather Than Recall | 3 | Legenda permanente boa; DSM4–6 somem no mobile (recall necessário) |
| 7 | Flexibility and Efficiency | 3 | Sem atalho "/" para busca; navegação por teclado sólida |
| 8 | Aesthetic and Minimalist Design | 4 | Brutalismo disciplinado; sem ruído; hierarquia clara |
| 9 | Error Recovery | 4 | "0 encontrados. Tente outro termo."; erro de sync com retry inline |
| 10 | Help and Documentation | 3 | Legenda + nota ilustrativa; sem contexto sobre o que é "ATV1" etc. |
| **Total** | | **34/40** | **Good — endereçar áreas fracas** |

## Design Specificity Verdict: PASS
**LLM:** Linguagem autoral forte — mapa de trânsito com papel técnico, trilhos coloridos por disciplina, estações com progresso lima. Nada é intercambiável com dashboard SaaS genérico; DESIGN.md é respeitado nas 4 telas (sem eyebrow, sem card grid, sem sombra).
**Deterministic scan:** detect.mjs sobre src/app + src/modules: **0 findings** (exit 0). Nada que o detector pegue além do review.
**Visual overlays:** skipped — subagentes indisponíveis (429 quota), overlay requer live-server + injeção; evidência CLI + Playwright inline usada como fallback.

## Overall Impression
Design coeso, autoral e disciplinado. O maior ganho não é visual — é **feedback**: a busca (elemento mais usado) opera em modo silencioso até Enter, e estados vazios (GAPS 0 materiais, DSM1/2 sem progresso) não recebem desing de momento.

## What's Working
1. **Mapa como instrumento, não decoração** — trilho/estação/lima comunicam posição real; legenda permanente com dt/dd.
2. **Integridade de sistema** — 1 arquivo de tokens, 1 CSS, 0 achados do detector; paridade mapa/lista no mesmo modelo de dados.
3. **Estados de erro com saída** — 404/403/sync-error todos com "Voltar ao atlas" ou retry inline.

## Priority Issues
1. **[P2] Busca muda a URL só no Enter** — `.search input` sem feedback ao digitar (não é live region; painel `.search-results` só surge com ?q= na URL). Usuário digita e nada acontece → sensação de quebra. Fix: debounce ~200ms atualizando `?q=` (client-side) ou minimamente um hint "Enter para buscar". Comando: `$impeccable animate` (feedback sutil) ou `harden`.
2. **[P2] GAPS 0 materiais sem empty state** — `/disciplinas/GAPS` renderiza só o sub-título padrão "navegue por pastas..."; `StudyDisciplineMaterials` com 0 arquivos não renderiza nada. Vale emocional: aluno entra e acha que o site quebrou. Fix: branch `materials.length === 0` com empty state no tema ("Esta disciplina ainda não tem materiais publicados"). Comando: `$impeccable onboard`.
3. **[P3] 88 links numa única lista (DW3)** — `.catalog-materials` com max 88 por grupo excede chunking (≤4); mobile vira rolagem longa. Mitigado pela árvore de pastas (ATV 02/, Aula 01/...). Fix opcional: colapsar pastas por padrão acima de ~12 itens. Comando: `$impeccable distill`.
4. **[P3] Legenda não cobre coral** — legenda tem 3 itens (linha, estação, atual) mas coral `--color-recent` e amarelo `--color-crossing` aparecem nos trilhos sem explicação. Fix: 2 entradas extras na `dl.legend`. Comando: `$impeccable document`.
5. **[P3] Sem atalho de teclado para busca** — Alex digita "/" esperando foco; skip-link + tab order OK, mas nenhum acelerador. Fix: keydown global "/" → foco na busca. Comando: `$impeccable delight`.

## Persona Red Flags
**Alex (power user):** sem "/" na busca; troca de semestre via tabs OK; lista→mapa rápido. Sem bulk na leitura (não é o caso de uso). 1 flag.
**Sam (teclado/SR):** foco azul-rota 3px em todo o caminho (prova Playwright); skip link foca MAIN#conteudo; hit 30.4px nas estações; busca sem aria-live para resultados dinâmicos é o único gap real. 1 flag.
**Casey (mobile 1 mão):** add-material no topo (fora da zona do polegar) mas acessível; 88 itens de lista no touch; DSM4–6 ocultos sem entrada visível. 2 flags.

## Minor Observations
- "30+" no contador de resultados vs 60 links renderizados — confirmação de cap inconsistente.
- `.you-are-here` citado no CSS de reduced-motion não existe no DOM (regra órfã, 1 linha).
- Nota ilustrativa do mapa usa max-width 17rem — em telas médias cobre trilho do canto.

## Questions to Consider
- E se a busca reagisse à digitação com o mesmo desenho de "Resultados para X"?
- E se DSM4–6 tivessem um overflow menu "+3" no mobile em vez de desaparecerem?
- E se a disciplina vazia mostrasse o mapa sem trilho, com "linha em construção"?

## Run Notes
- slug: atlas-src-app-page-tsx · ignore list: inexistente
- Assessment independence: DEGRADED — subagentes falharam (429 quota do provedor); A e B executados sequencialmente inline
- CLI detector: rodou, 0 findings (exit 0)
- Browser visibility: Playwright headless inline (não visível ao usuário)
- Overlay injection: skipped (requer live-server; fallback CLI+console)
- Live server: atlas-critique (wrangler 8787) será parado antes do envio final
- Temp files: removidos
