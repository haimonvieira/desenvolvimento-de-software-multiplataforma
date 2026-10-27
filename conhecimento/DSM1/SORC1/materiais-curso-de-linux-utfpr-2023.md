---
disciplina: DSM1/SORC1
titulo: curso de linux utfpr 2023
fonte: DSM1/SORC1/Materiais/curso_de_linux_utfpr_2023.pdf
tipo: pdf
paginas: 184
extraido_em: 2026-10-24
---

<!-- page: 1 -->

                     Semana de Calouros 2023


Linux
Aula I


Login: petsemcalX
Senha: PetSemcal#X                  2023

<!-- page: 2 -->

               1.
Sistemas Operacionais

<!-- page: 3 -->

Árvore de Sistemas Operacionais

<!-- page: 4 -->

Sistema Operacional


“O sistema operacional é uma camada de software que opera entre o
hardware e os programas aplicativos voltados ao usuário ﬁnal. Trata-se de
uma estrutura de software ampla, muitas vezes complexa, que incorpora
aspectos de baixo nível (como drivers de dispositivos e gerência de memória
física) e de alto nível (como programas utilitários e a própria interface
gráﬁca).” — Carlos Maziero


Sistemas Operacionais - Maziero

<!-- page: 5 -->

Abstração e Gerência

<!-- page: 6 -->

Kernel


●   O SO é dividido em diversas partes

●   O kernel (núcleo) é a parte mais baixo nível
    do sistema operacional

●   Gerencia recursos do sistema, hardware etc.

●   Outra possível parte de um SO é o conjunto
    de programas utilitários disponibilizados,
    como compiladores e editor de texto

<!-- page: 7 -->

Windows


●   Desenvolvido pela Microsoft a partir   ●   Código fechado
    de 1985
                                           ●   Programas pagos
●   Escrito em C/C++ e C#
                                           ●   Possibilidade de instalação em
●   Originado do MS-DOS, feito pela            computadores x86-64
    Microsoft e baseado no IBM PC DOS
                                           ●   É preciso apenas comprar licença 🤫
●   Baixa segurança (muitos malware)

●   Falta de privacidade (telemetria e
    coleta de dados)

<!-- page: 8 -->

macOS


●   Desenvolvido pela Apple a partir de     ●   Código fechado
    2001
                                            ●   Programas pagos
●   Escrito em Objective-C (Kernel em C e
                                            ●   Exclusivo para MacBook e outros PCs
    Assembly)
                                                da Apple
●   Originado do BSD (Berkeley Software
                                            ●   Hackintosh 🕵
    Distribution)

●   Falta de privacidade

<!-- page: 9 -->


<!-- page: 10 -->

Seria possível
existir um sistema
operacional livre?

<!-- page: 11 -->

           2.
História do Linux

<!-- page: 12 -->

Unix Uniplexed Information and Computing Service


●   Sistema operacional desenvolvido pela      ●   Oferece comandos simples que podem
    Bell Labs da AT&T a partir de 1969             ser combinados com pipes

●   Criado por Ken Thompson e Dennis Ritchie   ●   Shell scripting
    (desenvolvedores das linguagens B e C)
                                               ●   Deu origem a variantes:
●   Escrito em Assembly e C
                                                    ○   BSD → FreeBSD e macOS
●   Código fechado
                                                    ○   Solaris
●   💡 Pesquise sobre a Unix philosophy
                                                    ○   IBM AIX

<!-- page: 13 -->

Unix Uniplexed Information and Computing Service

<!-- page: 14 -->

Unix Uniplexed Information and Computing Service


Contudo, o Unix disponibilizado
pela AT&T não era livre.


                                        Ken Thompson e Dennis Ritchie

<!-- page: 15 -->

GNU GNU is Not Unix


●   Sistema operacional baseado no              ●   O kernel do GNU, Hurd, não atraiu
    comportamento do Unix (Unix-like)               atenção o suﬁciente para seu
                                                    desenvolvimento, ﬁcando incompleto
●   Criado por Richard Stallman e comunidade
                                                ●   💡 Pesquise sobre a GNU General
●   Centrado no conceito de Free Software
                                                    Public License (GPL)
●   A comunidade do GNU se concentrou em
    desenvolver principalmente programas
    utilitários disponibilizados pelo sistema
    operacional

●   Ex: gcc (GNU Compiler Collection)

<!-- page: 16 -->

GNU — Free Software

●   “meios técnicos para um ﬁm social”

●   Free não está para gratuito, mas para livre

●   Liberdades fundamentais:

     ○   Poder utilizar um software para qualquer propósito

     ○   Poder estudar o código e modiﬁcá-lo

     ○   Poder redistribuir cópias, cobrando ou não

     ○   Poder distribuir cópias de sua versão modiﬁcada

●   Ou seja, acesso ao código-fonte (open-source)

●   💡 Pesquise sobre o movimento software livre e o
    Manifesto GNU                                             Richard Stallman

<!-- page: 17 -->

E o kernel?

<!-- page: 18 -->

Minix Minimal Unix


●   Sistema operacional Unix-like desenvolvido por
    Andrew Tanenbaum a partir de 1987, em C, para ﬁns
    educacionais

●   Apresentava uma arquitetura de microkernel, ou seja,
    seu núcleo possui o mínimo de código para funcionar

●   Tanenbaum escreveu o livro Operating Systems: Design
    and Implementation com um resumo do código do
    kernel e outros componentes


                                                           Andrew Tanenbaum

<!-- page: 19 -->

Linus Torvalds


●   Cientista da computação ﬁnlandês formado pela
    Universidade de Helsinki

●   Na universidade, fez um curso sobre Unix e leu o
    livro de Tanenbaum sobre o Minix

●   Mesmo com o código do Minix disponível, sua
    modiﬁcação e redistribuição não era permitida

●   Interessado, Linus iniciou um projeto…


                                                       Linus Torvalds

<!-- page: 20 -->

