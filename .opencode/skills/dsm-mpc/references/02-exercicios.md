# Exercícios e atividades — MPC

## Panorama

| Fonte | O que é | Tem gabarito? |
| --- | --- | --- |
| aula 01, slides 42–44 | Práticas 01, 02 e 03 | **Não** |
| aula 02, slide 24 | Praticar união | Alternativa correta no slide (d) |
| `lista-matematica-1-bimestre.md` | Lista do 1º bimestre, 4 questões | **Não** |

## Práticas da aula 01

### Pratique 01 — ilha de Anchúria (slides 42–43)

Três moradoras (A, B, C), uma de cada tipo: herói (sempre verdade), ladrão
(sempre mente) e comum (às vezes mente). Falas:

- A: "Eu sou uma pessoa comum."
- B: "Andressa diz a verdade."
- C: "Eu não sou uma pessoa comum."

Pede quem é herói, ladrão e comum. **Sem gabarito no corpus.**

### Pratique 02 — João e os dias (slide 44)

João mente às terças, quintas e sábados; nos outros dias fala a verdade. Ele diz
"sábado" e "quarta-feira" para as perguntas "que dia é hoje?" e "que dia será
amanhã?". Pede o dia do encontro. **Sem gabarito.**

### Pratique 03 — tabelas-verdade (slide 45)

a) `p v ~(p ^ q)`
b) `p ^ q -> (p <-> q)`
c) `(p ^ q) ^ ~(p v q)`
d) `~p ^ (p ^ ~q)`
e) `(q -> p) -> (p -> q)`
f) `p v (q ^ ~q) <-> p`

**Sem gabarito.** O resumo pessoal diz "Resolução exercicio Pratique 03", mas
não traz a tabela resolvida.

## Lista do 1º bimestre

### Q1 — tabelas-verdade

A) `(p OR q) AND não p`
B) `p AND (p=>q) AND (p => não q)`
C) `p AND (p OR q) => (p OR q) AND q`
D) `não (p => q) AND ((não p AND q) OR não (p OR q))`
E) `não p => (p OR não (p OR não q))`

Sem gabarito.

### Q2 — turista e voo (múltipla escolha)

Premissas: "o turista perdeu o voo ou a agência se enganou"; "se perdeu o voo,
então a agência não se enganou"; "se a agência não se enganou, então o turista
não foi para o hotel"; "se não foi para o hotel, então o avião atrasou"; "se não
perdeu o voo, então foi para o hotel". Dado que o avião **não** atrasou, pede a
alternativa correta (A–E).

Sem gabarito. A resposta deve ser derivada por modus tollens a partir de "o
avião não atrasou"; marque como **derivação**, não como gabarito do corpus.

### Q3 — pares que pertencem à relação

A) `xRy = {(x,y) | x = y+1}`; pares (2,2), (2,3), (3,3), (3,2).
B) `xRy = {(x,y) | x divide y}`; pares (2,4), (2,5), (2,6).
C) `xRy = {(x,y) | x é ímpar}`; pares (2,3), (3,4), (4,5), (5,6).
D) `xRy = {(x,y) | x > y²}`; pares (1,2), (2,1), (5,2), (6,4), (4,3).

Sem gabarito. Observação: o item C depende só de `x`, o que é atípico para uma
relação binária; avise o aluno.

### Q4 — propriedades das relações

A) `R1 = {(a,b) | a ≤ b}`
B) `R2 = {(a,b) | a > b}`
C) `R3 = {(a,b) | a = b}`
D) `R4 = {(a,b) | a = b + 1}`
E) `R5 = {(a,b) | a + b ≤ 3}`

Pede verificar reflexiva, simétrica, antissimétrica e transitiva. Sem gabarito e
sem aula específica sobre as propriedades.

## Como responder "me dá o gabarito"

Diga que o corpus não tem gabarito. Ofereça:

- a tabela-verdade montada passo a passo, marcada como **resolução derivada**;
- a regra de precedência e a regra do condicional;
- para Q4, as definições padrão das quatro propriedades, marcadas como
  **complemento externo**;
- a citação do slide/questão correspondente.

Nunca apresente uma resposta como "gabarito oficial" se ela não está no corpus.
