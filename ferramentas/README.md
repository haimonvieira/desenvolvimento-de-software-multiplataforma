# Ferramentas — camada de conhecimento do DSM

Pipeline local, sem dependências externas obrigatórias. Usa apenas Python 3.10+
e os binários `pdftotext`/`pdfinfo` (poppler) já presentes no sistema.

## Fluxo

```
DSM1|DSM2|DSM3 (originais, intocados)
        │
        ▼
inventariar.py ──► conhecimento/_indice/inventario.csv
        │                resumo.json
        ▼
extrair.py ─────► conhecimento/<SEM>/<DISC>/*.md
        │                (texto + frontmatter + páginas)
        ▼
indexar.py ─────► conhecimento/_indice/materiais.db (FTS5)
        │
        ├── buscar.py        (CLI)
        └── retrieval.py     (núcleo reutilizável; futuro MCP importa daqui)
```

## Comandos

```bash
make inventariar
make extrair
make extrair FORCAR=1
make indexar
make buscar Q="LEFT JOIN WHERE" ARGS="--disciplina DSM2/BD2"
make validar
make avaliar
make tudo
```

## Camada de skills

As skills ficam em `.opencode/skills/`:

- `dsm/` — roteadora visível, com o mapa das 20 disciplinas.
- `dsm-bd2/` — skill de Banco de Dados II (piloto), oculta da lista automática
  (`metadata.opencode/autoinvoke: false`) e carregada pela roteadora.

Cada skill de disciplina tem `SKILL.md` + `references/` com curadoria, exercícios,
fontes e glossário. O conteúdo pesado continua em `conhecimento/`, recuperado por
busca — a skill não duplica o corpus.

Validação:

```bash
python3 ferramentas/validar.py   # frontmatter, links, _meta.json, evals
python3 ferramentas/avaliar.py --skill dsm-bd2 --k 5
```

## Decisões de projeto

- **Originais intocados.** Tudo é gerado em `conhecimento/`.
- **Idempotente.** `extrair.py` só regenera se a fonte for mais nova (ou `--forcar`).
- **Zero dependência obrigatória.** PDF via `pdftotext`; DOCX/PPTX via `zipfile` +
  `ElementTree`; HTML via `bs4` quando disponível, com fallback stdlib.
- **Página rastreável.** PDFs recebem marcadores `<!-- page: N -->`, usados na citação.
- **Núcleo único de busca.** `retrieval.py` é a API; `buscar.py` é só a CLI. Um MCP
  futuro deve importar `retrieval`, nunca reimplementar.
- **FTS5 com remoção de acentos.** `unicode61 remove_diacritics 2` faz
  "normalizacao" encontrar "normalização".

## Limitações conhecidas

- PDFs escaneados não têm texto; nenhum foi detectado no curso até agora. Se
  aparecer, instale `ocrmypdf`/`tesseract` e rode antes da extração.
- Figuras e diagramas não são descritos; o texto do slide é extraído.
- Código de projetos completos (Node/Next) é excluído de propósito para não
  poluir o índice; entram apenas documentos e pastas de exercício.