What would you like to see most in minix?

                                                        “Olá a todos que estão usando minix -


                                                        Estou    fazendo   um   sistema   operacional   livre
                                                        (apenas um hobby, não será grande e proﬁssional
                                                        como GNU) para clones AT-386. Está sendo
                                                        desenvolvido desde abril, e está começando a
                                                        ﬁcar pronto. Gostaria de opiniões sobre o que as
                                                        pessoas gostam e desgostam no minix, já que meu
                                                        SO se assemelha a ele (mesmo layout físico do
                                                        sistema de arquivos dentre outras coisas).


                                                        [...]”


      https://groups.google.com/forum/#!msg/comp.os.minix/dlNtH7RRrGA/SwRavCzVE7gJ

<!-- page: 21 -->

Linux


●   Kernel de sistema operacional livre desenvolvido por Linus
    Torvalds a partir de 1991

●   Escrito em C, em 2021 chegou a 27.8 milhões de linhas de código

●   Em 5 de outubro de 1991 sua primeira versão oﬁcial foi lançada,
    período em que o Linux já conseguia rodar alguns softwares do
    GNU, como bash e gcc

●   Inicialmente seu código era escrito apenas por Torvalds, após
    isso, se tornou um software com contribuições de diversas
    empresas e milhares de pessoas

●   Em fevereiro de 1992, Linux foi licenciado sob a GPL, tornando-se   Tux (mascote do Linux)

    um software livre

<!-- page: 22 -->

Recapitulando…

<!-- page: 23 -->

GNU, um sistema
operacional livre com
diversos programas

<!-- page: 24 -->

Linux, um kernel
livre e poderoso

<!-- page: 25 -->

Nasce GNU/Linux

<!-- page: 26 -->

GNU/Linux ou apenas Linux


 ●   Sistema operacional Unix-like livre e open-source
     que utiliza o kernel Linux e programas (pacotes)
     do GNU

 ●   GNU não conta apenas com programas para
     usuário ﬁnal, como o GIMP, mas também com
     inúmeros programas para desenvolvedores

 ●   Contudo, não há “o sistema operacional Linux”,
     isto é, Linux é uma família de diversos sistemas
     operacionais


… e que sistemas operacionais são esses?!

<!-- page: 27 -->

Vantagens do GNU/Linux


●   Gratuito

●   Mais seguro

●   Código-livre, que permite a comunidade a checar o código

●   Mais liberdade para modiﬁcações

●   Melhor ambiente para programação

<!-- page: 28 -->

Estatísticas


●   Os 500 melhores supercomputadores       ●   75% dos PCs rodam Windows, 15%
    do mundo rodam Linux                        macOS e 2,14% Linux

●   85% de todos os smartphones do          ●   Em PCs de proﬁssionais de
    mundo usam Linux                            computação, Linux chega a mais de
                                                40%
●   Dos 25 maiores sites do mundo, 23 são
    hospedados em servidores que rodam
    Linux, como Facebook, Youtube e Intel

<!-- page: 29 -->

“Linux” vs. “GNU/Linux”

<!-- page: 30 -->

      3.
Distribuições

<!-- page: 31 -->

Distribuição ou distro


●   Uma distribuição Linux é um sistema           ●   As distribuições Linux se diferem a
    operacional que utiliza o kernel Linux e os       partir de softwares que utilizam para
    pacotes do GNU                                    compor o sistema

●   Também, adiciona outros programas             ●   Desta forma, surgiram inúmeras
    funcionais para um sistema operacional            distribuições, formando diversas
                                                      famílias a partir de modiﬁcações
●   Ex: sistema gerenciador de pacotes e              feitas pela comunidade
    interface gráﬁca
                                                  ●   Uma distribuição pode ter versões
●   (Um gerenciador de pacotes é um programa          deﬁnidas ou ser atualizada
    que automatiza o processo de instalação,          constantemente (rolling-release)
    atualização e remoção de outros
    programas)
                                                         Árvore de distribuições GNU/Linux

<!-- page: 32 -->

Principais famílias

<!-- page: 33 -->

Debian


●   Sua primeira versão foi lançada em 1993

●   Por padrão, utiliza o gerenciador de
    pacotes apt

●   Utilizado bastante em servidores, devido a
    sua estabilidade

●   Seus principais ﬁlhos, como o Ubuntu, são
    voltados ao usuário comum, visto sua
    interface amigável

●   Assim, é família mais popular para o público
    geral

<!-- page: 34 -->

Fedora


●   Sua primeira versão foi lançada em 2003

●   Criada pela empresa Red Hat, após a
    descontinuação do Red Hat Linux

●   Sua irmã, a Red Hat Enterprise Linux, é
    voltada para a utilização em ambientes
    corporativos

●   Por padrão, utiliza o gerenciador de
    pacotes rpm

<!-- page: 35 -->

           Arch

           ●   Lançamento inicial em 2002

           ●   Não possui versões deﬁnidas, é uma distribuição
               rolling-release, ou seja, é atualizado constantemente
               para possuir as versões mais recentes dos softwares
               instalados

           ●   Utiliza o gerenciador de pacotes pacman

           ●   Por padrão, vem com o mínimo de software instalado, e
               cabe ao usuário montar seu próprio ambiente

           ●   Possui a ﬁlha manjaro como um sistema amigável, que
               possui alguns softwares instalados por padrão
TORVYLDX

<!-- page: 36 -->

Curiosidade: Android

●   Android é um sistema operacional mobile
    open-source desenvolvido principalmente pela
    Google

●   Apesar de não ser considerada uma distribuição
    GNU/Linux, utiliza uma versão modiﬁcada do
    kernel Linux em seu interior

<!-- page: 37 -->

            4.
Sistema de Arquivos

<!-- page: 38 -->

Sistema de arquivos


●   Gerenciamento do espaço de armazenamento do disco

●   Organização da memória em arquivos contidos em diretórios (pastas)

●   Cada diretório pode conter arquivos e outros diretórios

●   Diretório e arquivo possuem nome (case-sensitive)

●   Links simbólicos (atalho)

<!-- page: 39 -->

Sistema de arquivos

<!-- page: 40 -->

Sistema de arquivos não precisa decorar!
●   / → diretório raiz (root), todos diretórios e   ●   /tmp → arquivos temporários, conteúdo
    arquivos do SO estão contidos nele                  excluído ao reiniciar o computador
