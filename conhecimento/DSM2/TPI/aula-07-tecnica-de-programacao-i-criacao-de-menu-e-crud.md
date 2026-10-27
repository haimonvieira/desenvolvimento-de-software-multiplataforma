---
disciplina: DSM2/TPI
titulo: aula 07 Tecnica de Programacao I Criacao de Menu e Crud
fonte: DSM2/TPI/aula_07_Tecnica_de_Programacao_I_Criacao_de_Menu_e_Crud.pdf
tipo: pdf
paginas: 13
extraido_em: 2026-10-24
---

<!-- page: 1 -->

TÉCNICA DE PROGRAMAÇÃO I
       PROFº LUIZ CLÁUDIO

<!-- page: 2 -->


<!-- page: 3 -->

No pacote Visualização(View). Crie o Formulário
FrmMenu dentro do pacote Visualização

<!-- page: 4 -->

   Criando Menu
• Adicione um novo JFrame ao projeto.
• Acesse a "Paleta" do Netbeans, na categoria "Menus
  Swing" clique em "Barra de Menu "(JMenuBar1) e
  arraste até o JFrame, em seguida acrescente um Item de
  menu conforme figura a seguir

<!-- page: 5 -->

   Criando Menu
• Por padrão o JmenuBar1 já vem com dois menus (File e
  Edit). Se você clicar em cima dos Menus verá que o
  nome deles são respectivamente: JMenu1,JMenu2 Só a
  barra de menu (JmenuBar) com os 2 menus(JMenu) não
  fica legal. Para que um menu fique funcional,
  necessitamos inserir os Itens de Menu.

<!-- page: 6 -->

     Criando Menu- adicionar
     ícones
• Clique Na propriedade icon... Clique no botão importar
  para o projeto
• Ou para facilitar arraste as imagens para o pacote
  Visualização e selecione em Imagem no projeto a imagem

<!-- page: 7 -->

     Criando Menu- chamar
     outro formulário menu
• Clique com o botão direito em cima do Item de Menu
  que vai chamar o formulário e acesse o evento
  actionPerformed.

<!-- page: 8 -->

      Criando Menu- chamar
      outro formulário menu
• Para abrir uma janela é necessário instanciar uma
  instancia da classe do formulário e
• enviar true no atributo visible com o seguinte código:


  EXEMPLO:

<!-- page: 9 -->

     Criando Menu- chamar
     outro formulário menu
• Crie o menu abaixo:

<!-- page: 10 -->

   Criando Menu- chamar
   outro formulário menu
• Para que o formulário que foi aberto não encerre a
  aplicação quando ele for fechado configure no
  formulário que foi chamado a propriedade
  defaultCloseOperation com:

<!-- page: 11 -->

Para adicionar ícones aos botões, selecione os botões e
altere a propriedade ícones


Componente JButton

<!-- page: 12 -->

   Para adicionar uma Imagem ao Formulário

   ADICIONE UM LABEL E ALTERE A PROPRIEDADE ICON E SELECIONE A
IMAGEM DESEJADA EM IMAGEM DO PROJETO OU IMPORTE A IMAGEM :

<!-- page: 13 -->

O botão Sair Formulário Menu

              Clique com botão direito no botão sair Eventos
              Action ActionPerformed e código:
