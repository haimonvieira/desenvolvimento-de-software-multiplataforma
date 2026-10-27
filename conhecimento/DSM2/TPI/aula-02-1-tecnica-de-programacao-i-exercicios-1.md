---
disciplina: DSM2/TPI
titulo: aula 02.1  Técnica de Programação I   Exercicios 1
fonte: DSM2/TPI/aula 02.1- Técnica de Programação I - Exercicios 1.pdf
tipo: pdf
paginas: 7
extraido_em: 2026-10-24
---

<!-- page: 1 -->

Técnica de Programação I
       Profº Luiz Cláudio

<!-- page: 2 -->

                              Cliente
-nome : string
-end : string
-rg : string
+cadastrarCliente:void()
+listarCliente:void()


                            Principal


         +main(args[]:String):void()

<!-- page: 3 -->

                  Dobro
-numero : double
-calculo : double              Cálculo Dobro:
+calcularDobro:void()
                               setCalculo(getnumero() *2)


                   Principal


+main(args[]:String):void()

<!-- page: 4 -->

Passagem
-nomePassageiro : String
- telefone: String
- RG: String
- localViagem: String                                Principal
- data: String                                       + main(args{}: String): void
- horário: String
- numpoltrona: String


+ cadastrarDadosPassageiros(): void
+ cadastrarDadosPassagem(numpoltrona: String):void
+ mostrarDadosPassageiro():String
+ mostrarDadosPassagem():void

<!-- page: 5 -->

                    Fornecedores
- nomeFornecedor: String
- nomeProduto: String
- descricaoProduto: String                         Principal
                                                   + main(args{}: String): void
+ cadastrarFornecedor(nomeProduto: String): void
+ listarFornecedor(): String

<!-- page: 6 -->

                        Produto
- nomeProduto: String
- quantidade: int
- valor: double                            Principal
- total: double                            + main(args{}: String): void


+ cadastrarProduto(quant : int ): void
+ calcularTotal(): double

                                         Atenção não deve ser lido o valor total ,
                                         pois será calculado

                                         Cálculo Produto:

                                         setTotal(getvalor() * getquantidade());
                                         return getTotal();

<!-- page: 7 -->

O programa deve ler os dados da loja depois calcular o valor Total e mostrar
Os dados e valor total da compra    setvalorTotalCompra(getvalorCompra * getqtdItenComp)


Loja

- razaoSocial: String                                 Principal
                                                      + main(args{}: String): void
- cpfCliente: String
- valorCompra: double;
- qtdItensComp: int;
- valorTotalCompra: double;
+inserirDadosLoja() : void
+mostrarDadosLoja(): String
+calcularCompraLoja():double
