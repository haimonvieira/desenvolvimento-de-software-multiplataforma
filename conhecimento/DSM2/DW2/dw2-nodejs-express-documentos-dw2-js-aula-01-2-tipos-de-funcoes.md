---
disciplina: DSM2/DW2
titulo: DW2 JS Aula 01.2 Tipos de Funções
fonte: DSM2/DW2/dw2-nodejs-express/Documentos/DW2-JS-Aula_01.2-Tipos de Funções.pdf
tipo: pdf
paginas: 18
extraido_em: 2026-10-24
---

<!-- page: 1 -->

Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


                                                                                     JS Aula 01.2:
                                                                                           Funções

<!-- page: 2 -->

Identificando variáveis no Javascript
- Identificadores podem começar com letras, $ ou _
                                                                                                              {}
- Não podem começar com números;
- É possível usar letras ou número;
- É possível usar acentos;
- Não podem conter espaços;
- Maiúsculas e minúsculas fazem diferença;
- Para variáveis com mais de uma palavra, use o padrão camelCase;
- Não podem ser palavras reservadas (ex: var, function, alert, etc...)


Lista de palavras reservadas:
https://www.w3schools.com/js/js_reserved.asp

                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 3 -->

Variáveis                                                                                                      {}
De forma simplificada variáveis podem receber números ou

caracteres (strings).

- Variáveis do tipo string podem ser declaradas tanto com "...", '...' ou `...`
- Para definir variáveis podemos usar var, let ou const


var salario = 1500
let nome = “José”
const carro = { marca: “ford”, cor: “prata”, modelo: 2012 }


                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 4 -->

var x let x const                                                                                              {}
var: Pode ter o seu valor reatribuído. Pode ser redeclarado.
Escopo: Global e local.


let: Pode ter o seu valor reatribuído. Não pode ser redeclarado.
Escopo: De bloco.


const:. Não pode ter o seu valor reatribuído. Não pode ser
redeclarado.
Escopo: De bloco.


                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 5 -->

Tipos de variáveis                                                                                          {}
   number
            Infinity
             NaN
    string
   boolean
     null
  undefined
    object
             Array
   function

                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 6 -->

Funções                                                                                                     {}
Uma função em JavaScript é um                                              function {
conjunto de códigos (que podemos
chamar de “linhas” ou “bloco”) que
só serão executados quando a                                                   bloco
função em questão for solicitada.


Essa solicitação pode ser feita, por                                       }
exemplo, através de um evento.


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 7 -->

Nome da função                                                                                                 {}
Apesar do fato de no JavaScript existir as funções anônimas (que não possuem
nome), para a função funcionar corretamente é necessário atribuir um nome para
ela. Geralmente o nome da função está ligada a ação que ela irá executar.


 function ação ( ) {

     bloco


 }
                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 8 -->

Parâmetros da função                                                                                           {}
Além do nome da função, opcionalmente é possível atribuir parâmetros a essa
função. Um parâmetro pode ser, por exemplo, um valor passado para a função
que será usado por ela.


 function ação (param) {

     bloco


 }
                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 9 -->

Funções anônimas                                                                                              {}
Em JavaScript, quando você atribui uma função a uma variável, você está criando
uma variável que armazena uma referência para essa função. Isso é conhecido
como uma "função anônima" ou "função sem nome". Aqui está um exemplo:

// Atribuindo uma função a uma variável

var minhaFuncao = function() {

      console.log("Esta é uma função!")

  }

// Chamando a função através da variável

minhaFuncao()

                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 10 -->

Arrow functions                                                                                               {}
A partir do ECMAScript 6 (ES6) e versões mais recentes do JavaScript, você pode
usar a sintaxe de Arrow Function para criar funções anônimas de forma mais
concisa. Aqui está um exemplo:


// Atribuindo uma função de seta a uma variável

var minhaFuncao = () => {

  console.log("Esta é uma função de seta!")

}
// Chamando a função através da variável

minhaFuncao()

                         Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 11 -->

Comando typeof                                                                                       {}
O typeof é uma palavra-chave em JavaScript que
retornará o tipo da variável quando você a chama.


O operador typeof é útil porque é uma maneira
fácil de verificar o tipo de uma variável em seu
código.


                Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 12 -->

Comando typeof                                                                               {}


        Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 13 -->

Concatenação                                                                                                {}
Para juntarmos (concatenar) o conteúdo de um texto ao valor de uma
variável devemos usar o sinal de concatenação, que no caso do JavaScript

éo+

Exemplo:


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 14 -->

Template Strings                                                                                               {}
A versão mais atual do JavaScript permite também concatenar strings através do
Template String. Nesse caso fazemos uso de um placeholder, que é representado
pelos símbolos $ { }. Importante notar que agora não usamos aspas simples (‘) na
mensagem e sim crase (`) o que delimita o nosso Template String.


Exemplo:


                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 15 -->

Comentários em JavaScript                                                                    {}


        Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 16 -->

Operadores aritiméticos em JavaScript                                                                        {}
Operador   Descrição                               Exemplo                                       Resultado

+          Adição                                  5+2                                           7

-          Subtração                               5-2                                           3

*          Multiplicação                           5*2                                           10

/          Divisão                                 5/2                                           2.5

%          Módulo (Resto)                          5%2                                           1

**         Exponenciação                           5 ** 2                                        25


                     Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 17 -->

                                                                                                 {}
       Lista de Exercícios
     Exercício 02 – Tipo de funções


https://forms.gle/ddcMZwjgWDAuxi3i6


            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 18 -->

Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


                                                                                     JS Aula 01.2:
                                                                                           Funções
