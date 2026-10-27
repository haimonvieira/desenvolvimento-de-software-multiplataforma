# Conceitos consolidados — ES1

## 1. O que é Engenharia de Software

O corpus caracteriza a engenharia de software como uma **disciplina de
engenharia**: os engenheiros aplicam teorias, métodos e ferramentas onde for
apropriado, trabalham dentro de limites organizacionais e financeiros e cuidam
de **todos os aspectos da produção de software**, inclusive gestão de projetos
(aula 01, p. 19).

Não há notações, métodos ou técnicas universais: tipos diferentes de software
exigem abordagens diferentes (aula 01, p. 7).

## 2. O que é software

"Programas de computador e documentação associada" (aula 01, p. 11). Se o
programa é só para uso próprio, documentação extensa pode não ser necessária;
se outras pessoas vão usar e alterar, é preciso documentar projeto e código
(aula 01, p. 14).

## 3. História

O conceito foi proposto em **1968**, em uma conferência para discutir a chamada
"crise do software" (aula 01, p. 9).

## 4. As 4 atividades fundamentais

| Atividade | O que é |
| --- | --- |
| Especificação | Clientes e engenheiros definem o software e as restrições |
| Desenvolvimento | O software é projetado e programado |
| Validação | O programa é analisado para garantir que atende ao cliente |
| Evolução | O software muda para refletir novos requisitos |

Fonte: aula 01, p. 20; aula 02, p. 2.

## 5. Tipos de produto

- **Genéricos:** sistemas stand-alone produzidos para venda no mercado a
  qualquer cliente (apps, bancos de dados, processadores de texto).
- **Personalizados (sob medida):** encomendados e desenvolvidos para um cliente
  específico (controle de dispositivos, processos de negócio, tráfego aéreo).

A fronteira está ficando confusa: sistemas ERP são produto genérico adaptado
(aula 01, p. 15–16).

## 6. Atributos de bom software

| Atributo | Definição no corpus |
| --- | --- |
| Aceitabilidade | Inteligível, útil e compatível com os outros sistemas do usuário |
| Dependabilidade e segurança | Confiabilidade, segurança da informação e safety; não causar danos em falha |
| Eficiência | Não desperdiçar memória e ciclos de processador; responsividade e tempo |
| Manutenibilidade | Poder evoluir para atender necessidades mutáveis |

Fonte: aula 01, p. 17–18.

## 7. Diversidade de sistemas

O corpus lista: aplicações interativas baseadas em transações, sistemas de
controle embarcados, processamento em lotes, entretenimento, modelagem e
simulação, coleta e análise de dados e sistemas de sistemas (aula 02, p. 4–11).

## 8. Fundamentos gerais

1. O software deve ser desenvolvido com um processo gerenciado e compreendido
   (aula 02, p. 12).
2. Qualidade e desempenho importam para todos os tipos de sistema (p. 13).
3. É preciso compreender e controlar requisitos e expectativas (p. 14).
4. O slide repete o item 3 na p. 15; o corpus não apresenta um quarto
   fundamento distinto.

## 9. Modelo de processo de software

Também chamado de ciclo de vida (SDLC): representação simplificada de um
processo. Cada modelo mostra o processo de uma perspectiva e fornece informação
parcial (aula 03, p. 2).

Modelos genéricos citados: **cascata**, **desenvolvimento incremental** e
**integração e configuração** (aula 03, p. 3–5).

## 10. Modelo em cascata

Fases (aula 03, p. 9–13):

1. Análise e definição dos requisitos.
2. Projeto do sistema e do software.
3. Implementação e teste de unidade.
4. Integração e teste de sistema.
5. Operação e manutenção (a fase mais longa).

Características: cada fase gera documentos aprovados e a fase seguinte não
começa antes do fim da anterior (p. 14). Na prática há feedback e sobreposição.
É adequado a sistemas embarcados e a requisitos estáveis; não é recomendado
quando os requisitos mudam rapidamente (p. 16).

## 11. Desenvolvimento incremental

Ideia: implementação inicial → feedback → várias versões até o sistema
necessário. Especificação, desenvolvimento e validação são **intercalados**
(aula 03, p. 17). É a abordagem mais comum atualmente (p. 19).

Três vantagens (p. 21–22):

1. Menor custo de mudança de requisitos.
2. Feedback mais fácil do cliente.
3. Entrega e implantação antecipadas de software útil.

Problema principal: burocracia organizacional incompatível com processo
iterativo/ágil informal (p. 23).

## 12. Integração e configuração

Reuso informal acontece quando a equipe procura código similar e o adapta
(aula 03, p. 24). Três tipos de componentes reusados (p. 25–26):

1. Sistemas de aplicação stand-alone configurados.
2. Coleções de objetos/componentes integrados a um framework.
3. Web services (API) disponíveis remotamente.

## 13. Processo baseado em reuso

1. Especificação dos requisitos (breve).
2. Descoberta e avaliação do software.
3. Refinamento dos requisitos conforme os componentes disponíveis.
4. Configuração da aplicação (se houver pronta).
5. Adaptação e integração dos componentes.

Fonte: aula 03, p. 27–29.

## 14. Canvas

O Canvas é uma ferramenta para visualizar o futuro negócio e criar um modelo de
negócios como **quadro de hipóteses a validar** (aula 04, p. 2). O modelo de
negócios descreve a lógica de criação de valor e **precede** o plano de
negócios, que detalha etapas, prazos e planilhas (p. 6–7).

### Os 9 blocos e as 4 perguntas

| Pergunta | Blocos |
| --- | --- |
| Vou fazer o quê? | Proposta de Valor |
| Para quem? | Segmento de Clientes, Canais, Relacionamento com Clientes |
| Como? | Recursos Principais, Atividades Principais, Parcerias Principais |
| Quanto? | Fontes de Receita, Estrutura de Custos |

Fonte: aula 04, p. 8.

O material detalha cada bloco nas páginas 10–36, com exemplos. A proposta de
valor é "o QUE"; o segmento é "para quem"; canais são como o produto chega;
relacionamento é o tipo de vínculo; receitas são a entrada de dinheiro;
recursos, atividades e parcerias sustentam a operação; custos são o que se gasta
para realizar a proposta.
