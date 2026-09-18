# HHR Solutions - Pacote para uso com LLMs

Este pacote mantém o escopo simples aprovado para a atividade: `User` e `Caso` como entidades principais, com `detalhes` e `producoes` aninhados dentro de `Caso`.

Cada responsável deve usar os arquivos da própria área.

Se o agente trabalha dentro do repositório, mantenha os arquivos nos diretórios originais. O `AGENTS.md` da raiz contém regras gerais; o `AGENTS.md` da área especializa essas regras; o `llms.txt` funciona como mapa de contexto; e o guia `.md` é a especificação da área.

## Backend

Use:
- `AGENTS.md`
- `backend/AGENTS.md`
- `backend/llms.txt`
- `backend/01_BACKEND.md`

## Banco

Use:
- `AGENTS.md`
- `banco/AGENTS.md`
- `banco/llms.txt`
- `banco/02_BANCO_DE_DADOS.md`

## Documentação

Use:
- `AGENTS.md`
- `documentacao/AGENTS.md`
- `documentacao/llms.txt`
- `documentacao/03_DOCUMENTACAO.md`

## Design

Use:
- `AGENTS.md`
- `design/AGENTS.md`
- `design/llms.txt`
- `design/04_DESIGN.md`

Também existe um `LLM_CONTEXT_<AREA>.md` em cada pasta para ferramentas em que seja mais fácil enviar um único arquivo. Mesmo nesse caso, envie também o `AGENTS.md` da raiz.
