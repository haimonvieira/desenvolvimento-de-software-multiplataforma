# Fontes do corpus — SORC1

Inventário dos 7 arquivos em `conhecimento/DSM1/SORC1/`. O corpus é derivado
dos originais em `DSM1/SORC1/Materiais/`, que **não são alterados**.

## Tabela completa

| Arquivo no corpus | Original | Tipo | Págs. | Conteúdo | Confiabilidade |
| --- | --- | --- | --- | --- | --- |
| `materiais-01-tipos-de-redes-de-computadores-pptx.md` | `01 - Tipos de redes de computadores.pptx.pdf` | PDF | 16 | Sumário da disciplina, definição de rede, LAN/MAN/WMAN/WAN/WLAN/SAN/PAN | Alta (material do professor) |
| `materiais-02-topologia-de-rede-modelo-osi-e-host-pptx.md` | `02 - Topologia de rede, Modelo OSI e HOST.pptx.pdf` | PDF | 27 | Topologias, modelo OSI (7 camadas), host, 5 questões | Alta |
| `materiais-03-protocolo-tcp-ip-mascara-de-subrede-e-broadcast-pptx.md` | `03 - Protocolo TCP-IP, Mascara de SubRede e Broadcast.pptx.pdf` | PDF | 18 | TCP/IP, octetos, classes A–E, rede/host, máscaras, hosts, broadcast | Alta, com um erro de digitação |
| `materiais-04-tipos-de-cabos-conectores-e-ferramentas-para-crimpagem.md` | `04 - Tipos de Cabos, conectores e ferramentas para crimpagem.pdf` | PDF | 22 | Coaxial/BNC, fibra, par trançado, categorias Cat5e–Cat8, 568A/568B, crossover, patch cord | Alta, com ressalvas técnicas |
| `materiais-05-rack-e-dispositvos-de-rede-pptx.md` | `05 - Rack e Dispositvos de Rede.pptx.pdf` | PDF | 19 | Rack, porcas gaiolas, patch panel, voice panel, nobreak, PABX, hub e switch | Média: muitas páginas só com imagem |
| `materiais-06-classificacao-de-fluxo-de-transmissao-pptx.md` | `06 - CLASSIFICAÇÃO DE FLUXO DE  TRANSMISSÃO.pptx.pdf` | PDF | 15 | Simplex, half-duplex e full-duplex | Alta |
| `materiais-curso-de-linux-utfpr-2023.md` | `curso_de_linux_utfpr_2023.pdf` | PDF | 184 | Curso introdutório de Linux em 4 aulas (UFPR/PET) | Alta como apoio; **não é da Fatec** |

**Total:** 301 páginas (117 dos seis decks + 184 do curso de Linux).

## O que cada fonte responde melhor

- **Ementa, definição de rede e tipos de rede:** `materiais-01`.
- **Topologias, modelo OSI, host e questões:** `materiais-02`.
- **TCP/IP, classes, máscara, hosts e broadcast:** `materiais-03`.
- **Cabos, categorias, conectores e crimpagem:** `materiais-04`.
- **Rack, patch panel e hub versus switch:** `materiais-05`.
- **Simplex, half-duplex e full-duplex:** `materiais-06`.
- **SO, kernel, história, distribuições, sistema de arquivos, shell, comandos,
  permissões, SSH:** `materiais-curso-de-linux-utfpr-2023`.

## Mapa de páginas dos decks

