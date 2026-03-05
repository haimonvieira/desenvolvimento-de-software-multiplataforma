
//Objetos literais
document.writeln(`<h4>Objetos literais possuem atributos (propriedades) e métodos (funções)</h4>`);
const pessoa = {};
document.writeln(typeof pessoa);

//Criando objeto
const carro = {
    modelo: "gol",
    cor: "vermelho",
    acelerar(){
        return "Acelerando...";
    },
    frear(){
        return "Freando...";
    }
};

document.writeln(`<p>O modelo do carro é ${carro.modelo}</p>`);
document.writeln(`<p>A cor do carro é ${carro.cor}</p>`);
document.writeln(`<p>${carro.acelerar()}</p>`);
document.writeln(`<p>${carro.frear()}</p>`);

//Manipulando Arrays de objetos
const productList = [
    {
        nome: "Computador",
        marca: "Épou",
        preco: 5000,
        descricao: "MacBook M@# moderno top"
    },
    {
        nome: "Tablet",
        marca: "Semsunga",
        preco: 2000,
        descricao: "SemsungaBook mais barato que epou"
    },
    {
        nome: "Celular",
        marca: "Épou",
        preco: 9999,
        descricao: "AiFone 123"
    }
];

//Exibindo o array de objetos atraves do forEach
document.writeln("<h4>Exibindo o array d eobjetos atraves do forEach:</h4>");
productList.forEach((product) => {
    document.writeln(`
        Produto: ${product.nome} <br>
        Marca: ${product.marca} <br>
        Preço: ${product.preco} <br>
        Descrição: ${product.descricao} <br><br>
        `);
})