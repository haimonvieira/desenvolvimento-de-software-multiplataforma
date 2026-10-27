---
disciplina: DSM1/PI
titulo: Explorando visão computacional e IA
fonte: DSM1/PI/Artigo Cientifico/Referencias/Explorando visão computacional e IA.pdf
tipo: pdf
paginas: 16
extraido_em: 2026-10-24
---

<!-- page: 1 -->

                                                       REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                             ISSN: 1983-0882


Explorando visão computacional e IA para auxiliar indivíduos no
Espectro Autista com o reconhecimento de expressões faciais e
sentimentos

Exploring computer vision and AI to help individuals on the Au-
tistic Spectrum with facial expression and sentiment recognition

Aprovechamiento de la visión por ordenador y la Inteligencia Ar-
tificial para ayudar a Personas Autistas mediante el reconocimi-
ento de expresiones faciales y sentimientos
                                                                DOI: 10.54033/cadpedv22n9-151

                                                                   Originals received: 6/6/2025
                                                            Acceptance for publication: 7/1/2025


Beatriz Barreto Marreiros Barbosa
Graduanda em Bacharelado em Engenharia de Software
Instituição: iCEV – Instituto de Ensino Superior
Endereço: Teresina, Piauí, Brasil
E-mail: beatriz.barbosa@somosicev.com

Cristovam Paulo de Brito Rocha
Graduando em Bacharelado em Engenharia de Software
Instituição: iCEV – Instituto de Ensino Superior
Endereço: Teresina, Piauí, Brasil
E-mail: cristovam.rocha@somosicev.com

Carlos Futino Barreto
Mestre em Engenharia de Software
Instituição: iCEV – Instituto de Ensino Superior
Endereço: Teresina, Piauí, Brasil
E-mail: carlos.futino@somosicev.com

Lílian Gabriella Castelo Branco Alves de Sousa
Mestra em Antropologia
Instituição: iCEV – Instituto de Ensino Superior
Endereço: Teresina, Piauí, Brasil
E-mail: liliansousa@grupocev.com

Francisco Luciani de Miranda Vieira
Mestre em Gestão e Inovação
Instituição: iCEV – Instituto de Ensino Superior
Endereço: Teresina, Piauí, Brasil
E-mail: francisco.vieira@somosicev.com

RESUMO


                                                                                                               Page 1
                 REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 2 -->

                                                        REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                              ISSN: 1983-0882


O Transtorno do Espectro Autista (TEA) abrange distúrbios do
desenvolvimento que afetam a interação social e a comunicação. Esta pes-
quisa investiga o uso da inteligência artificial (IA), aprendizado de máquina e
visão computacional para auxiliar indivíduos com TEA no reconhecimento de
expressões faciais e emoções. Dada a crescente prevalência do TEA, que em
2020 afetava 1 em cada 36 crianças, é essencial desenvolver ferramen- tas
inovadoras. Este estudo combina uma revisão da literatura com uma
implementação prática, utilizando as bibliotecas DeepFace e OpenCV do
Python, para criar uma ferramenta acessível e intuitiva destinada a profis-
sionais de saúde, familiares e pessoas no espectro. A ferramenta permite o
treinamento de habilidades sociais em qualquer lugar e a qualquer mo-
mento, despertando o interesse das pessoas com TEA em desenvolver suas
competências sociais por meio de tecnologias atuais. Esta abordagem repre-
senta um avanço no uso de tecnologias avançadas para enfrentar os desafios
associados ao TEA, destacando a importância de continuar explorando e
aprimorando essas soluções.

Palavras-chave: Transtorno do Espectro Autista. Inteligência Artificial. Visão
Computacional. Expressões Faciais. Emoções. Inclusão Social.

ABSTRACT
Autism Spectrum Disorder (ASD) encompasses developmental disorders that
affect social interaction and communication. This research investigates the
use of artificial intelligence (AI), machine learning, and computer vision to
assist individuals with ASD in recognizing facial expres- sions and emotions.
Given the rising prevalence of ASD, which affected 1 in 36 children in 2020,
developing innovative tools is essential. This study combines a literature
review with practical implementation, utilizing the DeepFace and OpenCV
libraries in Python, to create an accessible and intuitive tool aimed at
healthcare professionals, family members, and indi- viduals on the spectrum.
The tool allows for the training of social skills anywhere and anytime,
stimulating the interest of people with ASD in de- veloping their social
competencies through current technologies. This ap- proach represents a
significant advancement in using advanced technologies to address the
challenges associated with ASD, highlighting the importance of continued
exploration and refinement of these solutions.

