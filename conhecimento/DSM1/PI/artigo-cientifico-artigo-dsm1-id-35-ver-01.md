---
disciplina: DSM1/PI
titulo: artigo dsm1 id 35 ver 01
fonte: DSM1/PI/Artigo Cientifico/artigo_dsm1_id_35_ver_01.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

VISÃO COMPUTACIONAL PARA RECONHECIMENTO DE EXPRESSÕES FACIAIS NA TERAPIA DE CRIANÇAS COM TRANSTORNO DO ESPECTRO AUTISTA

COMPUTATIONAL VISION FOR FACIAL EXPRESSION RECOGNITION IN THE THERAPY OF CHILDREN WITH AUTISM SPECTRUM DISORDER

Haimon Cugler Vieira      { haimon.vieira@fatec.sp.gov.br }

Hudson Lucas Gregorio { hudson.gregorio@fatec.sp.gov.br }

Kevin da Silva Oliveira { kevin.oliveira12@fatec.sp.gov.br }

Luca Tony da Silva Carravieri Fudalli { luca.fudalli@fatec.sp.gov.br }

Marcelo Jose Moreira Junior {marcelo.moreira16@fatec.sp.gov.br}

INTRODUÇÃO

O Transtorno do Espectro Autista (TEA) apresenta desafios significativos no desenvolvimento de habilidades socioemocionais, especialmente no reconhecimento e interpretação de expressões faciais. Tradicionalmente, a avaliação do progresso terapêutico nessas áreas depende da observação subjetiva de profissionais, o que pode limitar a precisão e a personalização das intervenções. Diante desse cenário, a visão computacional surge como uma ferramenta promissora para oferecer suporte tecnológico objetivo e baseado em dados.

Por meio de técnicas avançadas de processamento de imagem e análise de padrões, a visão computacional permite capturar, mapear e quantificar respostas faciais em tempo real durante sessões terapêuticas. Essa abordagem não apenas complementa o trabalho do terapeuta, mas também fornece métricas claras e mensuráveis sobre o engajamento e o progresso da criança.

Este artigo explorará como a aplicação dessa tecnologia pode transformar práticas terapêuticas, oferecer insights personalizados e, contribuir para um desenvolvimento mais eficaz das capacidades de interação social em crianças com TEA.

OBJETIVO

### 1. Objetivo Geral

Desenvolver um sistema baseado em visão computacional utilizando a biblioteca dlib para o reconhecimento de expressões faciais em crianças com Transtorno do Espectro Autista (TEA). O objetivo é auxiliar terapeutas na identificação e interpretação de emoções durante sessões terapêuticas, visando melhorar a comunicação e a interação social das crianças.

### 2. Objetivos Específicos

#### 2.1 Implementação do Algoritmo de Detecção Facial

Desenvolver um algoritmo eficiente para detecção facial em tempo real utilizando a biblioteca dlib;

Implementar a detecção de landmarks faciais para identificar pontos-chave no rosto (como olhos, sobrancelhas, nariz e boca) com o intuito de melhorar a precisão da detecção de características faciais;

Tentar assegurar que o sistema funcione sob diversas condições de iluminação e ângulos de captura.

#### 2.2 Classificação de Expressões Faciais

Classificar expressões faciais básicas (felicidade, tristeza, raiva, surpresa, medo e neutralidade) com uma certa precisão;

Utilizar técnicas de processamento de imagens para extração de características faciais relevantes;

Obter maior precisão sobre expressões (landmarks) a partir de um banco de imagens.

#### 2.3 Desenvolvimento de Interface de Usuário

Criar uma interface gráfica amigável para uso em ambientes terapêuticos, facilitando a interação do usuário com o sistema;

Oferecer visualizações em tempo real das emoções detectadas para auxiliar terapeutas durante as sessões;

Implementar recursos adicionais como registro de sessões e geração de relatórios de progresso das crianças.

#### 2.4 Validação e Testes do Sistema

Realizar testes do sistema em ambientes terapêuticos reais, com a participação de crianças autistas e profissionais da área;

Coletar feedback dos usuários para identificar oportunidades de melhoria e ajustar o sistema conforme necessário;

Avaliar a eficácia do sistema na melhoria da comunicação e da interação social das crianças autistas.

#### 2.5 Integração e Expansão do Sistema

Explorar possibilidades de integração do sistema com outras ferramentas terapêuticas e educacionais;

Desenvolver módulos adicionais para personalização do sistema conforme as necessidades específicas de cada criança e terapeuta;

Investigar a viabilidade de expansão do sistema para outras aplicações, incluindo jogos interativos e ferramentas de aprendizado.

ESTADO DA ARTE

Esta seção apresenta uma revisão dos principais estudos e ferramentas computacionais desenvolvidas para auxiliar crianças com TEA no reconhecimento de expressões faciais. O objetivo é analisar metodologias, resultados e lacunas, visando identificar oportunidades para pesquisas futuras.

