---
disciplina: DSM2/TPI
titulo: aula 03  Técnica de Programação I   Operadores JOption MENU
fonte: DSM2/TPI/aula 03- Técnica de Programação I - Operadores JOption MENU.pdf
tipo: pdf
paginas: 17
extraido_em: 2026-10-24
---

<!-- page: 1 -->

TÉCNICA DE PROGRAMAÇÃO I
        PROFº LUIZ CLÁUDIO

<!-- page: 2 -->


<!-- page: 3 -->

   Classe JOptionPane e a diretiva import.

<!-- page: 4 -->


<!-- page: 5 -->

 Workspace (espaço em disco onde serão salvos os arquivos dos projetos)
       Projeto (Estrutura de pastas e arquivos que compõem a aplicação)

           Classe de modelagem (Definição de tipo)

              Atributo
              Contrutores
              Getters e setters
              Métodos especificos da classe
           Classe Principal

              Método main()

<!-- page: 6 -->

 Código da
 estrutura
 básica da
classe Caixa

<!-- page: 7 -->

  Código dos métodos específicos da classe Caixa


Lembrando de importar a classe swing para poder utilizar a JOptionPane

<!-- page: 8 -->

                Classe Principal
 Instanciar um objeto chamado cx1 do tipo caixa.
 Apresentar um menu com as opções:
       1 – Entrada
       2 – Retirada
       3 – Consultar saldo
       0 – Sair
 Realizar as chamadas aos métodos de acordo com a opção do
  usuário
 Repetir as operações enquanto não for informada a opção
  zero

<!-- page: 9 -->


<!-- page: 10 -->

Em tempo de execução

<!-- page: 11 -->

 A primeira linha do método é
 chamada de assinatura e ela
 indica:
  Visibilidade
  Retorno de valor
  O nome do método
  Passagem de parâmetros

<!-- page: 12 -->

 Exemplo: Sem retorno e sem parâmetros.

     Na classe de modelagem:


     No método main:

<!-- page: 13 -->

 Exemplo: Sem retorno e com parâmetros.

     Na classe de modelagem:


     No método main:

<!-- page: 14 -->

 Exemplo: Com retorno e sem parâmetros.

     Na classe de modelagem:


     No método main:

<!-- page: 15 -->

 Exemplo: Com retorno e com parâmetros.

     Na classe de modelagem:


     No método main:

<!-- page: 16 -->

                     EXERCÍCIO 1

 Projeto: CalculadoraBasica


Faça o Menu de Opções

<!-- page: 17 -->

                                 EXERCÍCIO 2
   Projeto: ControleComissao

                                                   -valorVendido: double   Na opção 4 do
                                                   -novoSalario: double    Menu,deve chamar o
                                                                           método
                           +entrarNome():void                              calcularComissão e
                           +entrarSalarioBase(): void                      mostrar a mensagem
                           +entrarValorVendido():void
                           +calculoComissao(): double


                                       Classe:Vendedor
Método            setNovoSalario(((getvalorVendido*10)/100) + getSalarioBase());
calculoComissao

                  return getNovoSalario;
