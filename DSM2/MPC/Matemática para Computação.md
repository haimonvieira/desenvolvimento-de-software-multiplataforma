# 📘 Lógica Matemática

## 📅 Data: 09/02/2026

A lógica matemática é usada para analisar se uma proposição é **VERDADEIRA (V)** ou **FALSA (F)**.

---

## 📌 Proposição

Uma **proposição** é uma frase declarativa que pode assumir apenas dois valores lógicos:
- Verdadeiro (V)
- Falso (F)

Normalmente representamos proposições por letras minúsculas:
*p, q, r, s...*

---

## 🧠 Exemplos de Proposições

1. O 2DSM entrega as tarefas de matemática.
2. A Fatec de Registro está localizada no centro da cidade.
3. O resultado da operação 2 + 1 é igual a 1.

---

## 🔹 Tipos de Proposição

### ✔ Simples (uma única ideia)
- O céu é azul.
- A primavera é uma estação do ano.

### ✔ Complexa (duas ou mais ideias ligadas por conectivos)
- A linguagem C é fortemente tipada **e** Java é orientada a objetos.

> Proposições complexas utilizam **conectivos lógicos**.

---

## 🔗 Conectivos Lógicos

- ¬  → Negação (NOT)
- ∧  → Conjunção (AND)
- ∨  → Disjunção (OR)
- ⊕  → Ou exclusivo (XOR)
- →  → Condicional
- ↔  → Bicondicional

---

# 📊 Tabelas-Verdade

## 🔹 Negação (¬p)

| p | ¬p |
|---|----|
| V | F  |
| F | V  |

---

## 🔹 Conjunção (p ∧ q)

Verdadeiro apenas quando ambos são V.

| p | q | p ∧ q |
|---|---|:-----:|
| V | V | V     |
| V | F | F     |
| F | V | F     |
| F | F | F     |

---

## 🔹 Disjunção (p ∨ q)

Verdadeiro quando pelo menos um é V.

| p | q | p ∨ q |
|---|---|:-----:|
| V | V | V     |
| V | F | V     |
| F | V | V     |
| F | F | F     |

---

## 🔹 Ou Exclusivo (p ⊕ q)

Verdadeiro quando os valores são diferentes.

| p | q | p ⊕ q |
|---|---|:-----:|
| V | V | F     |
| V | F | V     |
| F | V | V     |
| F | F | F     |

---

## 🔹 Condicional (p → q)

Falso apenas quando:
- p = V
- q = F
- Ou seja, quando iguais verdadeiro, diferentes, o que vem depois da seta prevalece como verdade

| p | q | p → q |
|---|---|:-----:|
| V | V | V     |
| V | F | F     |
| F | V | V     |
| F | F | V     |

---

## 🔹 Bicondicional (p ↔ q)

Verdadeiro quando p e q possuem o mesmo valor lógico.

| p | q | p ↔ q |
|---|---|:-----:|
| V | V | V     |
| V | F | F     |
| F | V | F     |
| F | F | V     |

---

# 📌 Ordem de Precedência

1. Parênteses  
2. Negação (¬)  
3. Conjunção (∧) e Disjunção (∨)  
4. Condicional (→)  
5. Bicondicional (↔)  

---

# 📖 Conceitos Importantes

## ✔ Tautologia

Uma proposição que é **sempre VERDADEIRA**, independentemente dos valores de entrada.

## ✔ Contradição

Uma proposição que é **sempre FALSA**, independentemente dos valores de entrada.

## ✔ Contingência

Uma proposição que às vezes é verdadeira e às vezes é falsa.

---

# 📊 Tabela Resumo

| Estrutura | Verdadeiro Quando | Falso Quando |
|-----------|------------------|--------------|
| p ∧ q     | Ambos são V      | Pelo menos um é F |
| p ∨ q     | Pelo menos um é V| Ambos são F |
| p ⊕ q     | São diferentes   | São iguais |
| p → q     | Todos os casos, exceto um | p = V e q = F |
| p ↔ q     | São iguais       | São diferentes |

## Silogismo

Um argumento é válido quando sua conclusão é consequencia obrigatória de suas premissas.
Não leva em conta a realidade dos fatos.

- P1: Todos os homens são peixes
- P2: Nenhum peixe é animal
- C: Nenhum homem é animal

Obs.: Nem sempre a conclusão leva em consideração a realidade dos fatos

## Falácia

Um argumento é inválido quando a verdade das premissas não é suficiente para garantir a verdade da conclusão

- P1: Toda criança gosta de doce.
- P2: Fulano não é criança.
- C: Portanto, Fulano não gosta de doce.

## 📅 Data: 09/02/2026

Resolução exercicio Pratique 03.

## Data: 09/03/2026

## NOTAÇÃO

### Teoria dos conjuntos

Um conjunto é um grupo de elementos que possuem características em comum.
É normalmente representado por letras maiúsculas do alfabeto.

**Exemplos:**

A={0, 2, 4, 6, 8} -> São os numeros pares menores que 10
B={a, e, i, o, u} -> Grupo das vogais
C={...-1, 0, 1, 2} -> São os valores inteiros positivos e negativos

### Formas de representação

**A. Diagrama de Jemm**

Utiliza formas geométricas (círculos) para representar o conteúdo de um
conjunto.

**Exemplo:**

A={1, 2, 3, 4, 5}
B={3, 4, 5, 6, 7}
AB={3, 4}

**B. Descrição das características**

Descreve o que há de comum entre os elementos que fazem parte de um conjunto.

**Exemplos:**

- Y é o conjunto de estações do ano.
- A é o conjunto dos números primos de 1 a 100.
  
**C. Representação por enumeração**

Os elementos de um conjunto são representados em uma lista.

**Exemplos:**

- Y={primavera, verão, outono e inverno}
- B={100, 102, 104, 106, 108}

### Operação em conjuntos

**A. Relação de pertinência**

Símbolos utilizados:

- ∈ -> "pertence"
- ∉ -> "não pertence"
Y={0, 2, 4, 6, 8}


**B. Igualdade de conjuntos**

Dois conjuntos são iguais se possuírem os mesmos elementos mesmo que em ordem diferente.

A={3, 7, 9, 11}
B={7, 9, 3, 11}

A e B são iguais.

**C. Relação de inclusão**

Símobolos utilizados:
⊃ -> contém
⊂ -> está contido
⊅ -> não contém
⊄ -> não está contido

A={1 ,2 ,3}
B={1, 2, 3, 4, 5, 6}

**D. União**

É o conjunto formado por todos os elementos dos conjuntos analisados

A={1, 2, 3}
B={3, 4, 8}

A ∪ B = {1, 2, 3, 4, 8}

**E. Intersecção**

É o conjunto formado apenas pelos elementos que estão em todos os conjuntos simultaneamente

A={1, 2, 3}
B={3, 4, 8}

A ∩ B = {3}

**F. Diferença**

Conjunto formado apenas por elementos "exclusivos" do conjunto analisado.

A={1, 2, 3}
B={3, 4, 8}

A - B = {1, 2}
B - A = {4, 8}