Keywords: Autism Spectrum Disorder. Artificial Intelligence. Computer Vision.
Facial Expressions. Emotions. Social Inclusion.

RESUMEN
El Trastorno del Espectro Autista (TEA) engloba trastornos del desarrollo que
afectan a la interacción social y la comunicación. Esta investigación estudia el
uso de la inteligencia artificial (IA), el aprendizaje automático y la visión por or-
denador para ayudar a las personas con TEA a reconocer expresiones faciales
y emociones. Dada la creciente prevalencia del TEA, que en 2020 afectaba a 1
de cada 36 niños, es esencial desarrollar herramientas innovadoras. Este estudio
combina una revisión bibliográfica con una implementación práctica, utilizando


                                                                                                                Page 2
                  REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 3 -->

                                                       REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                             ISSN: 1983-0882


las librerías DeepFace y OpenCV de Python, para crear una herramienta acce-
sible e intuitiva dirigida a profesionales sanitarios, familiares y personas con es-
pectro. La herramienta permite entrenar habilidades sociales en cualquier lugar
y en cualquier momento, despertando el interés de las personas con TEA por
desarrollar sus competencias sociales utilizando las tecnologías actuales. Este
enfoque representa un gran avance en el uso de tecnologías avanzadas para
abordar los retos asociados al TEA, destacando la importancia de seguir explo-
rando y mejorando estas soluciones.

Palabras clave: Trastorno del Espectro Autista. Inteligencia Artificial. Visión por
Computador. Expresiones Faciales. Emociones. Inclusión Social.


1 INTRODUÇÃO


      Não há consenso científico para responder à pergunta "O que é autismo", de
acordo com Ricardo Schers (STRAVOGIANNIS, 2020); no entanto, se perguntarmos
a mai- oria das pessoas tem um conceito bem definido em mente. Entretanto, a
autora (SILVA, 2012) refere-se aos autistas como pessoas com habilidades
absolutamente reveladoras, caracterizadas por um conjunto de particularidades
que afeta princi- palmente a comunicação e o comportamento social. A discussão
sobre o Transtorno do Espectro Autista (TEA) tem ganhado importância, com
dados mostrando um aumento significativo nos diagnósticos. Em 2020, 1 em 36
crianças foi diagnosti- cada com TEA, uma alta em comparação com 1 em 150
crianças nos anos 2000 (MAENNER, 2021).
      Em todos os lugares, precisamos nos comunicar, expressando desejos,
dúvidas e chateações, além de interpretar essas expressões no outro. "Para
todos aqueles com traços ou diagnóstico de autismo, uma coisa é universal: o
contato social é sempre prejudicado", como informa a Psiquiatra Ana Beatriz em
(SILVA, 2012, p. 12). Diante disso, é primordial buscar soluções e abordagens
para o tratamento, especialmente no que diz respeito ao desenvolvimento das
habilidades sociais dessas pessoas.
      Estudos indicam que a socialização é vital para a integração e desenvol-
vimento individual (PRESSBOOKS, 2024; LUMEN LEARNING, 2024). Dada a
dificuldade de socialização das pessoas com TEA, esta pesquisa analisa como a


                                                                                                               Page 3
                 REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 4 -->

                                                         REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                               ISSN: 1983-0882


in- teligência artificial, aprendizado de máquina e visão computacional podem
facilitar o desenvolvimento dessas habilidades.
       A tecnologia também é uma grande aliada no tratamento de pessoas com
TEA. Segundo a psicóloga Milene Rosenthal, cuja a informação foi disponibilizada no
site canaltech1. Uma pessoa autista com dificuldade de comunicação pode não
saber se expressar verbalmente, mas um aplicativo que mostre figuras de
sentimentos, reações, entre outros, pode ser uma poderosa ferramenta de
expressão para aquele indivíduo.
       Este estudo utiliza uma abordagem bibliográfica, baseada em artigos e livros,
e inclui a implementação prática da biblioteca DeepFace do Python. O objetivo
é explorar como a inteligência artificial, juntamente com a visão computacional, pode
ser aplicada para desenvolver uma ferramenta intuitiva e acessível que auxilie no
treinamento de habilidades sociais para pessoas com TEA, facilitando o uso por
profissionais de saúde e familiares.


2 REVISÃO SISTEMÁTICA DA LITERATURA


       O Transtorno do Espectro Autista é classificado em três níveis, cada um
com ca- racterísticas próprias, como a presença ou ausência de deficiência
intelectual e o desenvolvimento da fala. No entanto, há uma característica
comum a todos: "o contato social é sempre prejudicado"(SILVA, 2012, p. 12).
       A comunicação, seja verbal ou não verbal, requer que o receptor compreenda
a mensagem transmitida pelo emissor. Uma forma de comunicação não verbal são
as expressões faciais, sendo cruciais para interpretar emoções e estabelecer uma
comu- nicação eficiente (MCQUAIL, 2001) (AMERICAN PSYCHOLOGICAL
ASSOCIATION, 2021). Alguns indivíduos com TEA, contudo, têm dificuldade em
interpretar essas expressões. Estudos de neuroimagem funcional mostraram
alterações nos sul- cos temporais superiores, uma região crítica para a percepção
de estímulos sociais, resultando em menor ativação durante atividades de
socialização (ZILBOVICIUS; MERESSE; BODDAERT, 2006).


1 Disponível em: https://canaltech.com.br/saude/como-a-tecnologia-esta-ajudando-pessoas- com-
autismo-no-brasil-153621


                                                                                                                 Page 4
                   REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 5 -->

                                                            REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                                  ISSN: 1983-0882


       O aprendizado de máquina (Machine Learning), uma subcategoria da IA,
refere-se a sistemas que modificam seu comportamento com base na
experiência. Visão computacional, por outro lado, permite que máquinas analisem
e interpretem imagens automaticamente. Ambas as tecnologias utilizam algoritmos
para identifi- car e classificar objetos, de forma semelhante ao cérebro humano,
processando dados de câmeras e smartphones para reconhecimento facial e de
objetos, como informado no site da Amazon2 e pelo autor (MALONE; RUS;
LAUBACHER, 2023).
       A aplicação de inteligência artificial e visão computacional no tratamento do
Transtorno do Espectro Autista (TEA) tem avançado significativamente nos últimos
anos. Desde 2015, o número de publicações nessa área tem aumentado,
refletindo o progresso tecnológico e o crescente interesse em desenvolver
soluções que auxi- liem indivíduos com TEA no reconhecimento de emoções e no
desenvolvimento de habilidades sociais (HAPPY; DANTCHEVA; DUGELAY,
2019; ZENG et al., 2021).
       Pesquisadores como Rana el Kaliouby (KALIOUBY; FERNANDEZ, 2020) e
Rosalind Picard (PICARD, 1997) têm liderado estudos sobre a utilização de inteli-
gência artificial e visão computacional para aprimorar o reconhecimento de expres-
sões faciais e criar tecnologias voltadas para o treinamento de habilidades sociais em
indivíduos com TEA. Complementarmente, os trabalhos de Paul Ekman (EKMAN,
2003), embora focados na teoria das expressões faciais e emoções, oferecem a
base teórica fundamental para esses sistemas.
       Estudos como os de Happy et al. (2019) (HAPPY; DANTCHEVA; DUGE-
LAY, 2019) e Zeng et al. (2021) (ZENG et al., 2021) investigam como a visão com-
putacional e a inteligência artificial podem ser empregadas para reconhecer emoções
em pessoas com TEA. Esses estudos demonstram como ferramentas
tecnológicas podem facilitar o treinamento de habilidades sociais ao fornecer
feedback em tempo real sobre as emoções detectadas.
       A revisão revelou que sistemas computacionais têm sido amplamente uti-
lizados para oferecer suporte no desenvolvimento de habilidades sociais em ambi-


2 Disponível em:   https://aws.amazon.com/pt/what-is/computer-vision/


                                                                                                                    Page 5
                      REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 6 -->

                                                         REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                               ISSN: 1983-0882


entes controlados, como clínicas terapêuticas e escolas. Essas ferramentas
criam um ambiente seguro para que indivíduos com TEA pratiquem o
reconhecimento de expressões faciais e emoções, sem o estresse associado às
interações sociais imedi- atas (GOODWIN et al., 2008; WAINER et al., 2014;
SCASSELLATI; ADMONI; MATARIC, 2012).
         Apesar dos avanços significativos, a revisão da literatura indica que ainda