●   /bin → arquivos binários executáveis, como      ●   /var → arquivos de dados variáveis,
    comandos da shell                                   programas armazenam dados de tempo
●   /dev → arquivos virtual especiais, como             de execução
    aqueles que representam dispositivos físicos
                                                    ●   /boot → arquivos do kernel e de boot
●   /etc → arquivos de conﬁguração do sistema
                                                    ●   /proc → arquivos sobre processos
●   /usr → arquivos executáveis dos usuários,
    bibliotecas, códigos-fonte e documentação       ●   /opt → arquivos de aplicações opcionais
                                                        (não disponíveis pela distribuição)
●   /home → diretórios pessoais de cada usuário
                                                    ●   /root → diretório pessoal do usuário root
●   /lib → as bibliotecas necessárias para os
    executáveis de /bin e /sbin                     ●   /media → diretórios montados para
                                                        mídias removíveis (USB, DVD, etc.)
●   /sbin → binários do sistemas, só podem ser
    executados pelo root

<!-- page: 41 -->

          5.
Interface Gráﬁca

<!-- page: 42 -->

GUI Graphical User Interface


●   Interface visual para usuários interagirem com
    os dispositivos através de componentes
    gráﬁcos

●   Alternativa ao CLI (command-line interface)

●   Menor curva de aprendizagem em relação a
    comandos por texto

●   Assim, surgem os programas com interface
    gráﬁca e suas janelas (windows)

<!-- page: 43 -->

Window Manager


●   Software do sistema que controla a localização, comportamento e aparência das
    janelas de programas

●   Determina tamanho e bordas das janelas, dentre outras características

●   Pode conter menus que iniciam outros programas, assim como barras de status com
    horário, data e outras informações

●   Faz parte de desktop environments, mas pode ser utilizado sozinho

●   Sendo utilizado sozinho, faz grande uso de atalhos de teclado para gerenciamento
    das janelas

●   Há três tipos de WMs: stacking, tiling e dinâmica (combina as duas primeiras)

●   💡 Pesquise sobre Xorg e Wayland

<!-- page: 44 -->

Stacking

<!-- page: 45 -->

Tiling

<!-- page: 46 -->

Desktop Environment


●   Contém um window manager, adicionando (muitas) outras funcionalidades

●   Geralmente, adiciona:

     ○   Ícones de atalhos para iniciar programas

     ○   Barras de ferramentas

     ○   Widgets na área de trabalho

     ○   Conjunto de programas utilitários (ex: office e editor de texto com GUI)

<!-- page: 47 -->

Exemplos de
Desktop Environments

<!-- page: 48 -->

GNOME

<!-- page: 49 -->

Cinnamon

<!-- page: 50 -->

Exemplos de
Window Managers

<!-- page: 51 -->

i3

<!-- page: 52 -->

Hyprland

<!-- page: 53 -->


<!-- page: 54 -->

         6.
Terminal e Shell

<!-- page: 55 -->

CLI Command-Line Interface


●   Interface que recebe comandos do
    usuário em forma de linhas de texto

●   Através de comandos, o usuário pode
    alterar o ambiente e utilizar programas

●   Maior poder de automatização

●   Mais rapidez para executar tarefas

●   … mais difícil para usuários leigos?

<!-- page: 56 -->

Terminal


●   Dispositivo eletrônico ou eletromecânico que
    permite a entrada e saída de dados

●   Os primeiros terminais eram os teletipos
    (Teletypes), máquinas de escrever que
    enviava e recebia mensagens

●   Os TTY eram telégrafos que enviavam
    mensagens escritas em seu teclado (como
    máquina de escrever)

●   Recebia mensagens e imprimia em papel


                                                   Teleprinter / Teletype / TTY usado na WW2

<!-- page: 57 -->

Terminal

●   Nos anos 50, a impressão em papel
    começou a ser substituída por displays
    de vídeo

●   Nos anos 60, terminais inteligentes
    foram lançados, os quais possuíam
    processamento próprio a partir de
    microprocessadores

●   Apesar de poder fazer algum
    processamento de dados, estes
    terminais eram conectados a um
    computador externo, como um
    mainframe, que executava os
    comandos digitados no terminal

<!-- page: 58 -->

Computadores pessoais


●   Diversos terminais eram conectados a
    cada computador, exigindo grande
    processamento

●   Com o barateamento de CPUs, os
    terminais foram ﬁcando cada vez mais
    poderosos

●   Com isso, surgem os PCs (Personal
    Computers), criados para uso pessoal

                                           Computador Pravetz 82, utilizado na União Soviética

<!-- page: 59 -->

Emuladores de terminal

●   Os PCs ofereciam terminais, mas estes não
    eram como os terminais anteriores

●   Visto que um PC não possui um hardware
    para a geração de caracteres, mas sim
    placas de vídeo, os terminais são emulados

●   Emuladores de terminal são programas que
    emulam terminais de vídeo, dentro de uma
    arquitetura de display

<!-- page: 60 -->

Shell


●   Software que interpreta comandos de         ●   Permite a combinação de diversos
    texto                                           comandos (programas)

●   Linguagem de comandos interativa            ●   bash: shell da GNU

●   Linguagem de scripting                      ●   zsh: shell que adiciona outras
                                                    funcionaliades além das presentes no
●   É acessada utilizando um emulador de
                                                    bash
    terminal

●   Ex: gnome terminal, terminator, kitty, st

<!-- page: 61 -->

Working directory


 ●   Ao iniciar um terminal, por padrão ele abrirá dentro do diretório pessoal do usuário ativo
     (ex: /home/pet)

 ●   É possível navegar pelos diretórios do sistema de arquivos a partir de comandos

 ●   Assim, o diretório que o usuário se encontra no terminal em um determinado momento é
     chamado de working directory (diretório de trabalho)


Abra o terminal com o atalho Ctrl+Alt+T

<!-- page: 62 -->

Path ou caminho

●   Nos comandos interpretados pelo     ●   Assim, para representar uma localização com o
    shell, usamos caminhos para             caminho absoluto deve-se utilizar o diretório raiz
    representar uma localização do          (o barra “/”)
    sistema de arquivos
                                        ●   /home/pet/Pictures/Wallpapers/wallpaper.png
