//Tipos de funções

//Função Simples
function showMessage() {
  const message = "<h2>Olá! Seja bem vindo(a)!</h2>";
  document.writeln(message);
}

//Invocar função
showMessage();

//Função com parâmetro / argumento
const user = "Haimon";

//camelCase o nome da funcao
function showUserMessage(user){

    //Template Strings - ${} -> placeholder para concatenar string
    document.writeln(`<h3>O que deseja fazer hoje, ${user}?</h3>`);

}

showUserMessage(user);

//Função com mais de um parâmetro
const n1 = 10;
const n2 = 5;

function sum(n1, n2){

    let result = n1 + n2;
    document.writeln(`<p>Soma de <b>${n1}</b> + <b>${n2}</b> é igual a <b>${result}</b></p>`);

}

//Invocando a função
sum(n1, n2); //Enviando os argumentos

//Função com retorno
const num1 = 10;
const num2 = 15;

//É indicado que as funções possuam o mínimo de responsabilidade
function mult(n1, n2){
    return n1 * n2;
}

document.writeln(`O resultado é ${mult(num1, num2)}`);

//Função com retorno condicional
const number = 4;

function even(number){

    if(number % 2 == 0){
        return "par";
    }

    return "impar";

}

document.writeln(`<p>O número ${number} é ${even(number)}</p>`);

//Função anônima
const divisao = function (n){
    return n / 2;
};

n = 5;
document.writeln(`<p>A metade de ${n} é ${divisao(n)}</p>`);

//Função seta (Arrow function) -> tipo de função anônima
const double = (number) => {
    return number * 2;
};

const x = 10;
document.writeln(`<p>Dobro de ${x} é ${double(x)}</p>`);

// Arrow function com mais de um parametro
const calculadora = (a, operador, b) => {

    return eval(`${a} ${operador} ${b}`);

};

document.writeln(`<p>O resultado da operação matemática é ${calculadora(100, "*", 2)}</p>`);
