# Conceitos consolidados — MBD

Cada item traz a fonte e a página. Quando a página não existe (arquivo Markdown),
a citação é só do arquivo.

## 1. Banco de dados

Definição do corpus: "uma coleção organizada de dados que pode ser facilmente
acessada, gerenciada e atualizada" (`materiais-aula01...md`, p. 1).

Importância: armazenar grandes volumes com eficiência e segurança. Exemplos:
reservas de voo, bancos online, redes sociais e gestão de clientes (p. 1).

## 2. História resumida

| Período | Marco | Fonte |
| --- | --- | --- |
| 1960s | Primeiros SGBDs, hierárquicos e de rede; MIS (IBM) e IDS (General Electric) | aula 01, p. 1 |
| 1970 | Edgar F. Codd publica o modelo relacional; dados em tabelas e álgebra relacional; System R e Ingres | aula 01, p. 1 |
| 1980 | Comercialização e popularização dos SGBDs relacionais; Oracle, DB2 e SQL Server | aula 01, p. 2 |
| 2000 | NoSQL e nuvem; MongoDB, Cassandra, Redis, DynamoDB e Spanner | aula 01, p. 2 |

## 3. Componentes de um SGBD

Hardware, software, dados, usuários e procedimentos (aula 01, p. 2).

## 4. Níveis de abstração

| Nível | O que mostra | Exemplo no corpus |
| --- | --- | --- |
| Físico | Como os dados são armazenados | estrutura em disco |
| Lógico | Como os dados são organizados | tabelas e relações |
| Visão | Como os dados chegam ao usuário | interfaces e relatórios |

Fonte: aula 01, p. 3.

## 5. Tipos de SGBD

- **Centralizado:** um único local; fácil de gerenciar, ponto único de falha.
- **Distribuído:** vários locais; mais disponibilidade, gestão complexa.
- **Paralelo:** vários processadores; alta performance, custo elevado.
- **Em nuvem:** servidores remotos; escalabilidade, dependência de conexão.

Fonte: aula 01, p. 3.

## 6. Funções de um SGBD

Controle de concorrência, recuperação de falhas, segurança e integridade
(aula 01, p. 3–4). O corpus cita transações bancárias, reservas e inventário
como exemplos (p. 4).

## 7. Modelo em rede

- Estrutura de **grafo**: registros são nós, relações são arestas.
- Um registro pode ter **múltiplos pais**.
- Mais flexível que o hierárquico, porém mais complexo de implementar.
- Exemplos: IDMS e CA-IDMS.
- Caso de uso: inventário com produtos, fornecedores e categorias.

Fonte: aula 02, p. 1 e 3.

## 8. Modelo hierárquico

- Estrutura de **árvore**: cada registro tem um único pai e pode ter vários
  filhos.
- Simples e eficiente para hierarquia natural; pouco flexível para mudanças.
- Exemplos: IBM IMS e Windows Registry.
- Caso de uso: sistema de arquivos (raiz, pastas, arquivos).

Fonte: aula 02, p. 1–2.

## 9. Modelo relacional

- Dados em **tabelas**; linhas são registros e colunas são atributos.
- Facilita organização, recuperação, integridade e redução de redundância.
- Exemplos de SGBD: MySQL, PostgreSQL, Oracle e SQL Server.
- Aplicações: CRM, inventário e sistema financeiro.

Fonte: aula 03, p. 1.

## 10. Chaves

- **Chave primária (PK):** identificador único de cada registro.
- **Chave estrangeira (FK):** referência à PK de outra tabela, usada para criar
  relacionamentos.

Fonte: aula 03, p. 3–4.

## 11. Relacionamentos

| Tipo | Definição no corpus | Exemplo |
| --- | --- | --- |
| 1:1 | Cada registro se relaciona a um único registro da outra tabela | Pessoas e Passaportes |
| 1:N | Um registro pode se relacionar a vários da outra tabela | Clientes e Pedidos |
| N:N | Vários de uma tabela se relacionam a vários da outra | Estudantes e Cursos |

Fonte: aula 03, p. 4–5.

Para N:N, o corpus mostra a tabela associativa `Inscricoes`, com `idInscricao`
(PK), `idCurso` (FK) e `idEstudante` (FK) — aula 03, p. 5–6.

## 12. Exemplo de modelagem de cursos

- `Cursos`: idCurso (PK), nomeCurso, Descrição.
- `Estudantes`: idEstudante (PK), nomeEstudante, Email.
- `Inscricoes`: idInscricao (PK), idCurso (FK), idEstudante (FK).

Fonte: aula 03, p. 5–6.

## 13. Rascunho da bicicletaria

Entidades e atributos listados em `clientes-registro-dos-clientes.md`:

- **clientes:** id, endereço, nome, telefone.
- **bicicletas:** id, id_cliente, marca, modelo, tipo, ano_fabricação.
- **atendimento:** id, data_entrada, data_saida, status, observação, id_servico.
- **serviços:** id, tipo_servico, id_produto, quantidade, valor, id_atendimento.
- **produtos:** id, quantidade, valor_unitario.
- **personalização:** id, id_produto, valor.
- **vendas:** id, id_cliente, data, id_servico.

O arquivo é um rascunho: há referências cruzadas redundantes (por exemplo,
`serviços` aponta para `atendimento` e `atendimento` aponta para `serviço`) e
não há indicação explícita de PK/FK. Aponte isso ao aluno em vez de "corrigir"
silenciosamente.