existem desafios relacionados à precisão dos sistemas de reconhecimento facial e
à aceitação por parte dos usuários com TEA. A personalização dessas
ferramentas é crucial, considerando a diversidade do espectro autista (ZENG et
al., 2021). Es- ses insights ressaltam a necessidade contínua de desenvolvimento
e aprimoramento dessas tecnologias.


3 METODOLOGIA


         Nesta pesquisa foi realizada uma extensa revisão da literatura sobre o uso
de In- teligência Artificial no tratamento de habilidades sociais. Foram utilizadas
fontes acadêmicas, como artigos, livros e teses, priorizando estudos relacionados à
tecnolo- gia publicados entre 2019 e 2024. Ferramentas de pesquisa foram
essenciais para a viabilidade deste estudo, incluindo a documentação oficial das
bibliotecas utilizadas na parte prática, Google Scholar, IEEE e SciELO.
         Diversos termos de pesquisa foram utilizados para orientar o estudo, entre
eles: “Transtorno do Espectro Autista”, “Tratamento de Habilidades Sociais”, “Lin-
guagem Não Verbal”, “Expressões Faciais”, “Inteligência Artificial”, “Visão Compu-
tacional” e “Tecnologia e Autismo”. Esses termos foram fundamentais para garantir
uma pesquisa direcionada e consistente com o tema do estudo.
         Além da revisão teórica, a pesquisa investiu na parte prática, explorando
tecnologias de IA e visão computacional para o reconhecimento de expressões
fa- ciais. Foram utilizadas bibliotecas da linguagem de programação Python para
im- plementar e testar códigos experimentais, embora o código desenvolvido ainda
seja experimental e necessite de aprimoramentos antes de este estar pronto para
o uso.


                                                                                                                 Page 6
                   REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 7 -->

                                                             REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                                   ISSN: 1983-0882


        Especificamente, a biblioteca DeepFace3 foi implementada para realizar aná-
lises faciais e associar emoções a partir de imagens selecionadas pelo usuário.
Jun- tamente com a DeepFace, utilizou-se a OpenCV4 para capturar e processar
imagens em tempo real através da webcam do computador, permitindo o
reconhecimento de expressões faciais enquanto o usuário interage com a
ferramenta.
        Em seguida, o sistema processa a imagem e retorna a emoção
predominante associada àquela expressão facial. Esse sistema pode ser utilizado
em situações de treinamento supervisionado por terapeutas ou em casa, com a
orientação de famili- ares, para melhorar a capacidade de interpretar emoções e
reações não verbais. A ferramenta pode ser aplicada em sessões de terapia para
reforçar a interação social de forma controlada, ou como prática diária para que o
indivíduo com TEA se acos- tume a reconhecer e responder adequadamente às
expressões faciais. Além disso, o sistema pode ser utilizado em ambientes
educativos, onde a interação social é fre- quentemente desafiadora para esses
indivíduos. O principal propósito da ferramenta é apoiar o desenvolvimento de
habilidades sociais essenciais, como a compreensão de sentimentos e emoções,
melhorando a comunicação entre indivíduos com TEA e seus familiares ou colegas.
Ao aumentar a conscientização sobre as emoções humanas, o sistema contribui
para reduzir o isolamento social e promover uma interação mais efetiva e natural.
        Além disso, as bibliotecas Pillow5 e o módulo ImageTk foram empregadas
para manipulação e exibição de imagens. Combinadas com a DeepFace, essas
bi- bliotecas permitiram a análise de uma imagem enviada pelo próprio usuário.
A biblioteca Tkinter6 foi utilizada para criar uma interface mais intuitiva, permitindo
que qualquer usuário, independentemente de seu conhecimento em programação,
possa utilizar o sistema, como é mostrado nas Figuras 1 e 2.


3 Disponível em: https://github.com/serengil/deepface
4 Disponível em: https://opencv.org/
5 Disponível em: https://pillow.readthedocs.io/en/stable/
6 Disponível em:   https://docs.python.org/pt-br/3/library/tkinter.html


                                                                                                                    Page 7
                      REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 8 -->

                                                        REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                              ISSN: 1983-0882


              Figura 1. Tela Inicial e Tela Descobrir do Detector de Emoções.


                              Fonte: Elaborado pelos autores.


     Figura 2. Tela Menu de Emoções e Tela de cada emoção do Detector de Emoções


                              Fonte: Elaborado pelos autores.


       Para acompanhar o desenvolvimento do projeto, realizamos testes em duas
