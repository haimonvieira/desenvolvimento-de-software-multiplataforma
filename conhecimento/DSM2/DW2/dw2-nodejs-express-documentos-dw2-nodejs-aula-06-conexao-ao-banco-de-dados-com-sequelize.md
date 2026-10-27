---
disciplina: DSM2/DW2
titulo: DW2 NodeJS Aula 06 Conexão ao banco de dados com Sequelize
fonte: DSM2/DW2/dw2-nodejs-express/Documentos/DW2-NodeJS-Aula_06-Conexão ao banco de dados com Sequelize.pdf
tipo: pdf
paginas: 16
extraido_em: 2026-10-24
---

<!-- page: 1 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 06:
Conexão ao banco de
dados MySQL com
Sequelize

<!-- page: 2 -->

O que é uma ORM?
Uma ORM, ou Object-Relational
                                                                                                            {}
Mapping, é uma técnica de programação
que visa facilitar a interação entre um
SGBDR (sistema de gerenciamento de
banco de dados relacional, como MySQL,
PostgreSQL, SQLite, etc.) e um programa
orientado a objetos.

A ideia principal é mapear objetos do
código-fonte para tabelas no banco de
dados e vice-versa, eliminando a
necessidade de escrever consultas SQL
manualmente e permitindo que os
desenvolvedores usem objetos e
métodos para manipular dados.


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 3 -->

O que é uma ORM?
Uma ORM, ou Object-Relational
                                                                                                            {}
Mapping, é uma técnica de programação
que visa facilitar a interação entre um
SGBDR (sistema de gerenciamento de
banco de dados relacional, como MySQL,
PostgreSQL, SQLite, etc.) e um programa
orientado a objetos.

A ideia principal é mapear objetos do
código-fonte para tabelas no banco de
dados e vice-versa, eliminando a
necessidade de escrever consultas SQL
manualmente e permitindo que os
desenvolvedores usem objetos e
métodos para manipular dados.


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 4 -->

O que é uma ORM?
As ORMs desempenham um papel crucial em ambientes onde o código
                                                                                                            {}
é predominantemente orientado a objetos, como em muitas linguagens
de programação modernas.
Elas ajudam a abstrair a complexidade das operações de banco de dados,
proporcionando uma interface mais intuitiva e facilitando a manutenção
do código.


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 5 -->

                                                                                           {}
     Query SQL
SELECT * FROM clientes


Método da ORM (Sequelize)
    Cliente.findAll()

      Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 6 -->

ORM Sequelize                                                                                                {}
O Sequelize é uma ORM para Node.js que
suporta vários bancos de dados relacionais,
incluindo MySQL, PostgreSQL, SQLite, etc.

O Sequelize facilita a interação entre SGBDR
e código JavaScript, permitindo que os
desenvolvedores usem objetos e métodos
para manipular dados em vez de escrever
consultas SQL manualmente.

Para instalar o Sequelize no seu projeto
Node, basta rodar o comando:

npm install sequelize


                        Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 7 -->

MySQL2                                                                                                        {}
O mysql2 é um driver MySQL para Node.js.
Em termos simples, é uma biblioteca que
permite que você se conecte a um banco de
dados MySQL a partir do ambiente Node.js e
execute consultas SQL de forma
programática.


Para instalar o MySQL2 no seu projeto Node,
basta rodar o comando:

npm install mysql2
                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 8 -->

Instalando e configurando o Sequelize

Para instalar o Sequelize no seu projeto utilize o comando: npm install
                                                                                                             {}
sequelize


Após isso, com o Sequelize instalado no seu projeto, criaremos uma nova
pasta com o nome “config” dentro da pasta do seu projeto. Dentro desta
pasta criaremos o arquivo de configuração do Sequelize, com o nome
“sequelize-config.js”


                        Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 9 -->

Configurando o Sequelize
No arquivo “sequelize-config.js”, faremos a importação do Sequelize e
                                                                                                            {}
em seguida iremos inserir as configurações de conexão com o banco de
dados, como endereço do banco, usuário, senha, nome do banco, etc.

// Importando o Sequelize
import Sequelize from "sequelize"
// Criando os dados de conexão com o banco de dados
const connection = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'admin',
    // Comente essa linha na primeira execução da aplicação
    // database: 'loja',
    timezone: "-03:00"
})
export default connection


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 10 -->

