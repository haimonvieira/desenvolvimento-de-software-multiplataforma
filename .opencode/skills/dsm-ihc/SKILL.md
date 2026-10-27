---
name: DSM — Interação Humano-Computador (IHC)
description: Responde dúvidas de Interação Humano-Computador do curso DSM usando o material local em conhecimento/DSM3/IHC. Cobre definição e interdisciplinaridade da IHC, as três ondas históricas, affordances (explícita, padrão, escondida, metafórica e falsa), interação, interface, usabilidade versus experiência do usuário (UX) e pesquisa de usuário com personas. Use quando a pergunta citar IHC, affordance, usabilidade, UX, interface, persona, pesquisa de usuário, Norman ou Bødker.
metadata:
  opencode/autoinvoke: false
---

# Interação Humano-Computador (DSM3/IHC)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica. O corpus tem 4 aulas em PDF (92 páginas).

## Escopo

Entram: definição e caráter interdisciplinar da IHC; TICs; interface e UI;
interação como diálogo/linguagem artificial; evolução da qualidade da interação
(décadas de 40 a 2010); três ondas da IHC; affordances (explícita, padrão,
escondida, metafórica e falsa); usabilidade versus UX; pontos de contato e
momentos da UX; pesquisa/estudo de usuário; personas (componentes, utilidade e
exemplos).

Não entram (e não devem ser inventados como se fossem do material): heurísticas
de Nielsen, avaliação de usabilidade, testes com usuários, acessibilidade em
profundidade, engenharia semiótica, design centrado no humano, requisitos de IHC
e prototipação. Esses temas aparecem apenas na ementa, sem desenvolvimento.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "termo" --disciplina DSM3/IHC --limite 8
   ```

2. **Leia o trecho** e responda com o vocabulário do material.

3. **Cite sempre** `conhecimento/DSM3/IHC/<arquivo>.md` e a página
   (`p. N`) quando a afirmação vier de um slide específico.

4. **Se não houver cobertura**, diga "isso não está no material indexado de IHC"
   e só então ofereça conhecimento externo, rotulado.

5. **Não invente gabarito.** As atividades têm enunciado e, em alguns casos,
   resposta no slide; os formulários externos não têm gabarito no corpus.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| Usabilidade e UX são sinônimos | Usabilidade é característica intrínseca do produto, embutida pelo designer; UX é a perspectiva individual, afetada pela usabilidade e também por expectativas, vivências e contexto (aula 03, p. 24–25) |
| UX é só a tela | UX abrange pontos de contato (marketing, loja, manual, instalação, interface, suporte, descarte) e momentos (antecipação, primeiro uso, uso esporádico, uso continuado) (p. 26) |
| Affordance é só "botão bonito" | Affordance é a qualidade que permite identificar a função de forma intuitiva; há 5 tipos, inclusive a **falsa** affordance (aula 02, p. 3–12) |
| Affordance explícita e padrão são iguais | Explícita torna a ação óbvia sem padrão consolidado; padrão usa convenções conhecidas, como link azul sublinhado (p. 6–7) |
| IHC começou nos anos 2000 | As três ondas são 70/80, 1990+ e 2000+ (aula 01, p. 17–20) |
| A primeira onda focava grupos | A primeira focava o indivíduo; a segunda, grupos; a terceira, cultura e estética (p. 18–20) |
| Persona é um usuário real | Persona é representação **fictícia** baseada em pesquisa e dados reais (aula 04, p. 8) |

## Números e fatos que precisam sair exatos

- **IHC:** estudo da interação entre pessoas e computadores; interdisciplinar
  (computação, artes, design, ergonomia, psicologia, sociologia, semiótica,
  linguística) — aula 01, p. 9.
- **Donald Norman:** psicólogo cognitivista que trabalhou usabilidade nos anos
  70/80 — p. 17.
- **Três ondas (Bødker, 2006):** 70/80 (indivíduo), 1990+ (grupos), 2000+
  (cultura/estética) — p. 17–20.
- **Usabilidade em 1980:** eficácia, eficiência, aprendizagem e satisfação —
  aula 03, p. 13.
- **Affordances:** conceito de James Gibson, 1977 — aula 02, p. 3.
- **Cinco tipos:** explícita, padrão, escondida, metafórica e falsa — p. 5–12.
- **Persona:** nome/foto fictícios, perfil demográfico, objetivos, dores,
  comportamentos e citações — aula 04, p. 9.
- **Exemplo do banco:** a alternativa correta é **D** — aula 03, p. 30.

## Cuidados ao responder

- O corpus tem o typo "Ferrnando" (aula 03, p. 27) e "Affordance explícito"
  (aula 02, p. 6). Corrija na resposta sem alterar o original.
- As aulas 01 e 03 usam "qualidade da interação" em uma linha do tempo; não
  confunda essa evolução histórica com as três ondas (que são outra
  periodização).
- O corpus **não** traz as heurísticas de Nielsen nem um método formal de
  avaliação; se o aluno pedir, diga que não está indexado.
- A ementa cita acessibilidade, engenharia semiótica e prototipação, mas as
  quatro aulas não as desenvolvem.
- As atividades de affordance e de persona são propostas de trabalho, não
  exercícios com resposta única.
- Não altere os arquivos em `DSM3/IHC/`.

## Referências

- `references/00-visao-geral.md` — cobertura, sequência e lacunas.
- `references/01-conceitos.md` — IHC, ondas, affordances, usabilidade/UX e personas.
- `references/02-exercicios.md` — questões, atividades e respostas do corpus.
- `references/03-fontes.md` — inventário das 4 aulas.
- `references/04-glossario.md` — termos.