Fernandes e Pinto (2024) exploram a importância da identificação das emoções para o desenvolvimento de habilidades sociais em crianças com TEA e estratégias que a terapia apresenta. A pesquisa investiga as dificuldades da criança com o espectro de se expressar e interagir socialmente com os neurotípicos e como a Análise do Comportamento contribui para o ensino dessa habilidade. As autoras concluem que a essa dificuldade afeta nas interações sociais e há intervenções como ABA (Applied Behavior Analysis), ou Análise do Comportamento Aplicada, sendo voltadas para esse treinamento, explorando o uso de figuras de expressões faciais, fotos, histórias, jogos e aplicativos. O estudo das autoras é de caráter qualitativo baseado em pesquisas bibliográficas, mas não especifica outros métodos que podem ajudar indivíduos neurodivergentes com alguma tecnologia para auxiliar os métodos clássicos.

Na pesquisa de Barbosa et al. (2025), eles investigam como a Inteligência Artificial (IA), aprendizado de máquina e visão computacional auxilia pessoas com o espectro autista no reconhecimento de expressões faciais e emoções para criar uma ferramenta para auxiliar profissionais da saúde, famílias e pessoas dentro do espectro. Foram utilizadas bibliotecas da linguagem de programação Python sendo elas a DeepFace e OpenCV para obter imagens em tempo real para fazer o reconhecimento de expressões e emoções, fazendo com que terapeutas ou familiares consigam melhorar a interpretação emocional e não verbal do indivíduo com espectro. Os resultados deles foram promissores utilizando as tecnologias, mas complementam dizendo que o uso de IA ainda precisa ser aprofundado neste campo. Destacam a ausência de pessoas dentro do espectro no estudo feito, para testar a ferramenta, mas afirmam que para pessoas neurotípicas a taxa de acerto da ferramenta desenvolvida foi de 50%.

Na pesquisa de Dantas (2021), desenvolvida em sua tese de doutorado, foi abordado o uso de redes neurais convolucionais e bases de dados públicas (ex.: CK+, FER2013) para criar um jogo voltado ao reconhecimento de emoções em crianças com TEA. O estudo incluiu uma revisão detalhada de trabalhos como os de Barbosa et al. (2025) e Fernandes e Pinto (2024), além de propor uma ferramenta inovadora.

A avaliação do jogo foi realizada em dois cenários: Associação dos Deficientes da Liberdade e uma Clínica de Terapia Ocupacional, com foco nos resultados obtidos no segundo cenário, onde 8 crianças com TEA participaram do estudo. A metodologia foi dividida em três etapas:

Referência: Coleta de dados sobre o conhecimento inicial dos participantes;

Intervenção: Uso do jogo para treinamento das habilidades emocionais; e

Manutenção: Reavaliação após a intervenção.

Os resultados demonstraram uma melhora significativa no reconhecimento de emoções, especialmente na etapa de manutenção, onde a taxa de acerto alcançou 96,6% na média.

O autor cita algumas lacunas que ficaram no seu trabalho como no problema de identificar micro-expressões e desbalanceamento da base de dados, propondo trabalhos futuros para melhorar a ferramenta.

Por fim, o autor conclui que a ferramenta contribui para o aprimoramento das habilidades de detecção e expressão de emoções em indivíduos com TEA.

Este estudo propõe um sistema híbrido que integra visão computacional com estratégias terapêuticas, como a Análise do Comportamento Aplicada (ABA), visando o reconhecimento de emoções complexas (ex.: micro-expressões). O sistema será validado com crianças com Transtorno do Espectro Autista (TEA) e implementado em um jogo educacional sério — uma ferramenta projetada para fins terapêuticos e pedagógicos, que combina diversão e aprendizagem para engajar as crianças.

Além de auxiliar no desenvolvimento das habilidades sociais das crianças, o sistema fornecerá dados quantitativos para profissionais da saúde, permitindo o monitoramento do progresso e a personalização das intervenções. Dessa forma, busca-se preencher as lacunas identificadas em estudos anteriores, que não integram tecnologias digitais com abordagens terapêuticas tradicionais ou validam ferramentas com o público-alvo.

REFERÊNCIAS

FERNANDES, M.E; PINTO, D.S.M. O RECONHECIMENTO DE EMOÇÕES EM CRIANÇAS COM TRANSTORNO DO ESPECTRO AUTISTA: CONTRIBUIÇÕES DA ANÁLISE DO COMPORTAMENTO APLICADA. FAP. Apucarana. 2024. Disponível em: https://www.fap.com.br/banco-tc/psicologia/2024/PSI2024005.pdf. Acesso em: 7 de set. de 2025.

BARBOSA, B. B. M.; ROCHA, C. P. De Brito; BARRETO, Carlos Futino ; SOUSA, L. G. C. B. A.; VIEIRA, F. L. De Miranda. Explorando visão computacional e IA para auxiliar indivíduos no Espectro Autista com o reconhecimento de expressões faciais e sentimentos. REVISTA CADERNO PEDAGÓGICO, Teresina. 2025. Disponível em: https://ojs.studiespublicacoes.com.br/ojs/index.php/cadped/article/view/18082/9971. Acesso em: 10 de set. de 2025.

DANTAS, Adilmar Coelho. Abordagem Computacional para aprimoramento das habilidades com as emoções em indivíduos com autismo. Universidade Federal de Uberlândia, Uberlândia. 2021. Disponível em: https://repositorio.ufu.br/bitstream/123456789/35070/10/AbordagemComputacionalAprimoramento.pdf. Acesso em: 12 de set. de 2025.
