# Exercícios e atividades — ES2

## Panorama

| Fonte | O que é | Tem gabarito? |
| --- | --- | --- |
| aula 01, p. 23 | 8 perguntas abertas sobre viabilidade, custos e métricas | **Não** |
| aula 03, p. 31–34 | 5 exercícios de diagrama de classes | **Não** |
| `Engenharia de Software 2.md` | Arquivo vazio | — |

## Atividade da aula 01 (p. 23)

1. O que você entende por viabilidade?
2. O estudo de viabilidade ajuda em que tipo de decisão?
3. Quais os tipos de teste de viabilidade?
4. Explique o foco da viabilidade de cronograma.
5. O que envolve os custos de desenvolvimento de sistemas?
6. Qual a diferença entre custo fixo e variável?
7. O que são métricas de software?
8. Para que servem os pontos de função de um software?

Respostas estão no corpo da aula (p. 7–22). Não há gabarito separado; qualquer
resposta precisa citar a página.

## Exercícios da aula 03

### 1) Criar classes em UML (p. 31)

a) `Pessoa` — atributos `nome`, `idade`; método `CadastrarPessoa()`.
b) `Porta` — atributos `aberta`, `cor`, `dimensaoX`, `dimensaoY`, `dimensaoZ`;
métodos `abre()`, `fecha()`, `pinta()`, `estaAberta()`.

### 2) Conta bancária (p. 31)

Atributos: número, nome do cliente, saldo, limite. Métodos: sacar, depositar,
transferir, mostrar titular.

### 3) Identificar classes e montar diagramas (p. 32)

a) Turma de graduação com disciplinas ministradas em salas diferentes.
b) Rede de cinemas ArtFilme exibindo "Os Vingadores" em três sessões diárias.

### 4) Clínica médica (p. 33)

a) Atributos: nome, CRM, especialidade, data de admissão. Métodos: realizar
consulta, prescrever exame, prescrever receita. → Classe provável: **Médico**.
b) Atributos: dia, hora, identificador de consulta paga, identificador de
comparecimento. Operações: marcar, desmarcar, remarcar, pagar consulta,
registrar comparecimento. → Classe provável: **Consulta**.

Essas duas são as únicas com resposta praticamente implícita no enunciado.

### 5) Locadora de veículos (p. 34)

Enunciado pede identificar objetos, atributos e usuários. Dados: carros
classificados em popular, luxo e utilitário; placa e valor diário; funcionários
cadastram clientes e veículos, fazem e encerram locações; clientes especiais e
comuns, com desconto e quilometragem extra; cliente identificado por nome,
cartão de crédito e validade.

Não há gabarito. Uma resposta defensável:
`Veiculo` (placa, valorDiario, tipo), `Cliente` (nome, cartao, validade, tipo),
`Locacao` (data, km, desconto), `Funcionario` (cadastro). O importante é
justificar cada classe com o texto.

## Como responder "me dá o gabarito"

Diga que o corpus não traz gabarito. Ofereça:

- a resposta implícita dos itens 4a e 4b (Médico e Consulta);
- um esqueleto de classes para os demais, marcado como **derivação**;
- a regra de multiplicidade e os símbolos de agregação/composição para o aluno
  conferir o próprio diagrama.

## Cuidado com o exemplo de pontos de função

Se o aluno pedir para resolver "130 PF, 6 devs, 8 h/dia", reproduza a conta do
material (p. 21) e **avise** que ela não é dimensionalmente consistente. Não
invente uma fórmula "correta" como se estivesse no corpus.
