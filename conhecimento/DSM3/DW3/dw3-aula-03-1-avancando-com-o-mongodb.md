---
disciplina: DSM3/DW3
titulo: DW3 Aula 03.1 Avançando com o MongoDB
fonte: DSM3/DW3/DW3-Aula_03.1-Avançando com o MongoDB.pdf
tipo: pdf
paginas: 22
extraido_em: 2026-10-24
---

<!-- page: 1 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 03:
                                                                              {}
Avançando com o MongoDB

<!-- page: 2 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 03.1:
                                                                              {}
Documentos aninhados no
MongoDB

<!-- page: 3 -->

Documentos aninhados no MongoDB
Documentos aninhados no
                                                                                                              {}
MongoDB são estruturas de dados
em que documentos (pares
chave-valor) são embutidos dentro
de outros documentos.

Essa abordagem permite armazenar
dados hierárquicos e complexos em
um único documento, seguindo o
modelo de documento ﬂexível do
MongoDB.

                        Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 4 -->

Documentos aninhados com Mongoose
                                                                                                             {}
Em nossa API de games iremos criar
um documento aninhado para
conter as descrições de cada jogo.


O atributo de descrição pode ter
outros dados subsequentes como:
gênero, plataforma e classiﬁcação.


Para reﬂetir essas mudanças no
banco de dados devemos realizar
alterações no model Game.js.


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 5 -->

Documentos aninhados com Mongoose
                                                                                                      {}
       Antes:                                                                      Depois:


                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 6 -->

Documentos aninhados no MongoDB
Agora podemos enviar uma nova
                                                                                                             {}
requisição para ser cadastrado um
jogo seguindo a nova estrutura de
documento aninhado.


O campo “descriptions” agora
aceita um array de objetos.


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 7 -->

Documentos aninhados no MongoDB
Cada objeto dentro de descriptions será um novo documento com sua
                                                                                                            {}
própria ObjectId. No banco de dados teremos o seguinte resultado:


                      Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 8 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 03.2:
                                                                              {}
Conectando ao
MongoDB Atlas

<!-- page: 9 -->

Hospedando o banco no MongoDB Atlas
O MongoDB Atlas é um serviço de banco de dados na nuvem gerenciado
                                                                                                              {}
pela própria MongoDB. Ele permite criar, gerenciar e escalar bancos de
dados MongoDB em diferentes provedores de nuvem como AWS, Google
Cloud e Azure. MongoDB Atlas é ideal para empresas que querem usar
MongoDB sem a complexidade de gerenciar a infraestrutura.


                        Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 10 -->

Principais benefícios do MongoDB Atlas                                                                         {}
Gerenciamento automatizado: Atlas cuida de tarefas como backups,
atualizações e monitoramento.

Escalabilidade: Fácil de escalar conforme a demanda, tanto em
armazenamento quanto em processamento.

Segurança: Oferece recursos de segurança integrados, como criptograﬁa
de dados e autenticação robusta.

Alta disponibilidade: Réplicas automáticas e recuperação de desastres
garantem que os dados estejam sempre disponíveis.

Fácil integração: Funciona bem com diversas ferramentas e APIs.

                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 11 -->

Criando uma conta no MongoDB Atlas
Para criar sua conta no MongoDB Atlas pode ser usado uma conta Google.
                                                                                                              {}
Para isso acesse o link: https://www.mongodb.com/cloud/atlas/register e
realize seu cadastro.


                        Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 12 -->

Criando uma conta no MongoDB Atlas

Após a criação da conta,
                                                                                                                      {}
algumas informações
adicionais serão solicitadas.


Caso não saiba responder,
marque opções como:

“Not sure / None” e ﬁnalize o
cadastro clicando em Finish.


                                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 13 -->

Conﬁgurando os dados de conexão
Na tela seguinte “Connect
to Cluster” será informado
                                                                                                                   {}
o seu usuário e senha para
conexão com o banco
anote esses dados.


Em seguida, clique em
Create Database User.


                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 14 -->

Conﬁgurando os dados de conexão
Após isso, ainda na mesma tela, clique                     1
                                                                                                                   {}
em Network Access, aqui devemos
incluir o IP 0.0.0.0/0 para permitir que
qualquer    endereço    de   IP       tenha
permissão para se conectar com o
banco.


2                                             3


                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 15 -->

Conﬁgurando os dados de conexão
Após isso, volte a tela “Connect to
                                                            1
                                                                                                                 {}
Cluster” e clique na opção “Choose a
connection method”.
Aqui será deﬁnido a forma que a
aplicação se conectará com o banco.
Escolha a opção Drivers e em seguida
a opção Node.js.


 2                                            3


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 16 -->

Conﬁgurando os dados de conexão
Em seguida, vá para o projeto da API e
                                                            1
                                                                                                                 {}
instale o pacote do mongodb, rodando o
comando npm install mongodb


Feito isso, volte para o site do MongoDB Atlas e copie sua string de conexão em
um bloco de notas. Posteriormente, incluiremos essa linha de conexão na API para
que ela consiga se conectar com o banco de dados

2


Por ﬁm, termine a conﬁguração               3
clicando no botão Done.


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 17 -->

Acessando o banco e as coleções
Com tudo conﬁgurado, vamos acessar a seção para                                              1
                                                                                                                  {}
visualizar os bancos e as coleções que serão
hospedadas em seu Cluster.

Para isso, procure pela opção Clusters, localizada do
lado esquerdo superior do site.


Em seguida, clique na opção Browse Collections.


 2


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 18 -->

Acessando o banco e as coleções
Feito isso, você será redirecionado para a seção onde será possível visualizar e
manipular todos os bancos e coleções do seu Cluster. Agora, devemos alterar o
                                                                                                                 {}
projeto da API para que seja possível realizar a conexão com o MongoDB Atlas.


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 19 -->

Conﬁgurando a conexão na API
Para conﬁgurar a conexão na API crie uma pasta com o nome conﬁg e dentro dela um
arquivo chamado “db-connection.js”. Dentro desse arquivo inclua o seguinte código:
                                                                                                                  {}
                                    Cole aqui sua string de conexão


                                                                               Inclua aqui o nome do banco.


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 20 -->

Conﬁgurando a conexão na API
Após isso, devemos ir até o arquivo principal index.js e importar o arquivo
db-connection.js. Devemos também comentar a antiga string de conexão:
                                                                                                                  {}

Por ﬁm, rode a aplicação e aguarde pela
mensagem de conexão bem sucedida no console:


Vá até o MongoDB Atlas e conﬁra se o banco foi
criado no seu Cluster conforme a imagem ao lado.

                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 21 -->

Finalizando
Para ﬁnalizar, realize o cadastro de um novo jogo pelo Insomnia e veriﬁque se o cadastro
é inserido no banco do MongoDB Atlas. Em caso positivo a conﬁguração foi feita com
                                                                                                                    {}
sucesso e o projeto está pronto para utilizar o banco hospedado no MongoDB Atlas.


                              Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max

<!-- page: 22 -->

  Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web III – Prof. Diego Max


Aula 03:
                                                                              {}
Avançando com o MongoDB
