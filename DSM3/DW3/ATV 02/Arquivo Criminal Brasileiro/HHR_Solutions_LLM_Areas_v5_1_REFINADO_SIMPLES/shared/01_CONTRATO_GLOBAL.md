# Contrato global do projeto
## HHR Solutions - Arquivo Criminal Brasileiro

Este documento resume as decisões compartilhadas entre as quatro áreas.

## Escopo

Projeto acadêmico de API REST para organizar informações públicas sobre casos criminais brasileiros e relacioná-los a produções audiovisuais.

Não existe implementação de Frontend. O Figma representa apenas o protótipo visual.

## Entidades

### User

- `_id: ObjectId` - gerado automaticamente pelo MongoDB.
- `email: String` - e-mail usado no cadastro e login.
- `password: String` - armazena o hash Argon2id da senha.

### Caso

- `_id: ObjectId` - gerado automaticamente pelo MongoDB.
- `titulo: String` - nome pelo qual o caso será identificado.
- `resumo: String` - descrição curta e informativa do caso.
- `categorias: Array<String>` - lista de classificações do caso, por exemplo `Homicídio` e `Repercussão nacional`.
- `detalhes: documento aninhado` - reúne local, período e situação judicial geral do caso.
- `producoes: Array de documentos aninhados` - lista de filmes, séries ou documentários relacionados ao caso.

### Detalhes

- `cidade: String` - cidade relacionada ao caso.
- `estado: String` - estado/UF.
- `anoInicio: Number` - ano inicial do caso.
- `anoFim: Number` - ano final, quando fizer sentido.
- `situacaoJudicial: String` - texto simples que resume a situação judicial geral registrada para o caso.

### Producao

- `tmdbId: Number` - identificador da produção no TMDB.
- `titulo: String` - título da produção.
- `tipo: String` - informa se é filme, série ou documentário.
- `ano: Number` - ano de lançamento.
- `sinopse: String` - resumo da produção.
- `poster: String` - endereço da imagem/poster usada na interface.

## Rotas públicas

- `POST /user`
- `POST /login`

## Rotas protegidas

- `GET /casos`
- `POST /casos`
- `GET /casos/:id`
- `PUT /casos/:id`
- `DELETE /casos/:id`
- `GET /tmdb/buscar?query=texto`

## Documentação

- `GET /api-docs`

## Decisões técnicas

- Estrutura principal: Route -> Controller -> Service -> Model.
- MongoDB + Mongoose.
- Banco hospedado no MongoDB Atlas.
- JWT para autenticação.
- Argon2id substitui bcrypt por decisão do grupo.
- TMDB é extensão para pesquisa de produções audiovisuais.
- `categorias` e `producoes` em arrays são extensões além do exemplo direto mostrado em aula.
- O escopo permanece simples: existem apenas os Models/collections `User` e `Caso`; `detalhes` e `producoes` ficam dentro de `Caso`.
- Não criar entidades separadas de Pessoa, Evento, Fonte ou Produção para esta atividade.
- `_id` é gerado automaticamente pelo MongoDB e não deve ser enviado manualmente em POST ou PUT.
- As aulas do professor são a principal referência de estilo e nível de complexidade.

## Controle de mudança

Mudanças em campos, tipos, rotas, autenticação, Models ou funcionalidades devem ser avaliadas entre as áreas antes de virar novo contrato.
