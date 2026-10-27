---
disciplina: DSM2/DW2
titulo: DW2 JS Aula 02 Arrays, Objetos e Classes
fonte: DSM2/DW2/dw2-nodejs-express/Documentos/DW2-JS-Aula_02-Arrays, Objetos e Classes.pdf
tipo: pdf
paginas: 14
extraido_em: 2026-10-24
---

<!-- page: 1 -->

Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


                                                                                           JS Aula 02:
                                                                                     Arrays, Objetos e Classes

<!-- page: 2 -->

O que são arrays em JavaScript?                                                                                 {}
O array é um objeto no JavaScript, ele
nos auxilia pois podemos utilizar uma
única variável para armazenar uma
lista de diferentes elementos.

Por exemplo, imagine que seja
necessário armazenar os nomes de
todos os alunos de uma sala de aula.

Criar uma variável para cada aluno
seria, no mínimo, trabalhoso,
dependendo do tamanho dos dados
eu diria inviável.

Nesta ideia podemos então criar a
variável alunos e com isso armazenar o
nome de todos os alunos.

                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 3 -->

Como declarar um array no JavaScript?                                                                            {}
Para utilizar os Arrays precisamos declarar uma variável. E ao atribuir um valor,
vamos colocar entre [ ] e separar cada um por , . Por exemplo:


let Produtos = ['Computador', 'Notebook', 'Celular', 'Tablet']


Nós podemos declarar arrays também sem nenhum item e tamanho.


let Produtos = []


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 4 -->

Exibindo os dados de um Array                                                                                  {}
let Produtos = ['Computador', 'Notebook', 'Celular', 'Tablet']


Para acessar um item de um array é muito simples, basta utilizarmos o índice da
posição do item.


console.log(Produtos[0])


Nesse caso será exibido o valor “Computador” que é o primeiro item do nosso
array.


                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 5 -->

Percorrendo um Array com forEach                                                                                {}
let Produtos = ['Computador', 'Notebook', 'Celular', 'Tablet']

Em alguns casos pode ser necessário percorrer uma determinada lista e exibir
seus valores de forma automática em um loop de repetição. Nesse caso podemos
utilizar a estrutura forEach, como no exemplo a seguir:

Produtos.forEach(produto => {
    console.log(produto)
})

Nesse caso será exibido todos os items da lista:

Computador
Notebook
Celular
Tablet
                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 6 -->

Objetos no JavaScript
Nós utilizamos objetos para agrupar valores que possuem propriedades e
                                                                                                               {}
funções, podemos por exemplo fazer uma analogia aos objetos do mundo real.
Um carro que possui cor e marca, ele também realiza ações como acelerar e frear.

Para declarar um objeto a sintaxe é bem parecida a que utilizamos para declarar
arrays, porém trocamos os [ ] por { }. Onda as chaves, valores e funções são
declaradas entre { }, conforme abaixo:

let carro = {
    modelo: 'gol',
    cor: 'vermelho',
    acelerar(){
        console.log('Acelerando...')
    },
    frear(){
        console.log('Freando')
    },
}
                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 7 -->

Como acessar as propriedades ou funções
de um Objeto?
                                                                                                               {}
Para acessar uma propriedade ou uma função basta utilizarmos o nome do
objeto seguido da propriedade/função separada por ponto. Por exemplo:

console.log(carro.modelo)
carro.acelerar()


Nesse caso teremos as saídas:

gol
Acelerando...


                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 8 -->

Array de objetos
                                                                                       const productList = [{
                                                                                                                  {}
Visto como utilizar arrays e objetos, podemos
                                                                                           nome: "Computador",
juntar as duas coisas e criarmos Arrays de objetos.                                        marca: "Lenovo",
                                                                                           preco: 3000
                                                                                       },
Um array de objetos nada mais é do que uma lista
                                                                                       {
de objetos, ou seja, uma lista que possui itens que                                        nome: "Tablet",
possuem propriedades e funções.                                                            marca: "Samsung",
                                                                                           preco: 2000
                                                                                       },
Para declararmos um array de objetos, juntamos                                         {
                                                                                           nome: "Celular",
as duas sintaxes:                                                                          marca: "Apple",
                                                                                           preco: 6000,
const productList = [{}]
                                                                                       }
                                                                                       ]
Ao lado temos essa lista populada:


                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 9 -->

Percorrendo um array de objetos                                                                                   {}
Assim como fizemos com o array, podemos percorrer também um array de objetos
com a estrutura forEach, conforme a seguir:

// EXIBINDO ARRAY DE OBJETOS COM FOREACH                                                   Produto: Computador
                                                                                           Marca: Lenovo
productList.forEach(product => {                                                           Preço: 3000
     console.log(`Produto: ${product.nome}`)
                                                                                           Produto: Tablet
     console.log(`Marca: ${product.marca}`)                                                Marca: Samsung
     console.log(`Preço: ${product.preco}`)                                                Preço: 2000

     console.log()                                                                         Produto: Celular
})                                                                                         Marca: Apple
                                                                                           Preço: 6000

Assim teremos a saída ao lado:


                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 10 -->

O que são classes em JavaScript?                                                                               {}
Em JavaScript, classes são uma forma
de criar objetos e organizar o código
de forma mais clara e reutilizável. Elas
funcionam como "modelos" para criar
múltiplos objetos com as mesmas
propriedades e métodos.

As classes foram introduzidas no
ECMAScript 2015 (ES6) e são
basicamente uma sintaxe especial
para funções construtoras, tornando o
código mais limpo e fácil de entender.

                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 11 -->

Criando uma classe no Javascript                                                                            {}
// CLASSES NO JAVASCRIPT
class Carro {
  // Nome de classes devem iniciar com a primeira letra maiúscula.
  // ATRIBUTOS
  constructor(marca, modelo, ano) {
    this.marca = marca;
    this.modelo = modelo;
    this.ano = ano;
  }
  // MÉTODOS
  buzinar() {
    return "Beep! Beep!";
  }
}


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 12 -->

Criando instâncias (objetos)                                                                                   {}
// Criando uma instância (objeto) da classe Carro
const carroPopular = new Carro("Fiat", "Uno", "2012");
document.write(
  `<p>O carro ${carroPopular.marca} modelo ${carroPopular.modelo} é do ano
${carroPopular.ano} e faz ${carroPopular.buzinar()}</p>`
);

// Instância carroEsportivo
const carroEsportivo = new Carro();
carroEsportivo.marca = "Chevrolet";
carroEsportivo.modelo = "Camaro";
carroEsportivo.ano = "2024";
document.write(
  `<p>O carro ${carroEsportivo.marca} modelo ${carroEsportivo.modelo} é do
ano ${carroEsportivo.ano} e também faz ${carroEsportivo.buzinar()}</p>`
);


                          Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 13 -->

Adicionando novos métodos e atributos                                                                       {}
// Adicionando um novo atributo
carroEsportivo.corNeon = "Azul";

// Adicionando um novo método
carroEsportivo.turbo = function () {
   return "Vrummmm! O carro está acelerando!!!";
};

document.write(
   `<p>O carro ${carroEsportivo.marca} ${carroEsportivo.modelo}
também tem neon da cor ${carroEsportivo.corNeon}.
${carroEsportivo.turbo()}</p>`
);


                       Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 14 -->

Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


                                                                                           JS Aula 02:
                                                                                     Arrays, Objetos e Classes
