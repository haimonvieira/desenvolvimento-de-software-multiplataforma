---
name: Certidão de Registro
description: Catálogo e ficha cadastral de empresas, com cara de certidão em papel de segurança.
colors:
  papel: "#f7f5ef"
  tinta: "#1d1b16"
  dourado: "#b08d3f"
  rotulo: "#5c5648"
  filete: "#c9c3b5"
  campo: "#9c9687"
  selo: "#0f5132"
  branco: "#ffffff"
typography:
  display:
    fontFamily: "Georgia, \"Times New Roman\", Times, serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.25
  headline:
    fontFamily: "Georgia, \"Times New Roman\", Times, serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Georgia, \"Times New Roman\", Times, serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.06em"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    size: "40px"
  button-primary-hover:
    backgroundColor: "{colors.rotulo}"
    textColor: "{colors.papel}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    size: "40px"
  button-secondary:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    size: "40px"
  input:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "0 10px"
    size: "40px"
  card-verbete:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "12px 0"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.selo}"
    rounded: "{rounded.full}"
    size: "132px"
---

# Design System: Certidão de Registro

## Overview

**Creative North Star: "A Certidão em Papel de Segurança"**

A tela é tratada como uma folha de registro oficial: fundo de papel envelhecido, tinta escura, filete dourado em borda dupla e um selo circular que carrega a situação cadastral ou a contagem real de registros. Não há cards com foto, botões arredondados ou ilustrações decorativas — a autoridade vem da tipografia serifada e da estrutura de verbetes em colunas.

A densidade é alta e funcional: cada linha é um par rótulo/valor, separado por filetes pontilhados. O verde-selo só aparece quando os dados comprovam uma situação ativa; do contrário, a informação segue na cor da tinta. A interface reage pouco, mas com precisão: foco dourado, hover escurecido e um spinner de carregamento que lembra a rotação de um carimbo.

**Key Characteristics:**
- Papel envelhecido como fundo único, com moldura dourada dupla no container.
- Tipografia serifada (Georgia) para títulos, nomes e valores principais; sans-serif do sistema para rótulos; mono para CNPJ.
- Verbetes em linhas rótulo/valor, separados por filetes pontilhados.
- Selo circular girado -6° como carimbo de situação ou contagem.
- Quase todos os cantos são retos; só o selo é circular.

## Colors

A paleta é restrita e funcional: papel, tinta, dourado para a moldura, tons de cinza quente para rótulos e filetes, e verde-selo para dados ativos.

### Primary
- **Papel Envelhecido** (`#f7f5ef`): fundo de toda a aplicação, do `html` ao `body` ao container.
- **Dourado Filete** (`#b08d3f`): moldura dupla do container, kicker de linha de registro, foco de outline, e topo do spinner de carregamento.
- **Selo Verde** (`#0f5132`): cor do carimbo circular e dos valores de situação ativa ("EM FUNCIONAMENTO NORMAL", "ATIVA").

### Neutral
- **Tinta** (`#1d1b16`): cor principal do texto, botões primários, bordas de erro e borda do selo quando a situação não é ativa.
- **Rótulo** (`#5c5648`): rótulos de verbetes, subtítulos e estado hover do botão primário.
- **Filete** (`#c9c3b5`): divisões pontilhadas entre rótulos e valores, bordas de estados vazio, e anel do spinner.
- **Campo** (`#9c9687`): borda de inputs e botões secundários.
- **Branco** (`#ffffff`): fundo dos inputs, botões secundários e fallback de superfície sobre o papel.

### Named Rules
**The Selo Carrega Dado Real Rule.** O carimbo circular nunca é decorativo: na home mostra o número real de registros, no detalhe mostra a situação cadastral retornada pela API. Se a situação não for ativa, o selo usa a cor da tinta, não o verde.

**The Verde Só Para Ativa Rule.** A cor `#0f5132` é reservada para situação cadastral ativa. Nenhum outro dado ou elemento a usa como acento.

## Typography

