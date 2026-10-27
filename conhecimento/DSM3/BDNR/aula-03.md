---
disciplina: DSM3/BDNR
titulo: Aula 03
fonte: DSM3/BDNR/Aula_03.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

APOSTILA DO ALUNO

Banco de Dados Não Relacional

Primeiros Passos com MongoDB

Curso Superior de Tecnologia em Desenvolvimento de Software Multiplataforma

O que é o MongoDB

O MongoDB é um banco de dados da categoria de documentos, criada em 2009. Seu nome vem da palavra inglesa humongous, que significa enorme, refletindo sua proposta de lidar com grandes volumes de dados. Em vez de organizar a informação em tabelas com linhas e colunas, como os bancos relacionais, o MongoDB guarda cada registro como um documento.

Documentos, coleções e bancos

No MongoDB, três conceitos substituem a estrutura tabular tradicional: coleção, documento e campo. A comparação com o modelo relacional evidencia a correspondência entre essas estruturas.

| No mundo relacional | No MongoDB | O que é |

| Tabela | Coleção | Agrupa registros do mesmo tipo |

| Linha | Documento | Um registro individual |

| Coluna | Campo | Uma informação dentro do registro |

Um documento é parecido com um objeto JSON, formado por pares de campo e valor. Vários documentos ficam guardados dentro de uma coleção, e várias coleções ficam dentro de um banco de dados. Essa hierarquia é simples e flexível.

Como é um documento

O documento a seguir representa um livro. Observe como ele é legível e como consegue guardar até uma lista de assuntos dentro de si, algo que exigiria várias tabelas no modelo relacional.

{

"titulo": "NoSQL Essencial",

"autor": "Sadalage e Fowler",

"ano": 2013,

"assuntos": ["banco de dados", "nosql", "escalabilidade"]

}

| Definição: DocumentoDocumento é a unidade básica de informação no MongoDB. Ele se parece com um objeto JSON e pode conter texto, números, listas e até outros documentos aninhados dentro de si. |

A grande vantagem: flexibilidade

Documentos de uma mesma coleção não precisam ter os mesmos campos. Um livro pode ter o campo editora e outro não, sem que isso cause problema. Essa flexibilidade reduz a rigidez de um esquema fixo.

| Aplicação em situação realEm um catálogo de uma loja, um celular tem campos como memória e tela, enquanto uma camiseta tem tamanho e cor. No MongoDB, ambos podem viver na mesma coleção de produtos, cada um com seus próprios campos, sem desperdício de espaço. |

Exercícios

Quais são os três conceitos do MongoDB que correspondem a tabela, linha e coluna do modelo relacional?

Escreva, em formato de documento, a representação de um aluno com os campos nome, curso e uma lista de disciplinas.

Por que se diz que o MongoDB resolve o problema da rigidez do esquema? Dê um exemplo.

Qual a origem do nome MongoDB e o que ela revela sobre a proposta do banco?

Criando a Conta no Atlas

O que é o MongoDB Atlas

O MongoDB Atlas é o serviço que permite criar e usar um banco MongoDB diretamente na nuvem, sem instalar o servidor de banco de dados no computador local. Ele oferece uma camada gratuita permanente, chamada M0, adequada às práticas apresentadas neste material.

| Definição: ClusterNo Atlas, o banco de dados fica hospedado em um cluster, que é o conjunto de servidores que armazenam os dados na nuvem. O cluster gratuito M0 é suficiente para práticas introdutórias. |

Passo a passo da criação

As etapas a seguir apresentam, em ordem, o processo de criação e configuração do ambiente no MongoDB Atlas.

Passo 1: Acessar o site e cadastrar-se

No navegador, acesse o endereço oficial do MongoDB Atlas, mostrado abaixo. Clique no botão de cadastro e crie a conta usando um e-mail ou uma conta Google. Nenhum cartão de crédito é solicitado.

https://www.mongodb.com/cloud/atlas/register

Passo 2: Criar a organização e o projeto

Após o cadastro, o Atlas solicita a criação de uma organização e de um projeto. A organização pode receber um nome de identificação e o projeto pode ser nomeado de acordo com a finalidade do banco.

Passo 3: Escolher o cluster gratuito

