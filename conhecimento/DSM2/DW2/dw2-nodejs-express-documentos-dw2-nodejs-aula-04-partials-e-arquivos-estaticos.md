---
disciplina: DSM2/DW2
titulo: DW2 NodeJS Aula 04 Partials e Arquivos estáticos
fonte: DSM2/DW2/dw2-nodejs-express/Documentos/DW2-NodeJS-Aula_04-Partials e Arquivos estáticos.pdf
tipo: pdf
paginas: 7
extraido_em: 2026-10-24
---

<!-- page: 1 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 04:
Partials e Arquivos
estáticos no Node.js

<!-- page: 2 -->

Reutilizando arquivos com Partials
As parciais (ou partials) são arquivos EJS normais que outras páginas podem
                                                                                                                {}
chamar. As partials são um conceito de modelagem amplamente utilizado.

Para construir modelos que, provavelmente, serão reutilizados, você pode isolá-
los em seus próprios arquivos (as parciais) e usá-los em vários modelos. Você pode
considerá-lo como sendo uma técnica simples para modularizar seus modelos.


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 3 -->

Reutilizando arquivos com Partials
                                                                                                                 {}
1 - O primeiro passo para começar a utilizar as
partials, é criar uma pasta com o nome
“partials” dentro da sua pasta “views”.


2 – Dentro da pasta partials, crie os arquivos
que serão reaproveitados em outras páginas,
como cabeçalho (header), rodapé (footer),
menus (navbar), etc.


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 4 -->

Reutilizando arquivos com Partials
3 – Após criar o conteúdo desses arquivos, eles já podem ser importados em
                                                                                                                    {}
outras páginas. Para isso basta incluir nas páginas que irão receber os partials o
seguinte: <%- inclue partials(‘partials/nome-do-arquivo.ejs’) %>


Lembre-se: As partials seguem o fluxo normal do código e serão exibidas exatamente na
posição que forem importadas. Por exemplo, para incluir o rodapé, a partial deve ser
inserida no final do arquivo EJS.

                               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 5 -->

Arquivos estáticos (pasta public)
Para entregar arquivos estáticos no Express como imagens, arquivos CSS, e arquivos
                                                                                                                    {}
JavaScript, devemos usar a função express.static integrada no Express.
No seu arquivo index.js basta incluir a linha:


Assim estamos definindo que nossos
arquivos estáticos estarão armazenados
na pasta com o nome public.


Dentro dessa pasta podemos incluir
nossas pastas de CSS, JS, images, etc.


                               Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 6 -->

Arquivos estáticos (pasta public)
Feito isso, agora podemos, por exemplo, importar o nosso CSS em nossa partial header.ejs,
                                                                                                                  {}
que conterá as linhas de código do nosso cabeçalho. Assim, toda página que receber a
partial header.ejs automaticamente também já estará recebendo o nosso arquivo CSS.


Note que no código de importação do CSS, não precisamos incluir a pasta public no
caminho, pois o Express saberá automaticamente que nossos arquivos estáticos estarão lá.


                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 7 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 04:
Partials e Arquivos
estáticos no Node.js