**Display Font:** Georgia ("Times New Roman", Times, serif)
**Body Font:** system-ui (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif)
**Label/Mono Font:** ui-monospace (SFMono-Regular, Menlo, Consolas, "Liberation Mono", "Courier New", monospace)

**Character:** A combinação evoca documento oficial: serifas nos títulos e nomes dão peso institucional, enquanto a sans do sistema mantém rótulos neutros e legíveis em corpo pequeno. O mono é usado apenas para CNPJ, reforçando que é um identificador, não um nome.

### Hierarchy
- **Display** (400, 28px, line-height 1.25): título de página — "Catálogo de Empresas" e "Certidão de Registro".
- **Headline** (700, 24px, line-height 1.25): nome fantasia/razão social no topo da ficha detalhe.
- **Title** (700, 18px, line-height 1.25): títulos de seção na ficha — "Dados cadastrais", "Endereço e contato" etc.
- **Body** (400, 14px, line-height 1.5): valores dos verbetes, parágrafos de erro/vazio e textos auxiliares.
- **Label** (400, 10px, line-height 1.25, letter-spacing 0.06em, uppercase): rótulos dos verbetes e campos de busca.

### Named Rules
**The Kicker Em Serif Rule.** A linha de registro no topo ("BrasilAPI · CVM", "BrasilAPI · Receita Federal") usa a mesma Georgia serifada do título, em 12px uppercase, cor dourada. Isso une a identidade da fonte em vez de usar uma sans secundária.

**The CNPJ Em Mono Rule.** Todo identificador CNPJ exibido usa a família mono, seja no catálogo ou na ficha detalhe.

## Layout

O layout é uma única folha centralizada, com largura máxima de 1440px e moldura dourada dupla. Dentro dela, o conteúdo flui verticalmente, com duas colunas de verbetes apenas na home a partir de 768px.

- **Container:** sem `max-width` (a folha ocupa a viewport), `min-height: calc(100vh - 2rem)`, borda simples de 1px dourada + outline de 1px dourado com offset de 4px. Padding 20px mobile, 28px a partir de 640px, 40px a partir de 1024px.
- **Home:** header com título à esquerda e selo à direita a partir de 640px; em mobile, o selo fica abaixo do título alinhado à direita. Barra de busca com dois campos e botão. Grid de verbetes em 1 coluna até 767px e 2 colunas a partir de 768px.
- **Detalhe:** botão "Voltar ao catálogo" no topo; header igual ao da home; depois, seções empilhadas de verbetes. Cada seção usa 1 coluna até 767px e 2 colunas a partir de 768px, exceto "Atividade principal", que é sempre 1 coluna.
- **Rhythm:** margens entre seções de 24px; seções de detalhe usam 32px. Espaçamento entre linhas de um verbete: 10px vertical.

### Named Rules
**The Filete Dourado Só No Papel Rule.** A borda dupla dourada pertence apenas ao container externo. Nenhum card, botão ou input usa dourado em sua borda.

**The Duas Colunas Só Para Verbetes Rule.** O layout de duas colunas é usado apenas para listagens de pares rótulo/valor. Títulos, busca e selo permanecem em fluxo único.

## Elevation & Depth

O sistema é completamente flat. Não há sombras, gradientes, backdrop-filter nem elevação em cards. A profundidade visual vem da sobreposição do container branco-papel contra o fundo papel, da borda dupla dourada e da densidade tipográfica. O único movimento de profundidade é o estado hover dos botões, que inverte ou escurece a cor de fundo, sem elevação.

## Shapes

A forma dominante é o retângulo. Inputs, botões, cards e containers têm cantos retos (`border-radius: 0`). A única exceção é o selo circular, com 132px de diâmetro no desktop e 88px no mobile, borda de 3px e rotação de -6°. O spinner de carregamento também é circular, com 40px de diâmetro e borda de 4px.

