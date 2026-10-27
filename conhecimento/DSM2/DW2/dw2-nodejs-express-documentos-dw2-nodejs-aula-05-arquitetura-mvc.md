---
disciplina: DSM2/DW2
titulo: DW2 NodeJS Aula 05 Arquitetura MVC
fonte: DSM2/DW2/dw2-nodejs-express/Documentos/DW2-NodeJS-Aula_05-Arquitetura MVC.pdf
tipo: pdf
paginas: 10
extraido_em: 2026-10-24
---

<!-- page: 1 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 05:
Arquitetura MVC

<!-- page: 2 -->

Arquitetura MVC
A arquitetura MVC é nada mais que um
                                                                                                                           {}
padrão de arquitetura de software,
separando sua aplicação em 3
camadas.

A camada de interação do usuário
(view), a camada de manipulação dos
dados (model) e a camada de controle
(controller).

O Controller, por exemplo, é
responsável por receber todas as
requisições do usuário.

Seus métodos chamados actions são
responsáveis por uma página,                              A imagem representa o fluxo do MVC em um contexto de Internet,
controlando qual model usar e qual                        com uma requisição HTTP e resposta em formato HTML.

view será mostrado ao usuário.


                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 3 -->

Arquitetura MVC
Resumindo a arquitetura MVC temos:
                                                                                                              {}
Models: responsável pela manipulação dos dados;
Views: responsável pela interação com o usuário;
Controllers: camadas de controle.


                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 4 -->

Arquitetura MVC
Aqui temos um exemplo real da arquitetura MVC sendo aplicada em um projeto.
Temos uma pasta “views” onde estão armazenadas as páginas que o usuário terá
                                                                                                                 {}
contato. A pasta “models” onde estarão as regras de negócio e os códigos
responsáveis pela manipulação de dados. E a pasta “controllers” onde estarão os
arquivos de controle responsáveis por tratar as requisições dos usuários.

                                                                                 Models
                  Views


                                                                            Controllers


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 5 -->

Arquitetura MVC
Neste exemplo, no arquivo “PedidosControllers.js” incluímos os códigos com as rotas
                                                                                                                 {}
referentes a entidade “Pedido”. Note também que foi necessário importar o
“express.Router()”, responsável por gerenciar as rotas e também realizar sua
exportação.


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 6 -->

Arquitetura MVC
Feito isso, importamos todos os controllers no arquivo principal “index.js”.
                                                                                                                  {}

Ainda no arquivo “index.js”, definimos o uso das rotas que estão nos Controllers:


Assim, as rotas que antes estavam no arquivo “index.js” agora se localizam
devidamente organizadas em seus arquivos de controllers.

                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 7 -->

Common JS x ES6 Modules                                                                                       {}
A partir de agora para trabalharmos com módulos utilizaremos o modo de
importação do EcmaScript 6 (ES6). Ele difere do modo de importação de
módulos do CommonJS que é nativo do Node. Veja a diferença:


Common JS :


ES6 Modules:


                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 8 -->

Common JS x ES6 Modules                                                                                  {}
Há mudanças também na forma de exportar módulos.
Veja a diferença:

Common JS :


ES6 Modules:


                    Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 9 -->

ES6 Modules                                                                                                    {}
Para que a mudança funcione, precisamos informar no arquivo package.json do
projeto que estaremos utilizando os módulos do ES6, conforme a seguir:


                                                                       Incluir essa linha no arquivo
                                                                       package.json do projeto:


                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 10 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 05:
Arquitetura MVC
