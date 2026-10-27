# Exercícios e atividades — SORC1

## Panorama

| Fonte | O que é | Tem gabarito? |
| --- | --- | --- |
| materiais-01, p. 16 | Pesquisa sobre onde cada tipo de rede é usado | **Não** (atividade aberta) |
| materiais-02, p. 23–27 | 5 questões de múltipla escolha | **Não** no corpus; respostas derivadas abaixo |
| materiais-03, p. 7 | Identificar a classe de 3 IPs | **Sim, implícito** na p. 9 |
| materiais-03, p. 12–15 | Exemplo de máscara e contagem de hosts | **Sim**, no próprio slide |
| materiais-04 | Sem exercício escrito; prática de crimpagem | — |
| Curso de Linux, p. 67 | Instalar uma distribuição | **Não** |
| Curso de Linux, p. 125, 153–154, 182 | Baixar e extrair arquivos com `wget`/`tar` | **Não** |
| Curso de Linux, p. 160, 173, 179 | "Exercício surpresa": explicar comandos | **Não**; respostas derivadas abaixo |
| Curso de Linux, p. 181 | Praticar SCP entre colegas | **Não** |

## Materiais-01 — pesquisa de tipos de rede (p. 16)

**Enunciado:** pesquisar diferentes locais e situações em que cada tipo de rede
é utilizado.

Não há resposta única. Um roteiro que cumpre o pedido:

| Tipo | Onde procurar | Exemplo plausível |
| --- | --- | --- |
| LAN | Casa, escola, empresa | Rede Wi-Fi/cabeada de um laboratório |
| MAN | Cidade | Dois prédios da mesma empresa ligados por fibra |
| WMAN | Campus | Wi-Fi que cobre vários campi |
| WAN | País/mundo | Provedor de internet, link entre filiais |
| WLAN | Ambiente local sem fio | Wi-Fi doméstico |
| SAN | Datacenter | Armazenamento ligado a servidores |
| PAN | Pessoa | Fone Bluetooth, rede UWB |

Fonte dos conceitos: materiais-01, p. 9–15.

## Materiais-02 — questões de múltipla escolha (p. 23–27)

**Não há gabarito oficial no corpus.** As respostas abaixo são **derivadas** do
conteúdo das páginas anteriores.

### p. 23 — topologia de cabo central

> Qual topologia conecta todos os dispositivos a um único cabo central?

- a) Estrela
- b) Barramento
- c) Anel
- d) Malha

**Resposta derivada: b) Barramento.** O slide da p. 7 diz que, no barramento,
todas as estações compartilham um mesmo cabo.

### p. 24 — camada da entrega confiável

> Qual camada do OSI é responsável pela entrega confiável, controle de fluxo e
> detecção de erros?

- a) Física
- b) Aplicação
- c) Transporte
- d) Rede

**Resposta derivada: c) Transporte.** A descrição da p. 17 fala em controle de
fluxo, segmentação e controle de erros.

### p. 25 — o que é um host

> Qual item representa um host?

- a) Um roteador que apenas encaminha pacotes
- b) Um computador conectado que envia e recebe dados
- c) Um cabo de rede
- d) Um switch

**Resposta derivada: b.** A p. 22 define host como computador ligado à rede por
IP e domínio, que oferece recursos e serviços.

### p. 26 — maior redundância

> Qual topologia oferece maior redundância, com múltiplos caminhos?

- a) Estrela
- b) Anel
- c) Malha
- d) Barramento

**Resposta derivada: c) Malha.** A p. 6 destaca as interconexões redundantes e
os vários caminhos possíveis.

### p. 27 — camada de sessão

> A camada de sessão é responsável por:

- a) Transmitir bits pelo meio físico
- b) Estabelecer, gerenciar e encerrar sessões entre aplicações
- c) Roteamento de pacotes
- d) Controle de erros na transmissão

**Resposta derivada: b.** É a descrição literal da p. 18.

## Materiais-03 — classes de IP (p. 7)

**Enunciado:** identificar a classe de:

| Endereço | 1º octeto | Classe | Rede | Host |
| --- | --- | --- | --- | --- |
| `192.168.0.97` | 192 | **C** (192–223) | `192.168.0` | `97` |
| `10.12.27.35` | 10 | **A** (1–126) | `10` | `12.27.35` |
| `132.147.110.74` | 132 | **B** (128–191) | `132.147` | `110.74` |

As respostas estão na p. 9 do próprio material; a regra está na p. 6.

## Materiais-03 — máscara e hosts (p. 12–15)

**Exemplo:** `192.168.0.50/24`.

- Rede: `192.168.0`
- Host: `50`
- Máscara: `255.255.255.0`
- Hosts possíveis: **254**

**Contas que o material cobra:**

