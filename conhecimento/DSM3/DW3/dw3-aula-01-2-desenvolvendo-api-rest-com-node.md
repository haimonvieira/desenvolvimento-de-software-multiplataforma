---
disciplina: DSM3/DW3
titulo: DW3 Aula 01.2 Desenvolvendo API Rest com Node
fonte: DSM3/DW3/DW3-Aula_01.2-Desenvolvendo API Rest com Node.pdf
tipo: pdf
paginas: 27
extraido_em: 2026-10-24
---

<!-- page: 1 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 01.2:
Desenvolvendo uma API Rest
com Node.js

<!-- page: 2 -->

API - Application Programming Interface
                                                                                                             {}
API significa Interface de
Programação de Aplicações
(Application Programming
Interface).

É um conjunto de regras e
definições que permite que
diferentes softwares se
comuniquem entre si.

                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 3 -->

API - Application Programming Interface
Uma API é como um "conector" que deixa diferentes programas
                                                                                                            {}
conversarem entre si. Em vez de precisar entender tudo que acontece
dentro de um software, os desenvolvedores usam a API, que dá as
regras e as maneiras corretas de se comunicar com o sistema.


                      Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 4 -->

API - Application Programming Interface
                                                                                                     {}


               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 5 -->

API - Application Programming Interface
Através das APIs é possível criar aplicativos
                                                                                                                 {}
que usam funcionalidades de outros
lugares, facilitando a vida dos
programadores.

Sendo assim as APIs são muito úteis para
permitir que diferentes sistemas, mesmo
que estejam em ambientes distintos,
troquem informações e funcionem bem
juntos.


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 6 -->

APIs REST                                                                                                         {}
APIs REST são APIs web que seguem os princípios da arquitetura REST
(Transferência de Estado Representacional, que é um estilo de arquitetura de
software), utilizando HTTP para comunicação e geralmente operando com os
métodos HTTP (GET, POST, PUT, DELETE) para manipular recursos.


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 7 -->

Formato JSON
Muitas vezes, os dados retornados por uma API
estarão no formato JSON (Javascript Object
                                                                                                                   {}
Notation).

O JSON é um formato de dados leve e de fácil
leitura utilizado para troca de informações entre
sistemas computacionais. Ele é frequentemente
usado para transmitir dados entre um servidor e
um cliente em aplicações web e móveis, embora
também seja utilizado em diversos outros
contextos.

Ele é amplamente utilizado na web para
representar dados estruturados de forma legível
tanto para humanos quanto para máquinas. Em
resumo, o JSON é uma forma popular de
representar dados estruturados e transferi-los
entre diferentes sistemas.
                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 8 -->

                                                                                                 {}
     Exemplo de API pública:

https://www.freetogame.com/api/games


           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 9 -->

Métodos HTTP
GET: O método GET é usado para solicitar dados de um recurso específico. Ele é
                                                                                                                  {}
usado para recuperar informações, e não para modificá-las. Por exemplo, ao fazer
uma solicitação GET para uma URL de API de usuários, você pode obter uma lista de
todos os usuários ou os detalhes de um usuário específico.

POST: O método POST é usado para enviar dados para o servidor criar um novo
recurso. Ele é comumente usado para criar novos registros ou enviar dados que serão
processados pelo servidor. Por exemplo, ao enviar um formulário de cadastro de
usuário, você usaria o método POST para enviar os dados do novo usuário para o
servidor.


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 10 -->

Métodos HTTP
PUT: O método PUT é usado para atualizar ou substituir completamente um recurso
                                                                                                                   {}
existente. Quando você envia uma solicitação PUT, você está substituindo o recurso
inteiro com os dados que você está enviando.
Por exemplo, ao enviar uma solicitação PUT para uma URL de API de usuário com
novos dados, você está substituindo completamente os dados do usuário existente
pelos novos dados.


DELETE: O método DELETE é usado para excluir um recurso específico do servidor.
Ele é usado quando você deseja remover permanentemente um recurso. Por
exemplo, ao enviar uma solicitação DELETE para uma URL de API de usuário com o ID
do usuário que você deseja excluir, você está solicitando que o servidor remova esse
usuário do banco de dados.

                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 11 -->

Códigos de status HTTP
                                                                                                               {}
200 (OK): Indica que a requisição foi bem sucedida. É o código que o
servidor retorna quando a requisição foi processada com sucesso.


201 (Created): Indica que a requisição foi bem sucedida e resultou na
criação de um novo recurso no servidor.


204 (No Content): Indica que a requisição foi bem sucedida, mas não
há conteúdo para retornar ao cliente. É comum em respostas de requisições
que não retornam dados, como atualizações de status.


                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 12 -->

Códigos de status HTTP
                                                                                                               {}
400 (Bad Request): Indica que a requisição feita pelo cliente é
inválida, geralmente devido a dados malformados ou ausentes.


404 (Not Found): Indica que o recurso requisitado não foi
encontrado no servidor. É o código de erro padrão quando uma URL não
corresponde a nenhum recurso disponível.


500 (Internal Server Error): Isso significa que algo deu errado
no servidor enquanto tentava processar a requisição, mas o servidor não
conseguiu especificar a natureza exata do problema.

                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 13 -->

Códigos de status HTTP
                                                                                                            {}


    Mais informações: https://www.devmedia.com.br/http-status-code/41222

                      Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 14 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 01.3:
Criando a API

<!-- page: 15 -->

Criando a API
Iniciaremos agora a criação da nossa API. Após iniciar o projeto com o comando npm init,
faça as devidas configurações no arquivo package.json, conforme a seguir:
                                                                                                                      {}


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 16 -->

Criando a API
Feito isso, devemos criar o arquivo principal do projeto que recebe o nome de index.js. Nele
iremos importar e configurar o express, bem como criar a inicialização do servidor na porta
                                                                                                                             {}