abordagens distintas: análise por meio de imagens estáticas e em tempo real. Foram
coletadas 18 fotografias de diferentes indivíduos, cada uma capturando uma varie-
dade de expressões faciais. Optamos por incluir um número maior de imagens que
capturassem a região dos ombros para cima, pois acreditamos que esta
perspectiva forneceria uma visão mais clara das expressões faciais. Após a
coleta, as emoções presentes nas imagens foram cuidadosamente analisadas com
o auxílio do detector de emoções desenvolvido neste estudo. O objetivo desta
análise foi testar a eficácia do detector ao identificar emoções em imagens estáticas.
A análise realizada pela IA foi posteriormente classificada em "Correta", "Errada"e
"Inconclusiva"para avaliar a precisão do sistema e ajustar sua eficácia no
reconhecimento de expressões faciais.
       Na segunda abordagem, participaram 8 voluntários, todos sem diagnóstico
de TEA. Durante esses testes, focamos na identificação e análise das seis
emoções básicas: raiva, nojo, medo, felicidade, surpresa, tristeza e a emoção
neutra. O papel desses voluntários foi ajudar na avaliação da análise por meio
da webcam. Como não tínhamos acesso a pessoas devidamente diagnosticadas


                                                                                                                Page 8
                  REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 9 -->

                                                        REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                              ISSN: 1983-0882


com TEA, testamos as funcionalidades com pessoas ao nosso alcance. Os testes
foram conduzidos ao longo de um período de uma semana no ano de 2024.


4 RESULTADOS


       A análise dos dados confirma a relevância das habilidades sociais
prejudicadas no espectro autista, como discutido por Silva (SILVA, 2012), e a
necessidade de inter- venções eficazes. Este estudo reforça a importância das
tecnologias no tratamento do TEA, alinhando-se a (CONTRERAS-ORTIZ;
MARRUGO; RIBON, 2023) sobre os benefícios de ambientes virtuais. A
integração da tecnologia no tratamento do TEA oferece vantagens significativas,
permitindo um tratamento mais precoce e acessível, conforme discutido por
Adams et al. (ADAMS et al., 2008). No entanto, também há desafios, como a falta
de estrutura e conhecimento na implementação dessas tecnologias.
       Os resultados indicam que ferramentas modernas, como Inteligência Artifi-
cial e visão computacional, têm grande potencial para melhorar o tratamento das
habilidades sociais. Embora a revisão da literatura mostre evidências promissoras
sobre a contribuição dessas tecnologias, a eficácia prática ainda precisa ser
validada de forma mais detalhada. A identificação de expressões faciais pelo
sistema desen- volvido mostrou-se promissora, mas a relevância da IA nesse
contexto requer mais exploração.
       A aplicação é capaz de analisar expressões faciais de imagens estáticas
e em tempo real via webcam, traduzindo-as em sentimentos para que indivíduos
com TEA pratiquem o reconhecimento emocional. Sugere-se a utilização em
sessões terapêuticas para associar expressões a sentimentos, semelhante ao uso
de PECS7. Por ser uma abordagem inovadora e atual, há uma maior probabilidade
de aumentar o interesse do autista no processo de aprendizado sobre emoções.
       Importante frisar que a aplicação visa auxiliar e não substituir profissionais
e treinamentos especializados. A ferramenta proporciona uma melhoria significativa
na percepção dos indivíduos com autismo sobre diferentes sentimentos, apoiando


7 O PECS é um sistema único de comunicação alternativa/aumentativa,             destinado a ensinar
comunicação funcional


                                                                                                                Page 9
                  REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 10 -->

                                                       REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                             ISSN: 1983-0882


uma area muito importante, a socialização (UMBERSON et al., 1996)(BANDURA
et al., 1986)(SCHNEIDER, 1993).
      Na parte prática, foram realizados testes para avaliar a eficácia da aplicação
em reconhecer expressões faciais. O objetivo foi testar a eficácia da aplicação
em identificar corretamente as expressões analisadas. As bases de dados foram
cons- truídas pelos autores, que coletaram fotos de si mesmos e de pessoas
conhecidas, utilizaram voluntários familiares e amigos para as análises por
webcam. Os perfis foram escolhidos com base na acessibilidade por parte dos
autores.
      A avaliação foi conduzida perguntando aos participantes se a emoção identi-
ficada pelo detector correspondia à emoção que eles queriam expressar.
Resultados foram classificados como inconclusivos em casos onde a expressão
não era clara- mente identificável, como no caso onde uma expressão de
felicidade foi analisada como neutra devido à sutileza do sorriso.
      Após os testes de funcionamento, nenhum ajuste foi feito nos parâmetros do
