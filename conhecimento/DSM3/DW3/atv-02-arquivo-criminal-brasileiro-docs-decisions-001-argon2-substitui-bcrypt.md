---
disciplina: DSM3/DW3
titulo: 001 argon2 substitui bcrypt
fonte: DSM3/DW3/ATV 02/Arquivo Criminal Brasileiro/docs/decisions/001-argon2-substitui-bcrypt.md
tipo: md
paginas: 0
extraido_em: 2026-10-24
---

# ADR 001 — Argon2id substitui bcrypt

- **Status:** aceita
- **Data:** 2026-09 (contrato global v5.1)
- **Contexto:** as aulas do professor usam `bcrypt` para hash de senha (`userController.js` da aula 05). O grupo decidiu adotar Argon2id.
- **Decisão:** usar `argon2` (`argon2.hash` no cadastro, `argon2.verify` no login) em `controllers/userController.js`. Nenhuma outra parte do fluxo de auth muda.
- **Consequências:** dependência `argon2` (nativa, requer build no `npm install`); API do hash é assíncrona (`await`), diferente do `bcrypt` síncrono da aula — não "simplificar" de volta para chamadas síncronas.
- **O que quebra se violar:** trocar de volta para bcrypt invalida todos os hashes já persistidos (login de usuários existentes falha); trocar o algoritmo sem migração tem o mesmo efeito.
