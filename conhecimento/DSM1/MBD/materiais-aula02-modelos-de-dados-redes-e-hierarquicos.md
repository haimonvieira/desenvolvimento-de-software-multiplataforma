---
disciplina: DSM1/MBD
titulo: Aula02   Modelos de Dados Redes e Hierárquicos
fonte: DSM1/MBD/Materiais/Aula02 - Modelos de Dados Redes e Hierárquicos.pdf
tipo: pdf
paginas: 3
extraido_em: 2026-10-24
---

<!-- page: 1 -->

    Aula02 - Modelos de Dados: Redes e Hierárquicos
1. Modelo de Dados em Rede

      Estrutura e Características:

             Estrutura: O modelo de dados em rede organiza os dados em uma
              estrutura de grafo, onde os registros são nós e as relações entre eles
              são arestas.

             Características: Permite relações complexas entre os dados, com
              múltiplos caminhos de acesso. É mais flexível que o modelo
              hierárquico, pois um registro pode ter múltiplos pais.

      Exemplos de Bancos de Dados:

             IDMS (Integrated Database Management System): Um dos primeiros
              SGBDs a implementar o modelo de rede.

             CA-IDMS: Uma versão moderna do IDMS, ainda em uso em algumas
              grandes organizações.

2. Modelo de Dados Hierárquico

      Estrutura e Características:

             Estrutura: Organiza os dados em uma estrutura de árvore, onde cada
              registro tem um único pai, mas pode ter múltiplos filhos.

             Características: Simples e fácil de entender, mas limitado em termos
              de flexibilidade. Ideal para dados que têm uma hierarquia natural.

             Raiz: O nível mais alto da hierarquia, que contém todas as pastas e
              arquivos.

             Pastas: Contêm subpastas e arquivos. Cada pasta pode ter múltiplas
              subpastas e arquivos, mas cada subpasta ou arquivo tem apenas uma
              pasta pai.

             Arquivos: Elementos finais da hierarquia que contêm os dados. Cada
              arquivo está contido em uma única pasta.


Características do Modelo Hierárquico

      Simplicidade: Fácil de entender e implementar, especialmente para dados que
       têm uma hierarquia natural.

      Relações Pai-Filho: Cada registro (pasta ou arquivo) tem um único pai, mas
       pode ter múltiplos filhos.

      Acesso Rápido: A estrutura hierárquica permite um acesso rápido aos dados,
       seguindo o caminho da raiz até o registro desejado.

      Exemplos de Bancos de Dados:

<!-- page: 2 -->

             IBM Information Management System (IMS): Um dos primeiros e
              mais conhecidos SGBDs hierárquicos.

             Windows Registry: Utiliza uma estrutura hierárquica para armazenar
              configurações do sistema operacional.

3. Comparação entre os Modelos

      Vantagens e Desvantagens:

             Modelo de Rede:

                    Vantagens: Flexível, permite relações complexas, eficiente para
                     consultas que envolvem múltiplos caminhos.

                    Desvantagens: Complexo de implementar e gerenciar, pode ser
                     difícil de entender.

             Modelo Hierárquico:

                    Vantagens: Simples de implementar e entender, eficiente para
                     dados com hierarquia clara.

                    Desvantagens: Limitado em termos de flexibilidade, difícil de
                     adaptar a mudanças na estrutura dos dados.

      Casos de Uso:

             Modelo de Rede: Ideal para aplicações que requerem relações
              complexas entre dados, como sistemas de gerenciamento de
              inventário.

             Modelo Hierárquico: Adequado para dados com uma hierarquia clara,
              como organogramas e sistemas de arquivos.


4. Exemplos Práticos

      Demonstração de um Banco de Dados Hierárquico:

             Exemplo: Um sistema de gerenciamento de arquivos onde cada pasta
              pode conter múltiplos arquivos e subpastas, mas cada arquivo ou
              subpasta tem apenas uma pasta pai.

<!-- page: 3 -->

   Demonstração de um Banco de Dados em Rede:

         Exemplo: Um sistema de gerenciamento de inventário onde um
          produto pode estar relacionado a múltiplos fornecedores e categorias, e
          cada fornecedor pode fornecer múltiplos produtos.