●   Um path é um texto que representa
                                        ●   No caminho relativo, representa-se uma
    a localização de um arquivo ou
                                            localização relativa ao working directory
    diretório
                                        ●   Ou seja, a localização de um caminho relativo
●   Os caminhos podem ser absolutos
                                            pode mudar, a depender do working directory
    ou relativos
                                        ●   Pictures/Wallpapers/wallpaper.png
●   O caminho absoluto aponta para o
                                            (assumindo que o diretório atual é /home/pet)
    mesmo local, independentemente
    do diretório de trabalho atual

<!-- page: 63 -->

Atalhos da shell

●   Como o working directory varia bastante ao navegar pelo sistema de arquivos, utiliza-se
    atalhos (caracteres coringas) em paths

●   Esses caracteres permitem utilizar o caminho relativo sem precisar alterar o diretório atual

●   Caracteres coringas:

     ○   / → diretório raiz e separação de diretórios

     ○   ~ → diretório pessoal (home) do usuário atual (ex: /home/pet)

     ○   . → diretório atual

     ○   .. → diretório pai do atual

●   Assim, ao utilizar os caracteres coringas em um comando, a shell substitui o caractere para
    o caminho que o representa

<!-- page: 64 -->

7.
Dicas

<!-- page: 65 -->

Arch Linux Wiki wiki.archlinux.org


●   Maior wiki sobre assuntos relacionados
    ao Linux

●   Mantida pela comunidade

●   Traduzida para várias línguas

<!-- page: 66 -->

Dual boot — Linux e Windows


●   Instalação de dois (ou mais) sistemas   ●   Há vários tutoriais no youtube para
    operacionais em um computador               dual boot com Windows e Linux

●   Seleção do sistema operacional a ser    ●   Os passos podem variar de acordo
    executado durante o boot                    com a distribuição (porém, para a
                                                família Debian e Fedora é
●   Geralmente usa softwares como o
                                                generalizado)
    GRUB
                                            ●   Diolinux:
●   💡 Pesquise sobre boot loaders
                                                 ○   https://www.youtube.com/watch?v=6D6L9Wml1oY

<!-- page: 67 -->

Exercício (para casa)
●   Revise a aula, com calma, em web.inf.ufpr.br/pet/linux

●   Instale alguma distribuição GNU/Linux em seu computador

●   Recomendamos alguma distribuição para leigos, como o
    Ubuntu ou Linux Mint

●   Aventure-se com distribuições mais avançadas, como o Arch,
    quando estiver familiarizado e experiente

<!-- page: 68 -->

Avalie a aula
forms.gle/bJuWakM4pCi6VutR9


Conta como presença!

<!-- page: 69 -->

Obrigado!
        pet.inf.ufpr.br
       pet@inf.ufpr.br
       @petcompufpr

<!-- page: 70 -->

                     Semana de Calouros 2023


Linux
Aula II


Login: petsemcalX
Senha: PetSemcal#X                  2023

<!-- page: 71 -->

Relembrando…

<!-- page: 72 -->

Atalhos da shell

●   Como o working directory varia bastante ao navegar pelo sistema de arquivos, utiliza-se
    atalhos (caracteres coringas) em paths

●   Esses caracteres permitem utilizar o caminho relativo sem precisar alterar o diretório atual

●   Caracteres coringas:

     ○   / → diretório raiz e separação de diretórios

     ○   ~ → diretório pessoal (home) do usuário atual (ex: /home/pet)

     ○   . → diretório atual atual

     ○   .. → diretório pai do atual

●   Assim, ao utilizar os caracteres coringas em um comando, a shell substitui o caractere para
    o caminho que o representa

<!-- page: 73 -->

Atalhos do terminal


●   Ctrl+Alt+T → abre o terminal padrão            ●   Tab → autocomplete para
                                                       comandos/argumentos/arquivos
●   Setas (up/down) → navega pelos últimos
                                                       quando possível
    comandos
                                                   ●   Tab Tab → mostra as opções de
●   Ctrl+Shift+C/V → copia/cola no terminal
                                                       autocomplete
●   Ctrl+U → limpa o que está escrito antes do
                                                   ●   Ctrl+Z → coloca o processo que está
    cursor
                                                       sendo executado em background,
●   Ctrl+L → limpa a tela (como o comando clear)       liberando o prompt

                                                   ●   Ctrl+C → mata o processo

<!-- page: 74 -->

        1.
Contas no DInf

<!-- page: 75 -->

DInf Departamento de Informática


●   Utiliza o Linux Mint como sistema
    operacional nos computadores de seus
    laboratórios
●   Usuário: siglas do nome + ano de ingresso
●   Ex: Guilherme Nunes Uzias → gnu23
●   Solicitar login e senha de seu usuário na
    secretaria
●   Página web pessoal → ~/public_html
●   Quota de armazenamento
     ○   /home → 8 GB
     ○   /nobackup → 8 GB

<!-- page: 76 -->

DInf Departamento de Informática

●   Você não pode usar sudo (se usar, um root receberá um e-mail rs)
●   Lembre-se, NÃO FAÇA NADA ILEGAL!
●   Você deve alterar a senha do seu usuário, utilize o comando passwd
●   Não se esqueça da sua senha e não a passe para ninguém!

<!-- page: 77 -->

E-mail do DInf


●   Além do e-mail da UFPR (ufpr.br), você terá um e-mail do departamento

●   O e-mail será: login + @inf.ufpr.br

     ○   Ex: gnu23@inf.ufpr.br

●   Para acessar o e-mail, entre em webmail.inf.ufpr.br

●   O cache do e-mail contará na sua quota

●   Você pode utilizar o e-mail por algum cliente de e-mails, como o Thunderbird
     ○   https://web.inf.ufpr.br/dinf/departamento-de-informatica/infra-estrutura/tecnologica/duvidas-frequ
         entes-sobre-suporte-aos-sistemas

<!-- page: 78 -->

Wi-ﬁ e site pessoal


●   No DInf há a disponibilização do Wi-ﬁ C3SL, com 20Gb/s

●   Para acessar, siga os passos em:
    https://web.inf.ufpr.br/dinf/departamento-de-informatica/infra-estrutura/tecnologica/duvidas-frequentes-
    sobre-suporte-aos-sistemas

