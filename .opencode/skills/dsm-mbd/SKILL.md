---
name: DSM — Modelagem de Banco de Dados (MBD)
description: Responde dúvidas de Modelagem de Banco de Dados do curso DSM usando o material local em conhecimento/DSM1/MBD. Cobre conceito de banco de dados e SGBD, história dos modelos de dados, níveis de abstração, modelos em rede, hierárquico e relacional, tabelas, chave primária, chave estrangeira e relacionamentos 1:1, 1:N e N:N. Use quando a pergunta citar modelagem, SGBD, modelo relacional, entidade, chave primária, chave estrangeira ou relacionamento.
metadata:
  opencode/autoinvoke: false
---

# Modelagem de Banco de Dados (DSM1/MBD)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica. Aqui a ênfase é **modelo e estrutura**, não SQL.

## Escopo

Entram: conceito de banco de dados e de SGBD; história (1960s, Codd em 1970,
1980, 2000); componentes e funções de um SGBD; níveis de abstração (físico,
lógico, visão); tipos de SGBD; modelos em rede, hierárquico e relacional;
tabelas, linhas e colunas; chave primária e chave estrangeira; relacionamentos
1:1, 1:N e N:N; tabela associativa; exemplos de modelagem do corpus.

Não entram (e não devem ser inventados como se fossem do material): MER formal
com notação, normalização, álgebra relacional, SQL, modelagem física, índices.

## Protocolo obrigatório

1. **Busque antes de responder.** Nunca responda de memória.

   ```bash
   python3 ferramentas/buscar.py "termo" --disciplina DSM1/MBD --limite 8
   ```

2. **Leia o trecho retornado** e responda com as palavras do material,
   explicando com suas palavras.

3. **Cite sempre** `conhecimento/DSM1/MBD/<arquivo>.md` e a página quando for
   PDF (`p. N`).

4. **Se o corpus não cobrir**, diga "isso não está no material indexado de MBD"
   e só então ofereça conhecimento externo, claramente rotulado.

5. **Não responda SQL como se fosse MBD.** Consultas, DDL e MySQL são `dsm-bd2`.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| Banco de dados = SGBD | Banco é a coleção organizada de dados; SGBD é o software que gerencia (aula 01, p. 1 e 3) |
| Modelo de rede = internet | Rede aqui é modelo de dados em **grafo**, com múltiplos pais; não tem relação com a internet (aula 02, p. 1) |
| Hierárquico = relacional | Hierárquico usa **árvore** e um único pai; relacional usa **tabelas** (aula 02, p. 1; aula 03, p. 1) |
| N:N resolve com uma FK | N:N exige **tabela associativa**, como `Inscricoes` no exemplo de cursos (aula 03, p. 5–6) |
| Chave primária pode repetir | PK identifica unicamente cada registro; FK referencia a PK de outra tabela (aula 03, p. 3–4) |
| MER formal | O corpus mostra tabelas, PK/FK e cardinalidades, mas **não** ensina a notação MER; declare a lacuna |

## Exemplos canônicos do corpus

- **Biblioteca:** `Livros` (idLivro, titulo, autor, ISBN) e `Emprestimos`
  (idEmprestimo, dtEmprestimo, dt_Devolucao, idLivro) — aula 03, p. 2.
- **Cursos:** `Cursos`, `Estudantes` e `Inscricoes` (idInscricao, idCurso,
  idEstudante) — aula 03, p. 5–6.
- **Bicicletaria:** clientes, bicicletas, atendimento, serviços, produtos,
  personalização e vendas — `clientes-registro-dos-clientes.md`.

## Erros comuns ao responder

- Não diga que o modelo relacional foi criado na década de 1960: o corpus diz
  **1970, por Edgar F. Codd** (aula 01, p. 1).
- Não trate "modelo de rede" como topologia de rede de computadores.
- Não apresente normalização como conteúdo de MBD: ela **não** aparece no corpus.
- Não invente cardinalidade que o exemplo não mostra; descreva só o que está
  escrito.

## Referências

- `references/00-visao-geral.md` — o que o material cobre e em que ordem.
- `references/01-conceitos.md` — conceitos consolidados com página.
- `references/02-exercicios.md` — atividades do corpus e o que falta de gabarito.
- `references/03-fontes.md` — inventário dos 4 arquivos.
- `references/04-glossario.md` — termos e traduções.
