# Visão geral — SORC1 (DSM1/SORC1)

## O que o material cobre

O corpus de SORC1 tem **7 arquivos** e **301 páginas**:

1. Tipos de redes de computadores (16 p.).
2. Topologia de rede, modelo OSI e host (27 p.).
3. Protocolo TCP/IP, máscara de sub-rede e broadcast (18 p.).
4. Tipos de cabos, conectores e ferramentas para crimpagem (22 p.).
5. Rack e dispositivos de rede (19 p.).
6. Classificação de fluxo de transmissão (15 p.).
7. Curso de Linux da UFPR/PET (184 p.).

As seis primeiras são apresentações do professor Maylon H. Oliveira. A sétima é
um curso introdutório de Linux em quatro aulas, de outra instituição, usado como
apoio.

## Sequência didática que o corpus revela

| Ordem | Tema | Onde está |
| --- | --- | --- |
| 1 | Definição de rede e sumário da disciplina | materiais-01, p. 4–6 |
| 2 | LAN, MAN, WMAN, WAN, WLAN, SAN e PAN | materiais-01, p. 9–15 |
| 3 | Definição e tipos de topologia | materiais-02, p. 4–9 |
| 4 | Modelo OSI: conceito e sete camadas | materiais-02, p. 11–20 |
| 5 | Host | materiais-02, p. 22 |
| 6 | Questões de fixação | materiais-02, p. 23–27 |
| 7 | TCP/IP e octetos | materiais-03, p. 4–5 |
| 8 | Classes de IP e separação rede/host | materiais-03, p. 6–9 |
| 9 | Máscara de sub-rede e contagem de hosts | materiais-03, p. 11–15 |
| 10 | Broadcast | materiais-03, p. 17–18 |
| 11 | Cabos coaxial, fibra e par trançado | materiais-04, p. 2–6 |
| 12 | Categorias de cabo de rede | materiais-04, p. 8–12 |
| 13 | Conectores, crimpagem, 568A/568B e crossover | materiais-04, p. 13–19 |
| 14 | Patch cord | materiais-04, p. 20–22 |
| 15 | Rack, patch panel, voice panel e nobreak | materiais-05, p. 3–12 |
| 16 | Hub versus switch | materiais-05, p. 13–15 |
| 17 | Simplex, half-duplex e full-duplex | materiais-06, p. 3–6 |
| 18 | Linux: SO, kernel e história | curso de Linux, p. 2–29 |
| 19 | Distribuições | curso de Linux, p. 30–36 |
| 20 | Sistema de arquivos e GUI | curso de Linux, p. 37–53 |
| 21 | Terminal, shell e caminhos | curso de Linux, p. 54–63 |
| 22 | Comandos básicos, navegação e arquivos | curso de Linux, p. 79–107 |
| 23 | Streams, redirecionamento e coringas | curso de Linux, p. 114–124 |
| 24 | Usuários, permissões, pipes e filtros | curso de Linux, p. 132–154 |
| 25 | SSH, SCP e sshfs | curso de Linux, p. 168–182 |

## O que o corpus NÃO cobre

- IPv6.
- Sub-redes com VLSM, CIDR variável e cálculo binário detalhado.
- VLANs e segmentação lógica.
- Protocolos de roteamento (OSPF, BGP, RIP).
- NAT, firewall e proxy em profundidade.
- DHCP, DNS, GPO, Server 2025 e Packet Tracer — aparecem só no sumário do
  curso (materiais-01, p. 4), sem conteúdo.
- Wi-Fi em nível de padrões (802.11a/b/g/n/ac/ax).
- Cabeamento estruturado em detalhe (normas, patch panel por trás).
- Administração avançada de Linux: systemd, journalctl, gerenciamento de
  serviços, usuários além do básico, scripts completos.
- Gabarito oficial das questões e dos exercícios.

## Como estudar por este material

1. Associe cada tipo de rede a um **alcance** e a um **exemplo**.
2. Desenhe as quatro topologias e diga a vantagem e a desvantagem de cada uma.
3. Memorize a ordem das sete camadas OSI e uma função por camada.
4. Treine a classe do IP pelo primeiro octeto e a máscara padrão.
5. Refaça as contas de hosts de /8, /16 e /24 **subtraindo 2**.
6. Compare os cabos por alcance, imunidade e custo.
7. Decore a ordem dos oito fios nos padrões 568A e 568B.
8. No Linux, pratique os comandos em um terminal de verdade; ler a lista não
   substitui a execução.

## Limite de confiança

Os slides são curtos e muitos dependem de imagens. O curso de Linux é de outra
instituição e usa exemplos do DInf/UFPR (usuário, servidores `macalan`,
`orval`, `cpu1` e `cpu2`), que não existem na Fatec. Há erros de digitação e
pelo menos uma divergência técnica em categorias de cabo (ver
`03-fontes.md`). Para valores atuais de padrões de rede, confirme fora do corpus
e rotule como complemento.
