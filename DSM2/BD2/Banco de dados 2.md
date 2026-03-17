### Constraints

Regras que quando aplicadas garantem armazenamento  de dados
validos somente.

- Dados sempre consistentes;
- Erros detectados na origem;
- Sem necessidade de verificar no codigo.

### Primary Key

Identifica UNICAMENTE cada linha na tabela.

- Nao aceita **NULL**
- Sem duplicatas (cada valor deve ser unico na tabela)
- Uma por tabela (cada tabela deve ter somente uma chave primaria)

## NOT NULL | DEFAULT

### NOT NULL

O campo obrigatoriamente precisa de um valor


### DEFAULT

Define um valor padrao quando nenhum e informado

## Unique

Garante que nao existam dois registros com o mesmo valor em uma coluna.

- MySQL impede insercao de valores duplicados
- Retorna erro antes de gravar
- Cria indice automatico na coluna

## CHECK

Permite definir uma condicao logica que o valor deve satisfazer antes de ser aceito

### FOREIGN KEY

Garante que um valor em uma tabela sempre exista na tabela referenciada. Sem registros orfaos

- CASCADE
  - Propaga a acao para os filhos. Se deletar o pai, deleta os filhos automaticamente
- SET NULL
  - Anula a FK nos filhos quando o pai é removido. A coluna deve aceitar NULL
- RESTRICT
  - Impede a acao no pai se houver filhos. É o comportamento padrao. Verifica no inicio.
- NO ACTION
  - Similar ao RESTRICT. A verificacao ocorre no final da transacao

## 4 Pilares da Integridade de Dados

- Integridade de Entidade
  - Toda linha é unica e identificavel. Nao existem registros duplicados ou sem identidade.
    - PRIMARY KEY
- Integridade de Dominio
  - Valores dentro de limites aceitaveis. Nao entram dados absurdos no sistema.
    - CHECK, NOT NULL, DEFUALT, UNIQUE
- Integridade Referencial
  - Relacionamentos entre tabelas sempre consistentes. Nao existem registros orfaos.
    - FOREIGN KEY
- Integridade do Usuario
  - Regras de negocio especificas da plicacao, alem das constraints
    - Triggers, Stored procedures