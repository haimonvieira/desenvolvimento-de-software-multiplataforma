# Conceitos consolidados — SORC1

## 1. O que é uma rede

Rede de computadores é um conjunto de **computadores ou dispositivos
interligados por cabo ou wireless que compartilham recursos entre si**
(materiais-01, p. 6). As primeiras redes ficavam dentro de escritórios (rede
local); com a necessidade de trocar informações, surgiram outros tipos
(p. 6).

## 2. Tipos de rede

| Tipo | Nome | Alcance / ideia | Exemplo no corpus |
| --- | --- | --- | --- |
| **LAN** | Local Area Network | Mesmo espaço físico (empresa, escola, casa) | Rede interna de um escritório — p. 9 |
| **MAN** | Metropolitan Area Network | Conecta redes locais em **dezenas de quilômetros** | Dois escritórios na mesma cidade — p. 10 |
| **WMAN** | Wireless Metropolitan Area Network | Versão sem fio da MAN | Campi de universidades — p. 11 |
| **WAN** | Wide Area Network | Área geográfica de **grande escala** | Conexão à internet pela porta WAN do modem — p. 12 |
| **WLAN** | Wireless Local Area Network | Rede local sem fio | Wi-Fi residencial, empresarial e público — p. 13 |
| **SAN** | Storage Area Network | Comunicação entre servidor e outros computadores, restrita a isso | Rede de armazenamento — p. 14 |
| **PAN** | Personal Area Network | Distância bastante limitada | **Bluetooth** e **UWB** — p. 15 |

Fonte: materiais-01, p. 9–15.

## 3. Topologias

**Topologia** é a maneira como os computadores estão **conectados fisicamente**
em uma rede. Ela influencia flexibilidade, velocidade e segurança
(materiais-02, p. 4).

| Topologia | Como funciona | Vantagem / cuidado |
| --- | --- | --- |
| **Malha** | Dispositivos conectados com muitas interconexões redundantes entre nós | Se um cabo ou nó falha, há outros caminhos — p. 6 |
| **Barramento** | Todas as estações compartilham o **mesmo cabo** | Normalmente coaxial, com **terminador resistivo** em cada ponta para manter a impedância — p. 7 |
| **Anel** | Estações conectadas por um **caminho fechado** | O anel é a representação tradicional — p. 8 |
| **Estrela** | Todos os dispositivos ligados a um **concentrador** | Topologia ponto a ponto — p. 9 |

## 4. Modelo OSI

O **Modelo OSI** (Open System Interconnection / Interconexão de Sistemas
Abertos) é um modelo **conceitual** que divide as funções de comunicação em
**sete camadas**, cada uma com responsabilidades específicas. Ele facilita o
entendimento, o desenvolvimento e a solução de problemas e permite a
comunicação entre sistemas diferentes (materiais-02, p. 11).

O modelo **não define uma arquitetura de rede**: não especifica com exatidão os
serviços e protocolos de cada camada. Define apenas **funções**, ou seja, "o que
cada camada deve fazer" (p. 12).

### As sete camadas

Os nomes não aparecem no texto; vêm do diagrama da p. 13 e da ordem das
descrições das p. 14–20.

| Nº | Camada | Função descrita no corpus | Onde |
| --- | --- | --- | --- |
| 7 | **Aplicação** | Fornece serviços às aplicações do utilizador | p. 20 |
| 6 | **Apresentação** | Encriptação e compressão; compatibilidade entre aplicações de sistemas diferentes | p. 19 |
| 5 | **Sessão** | Estabelece, gerencia e termina as sessões entre aplicações | p. 18 |
| 4 | **Transporte** | Controle de fluxo, segmentação e controle de erros | p. 17 |
| 3 | **Rede** | Encaminhamento (routing) de pacotes, fragmentação e endereçamento lógico | p. 16 |
| 2 | **Enlace de dados** | Acesso ao meio físico e controle de erros da camada física | p. 15 |
| 1 | **Física** | Meio físico, conectores, interfaces e codificação/modulação dos sinais | p. 14 |

## 5. Host

