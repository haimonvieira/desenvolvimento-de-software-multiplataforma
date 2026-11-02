# DW3 - Atividade 02 - Consumo de API com React

Frontend desenvolvido com React + Next.js para consumir a API de empresas criada em Node.js + Express.

## Tecnologias

- React 18
- Next.js 14.2.5
- Axios
- Tailwind CSS 3

## Pré-requisito

Antes do frontend, inicie a API backend em:

```text
http://localhost:4000
```

Endpoints consumidos:

```text
GET http://localhost:4000/empresas
GET http://localhost:4000/empresas/:cnpj
```

## Executar

```bash
npm install
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Estrutura usada

A estrutura segue o padrão das aulas de DW3 com `src/pages`, `src/components`, `useState`, `useEffect`, `useRouter`, Axios e componentes simples. O Tailwind foi usado apenas para a estilização solicitada nesta atividade.

## Funcionamento

1. A página `/` consulta `GET /empresas`.
2. Os dados são mostrados em cards.
3. Ao clicar em um card, o usuário é enviado para `/empresa/[cnpj]`.
4. A página de detalhes é exibida visualmente como um modal.
5. A página consulta `GET /empresas/:cnpj` e mostra os dados retornados.
6. O botão de fechar ou voltar retorna para o catálogo.
