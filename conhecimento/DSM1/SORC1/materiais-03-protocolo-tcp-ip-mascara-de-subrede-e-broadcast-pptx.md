---
disciplina: DSM1/SORC1
titulo: 03   Protocolo TCP IP, Mascara de SubRede e Broadcast.pptx
fonte: DSM1/SORC1/Materiais/03 - Protocolo TCP-IP, Mascara de SubRede e Broadcast.pptx.pdf
tipo: pdf
paginas: 18
extraido_em: 2026-10-24
---

<!-- page: 1 -->

Prof. Maylon H. Oliveira

<!-- page: 2 -->

               SORC
  Sistemas Operacionais e Rede de Computadores


Fatec        Prof Maylon H Oliveira
  Registro

<!-- page: 3 -->

             Protocolo
              TCP/IP
                                       Prof. Maylon H. Oliveira

Fatec        Prof Maylon H. Oliveira
  Registro

<!-- page: 4 -->

TCP/IP significa protocolo de controle de transmissão/protocolo da
internet (Transmission Control Protocol/Internet Protocol).

TCP/IP é um conjunto de regras padronizadas que permitem que os
computadores se comuniquem em uma rede como a internet.


                                                      Prof. Maylon H. Oliveira

Fatec             Prof Maylon H. Oliveira
   Registro

<!-- page: 5 -->

ENDEREÇOS IP:
O que são os octetos do IP?
O endereço da versão 4 do protocolo IP, é dividido em quatro grupos
de 8 bits, denominados octetos, ou seja, quatro números de 0 a 255,
separados por pontos. O endereço IP é distribuído de forma
hierárquica, formando sub-redes

             192.xxx.xxx.xxx - A
             192.168.xxx.xxx - B
             192.168.0.xxx - C
                                                   Prof. Maylon H. Oliveira

Fatec                  Prof Maylon H. Oliveira
  Registro

<!-- page: 6 -->

CLASSES DE ENDEREÇOS IP:
A – 1 ~ 126
B - 128 ~ 191
C – 192 ~ 223
D – 224 ~ 239
E – 240 ˜ 255
                              0 E 127 não são utilizados

                                            Prof. Maylon H. Oliveira

Fatec        Prof Maylon H. Oliveira
  Registro

<!-- page: 7 -->

             192.168.0.97 – Classe ?

             10.12.27.35 – Classe ?

             132.147.110.74 – Classe ?

                                          Prof. Maylon H. Oliveira

Fatec           Prof Maylon H. Oliveira
  Registro

<!-- page: 8 -->

   SEPARAÇÃO REDE/HOST:


 A separação de uma rede TCP/IP é definida
            da seguinte forma:


                                       Prof. Maylon H. Oliveira

Fatec        Prof Maylon H. Oliveira
  Registro

<!-- page: 9 -->

               10.12.27.35 – Classe A
               10 – Rede
               12.27.35 - Host

               132.147.110.74 – Classe B
               132.147 - Rede
               110.74 - Host

               192.168.0.97 – Classe C
               192.168.0 – Rede
               97 - Host
                                           Prof. Maylon H. Oliveira

Fatec        Prof Maylon H. Oliveira
  Registro

<!-- page: 10 -->

             Máscara de
             Sub-Rede
                                       Prof. Maylon H. Oliveira

Fatec        Prof Maylon H. Oliveira
  Registro

<!-- page: 11 -->

MÁSCARA DE SUB-REDE:
 O que é a máscara de rede?

 A máscara de rede tem 32 bits, assim como o endereço IP, tendo como
 ﬁnalidade mascarar uma parte do endereço IP. Sendo assim, todo endereço
 IP tem uma máscara correspondente, servindo para identiﬁcar qual parte do
 endereço é da rede e qual é a do host.

 Existe ainda uma classe de endereçamento para cada máscara de rede.
 Veja a seguir:

 • Classe de endereçamento A: 255.0.0.0 ou /8
 • Classe de endereçamento B: 255.255.0.0; ou /16
 • Classe de endereçamento C: 255.255.255.0. ou /24

                                                                  Prof. Maylon H. Oliveira

Fatec                 Prof Maylon H. Oliveira
   Registro

<!-- page: 12 -->

 MÁSCARA DE SUB-REDE:
 Para exemplificar, vamos supor que o endereço
 IP 192.168.0.50 tem uma máscara de rede que
 é 255.255.255.0 (classe C). Nesse caso, a parte
 correspondente à rede é 192.168.0 e a parte
 que se refere ao host é 50.

 Ou seja:

 • Rede: 191.171.0
 • Host: 50
 • Máscara de Sub-Rede: 255.255.255.0
 (possíveis 254 hosts)
                                                   Prof. Maylon H. Oliveira

Fatec                 Prof Maylon H. Oliveira
   Registro

<!-- page: 13 -->

MÁSCARA DE SUB-REDE /8 BITS:


 255.0.0.0 /8

 Endereços IP: 16.777.216 Hosts
 (Tiro 1de rede e 1 para BroadCast)

 16.777.216 -2=16.777.214 hosts


                                                 Prof. Maylon H. Oliveira

Fatec                  Prof Maylon H. Oliveira
    Registro

<!-- page: 14 -->

MÁSCARA DE SUB-REDE /16 BITS:


  255.255.0.0 /16

  Endereços IP: 65.536 Hosts
  (Tiro 1 de rede e 1 para BroadCast

  65.536 -2=65.534 hosts


                                                  Prof. Maylon H. Oliveira

 Fatec                  Prof Maylon H. Oliveira
     Registro

<!-- page: 15 -->

MÁSCARA DE SUB-REDE /24 BITS:


  255.255.255.0 /24

  Endereços IP: 256 Hosts
  (Tiro 1 de rede e 1 para BroadCast)
  256 -2=254 hosts


                                                  Prof. Maylon H. Oliveira

 Fatec                  Prof Maylon H. Oliveira
     Registro

<!-- page: 16 -->

             BROADSCAST


                                       Prof. Maylon H. Oliveira

Fatec        Prof Maylon H. Oliveira
  Registro

<!-- page: 17 -->

      BROADCAST EM UMA REDE DE COMPUTADORES:


       O Broadcast de Rede é uma tecnologia que permite a
       transmissão de informações, como áudio, vídeo e dados, para
       múltiplos destinatários simultaneamente. Essa forma de
       comunicação em massa é amplamente utilizada em diferentes
       setores, como televisão, rádio, internet e telefonia.


                                                         Prof. Maylon H. Oliveira

Fatec               Prof Maylon H. Oliveira
  Registro

<!-- page: 18 -->

      BROADCAST EM UMA REDE DE COMPUTADORES:


                                        Prof. Maylon H. Oliveira

Fatec         Prof Maylon H. Oliveira
  Registro