**Host** é todo e qualquer computador ou máquina ligada a uma rede por meio de
um **número de IP e domínio definido**, com a responsabilidade de oferecer
recursos, informações e serviços aos usuários. Também é chamado de hospedagem,
hospedeiro ou anfitrião (materiais-02, p. 22).

## 6. TCP/IP e endereço IP

**TCP/IP** significa Transmission Control Protocol / Internet Protocol
(protocolo de controle de transmissão / protocolo da internet). É um **conjunto
de regras padronizadas** que permite que computadores se comuniquem em uma rede
como a internet (materiais-03, p. 4).

### Octetos

O endereço IPv4 é dividido em **quatro grupos de 8 bits**, chamados **octetos**:
quatro números de **0 a 255**, separados por pontos. O endereçamento é
hierárquico e forma sub-redes (materiais-03, p. 5).

```
192 . 168 . 0 . 50
 ↑     ↑    ↑   ↑
octeto 1  2    3   4
```

### Classes

A classe é definida pelo **primeiro octeto** (materiais-03, p. 6):

| Classe | Faixa do 1º octeto | Uso no corpus |
| --- | --- | --- |
| **A** | 1 a 126 | Redes grandes; máscara /8 |
| **B** | 128 a 191 | Redes médias; máscara /16 |
| **C** | 192 a 223 | Redes pequenas; máscara /24 |
| **D** | 224 a 239 | Multicast (o corpus só informa a faixa) |
| **E** | 240 a 255 | Experimental (o corpus só informa a faixa) |

**0 e 127 não são utilizados** (p. 6). Na prática, 127/8 é reservado para
loopback; o corpus não desenvolve isso.

### Separação rede/host

A classe determina quantos octetos identificam a rede (materiais-03, p. 9):

| Endereço | Classe | Rede | Host |
| --- | --- | --- | --- |
| `10.12.27.35` | A | `10` | `12.27.35` |
| `132.147.110.74` | B | `132.147` | `110.74` |
| `192.168.0.97` | C | `192.168.0` | `97` |

## 7. Máscara de sub-rede

A máscara tem **32 bits**, como o IP. Serve para **mascarar** parte do endereço
e identificar o que é **rede** e o que é **host** (materiais-03, p. 11).

| Classe | Máscara | Notação CIDR |
| --- | --- | --- |
| A | `255.0.0.0` | `/8` |
| B | `255.255.0.0` | `/16` |
| C | `255.255.255.0` | `/24` |

### Contagem de hosts

O total de endereços é `2^(bits de host)`. Desse total, **1 é o endereço de
rede** e **1 é o broadcast**, então os hosts utilizáveis são `2^n − 2`
(materiais-03, p. 13–15).

| Máscara | Bits de host | Total de endereços | Hosts utilizáveis |
| --- | --- | --- | --- |
| `/8` | 24 | 16.777.216 | **16.777.214** |
| `/16` | 16 | 65.536 | **65.534** |
| `/24` | 8 | 256 | **254** |

**Exemplo do corpus:** `192.168.0.50` com máscara `255.255.255.0` (classe C).
Rede = `192.168.0`; host = `50`; máscara = `255.255.255.0`; **254 hosts
possíveis** (materiais-03, p. 12).

> **Erro no original:** a p. 12 escreve "Rede: 191.171.0" no exemplo de
> `192.168.0.50`. O correto é `192.168.0`.

## 8. Broadcast

O corpus define **broadcast de rede** como a tecnologia que permite transmitir
informações — áudio, vídeo e dados — para **múltiplos destinatários
simultaneamente** (materiais-03, p. 17). É uma comunicação em massa usada em
televisão, rádio, internet e telefonia.

O material **não ensina a fórmula** do endereço de broadcast. Como o próprio
slide desconta 1 endereço para broadcast na contagem de hosts (p. 13–15), pode-
se derivar que, em uma sub-rede, o broadcast é o **último endereço da faixa**:

- `192.168.0.0/24` → broadcast `192.168.0.255`.
- `10.0.0.0/8` → broadcast `10.255.255.255`.
- `132.147.0.0/16` → broadcast `132.147.255.255`.

Rotule esses cálculos como **derivação**, não como ensinamento literal do
slide.

