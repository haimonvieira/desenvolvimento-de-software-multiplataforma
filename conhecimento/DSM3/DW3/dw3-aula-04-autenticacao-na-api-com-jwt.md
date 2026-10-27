---
disciplina: DSM3/DW3
titulo: DW3 Aula 04 Autenticação na API com JWT
fonte: DSM3/DW3/DW3-Aula_04-Autenticação na API com JWT.pdf
tipo: pdf
paginas: 24
extraido_em: 2026-10-24
---

<!-- page: 1 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 04:
Autenticação na API
com JWT

<!-- page: 2 -->

JSONWeb Token
A autenticação de uma API com JSON Web Token
(JWT) é um método usado para verificar a identidade
                                                                                                               {}
de usuários e proteger o acesso a sistemas.

JWT é um padrão aberto que define uma maneira
compacta e segura de transmitir informações entre
partes como um objeto JSON.


Para instalá-lo na aplicação rode o comando:

npminstall jsonwebtoken
                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 3 -->

JSONWeb Token
Login: O cliente (usuário) envia suas credenciais (como nome de usuário e senha) para a API.

Geração do Token: Se as credenciais forem válidas, o servidor gera um token JWT assinado
                                                                                                                        {}
com uma chave secreta ou com um par de chaves (pública/privada). Esse token contém
informações do usuário, como um identificador (ID), permissões, e uma data de expiração.

Envio do Token: O token é enviado de volta ao cliente e armazenado, geralmente em um
cookie seguro ou local storage.

Uso do Token: Para cada solicitação futura à API, o cliente inclui o token no cabeçalho da
requisição (normalmente no campo Authorization com o esquema Bearer).

Validação do Token: O servidor valida o token recebido, verificando sua assinatura e outros
dados (como validade) antes de permitir o acesso aos recursos da API.


                                  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 4 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 04.1:
Cadastro de usuário e login

<!-- page: 5 -->

Criando o Model de Usuário
Criaremos o modelo que irá representar a entidade User em nosso sistema. Para isso, dentro da


                                                                                                                       {}
pasta Models, crie o arquivo User.js. Esse arquivo terá a seguinte estrutura:


import mongoose from 'mongoose'                                          1 - Importação da biblioteca Mongoose;

const userSchema = new mongoose.Schema({
    name: String,
    email: String,                                                       2 – Criação de um novo Schema*
    password: String,
})
                                                                         3 – Criação do model. Aqui informamos
                                                                         que deve ser criado uma coleção que
const User = mongoose.model("User",
                                                                         receberá o nome de users quando for para
userSchema)                                                              o banco de dados.

export default User                                                      4 - Eportação do módulo.

                                 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 6 -->

Criando o Model de Usuário
Após isso, realize a importação do model no arquivo index.js


import User from './models/Users.js'
                                                                                                                   {}
Em seguida, rode a aplicação e verifique se a coleção users foi criada no banco
de dados.


                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 7 -->

Cadastrando usuários
Crie o arquivo userService.js. Para começarmos a cadastrar usuários na API, criaremos um
método chamado Create() na classe userService que irá inserir novos usuários no banco de
dados.                                                                                                                {}


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 8 -->

Cadastrando usuários
Após isso, crie o arquivo
userController.js, nele criaremos a
constante createUser que recebe
uma função assíncrona.
                                                                                                                            {}
Nessa função será coletado os
campos vindos do corpo da
requisição POST, em seguida
será chamado o método Create()
do service para cadastrar o
usuário no banco.


Lembre-se também de exportar
createUser no final do arquivo.

                                      Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 9 -->

Cadastrando usuários
Agora devemos apenas criar um novo endpoint “/user” no arquivo userRoutes.js, que receberá a


                                                                                                                         {}
requisição POST e chamará o método createUser() do userController para tratar a requisição:


Feito isso, importe as rotas do userRoutes no arquivo principal index.js, assim como feito com
gameRoutes. Agora, testaremos a requisição no Insomnia ou Postman, enviando uma requisição POST
para a rota “/user”. Será necessário enviar os dados que se deseja cadastrar no corpo da requisição
(BODY) em formato JSON. Envie os campos “email” e “password” em um JSON. Confira se o usuário é
cadastrado.
                                   Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 10 -->