sistema, e não houve separação em conjuntos de validação e teste, uma vez que
não foram realizados treinamentos adicionais no modelo.
      A Figura 3 e a Figura 4 mostram os resultados obtidos dos testes de análise
por tipo de foto e por webcam, respectivamente.


                Figura 3. Resultados dos testes de análise por tipo de foto


                             Fonte: Elaborado pelos autores.


                                                                                                             Page 10
                 REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 11 -->

                                                       REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                             ISSN: 1983-0882


                 Figura 4. Resultados dos testes de análise por webcam


                             Fonte: Elaborado pelos autores.


      A Figura 5 ilustra a tela e as informações que o usuário visualiza ao anali-
sar uma imagem, mostrando a porcentagem de cada emoção associada à
expressão detectada. Já a análise por webcam é exibida na Figura 6, que
apresenta uma inter- face simplificada para reduzir a carga de processamento. A
tela mostra a imagem capturada pela webcam com o rosto analisado e a emoção
predominante identificada.


              Figura 5. Tela de expressão analisada do detector de emoções


                             Fonte: Elaborado pelos autores.


                                                                                                             Page 11
                 REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 12 -->

                                                            REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                                  ISSN: 1983-0882


           Figura 6. Tela de análise de expressão por webcam do detector de emoções


                                  Fonte: Elaborado pelos autores.


5 DISCUSSÃO


         Durante a leitura deste artigo, é possível questionar por que as habilidades
sociais são frequentemente afetadas em indivíduos com TEA. Estudos como o
presente no site Applied Behavior Analysis8, indicam que essa dificuldade,
prevalente em todos os níveis do espectro, está diretamente associada a várias
características essenciais da condição. Conforme mencionado em (VOLKMAR,
2013), tais características in- cluem as dificuldades na interpretação de sinais de
comunicação não verbal. Esses aspectos sobrecarregam o indivíduo, levando ao
isolamento social ou a comporta- mentos inadequados.
         De acordo com o site Applied Behavior Analysis, a habilidade de prosperar
em ambientes sociais é crucial para a felicidade e experiência humana. Assim, o
estudo foca em estratégias para melhorar a capacidade de reconhecer e interpretar
emoções a partir de expressões faciais. Assim, quais estratégias poderiam ser
adotadas para aprimorar a capacidade de reconhecer e interpretar emoções a
partir de expressões faciais?
         O uso de ferramentas baseadas em visão computacional foi explorado como
um complemento e não um substituto aos métodos tradicionais de treinamento ofe-
recidos por profissionais. Essa abordagem, ao integrar tecnologia visa oferecer in-
tervenções mais precoces e envolventes.
         Além disso, um benefício adicional dessa abordagem é sua conexão com
o mundo do paciente. A ferramenta tecnológica desenvolvida, quando combinada

8 Disponível     em: https://www.appliedbehavioranalysisedu.org/why-do-autistics-have-issues- with-
social-skills/


                                                                                                                  Page 12
                      REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 13 -->

                                                         REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                               ISSN: 1983-0882


com uma estratégia de gamificação9 bem planejada, incluindo os interesses
específicos do indivíduo no espectro, mostra-se uma alternativa promissora para o
tratamento (OLIVEIRA, 2019).
       Entretanto, a tecnologia pode ter limitações, como a necessidade de infra-
estrutura adequada e capacitação para profissionais e pais. É crucial garantir um
ambiente apropriado e simplicidade no uso da ferramenta desenvolvida.
       A tecnologia de reconhecimento de expressões faciais desenvolvida neste
tra- balho representa uma abordagem prática e envolvente para aprender sobre
emoções associadas a diferentes expressões faciais. Dessa forma a utilização de
inteligência artificial e aprendizado de máquina nesse contexto abre um vasto leque
de possibi- lidades. Em consonância com estudos existentes (DURKIN; CONTI-
RAMSDEN, 2007), acreditamos que a aplicação de IA no tratamento do TEA
pode melhorar a compreensão emocional e a interação social de indivíduos
autistas.
       Embora os testes com imagens estáticas tenham mostrado desempenho
satisfatório, a análise em tempo real via webcam revelou desafios, especialmente na
identificação da expressão de nojo, conforme observações em outros estudos
(BERNARD- OPITZ; SRIRAM; NAKHODA-SAPUAN, 2001).
       Adicionalmente, é essencial reconhecer a necessidade de adaptar a