●   Também, você tem acesso a um site pessoal: www.inf.ufpr.br/<login>

     ○    Ex: www.inf.ufpr.br/gnu23

●   Para editá-lo, utilize o diretório public_html

     ○    Por exemplo, crie um arquivo chamado index.html

     ○    Acesse-o com www.inf.ufpr.br/<login>/index.html

<!-- page: 79 -->

           2.
Comandos básicos

<!-- page: 80 -->

Estrutura de comandos


●   Geralmente, um comando segue uma estrutura básica, sendo:

               [comando] [opções] [argumentos]
●   Exemplo:

                               cp -r dir1 dir2
    ffmpeg -y -i hypr.mp4 -i palette.png -ﬁlter_complex -r 10 -s 640x360 hypr.gif

<!-- page: 81 -->

whoami

●   Imprime na tela o usuário atual

<!-- page: 82 -->

pwd print working directory

●   Imprime na tela o diretório atual (working directory)

<!-- page: 83 -->

hostname


●   Imprime na tela o nome do sistema

●   Encontra-se em /etc/hostname (“no Linux tudo é um arquivo”)

<!-- page: 84 -->

tty


●   Imprime na tela o arquivo do terminal em questão (identiﬁcação)

<!-- page: 85 -->

who

●   Imprime na tela os usuários conectados ao sistema

<!-- page: 86 -->

Dicas

<!-- page: 87 -->

Histórico


●   Utilize as teclas up e down para navegar pelo histórico de comandos

●   Evita digitar novamente os últimos comandos caso erre

<!-- page: 88 -->

        3.
Buscando ajuda

<!-- page: 89 -->

help


●   A maioria dos comandos disponibilizam a opção --help

●   Imprime uma breve documentação sobre o comando

●   Também há outras possíveis opções, como --version

<!-- page: 90 -->

man manual

●   O comando man é usado para ler a
    documentação completa de algum comando

●   Não necessita conexão à internet

●   $ man [comando]

●   Para sair da interface do man, digite q

●   Teste o comando com:

     ○   $ man man

     ○   $ man ls

     ○   $ man cd

<!-- page: 91 -->

   4.
Navegação

<!-- page: 92 -->

cd change directory

●   Muda o diretório atual

●   Recebe como argumento o caminho para o qual será navegado

●   Lembre-se que é possível utilizar os caracteres coringas

<!-- page: 93 -->

ls list

 ●   Imprime na tela o conteúdo (diretórios e arquivos) do diretório passado como argumento

 ●   Caso não receba um argumento, utilizará o diretório atual

<!-- page: 94 -->

ls list

 ●   Opções comuns:

      ○   -a → imprime arquivos e diretórios ocultos
      ○   -l → imprime informações do conteúdo
      ○   -1 → imprime um item por linha
      ○   -m → separa os itens por vírgula
      ○   -t → ordena os arquivos em ordem decrescente de data

<!-- page: 95 -->

               5.
Gerenciando arquivos
         e diretórios

<!-- page: 96 -->

touch

●   Atualiza a data de última modiﬁcação e de último acesso do arquivo (sem modiﬁcar seu
    conteúdo)

●   Caso não exista o arquivo especiﬁcado, cria um arquivo com o nome passado como
    argumento

<!-- page: 97 -->

mkdir make directory


●   Cria um diretório usando o argumento passado como nome

●   Caso já exista um diretório com o nome, imprime mensagem de erro

<!-- page: 98 -->

rm & rmdir remove & remove directory

●   rm exclui arquivos a partir dos argumentos

●   rmdir exclui diretório se este estiver vazio, caso contrário imprime mensagem de erro

●   Também é possível excluir diretórios com rm, usando a opção -r

<!-- page: 99 -->

Nunca digite
sudo rm -rf /

<!-- page: 100 -->

Caractere de escape

●   Existem caracteres especiais da shell, como o / e o caractere de espaço, que separa textos

●   Assim, ao criar arquivos ou diretórios com o caracteres especiais, é preciso “escapá-los”

●   Para isso, utilize a barra invertida “\” antes do caractere

<!-- page: 101 -->

cp copy
●   Copia arquivos e diretórios (com -r)

●   $ cp [arquivo] [destino]

●   $ cp -r [diretório] [destino]

●   Caso o ﬁm do destino seja um diretório, a cópia terá o mesmo nome

●   Você pode terminar o destino com um arquivo, que será o nome da cópia

<!-- page: 102 -->

mv move


●   Move (recorta) ou renomeia arquivos e diretórios
●   $ mv [arquivo/diretório] [destino]
●   $ mv [arquivo/diretório] [novo nome]
●   Caso o destino seja o mesmo diretório da fonte, é possível alterar o nome do item

<!-- page: 103 -->

A opção -i em comandos
como mv, cp e rm pedem
conﬁrmação de execução
caso haja necessidade de
sobrescrever um item

<!-- page: 104 -->

               6.
Extraindo informações

<!-- page: 105 -->

ﬁle

●   Comando para imprimir o tipo do arquivo

●   A princípio, parece um comando bobo, visto que há as extensões de arquivo

●   Contudo, no Linux, o tipo do arquivo não se dá pela extensão, mas sim por metadados

<!-- page: 106 -->

du disk usage


●   Imprime o tamanho em bytes de arquivo/diretório

●   $ du -shc *

<!-- page: 107 -->

quota


●   Quando logado na sua conta em um PC do DInf ou na macalan, utilize este comando para
    saber o consumo de sua quota

●   $ quota -s

<!-- page: 108 -->

           7.
Editores de texto

<!-- page: 109 -->

Visual Studio Code

●   Criado pela Microsoft com o Electron, amplamente utilizado para desenvolvimento

●   Disponibiliza inúmeros plugins feitos pela comunidade

●   Há versões livres open-source, como o vscodium

<!-- page: 110 -->

gedit

●   Editor de texto com GUI do GNOME

●   Simples, mas disponibiliza alguns plugins

<!-- page: 111 -->

nano
●   Editor de texto do GNU para terminais

●   Interface simples, fácil aprendizado

