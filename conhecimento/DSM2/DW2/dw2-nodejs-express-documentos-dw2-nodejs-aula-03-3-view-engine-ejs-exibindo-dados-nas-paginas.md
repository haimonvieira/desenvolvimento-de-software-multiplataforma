---
disciplina: DSM2/DW2
titulo: DW2 NodeJS Aula 03.3 View Engine EJS   Exibindo dados nas páginas
fonte: DSM2/DW2/dw2-nodejs-express/Documentos/DW2-NodeJS-Aula_03.3-View Engine EJS - Exibindo dados nas páginas.pdf
tipo: pdf
paginas: 10
extraido_em: 2026-10-24
---

<!-- page: 1 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 03.3:
View Engine EJS

<!-- page: 2 -->

View engine - EJS                                                                                             {}
O EJS (Embedded JavaScript Templating) é uma Template Engine ou
(View Engine) que podemos utilizar com Node.js

Basicamente, uma Template
Engine serve para facilitar a
criação de páginas HTML e tornar
o envio e exibição de informações
para estas páginas um processo
mais simples e organizado.


                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 3 -->

Instalando o EJS                                                                                             {}
Para instalarmos o EJS, basta utilizarmos o comando npm install ejs --
save no console.


                        Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 4 -->

Renderizando páginas com EJS
O primeiro passo para começar a renderizar páginas com EJS, é indicar ao
                                                                                                                {}
Express através do método set, qual view engine iremos utilizar, no caso a ejs:


Agora em nossas rotas, já podemos renderizar páginas que possuem o formato
de arquivo .ejs, através do método render. Para isso, essas páginas devem ser
criadas dentro de uma pasta com nome views dentro da pasta do seu projeto.


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 5 -->

Renderizando páginas com EJS
Agora, ao acessarmos nossas rotas o EJS irá renderizar as páginas que indicamos.
                                                                                                               {}


                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 6 -->

Passando variáveis a rota                                                                                         {}
Ao renderizarmos uma página, é
possível também enviar variáveis
junto a essa página, para que
informações sejam exibidas nela.


Imagine que ao acessar uma rota de
nome /pedidos, você queira desenhar
a página pedidos.ejs e exibir as
informações dos produtos, puxados
de um banco de dados por exemplo,
nessa página.


                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 7 -->

Passando variáveis a rota
Para simularmos essa situação, criamos uma rota /pedidos e nela criamos uma variável de
                                                                                                                     {}
nome produtos. Essa variável receberá um array de objetos com as informações dos
produtos, simulando dados vindo de um banco.


Após isso, através do res.render, renderizamos a página “pedidos” (que deve ser criada dentro da
pasta views com a extensão pedidos.ejs). Dentro dos parâmetros do método render, passamos
um objeto de nome produtos que receberá o array produtos contendo as informações dos
produtos. Agora, ao ser renderizada a página pedidos já trará com ela as informações dos
produtos dentro da variável produto.
                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 8 -->

Passando variáveis a rota
Por fim, para exibirmos essas informações na página basta utilizarmos uma estrutura de
                                                                                                                     {}
repetição como a forEach, por exemplo.


                                                                     Note que para utilizarmos código Javascript
                                                                     dentro do HTML utilizamos os símbolos <% %>
                                                                     do EJS.


                                                                     Para exibirmos apenas o conteúdo de uma
                                                                     variável utilizamos os símbolos <%= variável %> .


                                                                     No exemplo ao lado, criamos uma tabela com as
                                                                     informações Nome e Preço dos produtos. Esses
                                                                     dados estão vindo da variável produtos que
                                                                     passamos a rota pedidos no arquivo index.js.


                              Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 9 -->

Passando variáveis a rota
Ao final, teremos o seguinte resultado:
                                                                                                                     {}


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 10 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 03.3:
View Engine EJS