interface para atender às especificidades de indivíduos no espectro autista antes
de sua im- plementação em cenários reais. Acrescenta-se ainda que no
desenvolvimento da aplicação, não foi realizada uma análise adequada de interface
e acessibilidade, dado que o foco do estudo era demonstrar a aplicação de visão
computacional no contexto discutido.


6 CONSIDERAÇÕES FINAIS


       Alinhados com Ana Beatriz (SILVA, 2012), compreende-se que a área da
socialização e as habilidades sociais são comumente prejudicadas em indivíduos
no espectro, independentemente do nível. O envolvimento com essa temática


9 Gamificação é o uso de elementos de jogos, como desafios e recompensas, em contextos não

relacionados a jogos, como educação e saúde, para motivar o engajamento e o aprendizado.


                                                                                                               Page 13
                   REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 14 -->

                                                            REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                                  ISSN: 1983-0882


partiu do que foi exposto pelos autores (PRESSBOOKS, 2024; LUMEN
LEARNING, 2024), onde foi destacada a importância da socialização na vida de
qualquer ser vivo. Visto que uma das maiores dificuldades está na percepção de
pistas sociais não verbais, este estudo focou em explorar a área das expressões
faciais.
        Para responder à questão norteadora, realizamos uma extensa revisão da
literatura acadêmica, na qual constatamos que a utilização de ferramentas tecno-
lógicas pode colaborar significativamente com o tratamento precoce do Transtorno
do Espectro Autista, cuja eficácia já foi comprovada por diversos autores (ADAMS
et al., 2008). Considerando que a maioria das pessoas atualmente tem acesso a
um smartphone, conforme mostrado nos dados estatísticos do Oberlo10, a criação
de fer- ramentas móveis para o tratamento incentivaria e facilitaria a intervenção
precoce.
        Além do desenvolvimento prático, foram realizados testes de funcionalidade
da aplicação com pessoas neurotípicas, constatando-se uma taxa de acerto
acima de 50%. Por fim, as poderosas tecnologias de visão computacional e
inteligência artificial podem ser usadas no tratamento do TEA e no treino de
habilidades sociais. No entanto, destacamos que a aplicação desenvolvida não
está em sua versão final, sendo necessários testes, melhorias e adaptações para
uso em situações reais.
        A principal contribuição social desta pesquisa reside na proposta de uma
ferramenta acessível para familiares e profissionais, promovendo inclusão e desenvol-
vimento de habilidades sociais. Academicamente, a pesquisa reforça a relevância
da tecnologia aplicada à saúde e educação.
        Entre as limitações do estudo, destacam-se a ausência de testes com
indiví- duos diagnosticados com TEA e a falta de uma análise aprofundada da
usabilidade da ferramenta. Para pesquisas futuras, recomenda-se a aplicação em
dispositivos móveis, testes com o público-alvo real e avaliação formal de
acessibilidade e usabilidade.


10 Disponível em:   https://www.oberlo.com/statistics/how-many-people-have-smartphones


                                                                                                                  Page 14
                      REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 15 -->

                                                      REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                            ISSN: 1983-0882


                                    REFERÊNCIAS

