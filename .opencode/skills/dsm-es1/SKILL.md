---
name: DSM — Engenharia de Software I (ES1)
description: Responde dúvidas de Engenharia de Software I do curso DSM usando o material local em conhecimento/DSM1/ES1. Cobre definição de engenharia de software, história, as 4 atividades fundamentais, tipos de produto, atributos de bom software, diversidade de sistemas, modelos de processo (cascata, incremental, integração e configuração), reuso e Canvas de modelo de negócios. Use quando a pergunta citar engenharia de software, processo de software, SDLC, cascata, incremental, reuso ou Canvas.
metadata:
  opencode/autoinvoke: false
---

# Engenharia de Software I (DSM1/ES1)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica.

## Escopo

Entram: o que é engenharia de software; software como programas + documentação;
história (1968); as 4 atividades fundamentais; produtos genéricos versus
personalizados; atributos de bom software; diversidade de sistemas; fundamentos
gerais; modelo de processo e SDLC; cascata; incremental; integração e
configuração; reuso; Canvas e seus 9 blocos.

Não entram (e não devem ser inventados como se fossem do material): engenharia
de requisitos detalhada, UML, Scrum/Kanban, testes em profundidade, métricas,
gestão de risco, modelo espiral desenvolvido.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "termo" --disciplina DSM1/ES1 --limite 8
   ```

2. **Leia o trecho** e responda com o vocabulário do material.

3. **Cite sempre** `conhecimento/DSM1/ES1/<arquivo>.md` e a página (`p. N`).

4. **Se não houver cobertura**, diga "isso não está no material indexado de ES1"
   e só então ofereça conhecimento externo, rotulado.

5. **Diferencie ES1 de ES2.** Processo, cascata, incremental e Canvas são ES1.
   Viabilidade, custos, pontos de função e diagrama de classes são `dsm-es2`.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| Engenharia de software = programar | É disciplina de engenharia que cobre todos os aspectos da produção de software, inclusive gestão (aula 01, p. 19) |
| Software = só código | São programas **e** documentação associada (aula 01, p. 11) |
| Cascata é sempre ruim | É adequado a sistemas embarcados e a situações de requisitos estáveis; ruim quando os requisitos mudam rápido (aula 03, p. 16) |
| Incremental = cascata com entregas | No incremental, especificação, desenvolvimento e validação são **intercalados**, com feedback rápido (aula 03, p. 17) |
| Reuso = copiar código | O corpus trata reuso formal em 5 etapas, com descoberta, avaliação e adaptação (aula 03, p. 27–29) |
| Canvas = plano de negócios | O Canvas **precede** o plano; é um quadro de hipóteses a validar (aula 04, p. 2 e 6–7) |

## Números e fatos que precisam sair exatos

- Conceito de engenharia de software proposto em **1968** (aula 01, p. 9).
- **4 atividades fundamentais:** especificação, desenvolvimento, validação e
  evolução (aula 01, p. 20; aula 02, p. 2).
- **Atributos de bom software:** aceitabilidade, dependabilidade e segurança,
  eficiência e manutenibilidade (aula 01, p. 17–18).
- **9 blocos do Canvas**, agrupados em 4 perguntas (aula 04, p. 8).
- **5 etapas** do processo baseado em reuso (aula 03, p. 27–29).

## Cuidados ao responder

- Não apresente o modelo espiral como se estivesse no corpus: ele só aparece na
  ementa (aula 01, p. 3), sem desenvolvimento.
- Não diga que o Canvas tem 10 blocos nem invente blocos.
- Não confunda "produto genérico" com "software livre": genérico é vendido no
  mercado para qualquer cliente (aula 01, p. 15).
- Não atribua ao material uma lista fechada de fases do incremental; o corpus
  descreve o ciclo, não um rol de fases.

## Referências

- `references/00-visao-geral.md` — cobertura e sequência.
- `references/01-conceitos.md` — conceitos com página.
- `references/02-exercicios.md` — atividades e lacunas de gabarito.
- `references/03-fontes.md` — inventário das 4 aulas.
- `references/04-glossario.md` — termos.
