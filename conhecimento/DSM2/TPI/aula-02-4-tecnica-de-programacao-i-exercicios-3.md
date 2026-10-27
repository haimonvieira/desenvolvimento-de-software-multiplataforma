---
disciplina: DSM2/TPI
titulo: aula 02.4  Técnica de Programação I   Exercicios 3
fonte: DSM2/TPI/aula 02.4- Técnica de Programação I - Exercicios 3.pdf
tipo: pdf
paginas: 6
extraido_em: 2026-10-24
---

<!-- page: 1 -->

TÉCNICA DE PROGRAMAÇÃO I
        PROFº LUIZ CLÁUDIO

<!-- page: 2 -->

                                         Categoria Cliente
         -nome: string
         -numeroConta: int
         -saldoMedio: double

         +cadastrarCliente():void
         +verificarSaldo():void()

                                                                                              Classe: Principal
                                                                                     Método        Instanciar um objeto do
                                                                                     main           tipo CategoriaCliente
                                                Principal                                           chamado cli.
                                                                                                   Chamar o método
                                                                                                   Cadastrar()
                                                                                                   verificarSaldo()
                       +main(args[]:String):void()

                                                  Classe: CategoriaCliente
Método           Lê e armazena (sets) valores para todos os atributos necessários.
                 verificarSaldo:
verificarSaldo   Saldo médio < 1000 “Cliente Comum”
                 Saldo médio >= 1000 e Saldo médio < 2500 “Cliente Prata”
                 Saldo médio >= 2500 “Cliente Ouro”
                 Apresenta o valor (get) do Saldo Médio

<!-- page: 3 -->

                            OlimpiadaMatematica
      -nome: string
      -endereco: string
      -media: double
      -notamenor: double
      -notamaior: double
      + calcularMedia(): void
      + verificarMedia():void()
                                                                                       Classe: Principal
                                                                              Método          Instanciar um objeto
                                                                              main             do tipo
                                      Principal
                                                                                               OlimpiadaMatematica
                                                                                               chamado olimp.
                                                                                              Chamar o método
                +main(args[]:String):void()                                                    calcular media ,
                                                                                               depois verificar media
                                  Classe: OlimpiadaMatematica
Método           Lê e armazena (sets) valores para todos os atributos , somente a média não será lida pois será
calcularMedia    calculada
                 Calcularmedia entre a nota menor e maior . setMedia( getNotaMenor() + getnotaMaior()) /2 )
                 No verificar media ,Se media > 9 “aluno inscrito” e listar aluno,caso contrario “media Insuficiente.
                 Apresenta o valor (get) da média

<!-- page: 4 -->

                                         Prova
      -nome: string
      -pontos: double
      -nivel: string

      +nivelProva():void()
      +listarResultado:void()

                                                                                        Classe: Principal
                                                                               Método        Instanciar um objeto do tipo
                                       Principal                               main           Prova chamado nível
                                                                                             Chamar o método nivelProva
                                                                                             Chamar o método
                                                                                              listarResultado
               +main(args[]:String):void()


                                                 Classe:Prova
Métodos   nivelProva: Lê e armazena (sets) valores para todos os atributos nome e pontos
          Se pontos <=100 setNivel(“nível 1”)
          Se pontos > 100 e pontos < 200 setNivel (“nível 2”)
          Se pontos >= 200 setNivel(“ nível 3”)

          listarSituacao: Apresenta os valores (gets) de todos os atributos.

<!-- page: 5 -->

                          Temperatura
                                                                          Classe: Principal
      -celsius: double                                      Método      Instanciar um objeto do tipo Temperatura
      -fahrenheit: double                                   main         chamado temp


      +calcularTempCelsius(double F):void()                             Ler os valores de Celcius e Farenheit na
                                                                         classe principal, e ao chamar o métodos ,
      +calcularTempFahrenheit(double C):void()
                                                                         passar os parâmetros, com os valores de
                                                                         Celsius e Fahrenheit.
                                                                        No menu principal faça um menu de
                                                                         opções com Case. Escolha as Opções para
                                                                         calculo:
                              Principal                                  1- Converter Fahrenheit-Celcius
                                                                         2- Converter Celcius-Fahrenheit


          +main(args[]:String):void()


                                           Classe:Temperatura
Métodos
             calcularTempCelsius:   setcelsius((F -32)* (5/9.0));
             Apresenta o valor (gets) do atributo celsius.

             calcularTempFahrenheit: setFahrenheit(C * 1.8 + 32);
             Apresenta o valor (gets) do atributo Fahrenheit

<!-- page: 6 -->

                          Combustivel
      -litros: double                                          Método       Instanciar um objeto do tipo Combustivel
                                                               main
      -totalGasto: double                                                    chamado comb , o km rodados e o valor
                                                                             da combustível será lido no Principal
      -km : double                                                          Apresente um Menu de opções com Case
      -valorComb: double                                                    O usuário deve escolher entre abastecer
                                                                             álcool , gasolina
      +calcularLitrosAlcool(double km): void()
                                                                            1- Álcool
      +calcularLitrosGasolina(double km): void()                            2- Gasolina
      +calcularTotalGasto(double valorComb):
      double
                                                                                      Atenção Lê Km rodada e
                            Principal                                                 valor do combustível na
                                                                                      classe Principal


      +main(args[]:String):void()
                                            Classe: Combustivel
Métodos
          calcularLitrosAlcool:     setLitros(km / 12);     //carro gasta 12 km por litro

          calcularLitrosGasolina:   setLitros(km / 15);   //carro gasta 15 km por litro

          calcularTotalGasto: setTotalGasto(this.getLitros() * valorComb );
