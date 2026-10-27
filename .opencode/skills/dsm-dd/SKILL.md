---
name: DSM — Design Digital (DD)
description: Responde dúvidas de Design Digital do curso DSM usando o material local em conhecimento/DSM1/DD. Cobre princípios do design (proximidade, espaço em branco, alinhamento, contraste, hierarquia, repetição), teoria e psicologia das cores, círculo cromático, harmonias, regra 60-30-10, padrões RGB/HEX/HSL/CMYK/Pantone, imagem bitmap e vetorial, PPI/DPI, formatos (JPEG, GIF, PNG, SVG, PDF, PSD, WEBP, TIFF, AVIF), resoluções e aspect ratio, tipografia, identidade visual e prototipação Lo-Fi/MVP/Figma. Use quando a pergunta citar design digital, cor, paleta, tipografia, imagem, resolução, protótipo, Figma, identidade visual ou UI/UX na disciplina DD.
metadata:
  opencode/autoinvoke: false
---

# Design Digital (DSM1/DD)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica. O corpus tem 9 aulas em PDF (303 páginas).

## Escopo

Entram: definição de design digital e papel do designer; UI versus UX; os seis
princípios do design; teoria das cores (círculo cromático, matiz/saturação/
brilho, harmonias, regra 60-30-10); psicologia das cores; espectro
eletromagnético; padrões de cor (RGB, canal alpha, HEX, HSL, CMYK, Pantone);
imagem digital (bitmap, vetor, PPI, DPI, interpolação, compressão); formatos de
imagem; tamanho e resolução de tela; aspect ratio; tipografia (família, cinco
categorias, leading, tracking, kerning, combinação); identidade visual;
prototipação (Lo-Fi, média, Hi-Fi, MVP) e Figma (grid, estilos, componentes,
plugins).

Não entram (e não devem ser inventados como se fossem do material): direitos
autorais na prática, acessibilidade visual, teoria avançada de gestalt, motion
design, design systems completos, testes com usuários e métricas de UX.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "termo" --disciplina DSM1/DD --limite 8
   ```

2. **Leia o trecho** e responda com o vocabulário do material.

3. **Cite sempre** `conhecimento/DSM1/DD/<arquivo>.md` e a página (`p. N`).

4. **Diferencie UI de UX** sempre que a perguntamisturar os dois: UI é
   visual/estética; UX é funcionalidade/usabilidade (aula 01, p. 7).

5. **Se não houver cobertura**, diga "isso não está no material indexado de DD"
   e só então ofereça conhecimento externo, rotulado.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| RGB e CMYK servem para a mesma finalidade | RGB é cor-luz (telas); CMYK é cor-pigmento (impressão) — aula 03, p. 25 e 29 |
| Pantone é um padrão de cor como RGB | O corpus diz que **não é**: é um catálogo cromático para padronizar nomenclatura — aula 03, p. 30 |
| HEX e RGB são sistemas diferentes | HEX é outra sintaxe para o mesmo modelo RGB — aula 03, p. 14–15 |
| Bitmap e vetor se comportam igual ao redimensionar | Bitmap perde qualidade (interpolação); vetor é baseado em fórmulas e escala sem perda — aula 04, p. 14–18 |
| PPI e DPI são a mesma coisa | PPI é pixels por polegada (imagem); DPI é pontos por polegada (impressão) — aula 04, p. 10–13 |
| 60-30-10 é uma medição exata | O corpus diz que os valores são "de certa forma imaginários" e servem para indicar grandeza — aula 02.1, p. 27 |
| Fonte serifada é melhor para tela | O corpus diz que sans serif é a preferida para peças digitais; serifada é clássica e comum em impressos — aula 05, p. 7–9 |
| Pode usar muitas fontes | O limite recomendado é **2 a 3 fontes** — aula 05, p. 19 |
| Wireframe é protótipo de alta fidelidade | Wireframe/rascunho/sketch é **baixa** fidelidade — aula 07, p. 7 |

## Números e fatos que precisam sair exatos

- **Seis princípios:** proximidade, espaço em branco, alinhamento, contraste,
  hierarquia e repetição (aula 01, p. 8 e 40).
- **Círculo cromático:** 12 cores = 3 primárias + 3 secundárias + 6 terciárias
  (aula 02.1, p. 11).
- **Harmonias (6):** monocromática, análoga, complementar, complementar
  dividida, triádica e tetrádica (aula 02.1, p. 18–26).
- **60-30-10:** 60% dominante, 30% secundária, 10% destaque (aula 02.1, p. 28).
- **RGB:** cada canal vai de **0 a 255** (aula 03, p. 3).
- **Alpha:** de **0 a 1** no RGB (aula 03, p. 12); PNG tem canal alpha (p. 11).
- **HEX:** `#` + 6 dígitos; 2 para vermelho, 2 para verde, 2 para azul
  (aula 03, p. 14).
- **HSL:** tom em graus; saturação e luminosidade em porcentagem (p. 20).
- **Pantone:** criado em **1963** (aula 03, p. 31).
- **DPI:** 150 (texto/interno), 300 (boa qualidade), 600 (alta), 1200
  (fotográfica), acima de 1200 (fotógrafos) — aula 04, p. 13.
- **GIF:** CompuServe, **1987**, **256 cores**, até **15 fps** (aula 04, p. 29–30).
- **AVIF:** promete ~**50% menor** que o JPEG (aula 04, p. 37).
- **Resoluções:** VGA 640×480; HD 1280×720; Full HD 1920×1080; 4K
  3840×2160; 8K 7680×4320 (aula 04, p. 52).
- **Aspect ratio:** 4:3 (CRT) e 16:9 (widescreen) (aula 04, p. 50).
- **Tipografia:** 5 categorias — serif, sans serif, condensada, script e
  fantasia/decorativa (aula 05, p. 6–14).
- **Identidade visual:** 4 componentes — logotipo, cores, tipografia e imagens
  (aula 06, p. 3); 5 etapas de criação (p. 13).
- **Grid no Figma:** mobile 4 colunas, gutter 8, margin 24; desktop 12, gutter
  16, margin 24; tablet 8, gutter 12, margin 24 (aula 07, p. 23).
- **MVP:** Minimum Viable Product, versão mais simples que entrega a proposta
  de valor (aula 07, p. 18).

## Cuidados ao responder

- A aula 04, p. 40, **inverte** as definições de tamanho e resolução de tela
  ("a primeira" deveria ser tamanho, não resolução). Use a definição correta:
  tamanho = dimensões físicas em polegadas; resolução = quantidade de pixels.
- O rodapé da aula 03, p. 35, diz "Aula - 04" por engano; o conteúdo é da
  aula 03.
- A aula 00, p. 2, tem rodapé residual de Qualidade e Teste de Software.
- "Complementares dividas" (aula 02.1, p. 23) = complementares divididas.
- "O GIF foi o primeiro formato que possuía alta taxa de **conversão**"
  (aula 04, p. 29) — o sentido é **compressão**.
- Várias páginas são só imagens (exemplos visuais); o texto não as descreve.
- Os exercícios são, em sua maioria, formulários externos ou trabalhos sem
  gabarito; não invente respostas.
- Não altere os arquivos em `DSM1/DD/`.

## Referências

- `references/00-visao-geral.md` — cobertura, sequência e lacunas.
- `references/01-conceitos.md` — princípios, cores, imagem, tipografia, identidade e prototipação.
- `references/02-exercicios.md` — exercícios e trabalhos, com o que tem gabarito.
- `references/03-fontes.md` — inventário das 9 aulas.
- `references/04-glossario.md` — termos.