## 9. Cabos e conectores

### Coaxial

Constituído por um **fio de cobre condutor** revestido por material isolante e
rodeado por uma **blindagem**. Usa conector **BNC** (materiais-04, p. 2).

### Fibra óptica

É o tipo de transmissão **mais rápido** que existe. Converte o sinal de dados em
**luz**; o receptor converte a luz de volta em dados. Transmite grandes
quantidades de informação com **atenuação bastante baixa** (materiais-04, p. 4).

### Par trançado

Composto por **pares de fios de cobre**. O corpus diz que é dividido em **7
categorias**, cada uma com padrão, frequência e taxa próprios (materiais-04,
p. 5), mas detalha apenas cinco.

**Desvantagens** (materiais-04, p. 6):

- comprimento máximo de **100 m**; acima disso começam as perdas;
- **baixa imunidade** a interferências externas — pode melhorar com blindagem,
  mas o custo aumenta.

### Categorias detalhadas

| Categoria | Frequência | Velocidade | Distância (no corpus) | Onde |
| --- | --- | --- | --- | --- |
| **Cat5e** | 100 MHz | 100 Mbps | 100 m | p. 8 |
| **Cat6** | 250 MHz | 1 Gbps | 100 m | p. 9 |
| **Cat6a** | 500 MHz | 10 Gbps | 100 m | p. 10 |
| **Cat7** | 600 MHz | 10/40 Gbps | 100 m | p. 11 |
| **Cat8** | 2000 MHz | 40 Gbps | 100 m | p. 12 |

> **Ressalva técnica:** o corpus repete 100 m para todas. Na prática, Cat8 é
> especificado para ~30 m (e Cat7 para 100 m). Registre a divergência ao
> responder.

### Padrões de crimpagem

O conector é o **RJ45**, com a trava voltada para baixo (materiais-04, p. 17).

**568A** (p. 17):

1. branco/verde
2. verde
3. branco/laranja
4. azul
5. branco/azul
6. laranja
7. branco/marrom
8. marrom

**568B** (p. 18):

1. branco/laranja
2. laranja
3. branco/verde
4. azul
5. branco/azul
6. verde
7. branco/marrom
8. marrom

Os dois padrões servem para tráfego de dados e são ligados a **hub ou switch**;
o 568B também é descrito para **dados e voz** (p. 17–18).

**Crossover:** usado para ligar micros **diretamente pela placa de rede**, sem
hub ou switch. Uma ponta recebe **568A** e a outra **568B** (p. 19).

### Patch cord

O **patch cable** ou **patch cord** é um cabo de ligação entre antenas e
dispositivos informatizados (desktops, notebooks, netbooks, PDAs, smartphones).
Uma ponta liga-se à antena, de forma direta ou por conector próprio
(materiais-04, p. 21–22).

## 10. Rack e dispositivos

O corpus mostra, sobretudo em imagens (materiais-05):

- modelos de **rack** (p. 3);
- fixação das **porcas gaiolas** (p. 4);
- **patch panel** frontal (p. 5);
- **voice panel** (p. 10);
- **nobreak** e nobreak de rack (p. 8–9);
- **central telefônica PABX**, modelo Siemens Hipath 3800 (p. 12–14).

### Hub versus switch

| Equipamento | Definição no corpus |
| --- | --- |
| **Hub** | "Ponto central"; interliga os computadores da rede local e, por ter várias portas, é visto como **concentrador de rede** (p. 14) |
| **Switch** | Principal componente da rede; conecta computadores, access points, impressoras e servidores na mesma rede e permite que compartilhem informações e conversem entre si (p. 15) |

## 11. Classificação do fluxo de transmissão

| Modo | Como funciona | Exemplo |
| --- | --- | --- |
| **Simplex** | Transmissão em **um só sentido**, de um emissor para um ou mais receptores | Rádio e televisão (materiais-06, p. 4) |
| **Half-duplex** | Dois sentidos, mas **alternadamente**: um transmite, o outro escuta, e vice-versa | Comunicação entre computadores (p. 5) |
| **Full-duplex** | Dois sentidos **ao mesmo tempo** | Telefonia; entre computadores, exige pelo menos dois canais, um por sentido (p. 6) |

