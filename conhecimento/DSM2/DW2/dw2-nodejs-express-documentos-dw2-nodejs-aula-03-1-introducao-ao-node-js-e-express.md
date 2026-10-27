---
disciplina: DSM2/DW2
titulo: DW2 NodeJS Aula 03.1 Introdução ao Node.js e Express
fonte: DSM2/DW2/dw2-nodejs-express/Documentos/DW2-NodeJS-Aula_03.1-Introdução ao Node.js e Express.pdf
tipo: pdf
paginas: 19
extraido_em: 2026-10-24
---

<!-- page: 1 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 03.1:
Introdução ao Node.js
e ao Express.js

<!-- page: 2 -->

Node JS                                                                                                    {}
Node.js é um interpretador de código Javascript que roda fora dos
navegadores. Através dele podemos usar o Javascript também para
desenvolvimento back-end.


Link para download: https://nodejs.org/en/download
                      Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 3 -->

Vantagens                                                                                                {}
- Muito leve;

- Muito rápido;

- Permite usar a mesma linguagem no front e back-end (JS);

- Possui uma vasta quantidade de bibliotecas;

- Está sendo utilizado fortemente no mercado.


                    Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 4 -->

Express JS                                                                                               {}
O Express.js é um framework que nos ajuda a construir
aplicações web com o Node.js. Possui diversas ferramentas
deixando o trabalho muito mais fácil e prático.


                    Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 5 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 01.1:
Introdução ao Node.js
e ao Express.js

<!-- page: 6 -->

Node Package Manager (NPM)                                                                              {}
O NPM é o gerenciador de pacotes do Node.js, é utilizado
para criar projetos Node e baixar diversas bibliotecas.

                                                  npm –v :
                                                  Verifica a versão do npm
                                                  npm init :
                                                  Inicia um projeto Node.js
                                                  npm install express –-save :
                                                  Instala o Express.js


                   Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 7 -->

Iniciando um projeto Node                                                                                         {}
Após já ter instalado o Node em seu computador, o primeiro passo para iniciarmos
um projeto Node, é criar a pasta do projeto.


Em seguida acesse o console do VS Code (atalho: ctrl + “) e navegue até a pasta do
projeto (utlize cd e cd.. para navegar entre as pastas).


Uma vez dentro da pasta do projeto utilize o comando npm init para iniciar um
projeto.


                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 8 -->

Iniciando um projeto Node                                                                                      {}
Em seguida, basta preencher as informações do projeto ou deixa-las em branco e
avançar com a tecla ENTER.


Uma vez iniciado o projeto um arquivo com o nome package.json será criado
contendo as informações do projeto.

                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 9 -->

Instalando o Express.js                                                                                         {}
Agora que iniciamos nosso projeto, precisamos instalar o framework Express.js.
Para isso basta utilizar o comando npm install express --save no console


Após a instalação do Express, uma pasta com o nome node_modules será criada.
Nesta pasta estão os módulos do framework.


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 10 -->

Módulos                                                                                                   {}
Módulos são “pedaços” do seu programa. Consiste em
uma forma de dividir o código de um sistema em vários
arquivos. Através dos módulos é possível também
importar bibliotecas a sua aplicação.

Exemplo:

Exportando: module.exports = connection

Importando: require( ‘connection’)


                     Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 11 -->

Importando o Express.js                                                                                      {}
Após instalar o Express é necessário importá-lo em nossa aplicação.
Para isso, crie o primeiro arquivo com o nome index.js na pasta do projeto.
Dentro do arquivo index.js, declaramos uma constante com o
identificador express e importamos a biblioteca express como um
módulo. Após isso, carregamos o express dentro da constante app.


                        Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 12 -->

Iniciando o servidor                                                                                                  {}
Uma vez que temos o Express carregado dentro da constante app,
podemos utilizá-la para chamar os seus métodos. Para iniciarmos nosso
servidor Node, utilizaremos o método listen, informando a porta que será
utilizada pelo servidor, no nosso caso utilizaremos a porta 8080:


                                                                                                Nota: Por padrão na
                                                                                                web utilizamos a
                                                                                                porta 80 para HTTP
                                                                                                e 443 para HTTPS.


                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 13 -->

Iniciando o servidor                                                                                          {}
Para testarmos nosso servidor, precisamos agora executar nosso arquivo
index.js com o comando node, através do console. Lembre-se que para
isso, devemos estar dentro da pasta do projeto (utlize cd e cd.. para navegar
entre as pastas).


A mensagem de sucesso deve ser exibida informando o carregamento do
servidor.


                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 14 -->

Automatizando o servidor com Nodemon
Podemos automatizar o processo de reiniciar o servidor com o utilitário Nodemon. Assim ele
                                                                                                                   {}
irá reiniciar o servidor toda vez que detectar alguma alteração no código da aplicação.

O primeiro passo é instalar o Nodemon através do npm. Para isso, dentro da pasta do seu
projeto, digite o comando npm install nodemon –g no console.


Feito isso, basta iniciar o servidor com o comando npx nodemon index.js. Agora a cada
alteração no código, o servidor será reiniciado automaticamente.


                              Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 15 -->

O que são rotas?                                                                                         {}
Rotas são os diversos caminhos que uma aplicação pode ter.


São exemplos de rotas:
meuapp.com/home
meuapp.com/perfil
meuapp.com/video/14


                    Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 16 -->

Criando rotas no Express.js                                                                                     {}
Existem várias formas de se criar rotas com Express.js, uma delas é utilizar
o método get:

                                                                                              req: Requisição
                                                                                              res: Resposta


No exemplo acima, no arquivo index.js criamos duas rotas. A rota principal
(“/ ”) e a rota perfil. Em seguida, através do objeto res utilizamos o método
send, para enviar uma resposta no momento em que a rota é acessada.

                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 17 -->

Acessando as rotas
Para testarmos nossas rotas, basta abrir o navegador e através da barra de
                                                                                                                {}
endereço digitar o endereço da rota. Lembre-se que com um servidor local,
utilizamos primeiramente o localhost, seguido da porta.


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 18 -->

Acessando as rotas
Nossa segunda rota também pode ser acessada conforme a seguir:
                                                                                                              {}


                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 19 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 03.1:
Introdução ao Node.js
e ao Express.js
