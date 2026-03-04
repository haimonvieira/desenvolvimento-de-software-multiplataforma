//Declarando e exibindo itens de um array
let produtos = [];
document.writeln(typeof produtos);

let products = ["Computador", "Notebook", "Celular", "Tablet"];
document.writeln(`<p>${products}</p>`);

document.writeln(`<p>Exibindo os elementos do vetor através do índice:</p>`);
document.writeln(`<p>${products[0]}</p>`);
document.writeln(`<p>${products[1]}</p>`);
document.writeln(`<p>${products[2]}</p>`);
document.writeln(`<p>${products[3]}</p>`);

document.writeln(`<p>Exibindo elementos do vetor através do forEach:</p>`);
products.forEach(function (product){

    document.writeln(`<p>${product}</p>`);

});

document.writeln(`<p>Exibindo elementos do vetor através do forEach com índices:</p>`);
products.forEach((product, i) => {
    document.writeln(`<p>${i+1}: ${product}</p>`);
});

//Métidos de manipulação de vetores
let frutas = ['Laranja', 'Maçã', 'Banana'];
document.writeln(`<p>Nossa lista de frutas é: ${frutas}</p>`)    ;
frutas[3] = 'Morango';
document.writeln(`<p>Agora nossa lista atualizada de frutas é: ${frutas}</p>`);

document.writeln(`<h4>O método PUSH - Insere um novo elemento no FINAL do vetor.</h4>`);
frutas.push('Abacaxi');
document.writeln(`<p>Agora nossa lista atualizada de frutas é: ${frutas}</p>`);

document.writeln(`<h4>O método UNSHIFT - Insere um novo elemento no INÍCIO do vetor.</h4>`);
frutas.unshift('Pera');
document.writeln(`<p>Agora nossa lista atualizada de frutas é: ${frutas}</p>`);

//Contar os elementos de um vetor - Método LENGTH
const itens = frutas.length;
document.writeln(`<p>O número de elementos na lista de frutas é: ${itens}</p>`);