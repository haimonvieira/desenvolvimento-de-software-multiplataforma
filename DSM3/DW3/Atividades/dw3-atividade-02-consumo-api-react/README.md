# DW3 - Atividade 02 - Consumo de API com React

Front-end em React + Next.js que consome a [BrasilAPI](https://brasilapi.com.br) (API pública, sem autenticação) e exibe os dados em formato de catálogo.

## Tecnologias

- React 18
- Next.js 14.2.5 (Pages Router)
- Axios
- Tailwind CSS 3

## API consumida

```text
GET https://brasilapi.com.br/api/cvm/corretoras/v1   (listagem)
GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}      (detalhe por CNPJ)
```

## Executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Rotas

- `/` – catálogo de corretoras em cards, com busca por nome ou CNPJ. Ao digitar um CNPJ completo (com ou sem pontuação) aparece um atalho para consultar qualquer empresa na base da Receita, mesmo fora do catálogo.
- `/empresa/[cnpj]` – dados completos da empresa, buscados na API pelo CNPJ recebido na rota.

## Funcionamento

1. A página `/` consulta a listagem e mostra os cards.
2. Cada card é um link para `/empresa/[cnpj]`.
3. A página de detalhes consulta a API pelo CNPJ e mostra cadastro, endereço, sócios e atividades.
4. O botão "Voltar ao catálogo" (ou o "×") retorna para `/`.
