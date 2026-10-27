---
name: DSM — Inglês I (ING1)
description: Responde dúvidas de Inglês I do curso DSM usando o material local em conhecimento/DSM3/ING1. Cobre leitura de texto técnico em inglês, Simple Present para instruções, imperativo, preposições, vocabulário de informática (printer, mouse, keyboard, screen, cable, program, file, email) e compreensão do vídeo "Using a Computer". Use quando a pergunta citar ING1, inglês instrumental, Simple Present, preposição em inglês, vocabulário de computador ou o texto Technical Game Safety Guide.
metadata:
  opencode/autoinvoke: false
---

# Inglês I (DSM3/ING1)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica. O corpus é **muito pequeno**: duas atividades
respondidas por um aluno, sem gabarito oficial.

## Escopo

Entram: leitura do texto *Technical Game Safety Guide*; uso do **Simple
Present** para instruções; **imperativo**; identificação de **preposições**;
vocabulário de informática do vídeo *Using a Computer* (printer, mouse,
keyboard, screen, cable, program, file, email, internet); compreensão literal
das 10 perguntas do questionário.

Não entram (e não devem ser inventados como se fossem do material): tempos
verbais além do Simple Present e do Present Continuous incidental, regras
gramaticais formais, lista de vocabulário, pronúncia, tradução oficial,
literatura, phrasal verbs e exercícios com gabarito do professor.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "termo" --disciplina DSM3/ING1 --limite 8
   ```

2. **Leia a atividade** e responda com o vocabulário do material.

3. **Cite sempre** `conhecimento/DSM3/ING1/<arquivo>.md` e a página (`p. 1`)
   quando houver PDF; os dois arquivos têm 1 página ou nenhuma.

4. **Diga que a resposta é do aluno.** Não há gabarito oficial no corpus; as
   respostas do arquivo são produções do próprio estudante.

5. **Se não houver cobertura**, diga "isso não está no material indexado de
   ING1" e só então ofereça conhecimento externo, rotulado.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| Simple Present e Present Continuous são a mesma coisa | O texto usa Simple Present/imperativo para instruções; "is learning" aparece só no enunciado da questão 1, não no texto |
| A resposta de preposições do arquivo está completa | **Não está.** Faltam `through` e `during`, ambas presentes no texto |
| `before` é sempre preposição | Em "Before you insert...", é **conjunção** (introduz oração); por isso não entra na lista de preposições |
| `to` é sempre preposição | Pode ser preposição ("to the drive") ou parte do infinitivo ("to rest"); a atividade lista `to` sem essa distinção |
| O questionário tem gabarito oficial | Não. As 10 respostas são do aluno e podem conter erros |

## Números e fatos que precisam sair exatos

- **Texto:** *Technical Game Safety Guide*, 1 página, 4 parágrafos.
- **Tempo predominante:** **Simple Present**, usado para instruções.
- **Verbos no texto:** `plug`, `check`, `make`, `flows`, `insert`, `clean`,
  `cause`, `recommend`, `take`, `step`, `rest`, `stretch`, `feel`,
  `discontinue`, `experience`, `consult`.
- **Preposições do texto:** `into`, `on`, `of`, `from`, `through`, `during`,
  `with`, `in`, `for`, `to`.
- **Resposta do aluno:** `into, on, in, for, of, with, from, to` — **omite
  `through` e `during`**.
- **Vídeo:** quem aprende é **Jeffrey** (questão 1).
- **Equipamentos citados:** printer, mouse, keyboard, screen, cable (questão 3).
- **Funções:** mouse move o cursor e clica para abrir programas; teclado digita
  palavras; tela mostra ícones e programas (questões 5–7).
- **Arquivo:** pode conter texto, música ou foto (questão 8).

## Cuidados ao responder

- O corpus é **produção de aluno**, não material didático do professor. Trate
  como exemplo, não como verdade gramatical.
- Erros no original: "in **him** life" (questão 2, correto: *his*), "Move
  **cursos**" (questão 5, correto: *cursor*), "sent emails" (questão 9).
- A resposta 8 usa "A program helps **him** do..." — correto no contexto, mas
  não é regra geral.
- A questão 10 é **opinativa**; não existe resposta certa.
- Não invente gabarito nem traduções oficiais.
- Não altere os arquivos em `DSM3/ING1/`.

## Referências

- `references/00-visao-geral.md` — cobertura, sequência e lacunas.
- `references/01-conceitos.md` — Simple Present, imperativo, preposições e vocabulário.
- `references/02-exercicios.md` — AT1 e questionário, com correções.
- `references/03-fontes.md` — inventário dos 2 arquivos.
- `references/04-glossario.md` — termos em inglês e português.
