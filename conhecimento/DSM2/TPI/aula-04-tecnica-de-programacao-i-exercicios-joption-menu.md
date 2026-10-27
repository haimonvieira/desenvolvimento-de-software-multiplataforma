---
disciplina: DSM2/TPI
titulo: aula 04  Técnica de Programação I   Exercicios JOption MENU
fonte: DSM2/TPI/aula 04- Técnica de Programação I - Exercicios JOption MENU.pdf
tipo: pdf
paginas: 6
extraido_em: 2026-10-24
---

<!-- page: 1 -->

Técnica de Programação I
        Profº Luiz Cláudio

<!-- page: 2 -->

                  CustoPiso
-comprimentoComodo: double
                                                              Classe: Principal
                                             Método       Instanciar um objeto do tipo
-larguraComodo: double                       main
-precoporArea: double                                      CustoPiso chamado piso
-custoTotalComodo : double                                Apresentar um menu com as opções:
+inserirValores()                                                 1 – Inserir Valores do comodo
+calcularprecoArea():void                                         2 – Calcular preço por Area
+mostrarValores(): void                                           3 – mostrar Valores
                                                                  0 – Sair


                   Principal


+main(args[]:String):void()                       Classe: CustoPiso
Métodos        inserirValores: Lê (showInputDialog) e armazena (sets) valores para
               os atributos (comprimentoComodo e larguraComodo e preçoporArea)
               calcularprecoArea: calcula o custo total para assentar piso
               setcustoTotalComodo(getComprimento() * getLargura() *
               getPrecoporArea())
               mostrarValores: Apresenta (showMessageDialog) os valores (gets) de todos
               os atributos.

<!-- page: 3 -->

                 Quadrado
-areaQuadrado: double
                                                              Classe: Principal
                                             Método       Instanciar um objeto do tipo
-perimetroQuadrado : double                  main
+calcularArea(double ladoA): double                        Quadrado chamado quad
+calcularPerimetro(double ladoA): double                  Apresentar um menu com as
+mostrarValores(): void                                    opções:
                                                                 1 – Calcular Area Quadrado
                                                                 2 – Calcular Perimetro
                                                                 Quadrado
                                                                 3 – mostrar Valores
                   Principal                                     0 – Sair

                                                                 Obs.: Na opção dos Calculos. Leia
+main(args[]:String):void()                       Classe: Quadrado
                                                                 o valor do lado A

Métodos        calcularArea: recebe por parâmetro os valores do ladoA
               e calcula a Area setAreaQuadrado ( Math.pow(ladoa,2) )
               calcularPerimetro: recebe por parâmetro os valores do ladoA
               calcula perimetro setperimetroQuadrado(4 * ladoa )

               mostrarValores: Apresenta (showMessageDialog) os valores (gets) de todos
               os atributos.

<!-- page: 4 -->

                    Eleitores
-numeroTotalEleiotores: int                                          Classe: Principal
-numeroVotosBrancos : int                        Método
-numeroVotosNulos: int                                           Instanciar um objeto do tipo
                                                 main
-numeroVotosValidos: int                                          Eleitores chamado eleit
-percBrancos: double                                             Apresentar um menu com as opções:
-percNulo: double                                                        1 – Inserir quantidade Votos
-percValidos: double                                                     2 – Calcular Total Eleitores
                                                                         3 – Calcular Percentual Votos
                                                                         3 – Mostrar Percentual Votos
+inserirQtdVotos()
+calcularTotalEleitores():void                              Principal    0 – Sair
+calcularPercentualVotos():void

                                    +main(args[]:String):void()
                                                          Classe: Eleitores
Métodos          InserirQtdVotos: faça o input dos atributos números votos brancos,
                 nulos e validos
                 calcularTotalEleitores: somar todos os votos

                 calcularPercentualVotos: Faça o percentual para cada voto
                 exemplo:
                 setPercBrancos ((numeroVotosBrancos * 100)/ total eleitores)
                 Apresentar (showMessageDialog) o percentual de cada voto

<!-- page: 5 -->

                   Consorcio
-numeroTotalPrestacoes: int                                                  Classe: Principal
                                                             Método      Instanciar um objeto do tipo
-qtdPrestacoesPagas : int
                                                             main
-valorPrestacao: double                                                   Consorcio chamado cons
-saldodevedor: double                                                    Apresentar um menu com as opções:
-totalPago: double                                                               1 – Inserir Valores Consorcio
                                                                                 2 – Calcular Total Pago
+inserirValoresConsorcio()
                                                                                 3 – Calcular Saldo Devedor
+calcularTotalpago(): double
                                                                                 4- Mostrar Valores
+calcularSaldoDevedor():double                                                   0 – Sair
+mostrarValores(): void                   Principal


                               +main(args[]:String):void()
                                                                  Classe: Consorcio
Métodos         InserirValoresConsorcio: faça o input dos atributos
                numeroTotalPrestacoes, qtdPrestacoesPagas,valorPrestacao
                calcularTotalPago: setTotalPago(valorPrestacao * qtdPrestacoesPagas)

                calcularSaldoDevedor:
                    setSaldoDevedor( (numerototalprest * valorPrestacao)- totalpago)
                mostrarValores: Apresenta (showMessageDialog) os valores (gets) dos
                atributos totalpago e saldodevedor

<!-- page: 6 -->

                     Funcionario
-nomeFuncionario: string                                               Classe: Principal
-telefoneFuncionario: string                         Método        Instanciar um objeto do tipo
-enderecoFuncionario: string
                                                     main
-salariohora: double                                                Funcionario chamado func
-salariofinal: double
                                                                   Apresentar um menu com as opções:
                                                                           1 – Cadastrar Funcionario
+cadastrarFuncionario():void                                               2 – Calcular Salário
+calcularSalarioFinal(Int hrTrab): double                                  3 – Listar FUncionario
+listarFuncionario():void                                                  0 – Sair


                                                                          Obs.: Na opção Calcular salário
                        Principal                                         Leia o valor das horastrab e por fim
                                                                          mostre a Mensagem com valor do
                                                                          salario Final
+main(args[]:String):void()
                                                         Classe: Funcionario
Métodos            cadastrarFuncionario: Lê (showInputDialog) e armazena (sets) valores para
                   os atributos (nomeFuncionario,telefone,endereço,salariohora). Exemplo:
                   setNomeFuncionario((JOptionPane.showInputDialog("Digite o nome Funcionário: "));
                   calcularSalarioFinal: recebe por parâmetro o valor da horas trabalhadas e
                   multiplica pelo valor do salariohora
                    setsalariofinal(horatrab*getSalarioHora())
                    listarFuncionario: Apresenta (showMessageDialog) os valores (gets) de
                   todos os atributos.
