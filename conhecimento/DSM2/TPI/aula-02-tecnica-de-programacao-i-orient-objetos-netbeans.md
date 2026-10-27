---
disciplina: DSM2/TPI
titulo: aula 02  Técnica de Programação I   Orient.Objetos Netbeans
fonte: DSM2/TPI/aula 02- Técnica de Programação I - Orient.Objetos Netbeans.pdf
tipo: pdf
paginas: 48
extraido_em: 2026-10-24
---

<!-- page: 1 -->

               Aula 01
Técnica de Programação
     Profº Luiz Cláudio

<!-- page: 2 -->

• É uma técnica de desenvolvimento de softwares que
consiste em representar os elementos do mundo real
(que pertencem ao escopo da aplicação) dentro do
software.

• Em tese, é uma forma mais natural de informatização,
já que leva em consideração os elementos como eles
realmente existem.

<!-- page: 3 -->

•Vale ressaltar que a orientação a objetos
não é exclusividade da linguagem Java.
Outras linguagem C#, VB.net, PHP , Python
entre outras, fazem uso de tais recursos.

<!-- page: 4 -->

Os carros apresentarem diferentes formatos, cores e
estilos.
Cada objeto-carro tem característica semelhantes entre
si, por exemplo todos tem quatro rodas, e no mínimo,
duas portas, além de luzes de farol e de freio, bem como
vidros frontais e laterais, porém cada carro possui sua
característica própria.
No momento compreendemos este conceito,
percebemos que “fusca” e a denominação de um grupo,
ou seja, é a abstração de uma classe: a classe carro.

<!-- page: 5 -->


<!-- page: 6 -->


<!-- page: 7 -->

•Na verdade, na linguagem Java, tudo esta
 definido em classes.
•A estrutura da própria linguagem é organizada
 em classes.
•Representações básicas de classes em
 orientação a objetos:
 • A classe de modelagem (ou definição de tipo).
 • A classe que contém a inicialização da aplicação.

<!-- page: 8 -->

Ideias básicas da OO

  Na POO o programador é responsável por
  moldar o mundo dos objetos, e explicar para
  estes objetos como eles devem interagir entre
  si.

<!-- page: 9 -->

 Uma classe funciona como uma “receita” para criar objetos.
 Inclusive, vários objetos podem ser criados a partir de uma única
 classe. Assim como várias casas ou prédios poderiam ser
 construídos a partir de uma única planta; ou vários bolos poderiam
 ser preparados a partir de uma única receita; ou vários carros
 poderiam ser construídos a partir de um único projeto.


Casas construídas a partir da mesma planta
podem possuir características diferentes. Por
exemplo, a cor das paredes.

<!-- page: 10 -->

Classe   Atributo

         Método

<!-- page: 11 -->

Atributo
   É um dado para o qual cada objeto tem seu
   próprio valor.
   Definem características de objetos.

Exemplo de atributos:

Marca
Velocidade
Cor
Portas

<!-- page: 12 -->

Método
  Definem as habilidades dos objetos.
  Ações que os objetos podem executar.
  Métodos são declarados dentro de uma classe para
  representar as operações que os objetos pertencentes a esta
  classe podem executar, ou seja, as ações que objeto pode
  fazer , um automóvel pode ter seus atributos cadastrado, os
  dados podem ser mostrados, alterados, podemos aumentar a
  velocidade.

<!-- page: 13 -->

Uma aplicação orientada a objetos é composta por objetos.
 É uma Instância(criação) de uma classe
   Podemos definir os objetos como sendo os objetos físicos do
   mundo real (carro, avião, cachorro, casa, telefone,
   computador).


Por exemplo, quando um cliente requisita um saque através de
um caixa eletrônico do banco, o objeto que representa o caixa
eletrônico deve interagir com o objeto que representa a conta do
cliente.

<!-- page: 14 -->

Um objeto é como se fosse uma casa ou um prédio. Para ser construído, precisa
de um espaço físico. Esse espaço físico é algum trecho vago da memória do
computador que executa a aplicação. No caso das casas e dos prédios, o espaço
físico é algum terreno vazio.
Um prédio é construído a partir de uma planta criada por um engenheiro ou
arquiteto. Para criar um objeto, é necessário algo semelhante a uma planta
para que sejam “desenhados” os atributos e métodos que o objeto deve ter. Em
orientação a objetos, a “planta” de um objeto é o que chamamos de classe.

<!-- page: 15 -->

Classes
A classe Conta poderia ser escrita utilizando a linguagem Java. A
classe Conta é declarada utilizando a palavra reservada class.


                            classe


                                               atributos

<!-- page: 16 -->

                                  Parâmetros: São
 Assinatura de método            valores(como variáveis)
  ◦ Formado por:                  atribuídos
    nome do método.              aos métodos para alterar o
    argumentos (parâmetros)      seu comportamento em
    tipo de resposta (retorno)   tempo de execução.

public String calculaSalario(int valor)

             Retorno       Nome        Parâmetro entrada

<!-- page: 17 -->

 Assinatura de método sem parâmetros e sem retorno
  ◦ Formado por:
    nome do método.
    argumentos (parâmetros)
    tipo de resposta (retorno)

public void calculaSalario()


       Retorno vazio       Nome   Sem parâmetros

<!-- page: 18 -->

•A partir do momento em que os elementos
básicos da orientação a objetos são assimilados,
podemos modelar classes nas especificações
corretas utilizando a principal ferramenta de
modelagem e documentação de aplicações
orientadas a objeto existente no mercado:

•A UML (Unified Modeling Language ou
Linguagem unificada de modelagem).

<!-- page: 19 -->

