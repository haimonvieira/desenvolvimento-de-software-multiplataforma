---
name: DSM — Sistemas Operacionais e Redes de Computadores (SORC1)
description: Responde dúvidas de Sistemas Operacionais e Redes de Computadores do curso DSM usando o material local em conhecimento/DSM1/SORC1. Cobre tipos de rede (LAN, MAN, WMAN, WAN, WLAN, SAN, PAN), topologias (malha, barramento, anel, estrela), modelo OSI de 7 camadas, host, TCP/IP e octetos, classes de IP, máscara de sub-rede (/8, /16, /24), cálculo de rede/host, broadcast, cabos (coaxial/BNC, fibra óptica, par trançado e categorias Cat5e a Cat8), padrões 568A/568B e crossover, patch cord, rack, patch panel, hub versus switch, simplex/half-duplex/full-duplex e fundamentos de Linux (kernel, distribuições, sistema de arquivos, shell, comandos, permissões, streams, SSH/SCP/sshfs). Use quando a pergunta citar SORC1, rede, topologia, OSI, TCP/IP, endereço IP, máscara, broadcast, cabo de rede, crimpagem, switch, Linux ou terminal.
metadata:
  opencode/autoinvoke: false
---

# Sistemas Operacionais e Redes de Computadores (DSM1/SORC1)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica. O corpus tem 6 apresentações em PDF (117
páginas) e um curso de Linux (184 páginas).

## Escopo

Entram: definição de rede e de host; tipos de rede (LAN, MAN, WMAN, WAN, WLAN,
SAN, PAN); topologias (malha, barramento, anel, estrela); modelo OSI e as sete
camadas; TCP/IP e octetos; classes A–E; separação rede/host; máscaras /8, /16 e
/24 e contagem de hosts; broadcast; cabos coaxial (BNC), fibra óptica e par
trançado; categorias Cat5e, Cat6, Cat6a, Cat7 e Cat8; padrões 568A/568B,
crossover e patch cord; rack, patch panel e voice panel; hub versus switch;
simplex, half-duplex e full-duplex; e o curso de Linux (SO e kernel, história
Unix/GNU/Linux, distribuições, sistema de arquivos, GUI, shell, comandos
básicos, permissões, streams, pipes, SSH, SCP e sshfs).

