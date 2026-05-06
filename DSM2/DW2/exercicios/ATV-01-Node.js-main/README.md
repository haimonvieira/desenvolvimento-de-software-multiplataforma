# Criptografia Node

Projeto de exercício da disciplina Desenvolvimento Web II da FATEC Registro.

## Autor

- Haimon Cugler Vieira

## Localização

- `DSM2/DW2/exercicios/ATV-01-Node.js-main`

## Descrição

Aplicação web em Node.js com Express e EJS que apresenta informações sobre criptografia, algoritmos e história das tecnologias criptográficas.

## Funcionalidades

- Página inicial com navegação
- Página de perfil
- Página de história com tecnologias e marcos da criptografia
- Página de algoritmos com algoritmos de criptografia e hashes
- Layout usando views EJS e recursos estáticos em `public/`

## Tecnologias

- Node.js
- npm
- Express
- EJS
- Nodemon (desenvolvimento)

## Estrutura do projeto

- `index.js` - servidor Express e rotas
- `package.json` - dependências e scripts
- `views/` - templates EJS
- `public/` - arquivos estáticos (CSS, imagens, etc.)

## Requisitos

- Node.js instalado
- npm disponível

## Instalação

1. Na pasta do projeto, instale as dependências:

```bash
npm install
```

## Uso

Execute o servidor:

```bash
npm start
```

Abra o navegador em:

```text
http://localhost:8080
```

## Rotas disponíveis

- `/` - Página inicial
- `/perfil` - Página de perfil
- `/historia` - Página de história da criptografia
- `/algoritmos` - Página com algoritmos criptográficos

## Observações

Este exercício demonstra a estrutura básica de um site em Node.js com rotas e templates EJS.
