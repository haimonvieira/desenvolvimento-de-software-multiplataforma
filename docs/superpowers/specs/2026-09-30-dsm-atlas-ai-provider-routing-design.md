# DSM Atlas — Roteamento multi-provedor e orçamento agêntico (eixo 2, parte 2)

**Status:** aguardando revisão
**Data:** 30 de setembro de 2026
**Escopo:** roteamento entre vários provedores de IA e o orçamento de profundidade agêntica
**Depende de:** `2026-09-30-dsm-atlas-ai-usage-design.md` (o ledger e o transporte)
**Fora de escopo:** o eixo 1, já entregue

**A superfície do harness não está nesta spec, de propósito.** Quais ferramentas e
habilidades o agente ganha depende de uma decisão ainda aberta — se o harness vive *dentro*
do Atlas (o tutor fica mais agêntico) ou se o Atlas *é* o harness que outros agentes
consomem (materiais expostos como ferramentas). As duas leem o mesmo orçamento e o mesmo
roteamento, então esta spec fixa **o que limita o harness**, e a superfície vem depois sem
refazer nada disto.

## 1. Problema

O app tem um provedor e um teto global. Somar provedores multiplica a cota utilizável de
forma linear, e é o único gargalo desta família que se resolve assim. Mas três coisas hoje
são de provedor único: o ledger, a taxonomia de falhas e a configuração dos adaptadores.

**O dado que decide o desenho.** Provedores grátis oferecem dois formatos de cota que se
parecem e não são:

| Formato | Comportamento | Como orçar |
|---|---|---|
| **Recorrente** | Renova na janela (minuto, hora, dia) | Teto por janela; o dia seguinte tem o mesmo teto |
| **Bolsa** | Concessão única, queima até acabar | Orçamento decrescente; não volta |

Evidência desta própria sessão, não teoria: dois agentes meus morreram hoje com
`429 Your one-time 10 million welcome tokens have been used`. A bolsa foi consumida e
**não renovou**. Um desenho que tratasse uma bolsa de 10M como teto diário anunciaria
capacidade que não existe e falharia de repente, sem aviso prévio — exatamente o modo de
falha que o ledger deste projeto existe para impedir.

## 2. Decisões de desenho

**D-a — O registro declara a forma da cota, não só o número.** Cada provedor traz
`quotaShape: recurring | budget`, com janela e limite no primeiro caso e saldo inicial no
segundo. Sem isso, o orçamento é desconhecido e o provedor não entra.

**D-b — A contabilidade ganha a dimensão provedor.** O teto global por escopo continua
existindo (é a proteção contra um bug gastar tudo), e **por baixo** dele cada provedor tem o
seu teto. As janelas passam a ser `(scope, provider, subject_key, window_kind, window_start)`.

**D-c — Ordenação determinística.** O provedor é escolhido pelo maior saldo restante na
janela corrente, com desempate estável por id. Determinístico porque teste com ordem
aleatória não prova nada.

**D-d — Failover só onde faz sentido.** Uma tabela, porque é onde um erro custa caro:

| Desfecho | Repetir no mesmo | Passar para outro | Por quê |
|---|---|---|---|
| `unavailable` (5xx, transporte) | não | **sim** | nada foi processado |
| `rate_limited` | **não** | **sim** | a cota é de outra organização — não é a mesma cota |
| `timeout` | não | **não** | o resultado é desconhecido; a segunda chamada pode gastar duas vezes |
| `auth` | não | não | falha fechado e **desliga** o provedor |
| `unusable` (saída fora do contrato) | não | não | o provedor respondeu e o gasto é real |

**O `rate_limited` merece a nota, porque refina um invariante documentado.** A regra atual é
"429 nunca repete, nem no modelo de degradação", e a razão escrita é que os dois modelos do
Groq dividem o teto da organização — repetir gastaria a cota que o visitante acabou de ouvir
que acabou. Trocar de **organização** não repete nada disso: é outro recurso. O invariante
passa a ser *não repetir no mesmo provedor cuja cota foi esgotada*, que preserva a razão
original.

**D-e — Um provedor só entra se validar o mesmo contrato.** A validação com zod já existe no
adaptador público: todo candidato passa pelo mesmo schema, então trocar de provedor é seguro
por construção. É o que torna o roteamento barato em vez de assustador.

**D-f — A chave nunca sai do servidor.** Cada provedor tem a sua variável de ambiente, nunca
a mesma de outro escopo. BYOK continua sendo o único caminho em que uma chave de visitante
existe, e ela não é persistida.

**D-g — A profundidade agêntica é um recurso orçado, não uma constante.** O número de rodadas
de ferramenta por turno é derivado da cota restante, não fixado no código. Com pouca cota, o
harness pensa menos; com muita, pensa mais. Sem isso, um harness profundo esgota o dia em
poucas perguntas e o produto fica pior do que um tutor simples.

