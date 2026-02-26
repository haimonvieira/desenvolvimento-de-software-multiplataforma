// Função simples
// 1 – Crie uma função simples que exiba no console seu nome, sua idade e sua cidade. (Não esqueça de invocar a função no final).

function showMessage(message){
    console.log(message);
}

function showName(){
    return "Haimon Cugler Vieira, 25, Registro";
}

showMessage(`Meu nome é ${showName()}`);

// Função com parâmetros

// 2 – Crie uma função que receba dois números como parâmetro em seguida faça a divisão entre eles. O resultado deve ser exibido no console concatenado com uma string. (Ex: “O resultado da divisão foi...”). A função deve ser chamada ao final passando dois números como argumento.

function division(a, b){
    return a / b;
}

showMessage(`O resultado da divisão foi ${division(10, 2)}`);

// Função com retorno

// 3 – Crie uma função que receba três números e retorne a multiplicação entre esses números. O resultado deve ser exibido no console.

function receiveThreeNumbers(a, b, c){
    return a * b * c;
}

showMessage(`Resultado da multiplicação é ${receiveThreeNumbers(1, 2 , 3)}`);

// Função com mais de um retorno

// 4 – Crie uma função que receba uma idade como parâmetro. Se a idade for >= 18, a função deve retornar o valor “Maior de idade”, se não deve retornar “Menor de idade”. O resultado deve ser exibido no console.

function verifyAge(age){
    return age >= 18 ? "Maior de idade" : "Menor de idade";
}

showMessage(`Você é ${verifyAge(18)}`);

// Função anônima

// 5 – Crie uma função anônima que receba duas notas como parâmetro. Se a média dessas notas for <=5, a função deve retornar o valor “Reprovado”, se não deve retornar o valor “Aprovado”.  O resultado deve ser exibido no console. Considere média = (nota1 + nota2) / 2.

const receiveTwoScore = function (grade1, grade2){

    return ((grade1 + grade2) / 2) <= 5 ? "Reprovado" : "Aprovado";

};

showMessage(`Você está ${receiveTwoScore(5, 6)}`);

// Arrow function com parâmetro único

// 6 – Crie uma arrow function que receba um número como parâmetro e retorne o triplo desse número. O resultado deve ser exibido no console concatenado com uma string. (Ex: “O triplo do número é...”)

const tripleNumber = (number) => {
    return 3 * number;
};

showMessage(`O triplo é ${tripleNumber(3)}`);

// Arrow function com mais de um parâmetro

// 7 – Crie uma arrow function que receba quatro números como parâmetro e retorne a soma entre esses números. O resultado deve ser impresso no console.

const receiveFourNumbers = (number1, number2, number3, number4) => {

    return number1 + number2 + number3 + number4;

};

showMessage(`Soma dos números é ${receiveFourNumbers(2, 5, 2, 9)}`);