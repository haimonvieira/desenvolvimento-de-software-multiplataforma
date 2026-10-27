# Glossário — SORC1

## A–C

| Termo | Significado | Observação |
| --- | --- | --- |
| **Anel** | Topologia em caminho fechado | Cada estação ligada à seguinte |
| **Barramento** | Topologia em que todas as estações compartilham o mesmo cabo | Normalmente coaxial, com terminador nas pontas |
| **BNC** | Conector do cabo coaxial | Bayonet Neill–Concelman |
| **Broadcast** | Transmissão para múltiplos destinatários ao mesmo tempo | O endereço de broadcast de sub-rede é derivação |
| **Cabo coaxial** | Condutor de cobre, isolante e blindagem | Usa conector BNC |
| **Cat5e** | Categoria de par trançado | 100 MHz / 100 Mbps / 100 m |
| **Cat6** | Categoria de par trançado | 250 MHz / 1 Gbps / 100 m |
| **Cat6a** | Categoria de par trançado | 500 MHz / 10 Gbps / 100 m |
| **Cat7** | Categoria de par trançado | 600 MHz / 10–40 Gbps / 100 m |
| **Cat8** | Categoria de par trançado | 2000 MHz / 40 Gbps; 100 m no slide, ~30 m na prática |
| **CIDR** | Notação `/n` para a máscara | O corpus só usa /8, /16 e /24 |
| **Classe A** | IP de 1º octeto 1–126 | Máscara /8; rede no 1º octeto |
| **Classe B** | IP de 1º octeto 128–191 | Máscara /16; rede nos 2 primeiros octetos |
| **Classe C** | IP de 1º octeto 192–223 | Máscara /24; rede nos 3 primeiros octetos |
| **Classe D** | IP de 1º octeto 224–239 | Multicast; o corpus só informa a faixa |
| **Classe E** | IP de 1º octeto 240–255 | Experimental; o corpus só informa a faixa |
| **CLI** | Command-Line Interface | Interface por linhas de texto |
| **Concentrador** | Outro nome para hub | Interliga os computadores da rede local |
| **Crimpagem** | Fixação do conector ao cabo | Feita com alicate de crimpagem |
| **Crossover** | Cabo para ligar dois computadores direto | 568A em uma ponta e 568B na outra |

## D–H

| Termo | Significado | Observação |
| --- | --- | --- |
| **DHCP** | Dynamic Host Configuration Protocol | Só citado no sumário; sem conteúdo |
| **Distribuição** | Sistema com kernel Linux + pacotes GNU + extras | Debian, Fedora, Arch |
| **DNS** | Domain Name System | Só citado no sumário; sem conteúdo |
| **Estrela** | Topologia com todos ligados a um concentrador | Ponto a ponto |
| **Fibra óptica** | Transmissão por luz | Mais rápida; baixa atenuação |
| **Full-duplex** | Transmissão e recepção simultâneas | Exige dois canais |
| **Gateway** | Porta de saída da rede | Só citado no sumário; sem conteúdo |
| **GNU** | GNU is Not Unix | Projeto de Richard Stallman; kernel Hurd incompleto |
| **GNU/Linux** | Kernel Linux + pacotes GNU | Família de sistemas, não um único SO |
| **GPO** | Group Policy Object | Só citado no sumário; sem conteúdo |
| **GUI** | Graphical User Interface | Interface visual |
| **Half-duplex** | Dois sentidos, alternados | Um transmite enquanto o outro escuta |
| **Host** | Computador ligado à rede por IP e domínio | Oferece recursos, informações e serviços |
| **Hub** | Ponto central da rede local | Chamado de concentrador |

## I–P

| Termo | Significado | Observação |
| --- | --- | --- |
| **Kernel** | Núcleo do sistema operacional | Parte de mais baixo nível; gerencia hardware |
| **LAN** | Local Area Network | Mesmo espaço físico |
| **Malha** | Topologia com muitas interconexões | Múltiplos caminhos; alta redundância |
| **MAN** | Metropolitan Area Network | Redes locais em dezenas de km |
| **Máscara de sub-rede** | 32 bits que separam rede e host | /8, /16 e /24 |
| **Minix** | Sistema Unix-like de Tanenbaum (1987) | Microkernel; fins educacionais |
| **Nobreak** | Fornecimento de energia ininterrupto | Aparece em materiais-05 |
| **Octeto** | Grupo de 8 bits do IPv4 | Quatro por endereço, de 0 a 255 |
| **OSI** | Open System Interconnection | Modelo conceitual de 7 camadas |
| **PAN** | Personal Area Network | Distância muito curta; Bluetooth e UWB |
| **Patch cord** | Cabo de ligação entre dispositivos | Também chamado de patch cable |
| **Patch panel** | Painel de conexões do rack | Organiza o cabeamento |
| **PABX** | Central telefônica privada | Modelo Siemens Hipath 3800 no corpus |
| **Pipe** | `\|` — usa a saída de um comando como entrada do próximo | Ex.: `ls \| tac` |

## Q–Z

| Termo | Significado | Observação |
| --- | --- | --- |
| **Rack** | Estrutura padronizada para equipamentos | 19 polegadas no padrão de mercado |
| **Rede** | Computadores interligados que compartilham recursos | Por cabo ou wireless |
| **RJ45** | Conector do par trançado | Trava voltada para baixo |
| **Root** | Superusuário do Linux | Pode tudo no sistema |
| **SAN** | Storage Area Network | Comunicação servidor–armazenamento |
| **SCP** | Secure Copy | Copia arquivos via SSH |
| **Shell** | Interpretador de comandos | bash, zsh |
| **Simplex** | Transmissão em um só sentido | Rádio e TV |
| **SSH** | Secure Shell | Porta 22; camada de aplicação; chave pública |
| **sshfs** | SSH File System | Monta diretório remoto localmente |
| **Switch** | Componente central que conecta dispositivos da rede | Permite que conversem entre si |
| **TCP/IP** | Transmission Control Protocol / Internet Protocol | Conjunto de regras padronizadas |
| **Terminal** | Dispositivo de entrada e saída | Nos PCs, é um emulador |
| **Topologia** | Como os computadores estão conectados fisicamente | Influencia flexibilidade, velocidade e segurança |
| **Unix** | SO da Bell Labs/AT&T (1969) | Thompson e Ritchie; origem do BSD e do Solaris |
| **Voice panel** | Painel de voz do rack | Aparece em materiais-05 |
| **WAN** | Wide Area Network | Grande escala geográfica |
| **WLAN** | Wireless Local Area Network | Rede local sem fio |
| **WMAN** | Wireless Metropolitan Area Network | Versão sem fio da MAN |
| **568A** | Padrão de crimpagem | Branco/verde, verde, branco/laranja, azul, branco/azul, laranja, branco/marrom, marrom |
| **568B** | Padrão de crimpagem | Branco/laranja, laranja, branco/verde, azul, branco/azul, verde, branco/marrom, marrom |