Gerando o Token de autenticação
No arquivo userService.js. Criaremos mais um método chamado getOne() na classe userService
que irá retornar os dados de um único usuário, quando for realizado o login.

                                                                                                                      {}


 Nos próximos slides terá o código do método loginUser() para ser inserido no arquivo
 userController.js. Esse método será responsável por fazer o login do usuário e devolver um
 token de autenticação JWT.
                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 11 -->


<!-- page: 12 -->


<!-- page: 13 -->

Gerando o Token de autenticação
Agora devemos apenas criar um novo endpoint “/auth”no arquivo userRoutes.js, que receberá a
requisição POST e chamará o método loginUser() do userController para tratar a requisição de login:


Agora, testaremos a requisição no Insomnia ou Postmanenviando uma requisição POST para a rota “/auth”.
Envie os campos “email” e “password” em um JSON. A API deve retornar o tokende autenticação.
                                                                                                                         {}


                                   Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 14 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 04.2:
Middleware de autenticação

<!-- page: 15 -->

Middleware de autenticação
um middleware é uma função que tem acesso ao
objeto de requisição (req), ao objeto de resposta (res), e
à próxima função de middleware no ciclo de
solicitação/resposta de uma aplicação.
                                                                                                                       {}
O middleware pode executar várias tarefas, como:

 ● Executar qualquer código.
 ● Modificar o objeto de requisição (req) ou resposta
   (res).
 ● Encerrar o ciclo de requisição/resposta, enviando
   uma resposta ao cliente.
 ● Chamar a próxima função de middleware no
   stack usando a função next(). Se o middleware
   atual não terminar o ciclo de requisição/resposta,
   ele deve invocar next() para passar o controle para
   o próximo middleware.
                                 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 16 -->

Middleware de autenticação
O primeiro passo é exportar o JWTSecret no arquivo userController.js para podermos usá-lo no
middleware de autenticação.

                                                                                                                      {}
Após isso, criaremos nosso middleware de autenticação. O middleware irá verificar se o
cliente enviou um tokenJWT (Json Web Token) no cabeçalho da requisição, sob o campo
"authorization". Se o token estiver presente e for válido, ele é decodificado, e as informações
do usuário (como ID e e-mail) são anexadas ao objeto req. Isso permite que essas informações
sejam acessadas nas próximas etapas da requisição. Caso o token seja inválido ou ausente, a
requisição é rejeitada com um status 401 (não autorizado), e uma mensagem de erro é
enviada ao cliente. Para isso, crie uma pasta com o nome middleware na raiz do projeto e em
seguida um arquivo dentro da pasta chamado Auth.js. O código deste arquivo está nos
próximos slides.
                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 17 -->


<!-- page: 18 -->

Middleware de autenticação
Após isso, devemos importar o middleware de autenticação no arquivo gameRoutes.js, e adicioná-lo
em todas as rotas, conforme mostra a imagem abaixo:


                                                                                                                     {}


                               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 19 -->

Middleware de autenticação
Por fim, realizaremos os testes no Insomnia ou Postman. No exemplo abaixo será usado o
Postman. Agora, ao tentarmos acessar a rota “/games” é necessário informar o token de
autenticação, caso contrário a API retornará o código de status 401 (Não autorizado).
                                                                                                                        {}

Agora para ter acesso a listagem de games precisamos primeiramente realizar o login
enviando email e password para a rota “/auth”.


                                  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 20 -->

Middleware de autenticação
Ao realizarmos o login, a API nos retorna o token de autenticação:

                                                                                                                    {}


                              Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 21 -->

Middleware de autenticação
Agora devemos inserir o token no cabeçalho da requisição, informando o tipo do token que é
o Bearer Token. Segue logo abaixo um exemplo de como fazer isso no Postman.
                                                                                                                     {}


                               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 22 -->

Middleware de autenticação
Selecionado o tipo do token cole no espaço indicado o token que foi retornado pela API
no momento do login:                                                                                                 {}


Após isso, tente realizar uma nova requisição para a rota “/games” para verificar se o
acesso será concedido.


                               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 23 -->

Middleware de autenticação
Com a devida autenticação, agora a API nos permite acessar o recurso normalmente e temos
acesso a lista de games. Isso serve também para as outras requisições da API.
                                                                                                                      {}


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 24 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 04:
Autenticação na API
com JWT
