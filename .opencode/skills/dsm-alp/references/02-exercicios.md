# Exercícios e atividades — ALP

## Panorama

| Fonte | O que é | Tem gabarito? |
| --- | --- | --- |
| `listas-de-exercicios-lista-01-pseudocodigo-docx.md` | 10 exercícios (itens 1–8 em pseudocódigo, 9–10 em C) | **Não** |
| `slides-aula-01`, slides 22–30 | 2 práticas objetivas + 2 "faça você mesmo" | **Não** |
| `slides-aula-02`, slides 38–42 | 2 práticas guiadas + 2 "faça você mesmo" | **Não** |
| `slides-aula-04`, slides 35–39 | Prática das latas de tinta + lista externa | **Não** |
| `plano-de-ensino` | As 20 aulas e a fórmula de nota | — |

Nenhum exercício do corpus tem gabarito oficial. **Tudo o que vem abaixo é
resposta derivada** — diga isso ao aluno.

## Lista 01 — pseudocódigo (p. 1–2)

### 1. Antecessor e sucessor

```
algoritmo "antecessor_sucessor"
var n: inteiro
inicio
   leia (n)
   escreval ("Antecessor: ", n - 1)
   escreval ("Sucessor: ", n + 1)
fimalgoritmo
```

Fonte do enunciado: `listas-de-exercicios-lista-01`, p. 1.

### 2. Velocidade em km/h → "m/h"

Enunciado: `Resultado = V * 0,62` — p. 1.

```
algoritmo "converte_velocidade"
var v: real
inicio
   leia (v)
   escreval ("Resultado: ", v * 0.62)
fimalgoritmo
```

**Atenção:** o fator `0,62` converte km/h em **milhas/h**, não em m/h. Para
metros por hora o correto é `V * 1000`. O enunciado está inconsistente; registre
a divergência e mostre as duas leituras.

### 3. Quantidade de salários-mínimos

Salário mínimo = **R$ 1320,00** — p. 1.

```
algoritmo "salarios_minimos"
var salario, qtd: real
inicio
   leia (salario)
   qtd <- salario / 1320.00
   escreval ("Salários mínimos: ", qtd:6:2)
fimalgoritmo
```

### 4. Fahrenheit → Celsius

O enunciado pede F → C mas entrega `F = (C * 1.8) + 32`, que é a fórmula
inversa — p. 1. Invertendo:

```
algoritmo "fahrenheit_celsius"
var f, c: real
inicio
   leia (f)
   c <- (f - 32) / 1.8
   escreval ("Celsius: ", c:6:2)
fimalgoritmo
```

### 5. Volume de caixa retangular

`VOLUME = COMPRIMENTO * LARGURA * ALTURA` — p. 1.

```
algoritmo "volume_caixa"
var c, l, a, v: real
inicio
   leia (c, l, a)
   v <- c * l * a
   escreval ("Volume: ", v:8:2)
fimalgoritmo
```

### 6. Volume do cilindro

`v = π * r² * h` — p. 1.

```
algoritmo "volume_cilindro"
var r, h, v: real
inicio
   leia (r, h)
   v <- Pi * Quad(r) * h
   escreval ("Volume: ", v:8:2)
fimalgoritmo
```

### 7. Consumo de combustível

`DP = KF - KI` e `GC = DP / CC` — p. 1–2.

```
algoritmo "consumo"
var ki, kf, cc, dp, gc: real
inicio
   leia (ki, kf, cc)
   dp <- kf - ki
   gc <- dp / cc
   escreval ("Consumo: ", gc:6:2, " km/L")
fimalgoritmo
```

### 8. Total com IPI

`((valor1 * quant1) + (valor2 * quant2)) * (IPI/100 + 1)` — p. 2.

```
algoritmo "total_ipi"
var ipi, v1, q1, v2, q2, total: real
   c1, c2: inteiro
inicio
   leia (ipi, c1, v1, q1, c2, v2, q2)
   total <- ((v1 * q1) + (v2 * q2)) * (ipi / 100 + 1)
   escreval ("Total: ", total:8:2)
fimalgoritmo
```

## Lista 01 — linguagem C (p. 2)

### 9. Idade em anos, meses e dias → dias

```
#include <stdio.h>

int main() {
    int anos, meses, dias, total;
    printf("Anos, meses e dias: ");
    scanf("%d %d %d", &anos, &meses, &dias);
    total = anos * 365 + meses * 30 + dias;
    printf("Total em dias: %d\n", total);
    return 0;
}
```

A convenção de **365 dias por ano e 30 por mês** é derivação: o enunciado não a
define.