- **Container:** retangular, borda dupla dourada.
- **Inputs:** retangulares, altura 40px, borda 1px na cor campo.
- **Botões:** retangulares, altura 40px, sem radius.
- **Cards/verbetes:** retangulares, separados por borda inferior sólida e linhas internas pontilhadas.
- **Selo:** círculo perfeito, borda 3px, girado -6°.

### Named Rules
**The Quadrado Por Padrão Rule.** Todos os elementos interativos e de superfície são quadrados. Cantos arredondados são exceção e só aparecem no selo e no spinner.

## Components

### Buttons
- **Primary:** fundo `#1d1b16`, texto `#f7f5ef`, altura 40px, padding lateral 18px, cantos retos. Hover muda o fundo para `#5c5648`. Foco: outline dourado de 2px.
- **Secondary:** fundo `#ffffff`, borda 1px `#9c9687`, texto `#1d1b16`, altura 40px, padding lateral 16px, cantos retos. Hover muda a borda para `#1d1b16`. Foco: outline dourado de 2px.
- **Transition:** `transition` padrão do CSS para `background-color` e `border-color`.

### Inputs
- **Style:** fundo branco, borda 1px `#9c9687`, altura 40px, padding lateral 10px, cantos retos.
- **Placeholder:** cor `#5c5648` (rótulo), via utilitário `placeholder:text-*` no próprio input.
- **Focus:** outline de 2px na cor dourada, com offset negativo de 2px.
- **Error:** mensagem abaixo do campo na cor da tinta; campo recebe `aria-invalid="true"`.

### Cards / Containers
- **Container principal:** papel `#f7f5ef`, max-width 1440px, borda 1px dourada + outline 1px dourado com offset 4px.
- **Verbete (card de catálogo):** bloco retangular com borda inferior sólida na cor filete; internamente, cada par rótulo/valor é separado por borda inferior pontilhada na mesma cor. Hover não muda a cor de fundo; o link recebe foco dourado.
- **Estado vazio:** borda 1px filete, padding 32px, texto centralizado.
- **Estado de erro:** borda 1px tinta, padding 20px.

### Navigation
- **Voltar ao catálogo:** botão secundário no topo da página de detalhe.
- **Links de verbete:** todo o bloco do catálogo é clicável e leva à rota `/empresa/[cnpj]`. Sem sublinhado; foco dourado.

### Selo (Signature Component)
- **Shape:** círculo perfeito, 132px no desktop, 88px no mobile.
- **Border:** 3px na cor do selo (ativo) ou tinta (inativo).
- **Rotation:** `-rotate-6` (CSS `transform: rotate(-6deg)`).
- **Content:** texto centralizado em duas linhas, fonte serifada, 12px desktop / 11px mobile, uppercase, tracking 0.04em.
- **Data:** carrega o total de registros na home ou a situação cadastral no detalhe. Enquanto carrega, exibe "Consultando…".

### Loading
- **Spinner:** círculo de 40px com borda de 4px; anel completo na cor filete, topo na cor dourada; animação contínua de rotação (`animate-spin`).
- **Texto:** "Consultando registro…" em Georgia, 14px, cor rótulo, com letter-spacing wide.

## Do's and Don'ts

### Do:
- **Do** manter o fundo papel em toda a aplicação.
- **Do** usar Georgia para títulos, nomes e kickers; sans do sistema para rótulos; mono para CNPJ.
- **Do** reservar o verde-selo `#0f5132` para situação cadastral ativa e para o selo quando carrega essa situação.
- **Do** usar filetes pontilhados entre rótulos e valores de verbetes.
- **Do** girar o selo em -6° e mantê-lo carregando dado real da API.

### Don't:
- **Don't** usar cantos arredondados em botões, inputs ou cards — só o selo é circular.
- **Don't** adicionar sombras, gradientes ou elevação aos cards.
- **Don't** usar o verde-selo como cor de destaque genérica; ele pertence à situação ativa.
- **Don't** substituir o selo por um badge retangular ou chip.
- **Don't** inventar valores para campos ausentes da API; use "Não informado".
