---
disciplina: DSM2/DW2
titulo: DW2 NodeJS Aula 03.2 Passando parâmetros à rotas
fonte: DSM2/DW2/dw2-nodejs-express/Documentos/DW2-NodeJS-Aula_03.2-Passando parâmetros à rotas.pdf
tipo: pdf
paginas: 6
extraido_em: 2026-10-24
---

<!-- page: 1 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 03.2:
Passando parâmetros à rotas

<!-- page: 2 -->

Rotas com passagem de parâmetros                                                                            {}
Anteriormente aprendemos a criar rotas no Node.js. As rotas são os
vários caminhos que uma aplicação pode ter.


Nessa aula veremos como passar parâmetros, ou seja, valores
adicionais nessas rotas.


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 3 -->

Rotas com passagem de parâmetros
Para passar um parâmetro fixo em uma rota, basta adicionar /:parâmetro, após a
                                                                                                                {}
rota. Por exemplo, na rota perfil, queremos passar como parâmetro o nome do
usuário a quem pertence o perfil.


Para isso, após a rota /perfil, adicionamos o parâmetro nome (/:nome). Porém
agora, para a rota perfil ser acessada, será obrigatório informar o parâmetro.

Importante lembrar que podemos adicionar quantos parâmetros acharmos
necessário, ou seja, um parâmetro seguido do outro. Para isso basta adicionar
novamente no final /:parâmetro.


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 4 -->

Passando o valor do parâmetro a uma variável
Para pegarmos o valor do parâmetro e atribuirmos a uma varável devemos utilizar o
                                                                                                                   {}
objeto req (requisição). O objeto req trata dos dados enviados pelo usuário. O objeto res
por sua vez, trata da resposta que será enviada ao usuário. No nosso exemplo anterior,
caso desejemos passar o valor do parâmetro :nome a uma variável basta inserirmos o
seguinte:


Nesse caso criamos uma variável nome e através do req.params.nome, coletamos o
valor do parâmetro passado na rota. Uma vez coletado esse valor e atribuído a uma
variável, podemos utilizá-lo, como a seguir:


                              Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 5 -->

Passando o valor do parâmetro a uma variável
Caso passemos o valor “Pedro” no parâmetro :nome da rota perfil, o seguinte resultado
                                                                                                                  {}
será exibido:


                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 6 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 03.2:
Passando parâmetros à rotas