<!-- page: 112 -->

vi, vim e neovim
●   vi é um editor de texto para terminal criado para sistemas Unix

●   vim foi lançado como uma versão extendida do vi, adicionando novas funcionalidades

●   Posteriormente, neovim foi criado a partir do vim, melhorando a implementação de plugins

<!-- page: 113 -->

vi, vim e neovim


●   💡 Pesquise sobre o vim:

     ○   vimschool.netlify.app

     ○   openvim.com

     ○   tutorialspoint.com/vim/index.htm

<!-- page: 114 -->

                  8.
Entrada e saída de dados

<!-- page: 115 -->

Streams
●   Nos sistemas Unix, há a convenção de            ●   Por padrão, o stdin recebe dados do
    utilização de entradas e saídas padrão para a       teclado, e stdout e stderr imprime
    entrada e saída de dados                            mensagens na tela

●   São deﬁnidas três conexões/streams/ﬂuxos        ●   Contudo, é possível utilizar conteúdo
    padrão:                                             de arquivos no stdin, e redirecionar a
                                                        saída de stdout e stderr para
     ○   stdin → standard input (entrada padrão)
                                                        arquivos, em vez da tela
     ○   stdout → standard output (saída padrão)
                                                    ●   Então, a partir daqui, em vez de
     ○   stderr → standard error (erro padrão)          usarmos a expressão “imprimir na
                                                        tela”, falaremos “escrever na
●   Por estas streams ocorre o ﬂuxo dados entre o
                                                        saída/erro padrão”
    teclado, processos e a tela, mediados pelo
    shell                                           ●   Veremos como redirecionar as
                                                        streams adiante

<!-- page: 116 -->

Streams

<!-- page: 117 -->

echo

●   Escreve o texto (argumento) na saída padrão

●   Por padrão, escreve o caractere de nova linha \n no ﬁm do texto

●   Para evitar a escrita do new line, utilize a opção -n

<!-- page: 118 -->

cat & tac concatenate

●   Lê arquivo(s) passado(s) como argumento(s), o(s) concatena e escreve na saída padrão

●   Caso não seja passado nenhum argumento, lê os dados da entrada padrão (stdin)

●   O comando tac performa a mesma tarefa do cat, porém, escreve as linhas na ordem reversa

<!-- page: 119 -->

             9.
Caracteres coringas

<!-- page: 120 -->

Redirecionamento das streams

●   É possível alterar a fonte da stdin e as saídas de stdout e stderr a partir de caracteres
    coringas
●   Para redirecionar a saída padrão para um arquivo, utiliza-se > e >>, destrutivo e
    não-destrutivo respectivamente
     ○   echo ‘Hello, world!’ > hello.txt
     ○   echo ‘abc’ >> hello.txt
     ○   echo ‘destruindo’ > hello.txt
     ○   echo ‘echo abc’ > echo.txt
●   Para enviar dados de um arquivo para stdin, utiliza-se <
     ○   cat < hello.txt
     ○   bash < echo.txt

<!-- page: 121 -->

Regex regular expressions


●   As expressões regulares são amplamente
    utilizadas em diversas áreas da
    computação

●   Com elas, é possível representar padrões
    de texto a partir de sequência de
    caracteres

●   Alguns de seus caracteres são possíveis
    de serem usados no shell como caracteres
    coringas

●   💡 Pesquise sobre regex
                                               regexr.com

<!-- page: 122 -->

Caracteres coringas
●   * → representa zero ou mais ocorrências de quaisquer caracteres

●   ? → representa uma ocorrência de um caractere qualquer, pode ser combinado (ex:
    ?????.txt)

●   [] → representa uma ocorrência de algum caractere presente entre os colchetes, pode
    ser combinado (ex: [2468][13579].txt)

●   {} → com chaves é possível representar sequências de caracteres

     ○   echo {1..100}

     ○   echo {a..z}

●   & → colocado no ﬁm de um comando, coloca o processo em background e libera o
    prompt

     ○   gedit teste.txt &

<!-- page: 123 -->

Caracteres coringas

●   ; → com este caracter é possível separar comandos em apenas uma linha

     ○   echo a; echo b

●   $ → usada para representar variáveis de ambiente do shell

     ○   echo $PATH

●   “ → usada para representar texto permitindo caracteres especiais

     ○   echo “Data: $(date)”

●   ‘ → usada para representar texto anulando efeito dos caracteres especiais

     ○   echo ‘Data: $(date)’

<!-- page: 124 -->

Caracteres coringas

<!-- page: 125 -->

Exercício
$ wget https://www.inf.ufpr.br/vm20/linux/aula2.tar.gz
$ tar -xvf aula2.tar.gz

<!-- page: 126 -->

Avalie a aula
forms.gle/VX45YdL5WJsp7zMy6


Conta como presença!

<!-- page: 127 -->

Obrigado!
        pet.inf.ufpr.br
       pet@inf.ufpr.br
       @petcompufpr

<!-- page: 128 -->

                     Semana de Calouros 2023


Linux

Aula III


Login: petsemcalX
Senha: PetSemcal#X                  2023

<!-- page: 129 -->

Relembrando…

<!-- page: 130 -->

Comandos


●   rm - remove arquivo/diretório
●   mv [arquivo] [destino] - move arquivo/diretório
●   mv [arquivo] [novo nome] - renomeia arquivo/diretório
●   cp - copia arquivo/diretório
●   file - especiﬁca tipo do arquivo
●   touch - atualiza data de acesso ou cria novo arquivo
●   du - mostra o tamanho de arquivo/diretório
●   cat - concatena e imprime o conteúdo do arquivo

<!-- page: 131 -->

Texto para treino
wget https://www.inf.ufpr.br/vm20/linux/memorias.txt

<!-- page: 132 -->

           1.
Usuários e grupos

<!-- page: 133 -->

Usuários e grupos


●   Usuários e grupos são usados para controle de acesso a arquivos e diretórios

●   Usuários podem ser adicionados e removidos, com eles é possível logar no sistema

●   Grupos são conjuntos de usuários, que podem receber permissões especíﬁcas que se
    aplicam a todos os usuários presentes nele

●   Ao instalar o Linux, um usuário é criado por padrão, o usuário root

