---
disciplina: DSM2/TPI
titulo: aula 12  Técnica de Programação I   Revisão
fonte: DSM2/TPI/Spring/aula 12- Técnica de Programação I - Revisão.pdf
tipo: pdf
paginas: 44
extraido_em: 2026-10-24
---

<!-- page: 1 -->

Técnica de Programação I
       Profº Luiz Cláudio

<!-- page: 2 -->

    Função         Sinal
    Adição           +
   Subtração         -
 Multiplicação       *
    Divisão          /
Resto da divisão     %
  Incremento        ++
 Decremento          --

<!-- page: 3 -->

   Função          Sinal
     Igual          ==
  Diferente         !=
  Maior que          >
Maior ou igual a    >=
  Menor que          <
Menor ou igual a    <=

<!-- page: 4 -->

Converter em     y recebe o valor convertido


     int           int y = Integer.parseInt(x)

    float         float y = Float.parseFloat(x)

  double       double y = Double.parseDouble(x)

<!-- page: 5 -->

Scanner entrada = new Scanner(System.in);


System.out.println("Digite o primeiro numero:");
numero = entrada.nextInt();
                                                        Comando Escreva


                                           Comando Leia

Atenção: Para funcionar o Scanner devemos importar a biblioteca do
Scanner de leitura
No Java utilizando o comando
import java.util.Scanner;

<!-- page: 6 -->

int num1,num2;     String nome;
double num3,resultado;
Scanner entrada = new Scanner(System.in);
System.out.println("Digite o nome:");
nome = entrada.next();
System.out.println("Digite o primeiro numero:");
num1 = entrada.nextInt();
System.out.println("Digite o segundo numero:");
num2 = entrada.nextInt();
System.out.println("Digite o terceiro numero:");
num3 = entrada.nextDouble();
resultado = num1 + num2+ num3;
System.out.println("Resultado: " + resultado);

<!-- page: 7 -->

Na POO o programador é responsável por
moldar o mundo dos objetos, e explicar
para estes objetos como eles devem
interagir entre si.

<!-- page: 8 -->

 Uma classe funciona como uma “receita” para criar objetos.
 Inclusive, vários objetos podem ser criados a partir de uma
 única classe.


Casas construídas a partir da mesma
planta podem possuir características
diferentes. Por exemplo, a cor das
paredes.

<!-- page: 9 -->

Classe   Atributo

         Método

<!-- page: 10 -->

Atributo
   É um dado para o qual cada objeto tem seu
   próprio valor.
   Definem características de objetos.

Exemplo de atributos:

Marca
Velocidade
Cor
Portas

<!-- page: 11 -->

Método
  Definem as habilidades dos objetos.
  Ações que os objetos podem executar.
  Métodos são declarados dentro de uma classe para
  representar as operações que os objetos pertencentes a
  esta classe podem executar.

<!-- page: 12 -->

Uma aplicação orientada a objetos é composta por objetos.
 É uma Instância(criação) de uma classe
  Podemos definir os objetos como sendo os objetos
  físicos do mundo real (carro, avião, cachorro, casa,
  telefone, computador).

<!-- page: 13 -->

                                  Parâmetros: São
 Assinatura de método            valores(como variáveis)
  ◦ Formado por:                  atribuídos
    nome do método.              aos métodos para alterar o
    argumentos (parâmetros)      seu comportamento em
    tipo de resposta (retorno)   tempo de execução.

public String calculaSalario(int valor)

            Retorno     Nome           Parâmetro entrada

<!-- page: 14 -->

 Assinatura de método sem parâmetros e sem
  retorno
  ◦ Formado por:
    nome do método.
    argumentos (parâmetros)
    tipo de resposta (retorno)

public void calculaSalario()

       Retorno vazio    Nome      Sem parâmetros

<!-- page: 15 -->

               Carro
- marca : String
- velocidade : double
- cor : String
- porta: int

+cadastrarDadosCarro(): void
+mostrarDadosCarro(): void
+alterarDadosCarro()
+aumentarVelocidade(int v):void

<!-- page: 16 -->

Modificadores de acesso
 Private
   Só fica visível dentro da classe em que foi
    implementado
 Public
   Fica visível em toda a aplicação

 Protected
   Fica visível na classe em que foi implementado
    e em suas sub-classe

<!-- page: 17 -->

 Consiste na proteção dos atributos de uma
  classe (e posteriormente dos objetos) de
  acessos externos.


 Considerando que todas as regras referentes a
  classe estão contidas na própria classe (e
  nunca em outra parte da aplicação)

<!-- page: 18 -->

 A classe principal será usada somente
  para conter o método main

<!-- page: 19 -->


<!-- page: 20 -->

Codificação da classe Usuario


                                Codificação da classe Principal

<!-- page: 21 -->

Defina o Nome do Projeto e Project Location , defina o caminho onde será
           armazenado o projeto, em seguida clique em finish

<!-- page: 22 -->