| Deck | Página | Assunto |
| --- | --- | --- |
| materiais-01 | 4 | Sumário da disciplina (13 tópicos) |
| materiais-01 | 6 | Definição de rede |
| materiais-01 | 9–15 | LAN, MAN, WMAN, WAN, WLAN, SAN, PAN |
| materiais-01 | 16 | Pesquisa sobre usos de cada tipo |
| materiais-02 | 4 | Definição de topologia |
| materiais-02 | 5–9 | Malha, barramento, anel, estrela |
| materiais-02 | 11–12 | Modelo OSI: conceito e limite |
| materiais-02 | 13 | Diagrama das 7 camadas (os nomes vêm daqui) |
| materiais-02 | 14–20 | Descrição da camada física à de aplicação |
| materiais-02 | 22 | Definição de host |
| materiais-02 | 23–27 | 5 questões de múltipla escolha, sem gabarito |
| materiais-03 | 4–5 | TCP/IP e octetos |
| materiais-03 | 6 | Classes A–E |
| materiais-03 | 7 | Exercício de identificação de classe |
| materiais-03 | 9 | Separação rede/host |
| materiais-03 | 11 | Máscara de sub-rede |
| materiais-03 | 12 | Exemplo `192.168.0.50` (com erro de digitação) |
| materiais-03 | 13–15 | Contagem de hosts para /8, /16 e /24 |
| materiais-03 | 17–18 | Broadcast |
| materiais-04 | 2–3 | Cabo coaxial e BNC |
| materiais-04 | 4 | Fibra óptica |
| materiais-04 | 5–6 | Par trançado, categorias e desvantagens |
| materiais-04 | 8–12 | Cat5e, Cat6, Cat6a, Cat7 e Cat8 |
| materiais-04 | 13–16 | Conectores e ferramenta de crimpagem |
| materiais-04 | 17–18 | 568A e 568B |
| materiais-04 | 19 | Crossover |
| materiais-04 | 20–22 | Patch cord |
| materiais-05 | 3–4 | Modelos de rack e fixação |
| materiais-05 | 5–11 | Patch panel e voice panel |
| materiais-05 | 8–9 | Nobreak |
| materiais-05 | 12–14 | PABX e hub |
| materiais-05 | 15 | Switch |
| materiais-06 | 3–6 | Simplex, half-duplex, full-duplex |

## Mapa do curso de Linux

| Aula | Páginas | Assunto |
| --- | --- | --- |
| Aula I | 1–36 | SO, kernel, Windows/macOS, história do Unix/GNU/Linux, distribuições |
| Aula I | 37–53 | Sistema de arquivos, diretórios, GUI, window manager |
| Aula I | 54–67 | CLI, terminal, shell, caminhos e instalação |
| Aula II | 68–112 | Comandos básicos, navegação, arquivos e editores |
| Aula III | 113–154 | Streams, redirecionamento, coringas, usuários, permissões, pipes e filtros |
| Aula IV | 155–184 | `find`, `grep`, `cut`, SSH, SCP, mount e sshfs |

## Lacunas do acervo

- IPv6 e endereçamento de 128 bits.
- Sub-redes com VLSM, CIDR variável e cálculo binário detalhado.
- VLANs e segmentação lógica.
- Protocolos de roteamento (OSPF, BGP, RIP).
- NAT, firewall e proxy em profundidade.
- DHCP, DNS, GPO, Server 2025 e Packet Tracer — apenas citados no sumário
  (`materiais-01`, p. 4), sem conteúdo.
- Padrões Wi-Fi (802.11a/b/g/n/ac/ax).
- Normas de cabeamento estruturado.
- Administração avançada de Linux (systemd, journalctl, serviços, scripts).
- Gabarito oficial das questões e dos exercícios.

## Cuidados de citação

- Cite `conhecimento/DSM1/SORC1/<arquivo>.md` e a página (`p. N`).
- `materiais-03`, p. 12, escreve "Rede: 191.171.0" no exemplo de
  `192.168.0.50`. O correto é **192.168.0**.
- Os **nomes das camadas OSI não estão no texto**: vêm do diagrama da p. 13 e da
  ordem das descrições das p. 14–20. Diga isso ao citar.
- As questões das p. 23–27 **não têm gabarito**. Respostas derivadas: **b, c, b,
  c, b**. Rotule como derivação.
- `materiais-04`, p. 5, diz "7 categorias", mas só detalha **cinco**.
- `materiais-04`, p. 11–12, informa **100 m** para Cat7 e Cat8; na prática Cat8
  é limitado a ~30 m. Registre a divergência.
- `materiais-05` tem páginas só com imagem (rack, patch panel, voice panel); o
  texto não descreve os equipamentos.
- O curso de Linux é da **UFPR/PET**, com servidores `macalan`, `orval`, `cpu1`
  e `cpu2` que não existem na Fatec.
- O broadcast é definido de forma genérica (`materiais-03`, p. 17); o endereço
  de broadcast de uma sub-rede é **derivação**.
- Não altere os arquivos em `DSM1/SORC1/`.