## 3. Arquitetura

```
                    ┌──────────────────────────────┐
  pergunta ────────►│  seleção de provedor         │
                    │  maior saldo, desempate por id│
                    └──────────────┬───────────────┘
                                   ▼
                    ┌──────────────────────────────┐
                    │  reserve(scope, provider)    │◄── teto global + teto do provedor
                    └──────────────┬───────────────┘
                                   ▼
              ┌────────────────────────────────────────┐
              │ transporte (baseUrl) — formato OpenAI  │
              │ validação zod do contrato de saída     │
              └──────────────┬─────────────────────────┘
                             ▼
              falhou em D-d? ──► próximo candidato (nova reserva, a anterior liquidada a zero)
```

**Registro.** `atlas/src/integrations/ai/provider-registry.ts` — cada entrada:
`{ id, baseUrl, model, credentialEnv, quotaShape, janela/limite ou saldo, timeoutMs, enabled }`.
O `groq-transport.ts` extraído na spec anterior já recebe `baseUrl` e fala o formato OpenAI,
então **o seam do transporte já serve**; o que falta é o registro e a contabilidade. Provedor
que não for compatível com esse formato precisa de um adaptador próprio, e é por isso que a
pergunta §7 importa.

**Ledger.** `ai_usage_window` e `ai_reservation` ganham `provider`. As funções SQL
(`reserve_ai_budget`, `reconcile_ai_reservation`, `read_ai_quota`,
`expire_ai_reservations`) passam a receber o provedor. É migração nova, com
`schema-migration-parity.test.ts` cobrindo a paridade, como as anteriores.

**Reserva por tentativa, não por turno.** Um failover que não gastou nada liquida a reserva
anterior com uso zero e abre outra no candidato seguinte. É honesto: nenhum token foi gasto
na tentativa que falhou, e o turno do visitante consumiu uma tentativa de verdade. O resíduo
que fica registrado: um `429` ainda contou na taxa de requisições daquele provedor, e isso
não é devolvido.

## 4. O que não muda

- Timeout é desconhecido e não repete — agora nem localmente nem em outro provedor.
- Erro de autenticação falha fechado, sem expor chave nem corpo.
- Conteúdo de arquivo é evidência, nunca instrução; saída validada antes de qualquer uso.
- IA não publica nem altera lote.
- Baixar teto é operação; **subir** exige evidência de custo medida.
- A resposta só é transmitida depois da reserva bem-sucedida.

## 5. O que o roteamento não resolve

Vale escrever para ninguém achar que resolveu: os três limites de plataforma continuam
intactos e nenhum provedor novo toca neles.

| Limite | Valor no plano grátis | Consequência |
|---|---|---|
| CPU por requisição | **10 ms** | laço agêntico é viável só por ser I/O; trabalho pesado em JS estoura |
| Subrequests por invocação | 50 | teto da profundidade agêntica, junto com D-g |
| Conexões simultâneas | 6 | limita ferramentas em paralelo |
| Startup | 1 s | empacotar um SDK por provedor encosta nisso; ficar em `fetch` evita |

## 6. Fatiamento

| Fatia | Entrega | Aceitação |
|---|---|---|
| 1 | Registro de provedores + renomear o transporte para não ser "do Groq" | Comportamento idêntico com um provedor; suíte verde sem edição de comportamento |
| 2 | Migração do ledger com a dimensão provedor | Paridade de migração; um provedor único se comporta exatamente como hoje |
| 3 | Seleção determinística + failover da tabela D-d | Testes com provedores falsos: `unavailable` passa adiante, `timeout` **não**, `rate_limited` passa adiante e marca a janela |
| 4 | Forma `budget` (bolsa) com queima | Uma concessão fixa esgota, a mensagem de recusa **não** promete reinício, e o saldo restante é legível |
| 5 | Profundidade agêntica orçada (D-g) | Com cota curta o turno faz menos rodadas; com cota sobrando, mais — provado por teste, não por constante |

## 7. O que eu preciso saber antes de configurar

1. **As cotas de 10M e 1M são recorrentes ou bolsa única?** Decide se elas renovam. Se forem
   bolsa, entram como orçamento decrescente e a mensagem de recusa tem de ser diferente.
2. **Quais provedores, e o formato é compatível com OpenAI?** Se sim, entram só pelo registro.
3. **A cota é por conta ou por chave?** Se for por chave, várias chaves do mesmo provedor
   multiplicam — e o registro precisa de uma entrada por chave, não por provedor.

Nada disso muda as decisões D-a a D-g; muda só o preenchimento do registro.