Para Criar uma nova classe, clique
 com o botão direito no nome do        Defina um classe com nome
   projeto , New-> Java Class...     Usuario, em package selecione o
                                     pacote padrão do projeto, depois
                                            clique em Finalizar

<!-- page: 23 -->

Construtores gerados


                         Criar os
                       atributos na
                          classe

<!-- page: 24 -->

                                          Encapsulamento/getters e
Geração de getters e setters              setters gerados

Clique com o botão direito abaixo dos
atributos em insert code.. -> -Getter e
                Setter

<!-- page: 25 -->

Implementar o método Mensagem,
 abaixo dos atributos encapsulado

<!-- page: 26 -->

Renomei a Classe Principal que foi criado pelo Projeto , para o nome
                          classe Principal

<!-- page: 27 -->

                                      Criamos objeto usuario1 , que possui
                                         todos os métodos definidos na
                                         classe Usuario , este é objeto é
                                         instanciado dentro do método
                                                 Principal(main)


  Para chamar um método de uma
classe , colocamos o nome do objeto
    , seguido do nome do método

       Usuario1.Mensagem

<!-- page: 28 -->

         O painel console simula um prompt em ambiente texto


Enfim, a emocionante manifestação de vida do objeto usuario1

<!-- page: 29 -->

Vamos acrescentar na classe Principal, armazenando valores nos atributos da
classe Usuário, para guardar valores nos atributos , utilizamos a função set.

         Classe Principal: Armazenando dados nos atributos, para
                           enviar a classe Usuário

<!-- page: 30 -->

Inserindo o conteúdo dos atributos na classe Usuario,
dentro do método Mensagem, para resgatar os valores dos
atributos utilizamos a função get
          Classe Usuario: Alterar o método Mensagem

<!-- page: 31 -->

Clique na classe Principal e Pressione shift+ F6 e veja o
                       resultado:

<!-- page: 32 -->

Para ler valores e passar para a classe Usuario:
Vamos acrescentar na classe Principal, armazenando valores nos atributos da classe Usuário,
para guardar valores nos atributos , utilizamos a função set. Porém agora vamos fazer a leitura
dos dados, utilizando a biblioteca Scanner.

<!-- page: 33 -->

   Classe JOptionPane e a diretiva import.

<!-- page: 34 -->


<!-- page: 35 -->

O uso do operador &&(e) as duas condições devem ser
verdadeira
if ( (expressao_logica) && (expressão_logica))
{
/* Bloco de comandos */
}
else if ( (expressao_logica) && (expressão_logica))
{
/* Bloco de comandos */ }

<!-- page: 36 -->

Exemplo:
if ((nota > 0) && ( nota <= 5))
{
System.out.println("Reprovado");
                                    Se a condição for verdadeira
}
else
{
System.out.println("Aprovado");
                                   Senão a condição não for
}                                   verdadeira

<!-- page: 37 -->

setMedia(Double.parseDouble(
JOptionPane.showInputDialog("Digite a média:")));


If ( (media > 0) &&(media <= 5)){
    System.out.println("Reprovado");
JOptionPane.showMessageDialog(null,”Reprovado”);
}

Else if (( media > 5) && (media <=10))
{
    System.out.println(“Aprovado");
JOptionPane.showMessageDialog(null,”Aprovado”);
    }

<!-- page: 38 -->

setMedia(Double.parseDouble(
JOptionPane.showInputDialog("Digite a média:")));


If ( (media == 6) || (media == 7))
System.out.println(“Aprovado");
{JOptionPane.showMessageDialog(null,”Aprovado”);
}
Else if (( media == 5) || (media < 5)){
System.out.println("Reprovado");
JOptionPane.showMessageDialog(null,”Reprovado”);}

<!-- page: 39 -->


<!-- page: 40 -->


<!-- page: 41 -->

 Os componentes GUI Swing estão dentro do
  pacote javax.swing que são utilizados para construir as
  interfaces gráficas.

<!-- page: 42 -->


<!-- page: 43 -->

O programa deve ser digitado o ano que a pessoa nasceu e o ano atual e o nome
da pessoa, calcular a idade e mostrar

                   Idade
-anoAtual: int                                        Principal
-anoNasc: int                                         + main(args{}: String): void

-idade: int
-nome: String
+cadastrardados()
+calcularIdade()
+mostrarDados():void

<!-- page: 44 -->

                                                                    Classe: Principal
-   area: double                              Método main       Instanciar um objeto do tipo
-   base: double                                                 Triangulo chamado triang
                                                                Apresentar um menu com as opções:
                                                            1- Inserir dados triangulo
-   altura: double                                          2- calcular área do triangulo
                                                            3- mostrar área triangulo
+ inserirDadosTriangulo()                                   0- Sair


+ calcularArea()
+ mostrarAreaTriangulo(): double
                                                       Classe: Triangulo
Métodos       InserirDadosTriangulo: faça o input dos atributos altura e base do
              triângulo
              calcularArea: area = (base * altura) / 2.

              mostrarAreaTriangulo: Apresentar (showMessageDialog) com área do triângulo