<!-- page: 134 -->

Superusuário


●   O root é um superusuário, ou seja, é um usuário administrador que pode controlar
    qualquer aspecto do sistema operacional, desde acessar qualquer arquivo/diretório a
    rodar qualquer comando

●   Como usuário comum, é possível rodar um comando como root usando o comando sudo
    como preﬁxo

     ○   $ sudo apt install nvim

●   Contudo, para poder utilizar o comando sudo, o usuário deve estar no grupo sudoers, que
    apenas o root e outros usuários sudoers conseguem gerenciar

     ○   $ cat /etc/sudoers (só conseguirá rodar como superusuário, rs)

<!-- page: 135 -->

    2.
Permissões

<!-- page: 136 -->

Permissões
●   Há três tipos de permissões aplicadas a arquivos e diretórios:
     ○   Read: leitura
     ○   Write: escrita, alteração e deleção
     ○   Execute: execução
●   Estas permissões podem ser deﬁnidas para três entidades:
     ○   User: seu usuário
     ○   Group: usuários presentes nos seus grupos
     ○   Others: o resto
●   Cada arquivo e diretório possuem um dono, que é o criador do item
●   O dono pode gerenciar seus arquivos e diretórios para atribuir permissões de leitura,
    escrita e/ou execução a outros usuários
●   O superusuário tem permissão para leitura, escrita e execução em qualquer
    arquivo/diretório!

<!-- page: 137 -->

Permissões


●   Rode: $ ls -l

<!-- page: 138 -->

chmod change mode

●   Para alterar permissões, utiliza-se o comando chmod

●   O primeiro argumento são as entidades em que as permissões serão mudadas

●   O segundo argumento é o tipo de alteração

●   O terceiro argumento é o tipo de permissão

●   A notação textual segue:

     ○   $ chmod [ugoa] [+-=] [rwx] [arquivo/diretório]

●   As possibilidades do terceiro argumento podem ser combinadas

     ○   Ex: $ chmod ug=rw, o-rw hello.txt

●   Ao ser utilizado em diretórios, é possível utilizar a opção -R (Recursivo) para aplicar as
    mudanças em todos os arquivos/diretórios ﬁlhos

●   💡 Pesquise sobre a notação octal do chmod

<!-- page: 139 -->

public_html


●   Ao adicionar um arquivo no seu diretório public_html do DInf, não se esqueça de alterar
    as permissões para permitir a leitura e execução do arquivo pelo servidor nginx

●   $ chmod o+rx index.html

<!-- page: 140 -->

  3.
Histórico

<!-- page: 141 -->

history


●   A shell, por padrão, escreve os comandos executados num arquivo de histórico

●   Bash: ~/.bash_history

●   zsh: ~/.zsh_history

●   Assim, é possível utilizar o comando history que exibe o histórico dos comandos

<!-- page: 142 -->

                     4.
Redirecionamento de streams
            entre comandos

<!-- page: 143 -->

Pipeline


●   Você pode redirecionar a saída de um comando (stdout) para ser usada como entrada
    (stdin) de outro usando pipe (caractere ‘|’)

●   comando1 | comando2 | comando3 - comando1 gera entrada pro comando2 e o
    comando2 pro comando3.

●   Exemplos:

     ○   ls | tac - imprime o ls da última linha para a primeira

     ○   ls -t | tac - imprime o ls em ordem crescente de data

<!-- page: 144 -->

                  5.
Mais comandos de leitura

<!-- page: 145 -->

head


●   Por padrão, lê as primeiras 10 linhas de um arquivo

●   É possível especiﬁcar quantas linhas lidas com a opção -n [número]

●   Ex:

     ○    $ head arquivo.txt

     ○    $ head -n 20 arquivo.txt

<!-- page: 146 -->

tail


●   Por padrão, lê as últimas 10 linhas de um arquivo

●   É possível especiﬁcar quantas linhas lidas com a opção -n [número]

●   Ex:

     ○    $ tail arquivo.txt

     ○    $ tail -n 20 arquivo.txt

<!-- page: 147 -->

less


●   Lê um arquivo de forma interativa

●   Isto é, não imprime todo o arquivo na tela, em vez disso, é possível navegar pelo arquivo
    utilizando setas, mouse etc.

●   Ideal para arquivos grandes

●   “q” para sair, “h” para mostrar a tela de ajuda

●   “/padrao” grifa as ocorrências de “padrao” no documento

●   Versão melhorada do comando “more”

<!-- page: 148 -->

           6.
Buscando arquivos

<!-- page: 149 -->

ﬁnd


●   Formato: ﬁnd [ponto-inicial] [opções] [argumento]

●   Ponto inicial: por onde começar a procura (padrão: diretório atual)

●   Opções: no geral, especiﬁca que tipo de argumento o comando irá procurar, como nome,
    data de criação, permissão. Exemplo de opção: -iname.

●   Argumento: o que o comando irá procurar levando em consideração o tipo dado nas
    opções.

<!-- page: 150 -->

         7.
Filtrando texto

<!-- page: 151 -->

grep


●   Procura por uma palavra/frase/expressão dentro de um arquivo.
     ○   Global Regular Expression Print
     ○   Globally looks for a Regular Expression and Print
     ○   Global Regular Expression Parser
●   Formato: grep [opções][expressão][arquivo]
●   cat doc.txt | grep legal - Pega as linhas de doc.txt com a palavra “legal”
●   Você pode sempre usar o man para ver as opções:
     ○   man grep

<!-- page: 152 -->

cut


●   Usado para “cortar” o texto por colunas

●   Opções

      ○   -d’c’: usa ‘c’ como caractere delimitador

      ○   -fn : retorna apenas o campo (ﬁeld) número n

      ○   -fn,m : retorna apenas os campos (ﬁeld) número n e m

●   O caractere TAB é o padrão de delimitador

●   Parecido com outro comando: awk

●   cat documento.csv | cut -d’,’ -f1 - Colunas separadas por vírgula, coluna 1

<!-- page: 153 -->

Exercício
$ wget https://www.inf.ufpr.br/vm20/linux/aula2.tar.gz
$ tar -xvf aula2.tar.gz

