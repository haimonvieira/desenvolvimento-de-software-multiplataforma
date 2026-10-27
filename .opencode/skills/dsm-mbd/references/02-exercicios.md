# Exercícios e atividades — MBD

O corpus de MBD **não tem prova nem gabarito**. O que existe são atividades
propostas em aula, sem resposta escrita.

## Panorama

| Fonte | O que é | Tem gabarito? |
| --- | --- | --- |
| aula 01, p. 1 | Perguntas de contexto (conceito, importância, exemplos) | Não |
| aula 01, p. 3–4 | Perguntas sobre níveis, tipos e funções de SGBD | Não |
| aula 03, p. 2 | Atividade em grupo: identificar um BD relacional do dia a dia | Não |
| aula 03, p. 5–6 | Exercício de modelagem de cursos | Não |
| `clientes-registro-dos-clientes.md` | Rascunho de modelagem da bicicletaria | Não |

## Atividade da aula 03 — biblioteca

Enunciado: identificar um banco de dados relacional em uma aplicação do dia a
dia e explicar como o modelo relacional se aplica. Exemplos sugeridos: reservas
de hotel, e-commerce, biblioteca, gestão escolar, estoque, RH, consultas
médicas, projetos, votação e eventos (aula 03, p. 2–3).

Exemplo resolvido no próprio material: `Livros` (idLivro, titulo, autor, ISBN) e
`Emprestimos` (idEmprestimo, dtEmprestimo, dt_Devolucao, idLivro). A FK
`idLivro` liga empréstimo a livro (p. 2).

## Exercício de modelagem de cursos

Enunciado (aula 03, p. 5–6):

- `Cursos`: ID do Curso (PK), Nome do Curso, Descrição.
- `Estudantes`: ID do Estudante (PK), Nome do Estudante, Email.
- `Inscrições`: ID da Inscrição (PK), ID do Curso (FK), ID do Estudante (FK).

Tarefa: criar as tabelas, definir PK/FK e identificar os tipos de
relacionamento.

Resposta que o corpus sustenta:

- `Cursos` 1:N `Inscricoes` e `Estudantes` 1:N `Inscricoes`.
- Logo, `Cursos` N:N `Estudantes`, resolvido por `Inscricoes`.
- `Inscricoes` é a tabela associativa.

Não há gabarito oficial; essa leitura é a única compatível com o exemplo.

## Rascunho da bicicletaria

`clientes-registro-dos-clientes.md` lista entidades e atributos, mas não define
chaves nem cardinalidades. Um bom exercício é pedir ao aluno para:

1. escolher a PK de cada entidade;
2. transformar `id_cliente`, `id_servico` e `id_produto` em FKs;
3. decidir onde está o N:N (por exemplo, serviço × produto);
4. apontar as ambiguidades do rascunho.

O arquivo tem erros de grafia ("séricos", "personalização") e comentários
pessoais; não trate como modelo correto.

## Como responder "me dá o gabarito"

Diga que não existe gabarito no corpus. Ofereça:

- a resposta derivada do exemplo de cursos (acima), marcada como **derivação**;
- a lista de critérios que uma boa resposta precisa cumprir (PK, FK,
  cardinalidade, tabela associativa);
- a citação da página do enunciado.
