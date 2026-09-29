# DSM Atlas — Provedor de IA administrativa (decisão aprovada)

**Status:** aprovado em 28 de setembro de 2026
**Escopo:** classificação de uploads administrativos
**Provedor escolhido:** Groq, com **chave separada** da usada pelo tutor público
**Fonte verificada:** https://console.groq.com/docs/structured-outputs, /docs/models, /docs/rate-limits (consultados em 28/09/2026)

## 1. Decisão

A classificação administrativa usa a mesma API do Groq
(`https://api.groq.com/openai/v1`) com uma **credencial própria**,
`GROQ_ADMIN_API_KEY`, distinta de `GROQ_API_KEY`.

- **Modelo:** `openai/gpt-oss-120b`
- **Saída estruturada:** JSON schema, para que cada sugestão tenha campos
  tipados e confiança numérica em vez de texto livre.

A escolha de provedor igual é deliberada: uma conta a menos para manter, mesma
compatibilidade de runtime já validada, e o isolamento que importa — credencial,
orçamento e telemetria — permanece garantido pela chave e pelo escopo separados.

## 2. Por que a chave separada é obrigatória

A API do Groq aplica limites **por organização**, então duas chaves da mesma
organização compartilham o mesmo teto de RPM/RPD/TPM/TPD. A separação protege
contra três riscos concretos, não contra o teto compartilhado:

- **Vazamento de escopo:** um bug no caminho público nunca pode disparar gasto
  administrativo, nem o contrário.
- **Auditoria:** o ledger distingue `public` de `admin`, e cada chave pode ser
  revogada isoladamente sem derrubar o outro caminho.
- **Rotação:** trocar a chave pública não exige tocar na administrativa.

O teto de organização compartilhado é um risco aceito e já mitigado pelos
limites internos do escopo `admin` (`USAGE_POLICIES.admin`), que continuam
valendo independentemente do provedor.

## 3. Limites internos do escopo administrativo

Valores já fixados em `atlas/src/modules/tutor/usage-policy.ts`:

| Limite | Valor |
| --- | --- |
| Requisições por hora | 10 |
| Requisições por dia | 60 |
| Turnos globais por dia | 100 |
| Tokens globais por dia | 500.000 |
| Tokens de entrada por turno | 8.000 |
| Tokens de saída por turno | 2.000 |
| Ações de ferramenta por turno | 8 |
| Prazo | 60 s |

A classificação é um trabalho administrativo ocasional, não um serviço de
visitante; esses limites são folgados para o uso real e continuam sendo o teto
efetivo.

## 4. Tratamento de conteúdo não confiável

O texto dos arquivos enviados é **entrada não confiável e pode conter injeção
de prompt**. Regras obrigatórias:

- o conteúdo do arquivo entra delimitado como evidência, nunca como instrução;
- o catálogo de semestres e disciplinas enviado é o allowlist, não uma sugestão;
- a saída é validada contra schema antes de qualquer uso;
- semestre, disciplina e caminho são conferidos contra o catálogo real; valores
  inventados são descartados;
- arquivo que não pôde ser lido retorna aviso e destino nulo, nunca um palpite;
- nenhuma sugestão altera o estado do lote para confirmado.

## 5. Política de falhas

- **429:** não repetir; informar o administrador que a cota está esgotada e
  quando reinicia, usando `retry-after`.
- **Timeout:** resultado desconhecido; a reserva permanece consumida até
  expiração/reconciliação.
- **5xx:** falhar fechado, sem repetição automática.
- **Falha de autenticação:** falhar fechado, sem expor chave nem corpo do
  provedor.
- **Resposta sem schema válido:** descartar a sugestão; o lote segue para
  revisão manual.

## 6. Fora de escopo

- Reuso da credencial pública pelo caminho administrativo: proibido.
- Publicação automática por IA: proibida.
- Extração de conteúdo de formatos binários não suportados: permanece
  metadados + revisão manual.
