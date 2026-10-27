---
disciplina: DSM2/TPI
titulo: aula 08.1  Técnica de Programação I  Exemplo Passa Dados Controller HTML
fonte: DSM2/TPI/aula 08.1- Técnica de Programação I- Exemplo Passa Dados Controller HTML.pdf
tipo: pdf
paginas: 18
extraido_em: 2026-10-24
---

<!-- page: 1 -->

Técnica de Programação I
       Profº Luiz Cláudio

<!-- page: 2 -->


<!-- page: 3 -->

SEGUNDO PROJETO COM SPRING BOOT

Entre no site https://start.spring.io/, para criar o projeto spring boot.Depois de adicionar as
dependências(web,dev,thyme) , clique em generate , para criar e baixar seu projeto

<!-- page: 4 -->

 SEGUNDO PROJETO COM SPRING BOOT
Digite nas dependências web e selecione Spring Web, para rodar o projeto na web , em seguida digite dev , e selecione o
spring boot devtools , para que o projeto atualize automaticamente, digite thyme, para adicionar o thymeleaf e ter acesso e
carregar a página na web.

<!-- page: 5 -->

SEGUNDO PROJETO COM SPRING BOOT

Descompacte a pasta zipada , e cole dentro da pasta aonde ficarão seus projeto ,
abra o IntelliJ IDEA , abra o seu projeto dentro do Inttelij


Ao abrir o projeto, navegando na pasta
src->main->java , irá aparecer o nome do
pacote do projeto e o arquivo principal
do projeto , onde está o método main ,
como se fosse a classe Principal

<!-- page: 6 -->

SEGUNDO PROJETO COM SPRING BOOT

Para iniciarmos , vamos criar um pacote controller , pressione o botão direito , sobre o nome do pacote do
projeto , selecione New->Package e digite controller

<!-- page: 7 -->

SEGUNDO PROJETO COM SPRING BOOT

Depois crie uma classe dentro do controller , mesmo processo pressione botão direito , no botão controller ,
New->Java Class , coloque o nome da classe, com as Iniciais em Maiúsculo , IndexController.

<!-- page: 8 -->

SEGUNDO PROJETO COM SPRING BOOT

Para adicionar o maven no projeto , clique com botão direito no arquivo pom.xml , Maven->Sync Project

<!-- page: 9 -->

SEGUNDO PROJETO COM SPRING BOOT

Defina a anotação @Controller, , clique em cima de @Controler e pressione ALT+ENTER , para definir que a
classe será do tipo Controller e será criada automaticamente, e também automaticamente a importação será
definida

<!-- page: 10 -->

SEGUNDO PROJETO COM SPRING BOOT

Crie um método index que terá com uma retorno uma String, na qual irá retornar uma View que iremos
construir, e coloque uma anotação GetMapping , para passar os dados a página HTML.

                                                       O @GetMapping é o que chamamos de "anotação composta". Ele já vem
                                                       pré-configurado para aceitar apenas requisições do tipo GET. (“/”) ->
                                                       indica a raiz do html o index


                                                                           O Model transporta os
                                                                           dados do seu código
                                                                           Java (o Controller) para
                                                                           a sua página HTML (a
                                                                           View).


                           O método addAttribute ,
                           passa o nome do
                           atributo e o valor , para       No padrão MVC (Model-View-Controller), Model é letra M. Sem o Model, o
                           o html                          seu Java e o seu HTML , não conseguem trocar informações.

<!-- page: 11 -->

SEGUNDO PROJETO COM SPRING BOOT

No diretório resources, clique com botão direito em templates , selecione New->HTML File , crie um arquivo
index.html

<!-- page: 12 -->

SEGUNDO PROJETO COM SPRING BOOT

No arquivo index.html , crie dentro do body , um texto do tipo h1 , os atributos com $mesagem e $ano
recebem os valores do Controller, faça o style do jeito que você preferir
                                                                    O thymeleaf deve ser
                                                                    declarado aqui para que
                                                                    os dados sejam
                                                                    recebidos do Controller

<!-- page: 13 -->

SEGUNDO PROJETO COM SPRING BOOT

Para executar. Volte na classe Principal , clique no botão Run -> Run Aula01.....

<!-- page: 14 -->

SEGUNDO PROJETO COM SPRING BOOT

Para executar via terminal , clique em View->ToolWindows->Terminal


                                                  Digite no terminal o comando:
                                                  mvn spring-boot:run

<!-- page: 15 -->

SEGUNDO PROJETO COM SPRING BOOT

Depois de executar , vá até o navegador e digite: http://localhost:8080/ ,
para acessar o servidor e executar a página index.html

<!-- page: 16 -->


<!-- page: 17 -->

Exercício 1: Mostrar dados do Funcionário


1.No seu Controller, crie um @GetMapping("/perfil").
2.Adicione ao model os atributos: "nome", "cargo" e "experiencia"
3.Crie um arquivo perfil.html.
4.No HTML, exiba:
“Nome Funcionário é [nome], Cargo: [cargo] , Experiência: [experiencia] anos de experiência."

<!-- page: 18 -->

Exercício 2: Mostrar dados Curso

1.No Controller: Crie um @GetMapping("/curso").
2. No Model: Adicione:
• titulo
• professor
• cargaHoraria

3. Crie um arquivo curso.html:
4. No HTML, exiba:
“Título do Curso : [titulo], Professor: [professor] , Carga Horária: [cargaHoraria] “