### 10. Segundos → horas, minutos e segundos

```
#include <stdio.h>

int main() {
    int total, h, m, s;
    printf("Segundos: ");
    scanf("%d", &total);
    h = total / 3600;
    m = (total % 3600) / 60;
    s = total % 60;
    printf("%d h %d min %d s\n", h, m, s);
    return 0;
}
```

## Práticas dos slides

### Aula 01, Pratique 01 — Paciência (slide 22)

Sete colunas com 1 a 7 cartas: `1+2+3+4+5+6+7 = 28`. Monte = `52 - 28 = 24`.
Alternativas: 21, 24, 26, 28, 31 (slide 23). **Resposta derivada: 24.**

### Aula 01, Pratique 02 — data de nascimento (slide 24)

`A+B+C+D = 20`, com `AB` = dia e `CD` = mês. Alternativas: agosto, setembro,
outubro, novembro, dezembro (slide 25).

Testando: setembro (`09`) dá `C+D = 9`, logo `A+B = 11` → dia **29** (`2+9`).
Outubro, novembro e dezembro têm `C+D` 1, 2 e 3 e exigiriam dia maior que 31.
**Resposta derivada: setembro.**

### Aula 01, Pratique 01 — meninas e animais (slides 27–28)

Restrições: Joana mora um andar acima de Kelly; Joana não está no 4º; Kelly tem
passarinho e não está no 2º; quem está no 3º tem tartaruga; o cachorro está
imediatamente acima de Bete.

Solução: Kelly = 1º (passarinho), Joana = 2º, Bete = 3º (tartaruga), Yara = 4º
(cachorro), e o gato fica com Joana. **Resposta derivada: alternativa E** —
"Yara mora no 4º andar e tem um cachorro".

### Aula 01, Pratique 02 — tartarugas (slide 29)

Distância = `30 × 16 = 480 m`. A segunda leva `480 / 20 = 24` dias, ou seja,
espera de `24 - 16 = 8` dias. **Resposta derivada: alternativa A (8).**

### Aula 02, Pratique 01 — miojo (slide 38)

Pede descrição narrativa **e** fluxograma. Estrutura mínima: ferver água →
colocar o macarrão → aguardar o tempo → escorrer → misturar o tempero → servir.
Não há resposta oficial.

### Aula 02, Pratique 02 — média (slide 39)

```
algoritmo "media"
var n1, n2, media: real
inicio
   leia (n1, n2)
   media <- (n1 + n2) / 2
   escreval ("Média: ", media:5:2)
fimalgoritmo
```

### Aula 02, Pratique 01 — potência (slide 41)

```
algoritmo "potencia"
var x, y: inteiro
inicio
   leia (x, y)
   escreval ("Resultado: ", x ^ y)
fimalgoritmo
```

### Aula 02, Pratique 02 — quatro operações (slide 42)

```
algoritmo "operacoes"
var a, b: real
inicio
   leia (a, b)
   escreval ("Soma: ", a + b)
   escreval ("Produto: ", a * b)
   escreval ("Divisão: ", a / b)
   escreval ("Subtração: ", a - b)
fimalgoritmo
```

### Aula 04, Pratique 01 — latas de tinta (slides 35–36)

Dados: lata = **R$ 20,00**, **5 L** por lata, **1 L pinta 3 m²** (logo 15 m² por
lata) e `Área = 3.14 * r * 2 * (r + h)`.

```
algoritmo "latas_tinta"
var r, h, area, latas, custo: real
inicio
   leia (r, h)
   area <- 3.14 * r * 2 * (r + h)
   latas <- area / 15
   se latas > Int(latas) entao
      latas <- Int(latas) + 1
   fimse
   custo <- latas * 20
   escreval ("Latas: ", latas:4:0, "  Custo: R$ ", custo:7:2)
fimalgoritmo
```

O arredondamento para cima é derivação: o slide não define o que fazer com a
parte fracionária.

## Como responder "me dá a resposta"

1. Escreva o algoritmo completo, com `algoritmo`/`inicio`/`fimalgoritmo` ou com
   `#include`/`main`/`return`, conforme a linguagem pedida.
2. Diga que **não há gabarito oficial** no corpus.
3. Se o enunciado tiver erro (Lista 01, itens 2 e 4), mostre o erro e as duas
   leituras possíveis.
4. Cite `arquivo.md` + `p. N`, `slide N` ou `§seção`.
5. Se o tema for condicional, repetição, vetor ou matriz, avise que só existe
   sintaxe no Help do VisuAlg — não há aula correspondente no corpus.
