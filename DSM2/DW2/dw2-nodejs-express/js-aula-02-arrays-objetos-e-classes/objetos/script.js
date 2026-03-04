
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