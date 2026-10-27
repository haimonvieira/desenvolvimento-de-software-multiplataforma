---
disciplina: DSM3/DW3
titulo: DW3 Aula 02 Desenvolvendo o CRUD da API
fonte: DSM3/DW3/DW3-Aula_02-Desenvolvendo o CRUD da API.pdf
tipo: pdf
paginas: 21
extraido_em: 2026-10-24
---

<!-- page: 1 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 02:
Desenvolvendo o CRUD da API

<!-- page: 2 -->

Buscando registros na API
Após criarmos a base de dados da API, implementaremos
                                                                                                                            {}
agora um novo service na estrutura do projeto. Para isso, crie
uma pasta na raiz do projeto chamada services, dentro
desta pasta crie um novo arquivo chamado gameService.js.


No arquivo gameService.js criaremos uma classe
que será responsável por conter os métodos de
manipulação do banco de dados, como buscar,
criar, alterar e deletar registros.


O primeiro método a ser criado é o getAll(), que
irá selecionar todos os registros de games
cadastrados no banco de dados. Esse método
será uma função assíncrona, por isso
utilizaremos o padrão async/await.
                                      Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 3 -->

Funções assíncronas (async/await)
O padrão async/await no JavaScript é uma maneira
                                                                                                                        {}
moderna e mais fácil de lidar com operações
assíncronas, como buscar dados de uma API, sem
precisar usar muitos callbacks ou promises.

Função assíncrona (async): Quando você define uma
função como async, ela automaticamente retorna uma
promessa e permite que você use o await dentro dela.

await: O await é usado dentro de funções async para
"esperar" que uma promessa seja resolvida. Isso
significa que o código vai parar e esperar até que a
operação assíncrona termine, mas sem bloquear o
resto do programa. Depois que a promessa é resolvida,
o código continua a ser executado.

                                  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 4 -->

Funções assíncronas (async/await)
       Promisse:                                                               Async/await:
                                                                                                         {}


                   Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 5 -->

Criando o Controller
Após criarmos o service, criaremos agora nosso controller.
                                                                                                                               {}
Para isso, crie uma pasta na raiz do projeto chamada
controllers, dentro desta pasta crie um novo arquivo
chamado gameController.js.
                                                                                          O controller será responsável por
                                                                                          tratar as requisições do cliente.
                                                                                          No exemplo ao lado, getAllGames
                                                                                          recebe uma função assíncrona que
                                                                                          chama o método getAll() do service
                                                                                          para buscar os registros no banco.
                                                                                          Em seguida, o controller retorna
                                                                                          esses registro em um JSON, bem
                                                                                          como o código de status 200. Além
                                                                                          disso, também é feito o tratamento
                                                                                          de erro.

                                 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 6 -->

Modularizando as rotas
Visando a eficiência do projeto iremos agora modularizar as rotas da API
                                                                                                                                       {}
(endpoints). Para isso, crie uma pasta na raiz do projeto chamada routes,
dentro desta pasta crie um novo arquivo chamado gameRoutes.js.

Nesse arquivo iremos importar o express, em seguida carregar na variável gameRoutes o método
express.Router(), responsável por fazer o gerenciamento de rotas. Importaremos também o
gameController responsável por tratar as requisições.

                                                                                                    Nesse arquivo criaremos todos os
                                                                                                    endpoints (rotas) da API.
                                                                                                    Começaremos criando a rota
                                                                                                    “/games” que ao receber um
                                                                                                    requisição do tipo GET, chamará
                                                                                                    o método getAllGames( ) do
                                                                                                    gameController para fazer o
                                                                                                    tratamento da requisição.


                                   Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 7 -->

Listando os registros (GET)
Por fim, devemos importar nossas rotas no arquivo index.js, para que sejam acessíveis na aplicação.                     {}

Feito isso, testaremos a requisição no Insomnia, enviando uma requisição GET para a rota “/games”:


                                  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 8 -->

Cadastrando dados na API
Para começarmos a cadastrar dados na API, criaremos um novo
                                                                                                                      {}
método chamado Create() na classe gameService que irá inserir
novos registros no banco de dados.


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 9 -->

Cadastrando dados na API
Após isso, no arquivo gameController.js, criaremos a constante createGame que recebe uma
função assíncrona. Nessa função será coletado os campos vindos do corpo da requisição POST,
                                                                                                                      {}
