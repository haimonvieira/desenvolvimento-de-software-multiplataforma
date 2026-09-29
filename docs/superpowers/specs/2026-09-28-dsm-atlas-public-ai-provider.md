# DSM Atlas — Provedor de IA público (decisão aprovada)

**Status:** aprovado em 28 de setembro de 2026
**Escopo:** provedor do tutor público dos visitantes
**Provedor escolhido:** Groq
**Fonte verificada:** https://console.groq.com/docs/rate-limits, /docs/models, /docs/spend-limits, /docs/tool-use, /docs/openai (consultados em 28/09/2026)

## 1. Decisão

O tutor público usa a API do Groq, compatível com o formato [OI], em
`https://api.groq.com/openai/v1`, autenticada por chave de API no cabeçalho
`Authorization: Bearer`.

- **Modelo primário:** `openai/gpt-oss-120b`
- **Modelo de degradação:** `openai/gpt-oss-20b`, usado **somente quando o
  modelo primário está indisponível** (erro 5xx ou falha de transporte). Uma
  resposta `429` **não** é repetida no modelo de degradação: os dois modelos
  compartilham os mesmos limites de organização, então repetir consumiria cota
  que o visitante acabou de ser informado como esgotada. Um `429` encerra o
  turno no modelo primário com a mensagem de cota e `retry-after` (§6).
- **SDK:** cliente TypeScript oficial do Groq quando compatível com o runtime
  Cloudflare Workers; caso contrário, `fetch` nativo contra o mesmo endpoint.
  Verificar na implementação qual caminho o runtime aceita e registrar a
  escolha; não misturar as duas abordagens no mesmo caminho de código.

A escolha do modelo maior se justifica porque o tier gratuito aplica os mesmos
limites aos dois modelos: `gpt-oss-120b` entrega mais qualidade sem custo
adicional de cota.

## 2. Limites do tier gratuito (por organização)

Limites medidos **no nível da organização**, não por visitante. Todo o portal
compartilha esse orçamento.

| Modelo | RPM | RPD | TPM | TPD |
| --- | --- | --- | --- | --- |
| `openai/gpt-oss-120b` | 30 | 1.000 | 8.000 | 200.000 |
| `openai/gpt-oss-20b` | 30 | 1.000 | 8.000 | 200.000 |

- Cabeçalhos de resposta disponíveis: `retry-after`,
  `x-ratelimit-limit-requests`, `x-ratelimit-limit-tokens`,
  `x-ratelimit-remaining-requests`, `x-ratelimit-remaining-tokens`,
  `x-ratelimit-reset-requests`, `x-ratelimit-reset-tokens`.
- Ao exceder, a API responde `429` com `retry-after`.
- Tokens em cache não contam para os limites.

### 2.1 Consequência para o orçamento interno

O teto diário de tokens é o recurso mais escasso, não o número de requisições.

Com o teto por turno de 4.000 tokens de entrada e 1.000 de saída, cada turno
consome no máximo 5.000 tokens. O teto diário de 200.000 tokens da organização
permite, portanto, cerca de **40 turnos patrocinados por dia** — muito abaixo
do limite de 1.000 requisições.

Ajuste obrigatório na política interna (`atlas/src/modules/tutor/usage-policy.ts`):

- teto global diário de tokens patrocinados: **150.000** (margem de 25% para
  erro de contagem, respostas truncadas e repetições);
- teto global diário de turnos: **30** (derivado do teto de tokens, com folga);
- turnos simultâneos: **1** por vez, porque dois turnos de 5.000 tokens
  excederiam o teto de 8.000 TPM da organização.

O teto por visitante permanece o já implementado (5/hora, 15/dia).

## 3. Modelo de cobrança e risco financeiro

Os limites de gasto do Groq exigem **conta paga** com permissão de proprietário
da organização. No tier gratuito não há limite de gasto configurável, mas
também não há cobrança: sem forma de pagamento associada, não existe valor a
cobrar.

Regra operacional obrigatória:

- **Nenhuma forma de pagamento é associada à conta do Groq.**
- O portal não deve depender de limite de gasto do provedor; a proteção real é
  o teto interno implementado na Tarefa 13, que falha fechado.
- Se um dia a conta virar paga, configurar limite mensal de gasto **antes** de
  qualquer uso, ciente de que a medição tem atraso de 10 a 15 minutos.

## 4. BYOK (chave do próprio visitante)

O Groq é um provedor server-side; chamadas diretas do navegador não são o
caminho documentado. Portanto:

- **BYOK usa o proxy do Worker.** A chave trafega no cabeçalho `Authorization`
  apenas durante a requisição, não é persistida, não é registrada em log, não é
  sincronizada e não é gravada em banco, KV ou cache.
- A interface deve informar isso ao visitante antes do primeiro uso.
- Manter a chave em memória por padrão; persistir na sessão do navegador exige
  ação explícita com aviso.
- O caminho BYOK não consome a cota patrocinada nem o orçamento interno, mas
  continua sujeito aos limites de tamanho de mensagem e de ações de ferramenta.

## 5. Capacidades usadas

- **Tool calling:** suportado (`/docs/tool-use`). A allowlist de ferramentas
  permanece no orquestrador, nunca no prompt.
- **Saída estruturada:** suportada (`/docs/structured-outputs`); usar para a
  classificação administrativa da Tarefa 15.
- **Streaming:** suportado; a resposta só é transmitida após a reserva de
  orçamento bem-sucedida.

## 6. Política de falhas

- **429 / limite do provedor:** não repetir automaticamente, **nem no modelo de
  degradação** — os dois modelos compartilham os mesmos limites de organização
  (§2). O turno termina no modelo primário e o visitante é informado de que a
  cota está esgotada e de quando ela reinicia, usando `retry-after` quando
  presente. O estudo sem IA continua funcionando.
- **Timeout:** resultado **desconhecido**, não permissão para repetir. A reserva
  permanece consumida até a expiração/reconciliação já implementada. Também não
  há degradação para o modelo menor: uma resposta que pode ter sido processada
  não deve gerar uma segunda chamada paga.
- **Erro 5xx do provedor:** tentar **uma vez** o modelo de degradação; se ele
  também falhar, falhar fechado. Nenhuma cota é devolvida automaticamente sem
  reconciliação.
- **Erro de autenticação:** falhar fechado e não expor a chave nem o corpo do
  erro do provedor ao visitante.
- **Resposta sem citações válidas:** a afirmação é marcada como não sustentada
  pelos materiais, em português, em vez de completada por suposição.

## 7. Fora de escopo

- Provedor da IA administrativa: decidido separadamente na Tarefa 15.
- Reuso da credencial pública pelo caminho administrativo: proibido.
- Busca vetorial ou embeddings: continua fora do primeiro corte.