4000.

                                                                                        Lembre-se que antes de fazer
                                                                                        essas configurações você já deve
                                                                                        ter instalado o express através do
                                                                                        comando npm install express.

                                                                                        Aproveite também para instalar o
                                                                                        nodemon através do comando
                                                                                        npm install nodemon.

                                                                                        Por fim, inicie o servidor com o
                                                                                        comando npm start. Agora a
                                                                                        cada nova modificação no código
                                                                                        o servidor será reiniciado
                                                                                        automaticamente.


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 17 -->

Testando a API
Agora iremos testar o retorno de
dados da API, para isso iremos criar
                                                                                                                         {}
uma rota principal e em seguida,
definiremos um array de objetos
chamado games, e incluiremos nele
alguns jogos para que sejam
retornados pela API através de um
JSON.

Para enviar as requisições para API é
possível utilizar ferramentas como o
Insomnia ou Postman. No caso do
Postman é possível instalar sua
extensão no VS Code e fazer os testes
direto do editor de código.
                                   Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 18 -->

Testando a API com Insomnia
1, 2. Dentro do Insomnia deve ser criado um novo projeto que será salvo localmente.
3. Após criar o projeto crie também uma nova coleção onde será organizado os testes das requisições.
                                                                                                                        {}
4. Dentro da coleção crie um novo teste de requisição clicando no botão de + ou pelo atalho CTRL + N.
5. Defina a requisição a como GET, coloque o endereço da API e clique em SEND.


 1                                2                                                       3


 4                                                     5

                                  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 19 -->

Testando a API com Insomnia
Ao enviar a requisição, deve ser retornado o código de status 200 (OK) informando que a requisição
foi bem sucedida bem como um JSON contendo a lista de jogos.
                                                                                                                        {}


Feito isso, o próximo passo será conectar nossa API com o banco de dados MongoDB.

                                  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 20 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 01.4:
Criando o banco de dados
da API

<!-- page: 21 -->

Iniciando com o MongoDB Compass
1. Antes de criarmos a conexão com o banco, lembre-se que o servidor do MongoDB já deve estar
instalado no sistema.
                                                                                                                      {}
Link para download do MongoDB:
https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.2-signed.msi

2. Com o MongoDB já instalado, iremos o utilizar a GUI (Graphical User Interface) MongoDB
Compass, para nos ajudar a consultar as alterações em nosso banco.
Link para download da GUI MongoDB Compass:
https://www.mongodb.com/try/download/compass

3. Após a instalação, basta abrir o MongoDB Compass e abrir um conexão:


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 22 -->

Conhecendo a biblioteca Mongoose
Mongoose é um biblioteca de
                                                                                                                      {}
Modelagem de Dados de
Objeto (ou ODM, do inglês:
Object Data Modeling) para
MongoDB e Node.js.


Ele gerencia o relacionamento
entre dados, fornece a validação
de esquemas e é usado como
tradutor entre objetos no
                                                              Mapeamento de objetos entre o Node e o MongoDB,
código e a representação desses                                           gerenciado por meio do Mongoose.

objetos no MongoDB.


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 23 -->

Instalando e importando o Mongoose
Para instalar o Mongoose no seu projeto utilize o comando: npm install mongoose
Com o Mongoose instalado no seu projeto, faremos sua importação agora no
arquivo index.js, conforme a seguir:
                                                                                                                 {}
// Importando o Mongoose
import mongoose from "mongoose"

Criando a conexão com o banco de dados
Em seguida, iremos criar a conexão com o banco de dados do MongoDB, para isso,
iremos incluir a seguinte linha no nosso arquivo index.js:

// Iniciando conexão com o banco de dados do MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/api-thegames")


     Método do mongoose           URL do banco                        Nome do
     para se conectar ao                                              banco
     banco

                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 24 -->

Criando o Model
Criaremos agora o modelo que irá representar a entidade Games em nosso sistema. Para isso,
criamos uma pasta com o nome Models na raiz do projeto e dentro da pasta o arquivo Games.js.
                                                                                                                      {}
O model terá a seguinte estrutura:

import mongoose from 'mongoose'                                             1 - Importação da biblioteca Mongoose;

const gameSchema = new mongoose.Schema({
    title: String,
    platform: String,                                                       2 – Criação de um novo Schema*
    year: Number,
    price: Number
})                                                                          3 – Criação do model. Aqui informamos
                                                                            que deve ser criado uma coleção que
const Game = mongoose.model('Game',                                         receberá o nome de games quando for
gameSchema)                                                                 para o banco de dados.

export default Game                                                         4 - Eportação do módulo.


* Um Schema define a estrutura e o conteúdo dos seus dados. Schemas são a especificação
do modelo de dados do seu aplicativo.


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 25 -->

Criando o Model                                                                                                 {}
Os seguintes tipos de dados são permitidos em um Schema:

• Array

• Boolean (ou booleano, em português)

• Date (ou formato de data, em português)

• Mixed (um tipo genérico/flexível de dados)

• Number (ou numérico, em português)

• ObjectId

• String

                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 26 -->

Criação do banco de dados
Com o model criado basta importá-lo no arquivo index.js:

import Game from "./models/Games.js"
                                                                                                                  {}
Agora, se necessário, rode o projeto
novamente com o comando npm start.
Feito isso o banco já deve ter sido criado.
Basta abrir o MongoDB Compass e conferir.

Com o banco criado aproveite para inserir o registro de 3 novos jogos manualmente
no MongoDB Compass, com os campos “tittle”, “year”, “price” e “platform”, conforme
o exemplo abaixo. De preferência, insira um registro de cada vez.


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 27 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 01.2:
Desenvolvendo uma API Rest
com Node.js
