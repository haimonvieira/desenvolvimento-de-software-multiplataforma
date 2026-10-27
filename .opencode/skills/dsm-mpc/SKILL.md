---
name: DSM — Matemática para Computação (MPC)
description: Responde dúvidas de Matemática para Computação do curso DSM usando o material local em conhecimento/DSM2/MPC. Cobre lógica proposicional, conectivos, tabelas-verdade, precedência, tautologia/contradição/contingência, silogismo e falácia, teoria dos conjuntos (pertinência, inclusão, união, interseção, diferença), produto cartesiano, relações binárias e propriedades de relações. Use quando a pergunta citar proposição, conectivo, tabela-verdade, conjunto, união, interseção, produto cartesiano ou relação binária.
metadata:
  opencode/autoinvoke: false
---

# Matemática para Computação (DSM2/MPC)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica.

## Escopo

Entram: argumento, premissa e conclusão; silogismo e falácia; proposição simples
e composta; conectivos (NOT, AND, OR, XOR, condicional, bicondicional);
tabelas-verdade; precedência; tautologia, contradição e contingência;
conjuntos e formas de representação; pertinência, igualdade e inclusão; união,
interseção e diferença; par ordenado e produto cartesiano; relação binária;
propriedades de relações (reflexiva, simétrica, antissimétrica, transitiva).

Não entram (e não devem ser inventados como se fossem do material):
quantificadores, leis de De Morgan, relação de equivalência/ordem com esses
nomes, funções, combinatória e probabilidade.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "termo" --disciplina DSM2/MPC --limite 8
   ```

2. **Leia o trecho** e responda com o vocabulário do material.

3. **Cite sempre** `conhecimento/DSM2/MPC/<arquivo>.md`. Como as aulas são PPTX,
   cite também o número do slide quando ajudar (`slide 21`).

4. **Se não houver cobertura**, diga "isso não está no material indexado de MPC"
   e só então ofereça conhecimento externo, rotulado.

5. **Não invente gabarito.** A lista do 1º bimestre não tem respostas no corpus.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| Argumento válido = argumento verdadeiro | Validade depende da forma: a conclusão decorre das premissas, mesmo que elas sejam falsas (aula 01, slide 5) |
| Condicional `p → q` é falso quando p é falso | Só é falso quando `p = V` e `q = F` (aula 01, slide 32) |
| XOR = OR | XOR é verdadeiro quando os valores são **diferentes** (slide 31) |
| `∈` e `⊂` são a mesma coisa | `∈` liga elemento a conjunto; `⊂` liga conjunto a conjunto (aula 02, slides 10 e 15) |
| União = interseção | União junta todos; interseção só o que está nos dois (aula 02, slides 17 e 19) |
| Toda relação é reflexiva | Não; a lista pede para verificar reflexiva, simétrica, antissimétrica e transitiva (lista, Q4) |
| Combinatória está no corpus | Não está; o mapa da disciplina cita, mas o material não desenvolve |

## Números e fatos que precisam sair exatos

- **6 conectivos:** NOT, AND, OR, XOR, `→`, `↔` (aula 01, slide 18).
- **Precedência:** parênteses → negação → conjunção/disjunção → condicional →
  bicondicional (slide 37).
- **Tautologia:** última coluna só V; **contradição:** só F (slides 39–40).
- **Conjunto:** letra maiúscula; representação por Venn, descrição ou enumeração
  (aula 02, slides 4–8).
- **Produto cartesiano:** conjunto de todos os pares ordenados `(a, b)` com
  `a ∈ A` e `b ∈ B` (`matematica-para-computacao.md`).

## Cuidados ao responder

- Reproduza a notação do material (OR/AND/não) e, se usar símbolos, explique a
  correspondência.
- Não trate "diagrama de Jemm" como termo correto: é erro de digitação de
  **Venn** no resumo pessoal.
- A lista Q3-C define `xRy = {(x,y) | x é ímpar}`, o que depende só de x; avise
  que a definição é atípica.
- A lista Q4 pede propriedades que o corpus não explica em detalhe; responda com
  a definição matemática padrão e **marque como complemento externo**.
- Não diga que o corpus cobre quantificadores ou De Morgan.

## Referências

- `references/00-visao-geral.md` — cobertura e sequência.
- `references/01-conceitos.md` — conceitos com slide.
- `references/02-exercicios.md` — lista e práticas, com o que falta.
- `references/03-fontes.md` — inventário das 4 fontes.
- `references/04-glossario.md` — termos.
