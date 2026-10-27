---
disciplina: DSM2/TPI
titulo: aula 05  Técnica de Programação I  Formulários e Conexao BD
fonte: DSM2/TPI/aula 05- Técnica de Programação I- Formulários e Conexao BD.pdf
tipo: pdf
paginas: 27
extraido_em: 2026-10-24
---

<!-- page: 1 -->

TÉCNICA DE PROGRAMAÇÃO I
       PROFº LUIZ CLÁUDIO

<!-- page: 2 -->

Interface gráfica com Usuário – GUI(Graphical User
Interface)
É onde os resultados são apresentados em modo gráfico.
Essa interface é formada através de componentes GUI,
conhecidos por controles ou widgets. Esses
componentes são objetos que fazem a interação com
usuário por teclado, mouse ou outros dispositivos que
venham a servir para entrada de dados.

<!-- page: 3 -->

Os componentes GUI Swing estão dentro do
pacote javax.swing que são utilizados para construir as interfaces
gráficas. Alguns componentes não são do tipo GUI Swing e sim
componentes AWT. Antes de existir o GUI Swing, o Java tinha
componentes AWT (Abstract Windows Toolkit) que faz parte do
pacote javax.awt.

<!-- page: 4 -->

Abaixo são mostrados alguns dos componentes mais usados:
 JLabel - Exibe texto não editável (LABEL)
 JTextField – Caixa de Texto
  JButton – Botão - Libera um evento quando o usuário clicar nele
com o mouse.

<!-- page: 5 -->

Para criar um Projeto com formulário, crie um
projeto como Ant , Java with Ant , Java Application

<!-- page: 6 -->

Desmarque a caixa Create Main Class, para não
criar a classe Principal

<!-- page: 7 -->

Criar os pacotes Model, View, Control,
sistema MVC

Criar as classes no pacote Model
Criar o formulário no pacote View
Criar a classe de conexao no pacote Control

<!-- page: 8 -->

PARA CRIAR UM
FORMULÁRIO
JFRAME
1. CLICAR COM O
BOTÃO DIREITO NO
NOME DO PACOTE
VIEW

<!-- page: 9 -->

Para criar pacotes faça os
passos a seguir:
1. Clicar com o botão
   direito em cima do
   nome do projeto
2. Depois New-> Java
   Package
3. Em seguida o nome do
   pacote

<!-- page: 10 -->

Coloque o nome do Formulário Jframe , sempre Inicie
com nome Frm, neste caso FrmCliente

<!-- page: 11 -->

Construa o Formulário com os componentes e mude o nome das
variáveis


                                 Componente JTextField /campo de texto
                                 VariableName: txtCodigo

                                                     Componente JTextField /campo de texto
                                                     VariableName : txtNome

                                                Componente JTextField /campo de texto
                                                VariableName : txtEmail


   Componente JButton
   VariableName : btnCadastrar


                                             Componente Jtable / Tabela
                                             VariableName : tblUsuarios

                                             Para adicionar as colunas na tabela altere a propriedade model e
                                             defina os títulos das colunas

<!-- page: 12 -->

    Crie a tabela no BANCO DE DADOS
No WorkBench ou HeidiSQL, crie um database com nome banco_java,
e crie a tabela Cliente

<!-- page: 13 -->

Crie classe Conexao-pacote Control


PARA CRIAR UMA
CLASSE DE
CONEXAO
2. CLICAR COM O
BOTÃO DIREITO NO
NOME DO PACOTE
CONTROL

<!-- page: 14 -->

Crie classe Conexao-pacote Control
                                   Nome do banco de dados


                         Endereço do mysql
                         Pode usar alguns casos localhost

<!-- page: 15 -->

Classe Conexao

<!-- page: 16 -->

Classe Conexao

<!-- page: 17 -->

Crie classe Cliente-pacote Model

PARA CRIAR UMA
CLASSE DE
CLIENTES
3. CLICAR COM O
BOTÃO DIREITO NO
NOME DO PACOTE
MODEL

<!-- page: 18 -->

Criar a classe Cliente no
pacote de Model
                          Cliente
                   -codigo: int
                   -nome: String
                   -telefone: String
                   -email: String

                   + cadastrar()
                   + consultar()

<!-- page: 19 -->

Classe Cliente- Crie o método
cadastrar

  INSTANCIAR NA CLASSE CLIENTE A CLASSE DE CONEXÃO

<!-- page: 20 -->

Classe Cliente- Crie o método
consultar

<!-- page: 21 -->

Código do formulario

                    Componente JTextField /campo de texto
                    Nome da variável: txtCodigo
      Componente
      JFormattedField Nome da               Componente JTextField /campo de texto
      variável: txtTelefone                 Nome da variável: txtNome
      Para Adicionar um mascara
      telefone Formatter Factory,      Componente JTextField /campo de texto
      defina em mask a mascara
                                       Nome da variável: txtEmail


                       Componente JButton
                       Nome da variável:
                       btnCadastrar


                                    Componente Jtabela / Tabela
                                    Nome da variável: tblUsuarios

                                    Para adicionar as colunas na tabela altere a propriedade model e
                                    defina os títulos das colunas

<!-- page: 22 -->

Código do formulário – Instanciar classe Cliente


 INSTANCIAR NO FORMULÁRIO A CLASSE DE CLIENTE

<!-- page: 23 -->

Código do formulário – Botão Cadastrar

                         Colocar nome dos atributos , que recebe os valores das
                         caixas de texto

                         cli.setNomeatributo(nomeCaixadeTexto.getText())


             Chama o método consultar da classe Cliente , que retorna os dados
             consultados no banco de dados


                     Nome Da tabela utilizado no formulário Jframe


                     Sequencia dos dados que serão mostrados na tabela, de acordo [
                     com banco de dados

<!-- page: 24 -->

       Incluir Conector –MySQL no Projeto
Clique com botão direito em Libraries -> Add JAR/Folder...

<!-- page: 25 -->

      Incluir Conector -MySQL
Procure o conector do Java e clique em Open

<!-- page: 26 -->

Exercicio 1
1. Crie os pacotes de Model, Control e View.
2. Crie a classe Usuario em seu pacote designado, com os atributos nome, login, senha, email.
3. Crie o banco de dados chamado Usuario Com os seguintes campos nome, login, senha,
   email
4. Crie a classe de Conexão.
5. Crie o formulário frmUsuario.


                                                                    Usuario
                                                             -nome: String
                                                             -email: String
                                                             -login: String
                                                             -senha: String

                                                             +cadastrarUsuario()
                                                             +listarUsuario()

<!-- page: 27 -->

Exercicio 2
1. Crie os pacotes de Model, Control e View.
2. Crie a classe Produto em seu pacote designado, com os atributos codigo, nomeProduto e
   Descrição.
3. Crie o banco de dados chamado ConsultaProduto. Com os seguintes campos: codigo,
   nomeProduto e Descrição.
4. Crie a classe de Conexão.
5. Crie o formulário frmProduto.


                                                         Produto
                                                   -codigo: int
                                                   -nomeProduto: String
                                                   -descricao: String

                                                   +cadastrarProduto()
                                                   +listarProduto()