Criando a conexão com o banco de dados
Com o arquivo de configuração criado, no arquivo “index.js” iremos começar a criar as linhas
                                                                                                                    {}
responsáveis pela conexão da aplicação com o banco. O primeiro passo é importar o arquivo
de configuração do Sequelize:

// Importando o Sequelize
import connection from "./config/sequelize-config.js"

Após isso, criaremos a conexão com o banco de dados:

// Realizando a conexão com o banco de dados
connection.authenticate().then(()=> {
    console.log("Conexão com o banco de dados feita com sucesso!")
}).catch((error) => {
    console.log(error)
})


                               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 11 -->

Criando o banco de dados
Logo abaixo das linhas que criam a conexão com o banco, iremos inserir as linhas responsáveis
                                                                                                                    {}
por criar o banco de dados caso ele ainda não exista.

// Criando o banco de dados se ele não existir
connection.query(`CREATE DATABASE IF NOT EXISTS
loja;`).then(() => {
    console.log("O banco de dados está criado.")
}).catch((error) => {
    console.log(error)
})

Feito isso, ao rodarmos nossa aplicação, já podemos conferir se o banco de dados foi
devidamente criado.


                               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 12 -->

Configurando o Sequelize
Agora que o banco de dados já foi criado, devemos voltar ao arquivo “sequelize-
                                                                                                               {}
config.js” e retirar o comentário da linha “database” que indica qual banco será
usado pela aplicação. Iniciamos com essa linha comentado anteriormente pois o
banco ainda não existia e retornaria um erro.

 // Importando o Sequelize
 import Sequelize from "sequelize"
 // Criando os dados de conexão com o banco de dados
 const connection = new Sequelize({
     dialect: 'mysql',
     host: 'localhost',
     username: 'root',
     password: 'admin',
     // Comente essa linha na primeira execução da aplicação
     database: 'loja',
     timezone: "-03:00"
 })
 export default connection


                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 13 -->

Editando o Model
Agora em nosso arquivo de model Cliente.js, incluiremos o seguinte código:
                                                                                                                    {}
import Sequelize from "sequelize"                                           1 - Importação do Sequelize e seu
import connection from "../config/sequelize-                                arquivo de configuração.
config.js"
const Cliente = connection.define('clientes',
{
    nome:{                                                                  2 – Criação de uma nova entidade no
        type: Sequelize.STRING,                                             banco com o nome “clientes” que
        allowNull: false                                                    será armazenado na variável Cliente,
    },                                                                      contendo os campos nome, cpf e
    cpf:{
        type: Sequelize.STRING,                                             endereço, todos do tipo String.
        allowNull: false
    },
    endereco:{                                                              3 – Linha que cria a entidade no
        type: Sequelize.STRING,                                             banco, com a opção “force” definida
        allowNull: false                                                    com o valor “false” ou seja, caso a
    }
})                                                                          tabela já exista não será criada
                                                                            novamente.
Cliente.sync({force: false})
export default Cliente                                                      4 - Eportação do módulo.
                               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 14 -->

Editando o Model                                                                                                    {}
Aqui estão alguns dos tipos de dados comuns suportados pelo Sequelize:

STRING: Uma string de caracteres variáveis.
CHAR: Uma string de caracteres fixos.
TEXT: Uma string de texto longo.
INTEGER: Um número inteiro.
FLOAT: Um número decimal de precisão simples.
DOUBLE: Um número decimal de precisão dupla.
BOOLEAN: Um valor booleano (true/false).
DATE: Uma data.
TIME: Um valor de tempo.
ARRAY: Uma matriz de valores de qualquer tipo de dados suportado pelo Sequelize.
JSON: Um tipo de dados JSON.

                               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 15 -->

Inserindo registros
Com o nosso arquivo de model pronto, basta o importarmos no arquivo
                                                                                                                 {}
ClienteControllers.js:

// Importando os Models
import Cliente from "./models/Cliente.js"

Agora ao rodar aplicação a tabela “clientes” já deve estar criada em nosso banco de
dados:


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 16 -->

Criando uma tabela no banco
Note que todos os campos que definimos no arquivo de model, foram criados na
                                                                                                                {}
tabela. Além deles, foram criados também os campos “createdAt” e “updatedAt”
que já são campos criados pelo próprio Sequelize:


Para testarmos a busca de dados no banco, iremos inserir alguns registros de
forma manual, para que quando acessarmos a rota de clientes alguns registros
sejam mostrados.


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max