| Máscara | Total | Conta | Hosts |
| --- | --- | --- | --- |
| `/8` | 16.777.216 | 16.777.216 − 2 | **16.777.214** |
| `/16` | 65.536 | 65.536 − 2 | **65.534** |
| `/24` | 256 | 256 − 2 | **254** |

**Broadcast (derivação):** é o último endereço da faixa. Para `192.168.0.0/24`,
`192.168.0.255`; para `10.0.0.0/8`, `10.255.255.255`; para
`132.147.0.0/16`, `132.147.255.255`.

> O slide p. 12 escreve "Rede: 191.171.0" no exemplo de `192.168.0.50`. É erro
> de digitação; o correto é `192.168.0`.

## Curso de Linux — exercício de instalação (p. 67)

**Enunciado:** revisar a aula em `web.inf.ufpr.br/pet/linux` e instalar alguma
distribuição GNU/Linux; a recomendação para leigos é **Ubuntu** ou **Linux
Mint**.

Não há gabarito: é atividade prática. Ao responder, proponha um roteiro
(baixar a ISO, criar o pendrive bootável, testar em live USB, instalar e
atualizar) e avise que o corpus não detalha o passo a passo.

## Curso de Linux — exercícios com `wget` e `tar`

**Enunciados (p. 125, 153–154 e 182):**

```bash
wget https://www.inf.ufpr.br/vm20/linux/aula2.tar.gz
tar -xvf aula2.tar.gz

wget https://www.inf.ufpr.br/vm20/linux/aula3.tar.gz
tar -xvf aula3.tar.gz

wget https://www.inf.ufpr.br/vm20/linux/misterio.tar.gz
tar -xvf misterio.tar.gz
```

**O que fazem:** `wget` baixa o arquivo da URL; `tar -xvf` **extrai** (`-x`) o
conteúdo, **mostrando os arquivos** (`-v`) do arquivo (`-f`) indicado. Não há
gabarito de conteúdo; o exercício é executar e explorar os arquivos extraídos.

## Curso de Linux — "exercício surpresa" (p. 160)

**Enunciado:** explicar o que estes comandos fazem.

| Comando | Efeito |
| --- | --- |
| `man htop` | Abre o manual do `htop` |
| `rsync -h` | Mostra a ajuda resumida do `rsync` |
| `wget --help` | Mostra a ajuda do `wget` |
| `touch {1..5}` | Cria os arquivos `1`, `2`, `3`, `4` e `5` no diretório atual |

Respostas **derivadas**; o corpus não traz gabarito.

## Curso de Linux — "exercício surpresa" (p. 173)

| Comando | Efeito |
| --- | --- |
| `sudo apt install curl` | Instala o pacote `curl` como root |
| `chmod g+r -R <dir>/` | Adiciona leitura ao grupo, recursivamente, em `<dir>` |
| `rm {1..10}` | Remove os arquivos `1` a `10` |
| `tar -czvf <dir>.tar.gz <dir>/` | Cria (`-c`) um tar gzip (`-z`), verboso (`-v`), no arquivo (`-f`) indicado |

Respostas **derivadas**. Cuidado com `rm`: não há confirmação e a exclusão é
definitiva.

## Curso de Linux — "exercício surpresa" (p. 179)

| Comando | Efeito |
| --- | --- |
| `rm ./*.csv` | Remove todos os `.csv` do diretório atual |
| `ls -l \| grep ^d \| awk '{print $NF}'` | Lista apenas os **diretórios**, imprimindo o último campo (o nome) |
| `less <arquivoDeTexto>` | Abre o arquivo para leitura interativa |
| `du -hc <dir>` | Mostra o tamanho dos itens e um total legível (`-h`) |

Respostas **derivadas**. O corpus ensina `grep` (p. 151), `ls -l` (p. 94) e
`du` (p. 106), mas não explica `awk`.

## Curso de Linux — SCP entre colegas (p. 181)

**Enunciado:** usar SCP para copiar um arquivo da máquina de um colega e enviar
um arquivo seu para ele.

Roteiro com a sintaxe do corpus (p. 172):

```bash
# copiar do colega para a sua máquina
scp usuario@ip-do-colega:/caminho/arquivo.txt .

# enviar da sua máquina para o colega
scp arquivo.txt usuario@ip-do-colega:/caminho/destino/
```

O material recomenda **caminhos absolutos** para evitar problemas. Não há
gabarito: depende do ambiente.

## Como responder "me dá a resposta"

1. Se for questão de múltipla escolha, dê a alternativa, explique a passagem do
   slide e **avise que o gabarito não está no corpus**.
2. Se for cálculo de IP, mostre classe → rede → host → máscara → hosts, e
   rotule broadcast como derivação.
3. Se for atividade prática (instalar distro, crimpar cabo, SCP), entregue um
   roteiro passo a passo e diga que não há resposta única.
4. Se for comando de Linux, explique opção por opção (`-x`, `-v`, `-f` etc.).
5. Sempre cite arquivo e página.