## 12. Linux

### Sistema operacional e kernel

O sistema operacional é uma **camada de software entre o hardware e os
programas aplicativos** do usuário final. É uma estrutura ampla, com aspectos de
baixo nível (drivers, gerência de memória física) e de alto nível (utilitários e
interface gráfica) — definição de Carlos Maziero citada no curso (p. 4).

O **kernel** (núcleo) é a parte de **mais baixo nível** do SO e gerencia os
recursos do sistema e o hardware. Outra parte do SO é o conjunto de programas
utilitários, como compiladores e editores de texto (p. 6).

### História

- **Unix:** Bell Labs da AT&T, a partir de **1969**, por **Ken Thompson** e
  **Dennis Ritchie**. Escrito em Assembly e C; código fechado. Oferece comandos
  simples combináveis com **pipes** e shell scripting. Deu origem a BSD (→
  FreeBSD e macOS), Solaris e IBM AIX (p. 12).
- **GNU** (GNU is Not Unix): sistema **Unix-like** criado por **Richard
  Stallman** e comunidade, centrado em **Free Software**. O kernel do GNU,
  **Hurd**, não atraiu atenção suficiente e ficou incompleto; a comunidade
  concentrou-se nos utilitários (p. 15).
- **Free Software:** "free" é **livre**, não gratuito. As liberdades são: usar
  para qualquer propósito, estudar e modificar o código, redistribuir cópias
  (cobrando ou não) e distribuir cópias da versão modificada (p. 16).
- **Minix:** sistema Unix-like de **Andrew Tanenbaum**, a partir de **1987**,
  em C, para fins educacionais, com arquitetura de **microkernel** (p. 18).
- **Linux:** kernel livre de **Linus Torvalds**, a partir de **1991**, escrito
  em C. Em 2021 chegou a 27,8 milhões de linhas. A primeira versão oficial saiu
  em **5 de outubro de 1991**; em **fevereiro de 1992** o Linux foi licenciado
  sob a **GPL** (p. 21).
- **GNU/Linux:** sistema Unix-like livre e open-source que usa o **kernel
  Linux** e os **pacotes do GNU**. Não existe "o Linux" único: é uma família de
  sistemas (p. 26).

### Distribuições

Uma **distribuição** é um sistema operacional que usa o kernel Linux e os
pacotes do GNU, acrescentando programas funcionais, gerenciador de pacotes e
interface gráfica. Pode ter versões definidas ou ser **rolling-release**
(p. 31).

| Família | Origem | Gerenciador | Característica |
| --- | --- | --- | --- |
| **Debian** | 1993 | `apt` | Estável, muito usada em servidores; Ubuntu é a filha mais popular (p. 33) |
| **Fedora** | 2003, pela Red Hat | `rpm` | Irmã corporativa: Red Hat Enterprise Linux (p. 34) |
| **Arch** | 2002 | `pacman` | Rolling-release, instalação mínima; Manjaro é a filha amigável (p. 35) |

O **Android** usa uma versão modificada do kernel Linux, mas **não é
considerado** uma distribuição GNU/Linux (p. 36).

### Sistema de arquivos

Gerencia o espaço de armazenamento e organiza a memória em **arquivos contidos
em diretórios**. Cada diretório pode conter arquivos e outros diretórios; nomes
são **case-sensitive**; há **links simbólicos** (p. 38).

Diretórios principais (p. 40):

| Diretório | Conteúdo |
| --- | --- |
| `/` | Raiz; contém todos os diretórios e arquivos do SO |
| `/bin` | Binários executáveis, como comandos da shell |
| `/dev` | Arquivos virtuais especiais, como dispositivos físicos |
| `/boot` | Arquivos do kernel e de boot |
| `/etc` | Arquivos de configuração do sistema |
| `/proc` | Arquivos sobre processos |
| `/usr` | Executáveis dos usuários, bibliotecas, códigos-fonte e documentação |
| `/home` | Diretórios pessoais de cada usuário |
| `/root` | Diretório pessoal do root |
| `/lib` | Bibliotecas necessárias para `/bin` e `/sbin` |
| `/sbin` | Binários do sistema, executáveis pelo root |
| `/tmp` | Arquivos temporários; conteúdo excluído ao reiniciar |
| `/var` | Dados variáveis, como dados de tempo de execução |
| `/opt` | Aplicações opcionais, não disponíveis pela distribuição |
| `/media` | Diretórios montados para mídias removíveis (USB, DVD etc.) |

