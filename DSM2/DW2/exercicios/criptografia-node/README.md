# Criptografia Node

Projeto de exercício da disciplina Desenvolvimento Web 2 da FATEC Registro.

## Autor

- Haimon Cugler Vieira

## Descrição

Aplicação web simples em Node.js com Express e EJS que apresenta informações sobre criptografia, algoritmos e história das tecnologias criptográficas.

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

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/haimonvieira/criptografia-node.git
```

2. Acesse a pasta do projeto:

```bash
cd criptografia-node
```

3. Instale o npm se ainda não estiver instalado (Node.js já inclui o npm).

4. Instale as dependências do projeto:

```bash
npm install express ejs nodemon
```

## Uso

Execute o servidor em modo de desenvolvimento:

```bash
npm start
```

Acesse a aplicação em:

```text
http://localhost:8080
```

## Rotas disponíveis

- `/` - Página inicial
- `/perfil` - Página de perfil
- `/historia` - Página de história da criptografia
- `/algoritmos` - Página com algoritmos criptográficos

## Observações

Este projeto é um exercício acadêmico e demonstra a estrutura básica de um site em Node.js com rotas e templates EJS.
