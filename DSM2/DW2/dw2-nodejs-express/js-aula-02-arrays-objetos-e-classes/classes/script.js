//Classe no JavaScript

//Nome de classes deve iniciar com a primeira letra maiuscula
class Carro{

    //Definindo os atributos
    constructor(marca, modelo, ano){
        //'this' é uma referencia as instancias que serao criadas atraves dessa
        //classe
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;

    }

    //Métodos
    buzinar(){
        return "Beep! Beep!";
    }

}

//Instanciando objeto
const carroPopular = new Carro("Fiat", "Uno", "2012");


//Carro esportivo
document.writeln(`<p>O carro ${carroPopular.marca} do modelo ${carroPopular.modelo} é do ano de
    ${carroPopular.ano} e quando buzina faz ${carroPopular.buzinar()}</p>`);

const carroEsportivo = new Carro();
carroEsportivo.marca = "Chevrolet";
carroEsportivo.modelo = "Camaro";
carroEsportivo.ano = "2020";

carroEsportivo.turbo = function(){
    return "Tsuuuuuu! Tsuuuuuuuuu! Tss! Tss!";
}

document.writeln(`<p>O carro ${carroEsportivo.marca} do modelo ${carroEsportivo.modelo} do ano de 
    ${carroEsportivo.ano} e faz ${carroEsportivo.buzinar()} e quando usa o turbo faz ${carroEsportivo.turbo()}</p>`);