### GUI, terminal e shell

- **GUI** (Graphical User Interface): interface visual com componentes
  gráficos; alternativa ao CLI e com menor curva de aprendizagem (p. 42).
- **Window manager:** controla localização, comportamento e aparência das
  janelas; pode ser **stacking** ou **tiling** (p. 43–45).
- **Desktop environment:** contém um window manager e adiciona ícones, barras
  de ferramentas, widgets e utilitários (p. 46). Exemplos: GNOME e Cinnamon
  (p. 48–49); window managers: i3 e Hyprland (p. 51–52).
- **CLI** (Command-Line Interface): recebe comandos em linhas de texto; maior
  poder de automação e rapidez (p. 55).
- **Terminal:** dispositivo de entrada e saída; os primeiros eram teletipos e
  depois vieram os displays de vídeo (p. 56–57). Nos PCs, o terminal é um
  **emulador** (p. 59).
- **Shell:** software que interpreta comandos de texto; é linguagem interativa
  e de scripting, e permite combinar comandos. Exemplos: **bash** (GNU) e
  **zsh** (p. 60). É acessada por um emulador de terminal (gnome-terminal,
  terminator, kitty, st).
- **Working directory:** diretório em que o terminal está no momento; ao abrir,
  costuma ser o diretório pessoal (ex.: `/home/pet`) (p. 61). Atalho:
  `Ctrl+Alt+T` (p. 61).
- **Path:** texto que representa a localização de arquivo ou diretório.
  **Absoluto** começa em `/` e aponta sempre para o mesmo lugar; **relativo**
  depende do working directory (p. 62).
- **Atalhos:** `/` raiz, `~` home, `.` diretório atual, `..` diretório pai
  (p. 63).

### Comandos

Estrutura geral: `[comando] [opções] [argumentos]` (p. 80).

| Comando | Função | Onde |
| --- | --- | --- |
| `whoami` | Usuário atual | p. 81 |
| `pwd` | Diretório atual (print working directory) | p. 82 |
| `hostname` | Nome do sistema; fica em `/etc/hostname` | p. 83 |
| `tty` | Arquivo do terminal em questão | p. 84 |
| `who` | Usuários conectados ao sistema | p. 85 |
| `--help` | Documentação breve do comando | p. 89 |
| `man` | Manual completo; sai com `q` | p. 90 |
| `cd` | Muda o diretório atual | p. 92 |
| `ls` | Lista o conteúdo do diretório | p. 93 |
| `ls -a/-l/-1/-m/-t` | Ocultos / detalhes / um por linha / separados por vírgula / ordem de data | p. 94 |
| `touch` | Atualiza datas ou cria arquivo vazio | p. 96 |
| `mkdir` | Cria diretório | p. 97 |
| `rm` / `rmdir` | Remove arquivo / diretório vazio | p. 98 |
| `cp` | Copia arquivos; `-r` para diretórios | p. 101 |
| `mv` | Move ou renomeia | p. 102 |
| `file` | Mostra o tipo real do arquivo (metadados, não extensão) | p. 105 |
| `du -shc *` | Tamanho em bytes de arquivos/diretórios | p. 106 |
| `quota -s` | Consumo da quota do usuário | p. 107 |
| `echo` | Escreve texto na saída padrão; `-n` evita o `\n` | p. 117 |
| `cat` / `tac` | Concatena e escreve na saída / inverte a ordem | p. 118 |
| `history` | Histórico de comandos | p. 141 |
| `head` / `tail` | Primeiras / últimas 10 linhas; `-n` ajusta | p. 145–146 |
| `less` | Leitura interativa; sai com `q` | p. 147 |
| `find` | Busca por nome, data, permissão etc. | p. 149 |
| `grep` | Procura expressão em arquivo | p. 151 |
| `cut` | Corta texto por colunas; `-d` e `-f` | p. 152 |