Na tela de criação do cluster, selecione a opção gratuita, identificada pela letra M0 e pela palavra Free. Em seguida, escolha o provedor de nuvem e uma região próxima ao Brasil, como São Paulo, para reduzir o tempo de resposta. A preparação do cluster pode levar alguns minutos.

| AtençãoÉ fundamental escolher a opção gratuita M0. As outras opções têm custo. Caso o site sugira automaticamente uma opção paga, procure o botão que seleciona a versão gratuita antes de prosseguir. |

Passo 4: Criar o usuário do banco

Durante a preparação do cluster, o Atlas solicita a criação de um usuário e de uma senha para acesso ao banco. Esse usuário é diferente da conta usada para entrar no site. O nome de usuário e a senha devem ser armazenados em local seguro para uso nas conexões.

Passo 5: Liberar o acesso de rede

Na seção Network Access, é necessário definir de quais origens as conexões serão permitidas. O endereço indicado no procedimento autoriza acesso de qualquer origem. Em sistemas reais, essa permissão deve ser restringida aos endereços realmente necessários.

0.0.0.0/0

Passo 6: Obter a string de conexão

O Atlas fornece uma string de conexão, que funciona como o endereço completo do banco e contém os dados necessários para conectar as ferramentas. Essa string deve ser armazenada com segurança.

| Definição: String de conexãoA string de conexão é um endereço completo que diz às ferramentas onde o banco está e como entrar nele. Ela tem um formato parecido com o exemplo a seguir, em que usuario e senha devem ser substituídos pelos dados criados. |

mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/

Exercícios

O que é o MongoDB Atlas e qual a vantagem de usá-lo em vez de instalar o banco no próprio computador?

Qual opção de cluster deve ser escolhida para não gerar custos, e como ela é identificada na tela?

Qual a diferença entre a conta de login do site e o usuário do banco criado no passo 4?

Para que serve a string de conexão e por que ela deve ser guardada com cuidado?

Usando o mongosh

O que é o mongosh

O mongosh, abreviação de MongoDB Shell, é a ferramenta oficial de linha de comando do MongoDB. Por meio dela, os comandos são digitados e as respostas do banco aparecem diretamente no terminal, permitindo interação direta com o MongoDB.

Baixando e instalando

Passo 1: Baixar o instalador

Acesse o endereço oficial de download do mongosh, mostrado abaixo, e escolha a versão correspondente ao sistema operacional do computador, seja Windows, macOS ou Linux.

https://www.mongodb.com/try/download/shell

Passo 2: Instalar

No Windows, execute o instalador baixado e avance pelas telas aceitando as opções padrão. No macOS e no Linux, descompacte o arquivo e siga as instruções da página oficial. Ao final, o comando mongosh ficará disponível no terminal do sistema.

| DicaPara verificar se a instalação funcionou, abra o terminal do sistema e digite mongosh seguido de --version. Se aparecer um número de versão, a instalação foi bem-sucedida. |

Conectando ao banco

Para conectar, abra o terminal e digite o comando mongosh seguido da string de conexão entre aspas, substituindo usuario e senha pelos dados configurados no Atlas.

mongosh "mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/"

Se tudo estiver correto, o terminal exibirá uma mensagem de boas-vindas e mudará para um sinal de pronto, indicando que o banco está aguardando comandos.

| Erro comumSe aparecer um erro de autenticação, geralmente a senha foi digitada errada na string de conexão, ou faltaram as aspas em torno do endereço. Confira esses dois pontos antes de tentar de novo. |

Primeiros comandos de navegação

Uma vez conectado, alguns comandos simples permitem explorar o banco. O comando a seguir lista todos os bancos de dados existentes.

show dbs

O comando use seleciona um banco para trabalhar. Caso o banco não exista, ele será criado assim que o primeiro dado for inserido. No exemplo, seleciona-se um banco chamado escola.

use escola

O comando a seguir lista as coleções do banco atualmente selecionado.

show collections

Exemplo prático rápido

Os comandos abaixo inserem um aluno na coleção alunos e, em seguida, consultam os documentos cadastrados, verificando a conexão, a gravação e a leitura dos dados.

use escola

