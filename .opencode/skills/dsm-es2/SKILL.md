---
name: DSM — Engenharia de Software II (ES2)
description: Responde dúvidas de Engenharia de Software II do curso DSM usando o material local em conhecimento/DSM2/ES2. Cobre estudo de viabilidade (operacional, técnica, cronograma e econômica), custos fixos e variáveis, métricas e pontos de função, e diagrama de classes UML (classe, atributos, métodos, visibilidade, multiplicidade, agregação, composição, herança, classes associativas e notas). Use quando a pergunta citar viabilidade, pontos de função, diagrama de classes, UML, agregação, composição ou herança.
metadata:
  opencode/autoinvoke: false
---

# Engenharia de Software II (DSM2/ES2)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica.

## Escopo

Entram: estudo de viabilidade e seus quatro tipos; análise de custo-benefício;
custos de desenvolvimento e de operação; custos fixos e variáveis; métricas de
software; pontos de função; diagrama de classes UML; conceitos de OO
(classificação, abstração, instanciação); classe, atributos, métodos,
visibilidade; associação e multiplicidade; agregação; composição; herança;
classes associativas; notas.

Não entram (e não devem ser inventados como se fossem do material): espiral e
prototipagem desenvolvidos, arquitetura e padrões, outros diagramas UML,
engenharia de requisitos, testes.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "termo" --disciplina DSM2/ES2 --limite 8
   ```

2. **Leia o trecho** e responda com o vocabulário do material.

3. **Cite sempre** `conhecimento/DSM2/ES2/<arquivo>.md` e a página (`p. N`).

4. **Se não houver cobertura**, diga "isso não está no material indexado de ES2"
   e só então ofereça conhecimento externo, rotulado.

5. **Diferencie ES1 de ES2.** Processos, cascata, incremental e Canvas são ES1.
   Viabilidade, custos, pontos de função e diagrama de classes são ES2.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| Viabilidade = só dinheiro | São quatro: operacional, técnica, cronograma e econômica (aula 01, p. 8) |
| Custo fixo = custo que ocorre uma vez | Custo que ocorre uma vez é **de desenvolvimento**; fixo é o que se repete com taxa estável (aula 01, p. 15–17) |
| Agregação destrói a parte | Na agregação, a parte **não** é destruída com o todo; na composição, é (aula 03, p. 24 e 26) |
| Composição = agregação | Composição é vínculo mais forte, losango **preenchido**, parte exclusiva de um todo (p. 26) |
| `*` e `0..*` são iguais | `*` é "muitos"; `0..*` é "no mínimo nenhum" (p. 22) |
| Diagrama de classes = diagrama de casos de uso | O corpus trata só o diagrama de classes, "a ferramenta mais importante da UML" (p. 2) |

## Números e fatos que precisam sair exatos

- **4 tipos de viabilidade** (aula 01, p. 8).
- **Pontos de função** medem o tamanho funcional, o "QUE o software faz"
  (aula 01, p. 20).
- **Visibilidade:** `+` pública, `-` privada, `#` protegida (aula 03, p. 16–18).
- **Multiplicidades:** `0..1`, `1..1`, `0..*`, `*`, `1..*`, `3..5` (p. 22).
- **Losango vazio** = agregação; **losango preenchido** = composição
  (p. 23 e 26).

## Cuidados ao responder

- O arquivo `engenharia-de-software-2.md` está **vazio**; nunca cite conteúdo
  dele.
- O cabeçalho da aula 01 diz "Engenharia de Software I", mas o conteúdo é ES2;
  avise o aluno se ele estranhar.
- O exemplo de pontos de função tem uma conta confusa (0,45 dias). Reproduza
  citando a fonte e sinalize que a fórmula não fecha; não invente uma correção.
- Não descreva imagens de diagramas como se você as tivesse visto; o corpus só
  traz o texto.

## Referências

- `references/00-visao-geral.md` — cobertura e sequência.
- `references/01-conceitos.md` — conceitos com página.
- `references/02-exercicios.md` — exercícios da aula 03 e lacunas.
- `references/03-fontes.md` — inventário das fontes.
- `references/04-glossario.md` — termos de viabilidade e UML.