em seguida será chamado o método Create() do service para cadastrar os registros no banco.
Em seguida, o controller retornará o código de status 201 (Created). Além disso, também é feito
o tratamento de erro, retornando o código de status 500 (Erro interno do servidor).
Lembre-se também de exportar createGame no final do arquivo.


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 10 -->

Cadastrando dados na API
Agora devemos apenas criar um novo endpoint no arquivo gameRoutes.js, que receberá a requisição
POST e chamará o método createGame() do gameController para tratar a requisição:
                                                                                                                         {}
Feito isso, testaremos a requisição no Insomnia, enviando uma requisição POST para a rota “/game”.
Será necessário enviar os dados que se deseja cadastrar no corpo da requisição (BODY) em formato JSON.


                                   Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 11 -->

Deletando dados na API
Para deletar dados na API, criaremos um novo método chamado
                                                                                                                       {}
Delete() na classe gameService que irá excluir os registros no
banco de dados.


                                 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 12 -->

Deletando dados na API
Após isso, no arquivo gameController.js, criaremos a constante deleteGame que recebe uma função
assíncrona. Nessa função será verificado se o ID do jogo enviado é válido. Para isso, precisamos instalar
                                                                                                                         {}
e importar o ObjectId da biblioteca mongodb. Após essa verificação, será chamado o método Delete()
do service para excluir o registro em questão do banco de dados. Em seguida, o controller retornará o
código de status 204 (No Content). Além disso, também é feito o tratamento de erro, retornando o
código de status 400 (Bad Request) ou 500. Lembre-se também de exportar deleteGame no final.


                                   Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 13 -->

Deletando dados na API
Agora devemos apenas criar um novo endpoint no arquivo gameRoutes.js, que receberá a requisição
DELETE e chamará o método deleteGame() do gameController para tratar a requisição. Essa rota terá
                                                                                                                         {}
um parâmetro obrigatório que será a ID do jogo que se deseja excluir:


Feito isso, testaremos a requisição no Insomnia, enviando uma requisição DELETE para a rota “/game”.
Lembre-se que será necessário enviar a ID do jogo que se deseja excluir na URL:


                                   Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 14 -->

Alterando dados na API
Para começarmos a alterar dados na API, criaremos um novo
                                                                                                                       {}
método chamado Update() na classe gameService que irá
alterar registros no banco de dados.


                                 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 15 -->

Alterando dados na API
Após isso, no arquivo gameController.js, criaremos a constante updateGame que recebe uma função
assíncrona. Nessa função será coletado os campos vindos do corpo da requisição PUT, em seguida será
                                                                                                                           {}
chamado o método Update() do service para alterar o registro no banco. O controller retornará o código de
status 200 (OK) e um JSON com os dados do jogo alterado. Lembre-se também de exportar updateGame.


                                     Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 16 -->

Alterando dados na API
Agora devemos apenas criar um novo endpoint no arquivo gameRoutes.js, que receberá a requisição PUT e
chamará o método updateGame() do gameController para tratar a requisição:                                                 {}
Feito isso, testaremos a requisição no Insomnia, enviando uma requisição PUT para a rota “/game”.
Será necessário enviar os dados que se deseja alterar no corpo da requisição (BODY) em formato JSON, bem como
a ID do game na URL.


                                    Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 17 -->

Listando um registro único
Para listar um registro da API, criaremos um novo método
                                                                                                                      {}
chamado getOne() na classe gameService que irá listar um único
registro do banco de dados.


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 18 -->

Listando um registro único
Após isso, no arquivo gameController.js, criaremos a constante getOneGame que recebe uma função
assíncrona. Nessa função será verificado se o ID do jogo enviado é válido. Após essa verificação, será
chamado o método getOne() do service para buscar o registro em questão no banco de dados.
Em seguida, o controller retornará o código de status 200 (OK). E um JSON com os dados do jogo.
                                                                                                                        {}


                                  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 19 -->

Listando um registro único
Agora devemos apenas criar um novo endpoint no arquivo gameRoutes.js, que receberá a requisição
GET e chamará o método getOneGame() do gameController para tratar a requisição. Essa rota terá um
parâmetro obrigatório que será a ID do jogo que se deseja buscar:
                                                                                                                        {}
Feito isso, testaremos a requisição no Insomnia, enviando uma requisição GET para a rota “/game”.
Lembre-se que será necessário enviar a ID do jogo que se deseja buscar na URL:


                                  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 20 -->

                                                                                                     {}
      Exercício de fixação – Aula 01 e 02:

https://forms.cloud.microsoft/r/m1rrvZj2fH


               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 21 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 02:
Desenvolvendo o CRUD da API