db.alunos.insertOne({ nome: 'Maria', curso: 'DSM' })

db.alunos.find()

Após executar esses comandos, o terminal mostrará uma confirmação da inserção e, em seguida, o documento da Maria. Isso confirma que o banco na nuvem está recebendo e devolvendo dados corretamente.

| Resultado dos comandosO primeiro comando escolheu o banco escola. O segundo inseriu um documento na coleção alunos, que foi criada automaticamente. O terceiro buscou e exibiu todos os documentos dessa coleção. |

Exercícios

O que é o mongosh e para que ele serve?

Descreva os dois passos principais para instalar o mongosh no seu sistema operacional.

Conecte-se ao seu cluster e execute o comando show dbs. Anote quais bancos aparecem.

Insira um documento representando um aluno com seu próprio nome e curso, e depois use find para confirmar que ele foi gravado.

Usando o Compass

O que é o MongoDB Compass

O MongoDB Compass é uma interface gráfica gratuita que permite visualizar e manipular dados por meio de telas, botões e menus. Ele complementa o mongosh e pode ser utilizado conforme o tipo de tarefa.

| Quando usar cada umO Compass é ótimo para explorar dados visualmente e montar consultas complexas com auxílio da tela. O mongosh é mais rápido para tarefas repetitivas e comandos diretos. Saber usar os dois é uma vantagem. |

Baixando e instalando

Passo 1: Baixar o Compass

Acesse o endereço oficial de download do Compass, escolha a versão do seu sistema operacional e baixe o instalador.

https://www.mongodb.com/try/download/compass

Passo 2: Instalar e abrir

Execute o instalador e avance com as opções padrão. Ao abrir o Compass pela primeira vez, ele apresentará uma tela para conectar a um banco.

Conectando ao cluster

A conexão utiliza a string fornecida pelo MongoDB Atlas. Cole a string no campo indicado pelo Compass e clique no botão de conectar. A interface mostrará os bancos de dados disponíveis no cluster.

| DicaA string de conexão é exatamente a mesma usada no mongosh. Se ela funcionou no terminal, funcionará também no Compass. Vale a pena tê-la salva em um arquivo de texto para copiar e colar quando necessário. |

Explorando a interface

A tela principal do Compass mostra, do lado esquerdo, a lista de bancos e coleções. Ao clicar em uma coleção, os documentos aparecem no centro da tela, já formatados e fáceis de ler. As principais áreas são descritas a seguir.

Lista de bancos e coleções: navega pela estrutura do banco com cliques, sem digitar comandos.

Visualização de documentos: mostra cada documento de forma organizada e permite editá-lo diretamente na tela.

Barra de filtro: permite buscar documentos específicos preenchendo critérios, sem escrever o comando completo.

Exemplo prático rápido

As operações a seguir são executadas diretamente pela interface do Compass, sem digitar comandos, e correspondem às mesmas operações disponíveis no mongosh.

Abra o banco escola e clique na coleção alunos.

Observar o documento da Maria, inserido pelo mongosh, aparecendo na tela.

Clicar no botão de adicionar documento e criar um novo aluno preenchendo os campos pela interface.

Usar a barra de filtro para mostrar apenas os alunos do curso DSM, digitando o critério mostrado a seguir.

{ curso: 'DSM' }

Esse pequeno exercício mostra como o Compass realiza, de forma visual, as mesmas operações feitas por comando no mongosh. O documento criado pelo terminal aparece na tela, e o novo documento criado pela tela poderia ser visto pelo terminal, pois ambos acessam o mesmo banco na nuvem.

| Observação importanteO mongosh e o Compass são formas diferentes de acessar o mesmo banco. Tudo o que é feito em uma ferramenta fica disponível na outra, pois os dados permanecem armazenados no cluster na nuvem, e não no computador local. |

Exercícios

Qual a diferença entre o Compass e o mongosh, e quando cada um é mais conveniente?

Conecte o Compass ao seu cluster usando a string de conexão e descreva o que aparece na tela inicial.

Crie um novo documento de aluno usando os botões do Compass, sem digitar comandos.

Use a barra de filtro para mostrar apenas os documentos de um curso específico. Em seguida, abra o mongosh e confirme que os mesmos dados aparecem lá.