Não entram (e não devem ser inventados como se fossem do material): cálculo de
sub-redes com VLSM ou CIDR além de /8, /16 e /24; IPv6; VLANs; protocolos de
roteamento (OSPF, BGP, RIP); firewall e NAT em profundidade; DHCP, DNS, GPO e
Server 2025 (aparecem só no sumário do curso); Packet Tracer; administração
avançada de Linux; systemd; scripts de shell completos.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "termo" --disciplina DSM1/SORC1 --limite 8
   ```

2. **Leia o trecho** e responda com o vocabulário do material.

3. **Cite sempre** `conhecimento/DSM1/SORC1/<arquivo>.md` e a página (`p. N`).

4. **Mostre a conta** em exercícios de IP, máscara e hosts. O material cobra o
   resultado, não só a definição.

5. **Diferencie o que é do slide e o que é derivação.** O corpus define
   broadcast em termos gerais e não ensina a fórmula do endereço de broadcast;
   se você calcular o último endereço da sub-rede, rotule como **derivação**.

6. **Se não houver cobertura**, diga "isso não está no material indexado de
   SORC1" e só então ofereça conhecimento externo, rotulado.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| Hub e switch fazem a mesma coisa | O corpus chama o hub de **concentrador** e o switch de componente que conecta dispositivos e permite que conversem — `materiais-05`, p. 14–15 |
| Estrela é o mesmo que malha | Estrela liga todos a um **concentrador**; malha tem **múltiplos caminhos redundantes** — `materiais-02`, p. 6 e 9 |
| Barramento usa par trançado | O corpus diz que a topologia em barramento usa normalmente **cabo coaxial** com terminador resistivo nas pontas — `materiais-02`, p. 7 |
| Máscara /8 tem 16.777.216 hosts utilizáveis | São 16.777.216 endereços; **menos 2** (rede e broadcast) = **16.777.214** — `materiais-03`, p. 13 |
| A classe do IP é definida pela máscara | O corpus define a classe pelo **primeiro octeto** e associa a máscara padrão depois — `materiais-03`, p. 6 e 11 |
| 127 pode ser usado como host | O corpus diz que **0 e 127 não são utilizados** — `materiais-03`, p. 6 |
| Cat7 e Cat8 também são 100 m | O corpus repete 100 m para todas as categorias, mas isso **não vale para Cat8** na prática (30 m). Sinalize a ressalva — `materiais-04`, p. 11–12 |
| Cabo crossover é 568A nas duas pontas | Crossover é **568A em uma ponta e 568B na outra** — `materiais-04`, p. 19 |
| Full-duplex é alternar o sentido | Full-duplex transmite e recebe **ao mesmo tempo**; half-duplex alterna — `materiais-06`, p. 5–6 |
| Todo sistema operacional livre é Linux | GNU é o sistema e o kernel é o Linux; **GNU/Linux** é a junção — `materiais-curso-de-linux`, p. 15–26 |
| `>` e `>>` fazem a mesma coisa | `>` é **destrutivo** (sobrescreve); `>>` é **não destrutivo** (acrescenta) — curso de Linux, p. 120 |
| `chmod` só aceita notação octal | O corpus ensina a notação **textual** `[ugoa][+-=][rwx]` e manda pesquisar a octal — curso de Linux, p. 138 |

## Números e fatos que precisam sair exatos

- **LAN:** mesmo espaço físico (empresa, escola, casa) — `materiais-01`, p. 9.
- **MAN:** conecta redes locais dentro de **dezenas de quilômetros** —
  `materiais-01`, p. 10.
- **WMAN:** versão sem fio da MAN, também dezenas de quilômetros — p. 11.
- **WAN:** área geográfica de **grande escala** — p. 12.
- **WLAN:** rede local sem fio — p. 13.
- **SAN:** comunicação entre servidor e outros computadores, restrita a isso —
  p. 14.
- **PAN:** distância bastante limitada; exemplos **Bluetooth** e **UWB** —
  p. 15.
- **Topologias:** malha, barramento, anel e estrela — `materiais-02`, p. 5.
- **OSI:** **7 camadas**; o modelo define **funções**, não serviços e
  protocolos exatos — `materiais-02`, p. 11–12.
- **Host:** todo computador ligado à rede por IP e domínio, que oferece
  recursos, informações e serviços — `materiais-02`, p. 22.
- **IPv4:** **4 octetos**, cada um de 0 a 255, separados por pontos —
  `materiais-03`, p. 5.
- **Classes:** A **1–126**; B **128–191**; C **192–223**; D **224–239**;
  E **240–255**; **0 e 127 não são utilizados** — p. 6.
- **Separação rede/host:** A = 1 octeto de rede; B = 2; C = 3 — p. 9.
- **Máscaras:** A `/8` = 255.0.0.0; B `/16` = 255.255.0.0; C `/24` =
  255.255.255.0 — p. 11.
- **Hosts utilizáveis:** `/8` = 16.777.214; `/16` = 65.534; `/24` = 254 —
  p. 13–15.
- **Coaxial:** condutor de cobre, isolante, blindagem e conector **BNC** —
  `materiais-04`, p. 2.
- **Fibra óptica:** converte dados em **luz**; maior velocidade e baixa
  atenuação — p. 4.
- **Par trançado:** pares de cobre; máximo de **100 m**; baixa imunidade a
  interferência — p. 5–6.
- **Categorias:** Cat5e 100 MHz/100 Mbps; Cat6 250 MHz/1 Gbps; Cat6a 500
  MHz/10 Gbps; Cat7 600 MHz/10–40 Gbps; Cat8 2000 MHz/40 Gbps; distância de
  100 m no material — p. 8–12.
- **568A:** branco/verde, verde, branco/laranja, azul, branco/azul, laranja,
  branco/marrom, marrom — p. 17.
- **568B:** branco/laranja, laranja, branco/verde, azul, branco/azul, verde,
  branco/marrom, marrom — p. 18.
- **Crossover:** 568A em uma ponta e 568B na outra — p. 19.
- **Fluxos:** simplex (um sentido), half-duplex (dois sentidos, alternados),
  full-duplex (dois sentidos, simultâneos) — `materiais-06`, p. 3–6.
- **Linux:** kernel de Linus Torvalds a partir de **1991**; primeira versão
  oficial em **5 de outubro de 1991**; GPL em **fevereiro de 1992** — curso de
  Linux, p. 21.
- **Unix:** Bell Labs/AT&T, a partir de **1969**, por **Ken Thompson** e
  **Dennis Ritchie** — p. 12.
- **GNU:** **Richard Stallman**; kernel **Hurd** ficou incompleto — p. 15.
- **Minix:** **Andrew Tanenbaum**, **1987**, C, microkernel — p. 18.
- **Distribuições:** Debian 1993/apt; Fedora 2003/rpm; Arch 2002/rolling
  release/pacman — p. 33–35.
- **Permissões:** **rwx** para **user, group, others** — p. 136.
- **SSH:** porta **22**, camada de aplicação, criptografia de chave pública —
  p. 169 e 171.

## Cuidados ao responder

- `materiais-03`, p. 12, tem erro de digitação: o exemplo é `192.168.0.50`, mas
  o slide escreve "Rede: 191.171.0". O correto é **192.168.0**.
- `materiais-03`, p. 12, diz "Rede: 191.171.0" e "Host: 50"; use
  `192.168.0.50/24` como exemplo consistente.
- Os nomes das camadas OSI **não estão no texto**: vêm do diagrama da p. 13 e
  da ordem das descrições das p. 14–20. Ao citar, diga isso.
- As questões das p. 23–27 **não têm gabarito oficial**. As respostas
  derivadas são: p. 23 **b**; p. 24 **c**; p. 25 **b**; p. 26 **c**; p. 27
  **b**. Marque como derivação.
- O broadcast do corpus (p. 17) é definido de forma genérica (áudio, vídeo e
  dados para múltiplos destinatários). O endereço de broadcast de uma sub-rede
  é uma **derivação**: último endereço da faixa.
- `materiais-04`, p. 5, diz "7 categorias", mas só detalha cinco (Cat5e, 6, 6a,
  7 e 8). Não invente as duas restantes.
- `materiais-04`, p. 11–12, informa 100 m para Cat7 e Cat8; na prática Cat8 é
  limitado a ~30 m. Registre a divergência.
- `materiais-05` tem muitas páginas só com imagens (rack, patch panel, voice
  panel); o texto não descreve os equipamentos.
- O curso de Linux é da UFPR (PET/Computação), não da Fatec; trate como
  material de apoio, não como slide do professor.
- Os exercícios do curso de Linux são comandos e listas de exercício; não há
  gabarito formal no corpus.
- Não altere os arquivos em `DSM1/SORC1/`.

## Referências

- `references/00-visao-geral.md` — cobertura, sequência e lacunas.
- `references/01-conceitos.md` — redes, OSI, IP, cabos, fluxos e Linux.
- `references/02-exercicios.md` — questões, cálculos e exercícios de Linux.
- `references/03-fontes.md` — inventário dos 7 arquivos.
- `references/04-glossario.md` — termos de rede e de Linux.
