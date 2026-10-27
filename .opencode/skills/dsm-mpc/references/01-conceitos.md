# Conceitos consolidados — MPC

## 1. Argumento lógico

É a afirmação de que um grupo de proposições iniciais (premissas) resulta em uma
proposição final (conclusão) que é consequência das primeiras (aula 01, slide 4).

Exemplo do corpus:

- P1: Todo adolescente joga videogame.
- P2: Todo jogo é divertido.
- C: Todo adolescente se diverte.

## 2. Silogismo e falácia

- **Silogismo (argumento válido):** a conclusão é consequência obrigatória das
  premissas; não leva em conta a realidade dos fatos (slide 5).
- **Falácia (argumento inválido):** a verdade das premissas não garante a
  conclusão (slide 6).

Exemplo de falácia no corpus: toda criança gosta de doce; Fulano não é criança;
logo, Fulano não gosta de doce.

## 3. Lógica matemática

Ramo que estuda o raciocínio válido por meio de sistemas formais, separando a
forma do conteúdo. Passou a área da Matemática com Boole e De Morgan (slides
8–9). É ferramenta para programação (slide 10).

## 4. Proposição

Palavra ou símbolo com sentido completo que afirma algo e assume V ou F
(slide 12). Não pode ser V e F ao mesmo tempo, nem ter terceiro valor
(slide 14). Pode ser:

- **Simples:** uma sentença.
- **Composta:** combinação de duas ou mais simples.

## 5. Conectivos

| Conectivo | Símbolos no corpus | Operação |
| --- | --- | --- |
| NOT / não | `!`, `~`, `⌐` | Negação |
| AND / e | `&&`, `^`, `&` | Conjunção |
| OR / ou | `||`, `v` | Disjunção |
| XOR | `XOR` | Disjunção exclusiva |
| Condicional | `->` | "se... então" |
| Bicondicional | `<->` | "se e somente se" |

Fonte: aula 01, slides 18–19.

## 6. Tabelas-verdade

| Operação | Verdadeiro quando | Falso quando |
| --- | --- | --- |
| `¬p` | p é F | p é V |
| `p ∧ q` | ambos V | pelo menos um F |
| `p ∨ q` | pelo menos um V | ambos F |
| `p ⊕ q` | valores diferentes | valores iguais |
| `p → q` | todos os casos, exceto V→F | p = V e q = F |
| `p ↔ q` | valores iguais | valores diferentes |

Fonte: aula 01, slides 25–35; `matematica-para-computacao.md`.

## 7. Precedência

1. Parênteses
2. Negação
3. Conjunção e disjunção, na sequência
4. Condicional
5. Bicondicional

Fonte: aula 01, slide 37; resumo pessoal.

## 8. Tautologia, contradição e contingência

- **Tautologia:** última coluna só V (slide 39).
- **Contradição:** última coluna só F (slide 40).
- **Contingência:** às vezes V, às vezes F (resumo pessoal).

## 9. Conjuntos

Um conjunto é um grupo de elementos com características em comum, representado
por letra maiúscula (aula 02, slide 4; resumo pessoal).

### Representação

- **Diagrama de Venn:** círculos.
- **Descrição das características:** "Y é o conjunto dos meses do ano".
- **Enumeração:** `P = {2,4,6,8,10,12,14,16,18}`.

Fonte: aula 02, slides 5–8.

### Pertinência e igualdade

- `∈` pertence; `∉` não pertence (slides 10–11).
- Dois conjuntos são iguais se têm os mesmos elementos, independentemente da
  ordem e de repetições (slides 12–13).

### Inclusão

`A ⊂ B` quando todos os elementos de A também estão em B (slide 15). O resumo
pessoal lista `⊃` (contém), `⊂` (está contido), `⊅` e `⊄`.

## 10. Operações com conjuntos

| Operação | Definição | Exemplo do corpus |
| --- | --- | --- |
| União `A ∪ B` | Elementos de A ou de B | `{a,b,c,d,e} ∪ {c,d,e,f,g}` |
| Interseção `A ∩ B` | Elementos nos dois ao mesmo tempo | `{c,d,e}` |
| Diferença `A - B` | Elementos de A que não estão em B | `A = {-7,2,100}`, `B = {2,50}` → `{-7,100}` |

Fonte: aula 02, slides 17–22.

## 11. Par ordenado e produto cartesiano

- **Par ordenado:** lista `(a, b)` em ordem estabelecida; `(a1,b1) = (a2,b2)`
  somente se `a1 = a2` e `b1 = b2`.
- **Produto cartesiano `A × B`:** conjunto de todos os pares ordenados `(a,b)`
  com `a ∈ A` e `b ∈ B`.

Exemplo: `A = {1,2,3}`, `B = {r,s}` → `A×B = {(1,r),(1,s),(2,r),(2,s),(3,r),(3,s)}`.

Fonte: `matematica-para-computacao.md`.

## 12. Relação binária

Uma relação binária de A em B é sempre um subconjunto de `A × B` (resumo
pessoal). Exemplo: `A = {1,2,3}`, `B = {r,s}`, `aRb = {(1,r),(2,s),(3,r)}`.

## 13. Propriedades de relações

A lista do 1º bimestre pede para verificar:

| Propriedade | Ideia |
| --- | --- |
| Reflexiva | Todo elemento se relaciona consigo mesmo |
| Simétrica | Se `aRb`, então `bRa` |
| Antissimétrica | Se `aRb` e `bRa`, então `a = b` |
| Transitiva | Se `aRb` e `bRc`, então `aRc` |

**Atenção:** o corpus só enuncia essas propriedades na pergunta da lista (Q4);
não as define em uma aula. As definições acima são complemento externo e devem
ser marcadas como tal.
