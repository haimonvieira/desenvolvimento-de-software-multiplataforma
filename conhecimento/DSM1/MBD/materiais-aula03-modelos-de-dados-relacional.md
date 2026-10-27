---
disciplina: DSM1/MBD
titulo: Aula03   Modelos de Dados Relacional
fonte: DSM1/MBD/Materiais/Aula03 - Modelos de Dados Relacional.pdf
tipo: pdf
paginas: 6
extraido_em: 2026-10-24
---

<!-- page: 1 -->

               Aula03 - Modelos de Dados: Relacional
Modelo Relacional:

      Um modelo relacional organiza dados em tabelas, onde cada tabela é
       composta por linhas (registros) e colunas (atributos).
      Importância:

               Facilita a organização, recuperação e manipulação de dados de
                forma eficiente e segura.

               Permite a integridade dos dados e a eliminação de redundâncias.
Exemplo Prático:

      Pensem em uma tabela de "Clientes" em um sistema de vendas. Cada
       linha representa um cliente, e cada coluna pode representar atributos
       como nome, endereço, telefone, etc.

Clientes
Nome                       Endereço               Telefone


Exemplos de Bancos de Dados Relacionais

Sistemas de Gestão de Bancos de Dados (SGBDs):

      MySQL: Muito usado em aplicações web.

      PostgreSQL: Conhecido por sua robustez.

      Oracle: Utilizado em grandes corporações.

      SQL Server: Popular em ambientes corporativos.

Aplicações Práticas:

      Sistema de Gerenciamento de Clientes (CRM): Armazena
       informações sobre clientes, histórico de compras, etc.
      Sistema de Inventário: Gerencia produtos, quantidades em estoque,
       fornecedores, etc.
      Sistema Financeiro: Controla transações, contas a pagar e receber,
       etc.
Exemplo Prático:

      Imaginem um sistema de biblioteca. Teríamos uma tabela para "Livros"
       e outra para "Empréstimos". A tabela de "Livros" teria colunas como
       título, autor, ISBN, etc., enquanto a tabela de "Empréstimos" teria

<!-- page: 2 -->

       colunas como data de empréstimo, data de devolução, e o ID do livro
       emprestado.

 Livros
 idLivro         Titulo          Autor          ISBN


 Emprestimos
 idEmprestimo         dtEmprestimo        dt_Devolucao        idLivro


Atividade Prática (10 minutos)

Discussão em Grupo:

      Dividir em grupos. Cada grupo deve identificar um exemplo de banco de
       dados relacional em uma aplicação do dia a dia.
      Exemplos para discussão:
           o   Sistema de Reservas de Hotel:

           o   Tabelas possíveis: "Quartos", "Reservas", "Clientes".
           o   Plataforma de E-commerce:

           o   Tabelas possíveis: "Produtos", "Pedidos", "Clientes".
           o   Sistema de Gerenciamento de Biblioteca:

           o   Tabelas possíveis: "Livros", "Empréstimos", "Usuários".
           o   Sistema de Gestão Escolar:

           o   Tabelas possíveis: "Alunos", "Professores", "Turmas",
               "Disciplinas".
           o   Sistema de Controle de Estoque:

           o   Tabelas possíveis: "Produtos", "Fornecedores", "Entradas",
               "Saídas".
           o   Sistema de Gerenciamento de Recursos Humanos:

           o   Tabelas possíveis: "Funcionários", "Departamentos", "Folha de
               Pagamento".
           o   Sistema de Agendamento de Consultas Médicas:

           o   Tabelas possíveis: "Pacientes", "Médicos", "Consultas".
           o   Sistema de Gerenciamento de Projetos:

<!-- page: 3 -->

           o   Tabelas possíveis: "Projetos", "Tarefas", "Colaboradores".
           o   Sistema de Votação Eletrônica:

           o   Tabelas possíveis: "Eleitores", "Candidatos", "Votos".
           o   Sistema de Gerenciamento de Eventos:

           o   Tabelas possíveis: "Eventos", "Participantes", "Ingressos".

      Cada grupo deve apresentar seu exemplo e explicar como o modelo
       relacional é aplicado.


Estrutura de Tabelas

Tabelas:

      As tabelas são a estrutura básica de um banco de dados relacional. Elas
       são compostas por linhas (registros) e colunas (atributos).
      Exemplo Prático:

              Pensem em uma tabela de "Clientes". Cada linha representa um
               cliente, e cada coluna pode representar atributos como nome,
               endereço, telefone, etc.
Chaves Primárias:

      Uma chave primária é um identificador único para cada registro em uma
       tabela. Ela garante que cada registro possa ser identificado de forma
       única.
      Exemplo Prático:

              Na tabela de "Clientes", a coluna "ID do Cliente" pode ser a chave
               primária.
Chaves Estrangeiras:

      Uma chave estrangeira é uma referência a uma chave primária em outra
       tabela. Ela é usada para criar relacionamentos entre tabelas.
      Exemplo Prático:

              Se tivermos uma tabela de "Pedidos", a coluna "ID do Cliente"
               nessa tabela pode ser uma chave estrangeira que referência a
               chave primária "ID do Cliente" na tabela de "Clientes".

<!-- page: 4 -->

Tipos de Relacionamentos

Um-para-um:

     Cada registro em uma tabela está relacionado a um único registro em
      outra tabela.
     Exemplo Prático:

            Tabela "Pessoas" e tabela "Passaportes", onde cada pessoa tem
             um único passaporte.


Um-para-muitos:

     Um registro em uma tabela pode estar relacionado a múltiplos registros
      em outra tabela.
     Exemplo Prático:

            Tabela "Clientes" e tabela "Pedidos", onde cada cliente pode ter
             múltiplos pedidos.

<!-- page: 5 -->

Muitos-para-muitos:

      Múltiplos registros em uma tabela podem estar relacionados a múltiplos
       registros em outra tabela.
      Exemplo Prático:

              Tabela "Estudantes" e tabela "Cursos", onde cada estudante
               pode se inscrever em múltiplos cursos e cada curso pode ter
               múltiplos estudantes.


Atividade Prática

Exercício de Modelagem:

      Imaginem que estamos criando um sistema de gerenciamento de
       cursos.
      Tabelas possíveis:

              Cursos: ID do Curso (chave primária), Nome do Curso,
               Descrição.
              Estudantes: ID do Estudante (chave primária), Nome do
               Estudante, Email.
              Inscrições: ID da Inscrição (chave primária), ID do Curso (chave
               estrangeira), ID do Estudante (chave estrangeira).

 Cursos
 idCurso                    nomeCurso                  Descrição


 Estudantes
 idEstudante                nomeEstudante              Email

<!-- page: 6 -->

 Inscricoes
 idInscricao               idCurso                    idEstudante


Tarefa:

      Em grupos, criem as tabelas e definam as chaves primárias e
       estrangeiras.

      Identifiquem os tipos de relacionamentos entre as tabelas.