• Nome da classe
  • Usuario
• Atributos
  • nome, email, login e senha
• Métodos
  • Mensagem

                                 +Mensagem(): void

<!-- page: 20 -->

               Carro
- marca : String
- velocidade : double
- cor : String
- porta: int

+cadastrarDadosCarro(): void
+mostrarDadosCarro(): void
+alterarDadosCarro()
+aumentarVelocidade(int v):void

<!-- page: 21 -->


<!-- page: 22 -->

•Modificadores de acesso
•Private
 • Só fica visível dentro da classe em que foi
  implementado
•Public
 • Fica visível em toda a aplicação
•Protected
 • Fica visível na classe em que foi implementado e
  em suas sub-classe

<!-- page: 23 -->

•Consiste na proteção dos atributos de uma
classe (e posteriormente dos objetos) de
acessos externos.

•Considerando que todas as regras referentes a
classe estão contidas na própria classe (e nunca
em outra parte da aplicação)

<!-- page: 24 -->

•Métodos getters e setters.
•Cada atributo tem seus próprios
métodos públicos getter e setter.
• Getter: Lê o conteúdo de um atributo e retorna
  seu valor.
• Setter: Recebe um valor por parâmetro e altera
  (escreve) tal valor no referente atributo.

<!-- page: 25 -->

                 Objeto usuario1


Lê e retorna o
                                   Recebe e escreve
conteúdo dos
                                    conteúdos nos
  atributos
                                      atributos


                    Mensagem

<!-- page: 26 -->

                    Codificação da classe Usuario
        Atributos


     Construtores


Getters e Setters
Encapsulamento

<!-- page: 27 -->

• A classe principal será usada somente para
conter o método main

<!-- page: 28 -->

                      Usuario
- nome : String
- email : String
- login: String
- senha : String

+getNome(): String               Principal
+setNome(nome: String): void     + main(args{}: String): void
+getEmail(): String
+setEmail(email: String): void

+getLogin(): String

+setLogin(nome: String): void

+getSenha(): String

+setSenha(senha: String): void

+Mensagem(): void

<!-- page: 29 -->


<!-- page: 30 -->


<!-- page: 31 -->

Codificação da classe Usuario


                                Codificação da classe Principal

<!-- page: 32 -->

•Classe de modelagem (Definição de tipo)
 •Atributo
 •Contrutores
 •Getters e setters
 •Métodos especificos da classe
•Classe Principal
 •Método main()

<!-- page: 33 -->

•Passo a passo para a criação da aplicação
 exemplo utilizando o Netbeans
•Definição do workspace
 • Antes mesmo de começar devemos definir nossa
   área de trabalho onde salvará os arquivos gerados.
 • Crie uma pasta com qualquer nome e em qualquer
   unidade de disco e considere-a como sua workspace.

<!-- page: 34 -->

Clique em File New Project...
                                Selecione Java with Maven-> Java
                                           Application

<!-- page: 35 -->

Defina o Nome do Projeto e Project Location , defina o caminho onde será
           armazenado o projeto, em seguida clique em finish

<!-- page: 36 -->

Para Criar uma nova classe, clique
 com o botão direito no nome do        Defina um classe com nome
   projeto , New-> Java Class...     Usuario, em package selecione o
                                     pacote padrão do projeto, depois
                                            clique em Finalizar

<!-- page: 37 -->

Construtores gerados


                         Criar os
                       atributos na
                          classe

<!-- page: 38 -->

                                          Encapsulamento/getters e
Geração de getters e setters              setters gerados

Clique com o botão direito abaixo dos
atributos em insert code.. -> -Getter e
                Setter

<!-- page: 39 -->

Implementar o método Mensagem,
 abaixo dos atributos encapsulado

<!-- page: 40 -->

Renomei a Classe Principal que foi criado pelo Projeto , para o nome
                          classe Principal

<!-- page: 41 -->

                                      Criamos objeto usuario1 , que possui
                                         todos os métodos definidos na
                                         classe Usuario , este é objeto é
                                         instanciado dentro do método
                                                 Principal(main)


  Para chamar um método de uma
classe , colocamos o nome do objeto
    , seguido do nome do método

       Usuario1.Mensagem

<!-- page: 42 -->

  Clicar com o botão direito do
 mouse sobre a classe Principal ,
que contém o método main, clique
em Run File, ou Pressione shift+ F6

<!-- page: 43 -->

         O painel console simula um prompt em ambiente texto


Enfim, a emocionante manifestação de vida do objeto usuario1

<!-- page: 44 -->

Vamos acrescentar na classe Principal, armazenando valores nos atributos da
classe Usuário, para guardar valores nos atributos , utilizamos a função set.

         Classe Principal: Armazenando dados nos atributos, para
                           enviar a classe Usuário

<!-- page: 45 -->

Inserindo o conteúdo dos atributos na classe Usuario,
dentro do método Mensagem, para resgatar os valores dos
atributos utilizamos a função get
          Classe Usuario: Alterar o método Mensagem

<!-- page: 46 -->

Clique na classe Principal e Pressione shift+ F6 e veja o
                       resultado:

<!-- page: 47 -->

Para ler valores e passar para a classe Usuario:
Vamos acrescentar na classe Principal, armazenando valores nos atributos da classe Usuário,
para guardar valores nos atributos , utilizamos a função set. Porém agora vamos fazer a leitura
dos dados, utilizando a biblioteca Scanner.

<!-- page: 48 -->

Contatos
- Nome : String
- Telefone : String
- Endereco: String
- Cidade : string
                          Principal
                          + main(args{}: String): void


+ cadastrarDados:void()

+ mostrarDados:void()