<!-- page: 154 -->

Exercício
$ wget https://www.inf.ufpr.br/vm20/linux/aula2.tar.gz
$ tar -xvf aula2.tar.gz


$ wget https://www.inf.ufpr.br/vm20/linux/aula3.tar.gz
$ tar -xvf aula3.tar.gz

<!-- page: 155 -->

Avalie a aula
forms.gle/CnxErdMxXF7TTAmT9


Conta como presença!

<!-- page: 156 -->

Obrigado!
        pet.inf.ufpr.br
       pet@inf.ufpr.br
       @petcompufpr

<!-- page: 157 -->

                     Semana de Calouros 2023


Linux
Aula IV


Login: petsemcalX
Senha: PetSemcal#X                  2023

<!-- page: 158 -->

Relembrando…

<!-- page: 159 -->

Comandos


●   touch - atualiza data de acesso ou cria novo arquivo

●   rm - remove arquivo/diretório

●   mv [arquivo] [destino] - move arquivo/diretório

●   man - mostra o manual do comando

●   cp - copia arquivo/diretório

●   less - lê o arquivo de forma interativa

●   cat - concatena e imprime o conteúdo do arquivo

●   sudo - usa os poderes do super usuário

<!-- page: 160 -->

Exercício surpresa!!
●   O que estes comandos fazem?
    ○   man htop
    ○   rsync -h
    ○   wget --help
    ○   touch {1..5}

<!-- page: 161 -->

           1.
Recomendações de
      programas

<!-- page: 162 -->

Navegadores Web


   Firefox        Chromium   Qutebrowser

<!-- page: 163 -->

Multimídia


       VLC           Eye of GNOME    sxiv
  Vídeos e músicas      Imagens     Imagens

<!-- page: 164 -->

Gerenciadores de arquivos


   LF
    Terminal


                 Files for GNOME   Nemo
                      Gráﬁco       Gráﬁco

<!-- page: 165 -->

Office documentos, planilhas e apresentações


     LibreOffice                    WPS        Google Docs

<!-- page: 166 -->

Pesquise sobre o Latex!

<!-- page: 167 -->

Lista de aplicações
wiki.archlinux.org/title/List_of_applications

<!-- page: 168 -->

      2.
Secure Shell

<!-- page: 169 -->

Secure Shell


●   O Secure Shell é um protocolo de rede criptografado, sendo seguro para utilizar em
    qualquer rede (segura ou não)

●   É um protocolo TCP/IP na camada de aplicação, i.e., a mais alta

●   Com o ssh, é possível fazer login em uma máquina remota, assim, tendo acesso a um shell
    naquele computador

●   Como criptograﬁa, utiliza a Criptograﬁa de Chave Pública

●   Além de abrir um shell em máquinas remotas, é possível, também, mover arquivos entre os
    computadores

●   💡 Pesquise sobre o OpenSSH e a criptograﬁa de chave pública

<!-- page: 170 -->

Secure Shell

<!-- page: 171 -->

ssh Secure Shell


●   Conecta seu shell a outra máquina de forma remota
     ○   comando: ssh <user>@<endereço>

     ○   conecta na porta 22


●   As principais máquinas do DInf
     ○   macalan - servidora de uso geral
     ○   orval - servidora para processamento que utiliza muitos recursos
     ○   cpu1 e cpu2 - servidoras para processamento genérico

<!-- page: 172 -->

SCP


●   Copia um arquivo local para uma máquina remota
     ○   comando: scp <arquivo> <user>@<endereço>:<caminho>


●   Copia um arquivo remoto para a máquina local
     ○   comando: scp <user>@<endereço>:<caminhoDoArquivo> <destinoLocal>


●   Busque usar caminhos absolutos ao executar o scp, vai te evitar problemas

<!-- page: 173 -->

Exercício surpresa!!
●   O que estes comandos fazem?
    ○   sudo apt install curl
    ○   chmod g+r -R <dir>/
    ○   rm {1..10}
    ○   tar -czvf <dir>.tar.gz <dir>/

<!-- page: 174 -->

3.
sshfs

<!-- page: 175 -->

mount & umount


●   Monta dispositivos (USB, HD externo, etc.) em um diretório para poder acessar os arquivos

●   Lembre-se, os dispositivos são representados como arquivos em /dev

●   Ex:

     ○    mkdir pendrive && mount /dev/sda1 pendrive

●   Geralmente, os SOs montam automaticamente

●   Após a utilização, por segurança, deve-se desmontar o dispositivo

●   Ex:

     ○    umount pendrive && rmdir pendrive

<!-- page: 176 -->

sshfs


●   Monta diretórios remotos de outras máquinas na máquina local

     ○   comando: sshfs <user>@<endereço>:<caminhoRemoto> <diretórioAlvo>


●   Use fusermount para desmontar o diretório

     ○   comando: fusermount -u <diretoŕio>

<!-- page: 177 -->

               4.
Comandos legais do ssh

<!-- page: 178 -->

Comandos utilizados durante o ssh


●   whoami - mostra o nome do usuário no sistema
●   hostname - mostra o nome do sistema
●   who - mostra quem mais está conectado no sistema
●   finger - mostra os detalhes de um usuário no sistema

<!-- page: 179 -->

Exercício surpresa!!
●   O que estes comandos fazem?
    ○   rm ./*.csv
    ○   ls -l | grep ^d | awk '{print $NF}'
    ○   less <arquivoDeTexto>
    ○   du -hc <dir>

<!-- page: 180 -->

          5.
Exercício em sala

<!-- page: 181 -->

sshfs


●   Dê SCP na máquina do seu colega ao lado e tente copiar algum
    arquivo dela
●   Crie um arquivo e copie ele para a máquina do seu colega usando SCP

<!-- page: 182 -->

Exercício
$ wget https://www.inf.ufpr.br/vm20/linux/misterio.tar.gz
$ tar -xvf misterio.tar.gz

<!-- page: 183 -->

Avalie a aula
forms.gle/Xks4K5QCwvR8nsvs5


Conta como presença!

<!-- page: 184 -->

Obrigado!
        pet.inf.ufpr.br
       pet@inf.ufpr.br
       @petcompufpr