**Editores:** VS Code (ou VSCodium), gedit, nano, vi/vim/neovim
(p. 109–112).

### Streams e redirecionamento

Nos sistemas Unix há três fluxos padrão (p. 115):

| Stream | Nome | Padrão |
| --- | --- | --- |
| `stdin` | Standard input | Teclado |
| `stdout` | Standard output | Tela |
| `stderr` | Standard error | Tela |

Redirecionamento (p. 120):

- `>` — redireciona stdout para arquivo de forma **destrutiva** (sobrescreve);
- `>>` — redireciona stdout de forma **não destrutiva** (acrescenta);
- `<` — envia o conteúdo de um arquivo para o stdin.

**Pipe** `|` — usa a saída (stdout) de um comando como entrada (stdin) do
próximo. Ex.: `ls | tac` (p. 143).

### Caracteres coringas e metacaracteres

| Símbolo | Efeito | Exemplo |
| --- | --- | --- |
| `*` | Zero ou mais ocorrências de quaisquer caracteres | `*.txt` |
| `?` | Uma ocorrência de um caractere qualquer | `?????.txt` |
| `[]` | Um caractere presente no conjunto | `[2468][13579].txt` |
| `{}` | Sequências | `{1..100}`, `{a..z}` |
| `&` | Coloca o processo em background | `gedit teste.txt &` |
| `;` | Separa comandos na mesma linha | `echo a; echo b` |
| `$` | Variável de ambiente | `echo $PATH` |
| `"` | Permite caracteres especiais | `echo "Data: $(date)"` |
| `'` | Anula caracteres especiais | `echo 'Data: $(date)'` |

Fonte: curso de Linux, p. 122–123.

### Usuários, grupos e permissões

Usuários e grupos fazem o **controle de acesso** a arquivos e diretórios.
Grupos são conjuntos de usuários que podem receber permissões aplicáveis a todos
os membros. Ao instalar o Linux, o usuário **root** é criado (p. 133).

O **root** é superusuário e pode controlar qualquer aspecto do sistema. Um
usuário comum pode rodar comandos como root com o prefixo `sudo`, desde que
esteja no grupo **sudoers** (p. 134).

Permissões (p. 136):

| Letra | Permissão | Significado |
| --- | --- | --- |
| `r` | Read | Leitura |
| `w` | Write | Escrita, alteração e deleção |
| `x` | Execute | Execução |

Aplicam-se a três entidades: **user** (dono), **group** e **others**. O dono é
o criador do item e pode atribuir permissões; o superusuário tem `rwx` em
qualquer arquivo (p. 136).

`chmod` (change mode) usa a notação textual (p. 138):

```
chmod [ugoa] [+-=] [rwx] [arquivo/diretório]
```

Exemplos: `chmod ug=rw,o-rw hello.txt`; `chmod o+rx index.html`; `-R` aplica
recursivamente. A notação **octal** é sugerida como pesquisa, não ensinada.

### SSH, SCP e sshfs

- **SSH** (Secure Shell): protocolo de rede **criptografado**, seguro em qualquer
  rede. É um protocolo TCP/IP da **camada de aplicação** e usa **criptografia de
  chave pública**. Permite login remoto e transferência de arquivos
  (p. 169).
- `ssh <user>@<endereço>` conecta na **porta 22** (p. 171).
- **SCP** copia arquivos entre máquinas (p. 172):
  - local → remoto: `scp <arquivo> <user>@<endereço>:<caminho>`;
  - remoto → local: `scp <user>@<endereço>:<caminho> <destinoLocal>`.
- **mount/umount** monta e desmonta dispositivos em um diretório; dispositivos
  aparecem como arquivos em `/dev` (p. 175).
- **sshfs** monta diretórios remotos na máquina local:
  `sshfs <user>@<endereço>:<caminhoRemoto> <diretórioAlvo>`. Desmonta com
  `fusermount -u <diretório>` (p. 176).
