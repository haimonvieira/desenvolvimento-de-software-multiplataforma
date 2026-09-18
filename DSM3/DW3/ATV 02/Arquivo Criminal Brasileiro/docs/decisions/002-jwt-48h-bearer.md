# ADR 002 — JWT Bearer com expiração de 48h

- **Status:** aceita
- **Data:** 2026-09 (contrato global v5.1)
- **Contexto:** a aula 05 autentica com JWT assinado por `JWT_SECRET` e validado no middleware `Auth.Authorization`.
- **Decisão:** manter o padrão da aula — `jwt.sign({id, email}, segredo, {expiresIn: '48h'})` no login; `middleware/Auth.js` valida o formato `Bearer TOKEN` e injeta `req.loggedUser`. Sem refresh token, sem roles.
- **Consequências:** tokens vivem 48h; não há revogação (logout é apagar o token no cliente). Autorização além de "token válido" não existe — não assumir que existe.
- **O que quebra se violar:** mudar o payload, o segredo por ambiente sem sincronizar, ou o tempo de expiração sem atualizar a Documentação invalida clientes e a coleção Insomnia.