ADAMS, J. B. et al. Advice for parents of young autistic children (2008,
Revised). San Diego, CA: Autism Research Institute, 2008.
AMERICAN PSYCHOLOGICAL ASSOCIATION. Nonverbal Communication.
2021. Disponível em: <https://www.apa.org/news/podcasts/ speaking-of-
psychology/nonverbal-communication>.
BANDURA, A. et al. Social foundations of thought and action. Englewood
Cliffs, NJ, v. 1986, n. 23-28, p. 2, 1986.
BERNARD-OPITZ, V.; SRIRAM, N.; NAKHODA-SAPUAN, S. Enhancing
CONTRERAS-ORTIZ, M. S.; MARRUGO, P. P.; RIBON, J. C. R. E-Learning
Ecosystems for People With Autism Spectrum Disorder: A Systematic
Review. IEEE Access, IEEE, 2023.
DURKIN, K.; CONTI-RAMSDEN, G. Turn off or turn on? Technology,
television, and language in the home. Journal of Child Psychology and
Psychiatry, Wiley Online Library, v. 48, n. 10, p. 1058–1065, 2007.
EKMAN, P. Emotions Revealed: Recognizing Faces and Feelings to
Improve Communication and Emotional Life. [S.l.]: Henry Holt and Company,
2003.
GOODWIN, M. S. et al. Enhancing social communication through AAC
systems for children with autism spectrum disorders. Autism, SAGE
Publications, v. 12, n. 6, p. 583–600, 2008.
HAPPY, S. L.; DANTCHEVA, A.; DUGELAY, J. L. Recognizing facial
expressions in the wild using deep learning techniques. Journal of
Computer Vision, v. 127, n. 2, p. 314–327, 2019.
KALIOUBY, R. E.; FERNANDEZ, C. C. Girl Decoded: A Scientist’s Quest to
Reclaim Our Humanity by Bringing Emotional Intelligence to Technology.
[S.l.]: Currency, 2020.
LUMEN LEARNING. Introduction to Sociology: Socialization. 2024. Accessed:
2024-06-04. Disponível em: <https://courses.lumenlearning.com/ wm-
introductiontosociology/chapter/why-it-matters-socialization/>.
MAENNER, M. J. Prevalence and characteristics of autism spectrum disorder
among children aged 8 years—autism and developmental disabilities monitoring
network, 11 sites, United States, 2018. MMWR, v. 70, 2021.
MALONE, T.; RUS, D.; LAUBACHER, R. Machine learning, explained. 2023.
<https://mitsloan.mit.edu/ideas-made-to-matter/machine-learning-explained>.
Acessado em: 2024-06-04.
MCQUAIL, D. Introdução à Teoria da Comunicação. [S.l.]: Loyola, 2001.


                                                                                                            Page 15
                REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.

<!-- page: 16 -->

                                                       REVISTA CADERNO PEDAGÓGICO – Studies Publicações Ltda.
                                                                                             ISSN: 1983-0882


OLIVEIRA, L. A. d. Aproximações entre habilidades sociais e gamificação em
crianças com espectro autista: um estudo de levantamento bibliográfico.
Universidade Federal do Maranhão, 2019.
PICARD, R. W. Affective Computing. [S.l.]: MIT Press, 1997.
PRESSBOOKS. Introduction to Sociology: Socialization. 2024. Accessed:
2024-06-04. Disponível em: <https://louis.pressbooks.pub/introdsociology/
chapter/socialization/>.
SCASSELLATI, B.; ADMONI, H.; MATARIC, M. J. Robots for use in autism
research. Annual Review of Biomedical Engineering, Annual Reviews, v. 14,
p. 275–294, 2012.
SCHNEIDER, B. H. Children’s social competence in context: The
contributions of family, school and culture. [S.l.]: Psychology Press, 1993. v.
10.
SILVA, A. B. B. Mundo Singular: Entenda o autismo. [S.l.]: Editora
Fontanar, 2012.
social problem solving in children with autism and normal children through
computer-assisted instruction. Journal of Autism and Developmental
Disorders, Springer, v. 31, n. 4, p. 377–384, 2001.
STRAVOGIANNIS, A. L. Autismo: Um olhar por inteiro. São Paulo: Literare
Books International, 2020.
UMBERSON, D. et al. The effect of social relationships on psychological
well-being: Are men and women really so different? American sociological
review, JSTOR, p. 837–857, 1996.
VOLKMAR, F. R. Autism Spectrum Disorders. In: VOLKMAR, F. R. (Ed.).
Encyclopedia of Autism Spectrum Disorders. Springer, 2013. p. 345–349.
Disponível em: <https://link.springer.com/referenceworkentry/10.1007/978-1-4614-
4788-7\_60>.
WAINER, A. L. et al. The effectiveness of using a humanoid robot to teach
social skills to children with autism spectrum disorder. International
Journal of Social Robotics, Springer, v. 6, n. 4, p. 423–435, 2014.
ZENG, Z. et al. A survey of affect recognition methods: Audio, visual, and
spontaneous expressions. IEEE Transactions on Pattern Analysis and
Machine Intelligence, v. 33, n. 1, p. 39–58, 2021.
ZILBOVICIUS, M.; MERESSE, I.; BODDAERT, N. Autismo: neuroimagem.
Rev. Bras. Psiquiatr., v. 28, p. s21–s28, May 2006.


                                                                                                             Page 16
                 REVISTA CADERNO PEDAGÓGICO – Studies Publicações e Editora Ltda., Curitiba, v.22, n.9, p. 01-16. 2025.
