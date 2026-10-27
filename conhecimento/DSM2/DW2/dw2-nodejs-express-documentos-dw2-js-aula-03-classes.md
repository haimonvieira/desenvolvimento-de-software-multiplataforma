---
disciplina: DSM2/DW2
titulo: DW2 JS Aula 03 Classes
fonte: DSM2/DW2/dw2-nodejs-express/Documentos/DW2-JS-Aula_03-Classes.pdf
tipo: pdf
paginas: 6
extraido_em: 2026-10-24
---

<!-- page: 1 -->

Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


                                                                                     JS Aula 03:
                                                                                          Classes

<!-- page: 2 -->

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

<!-- page: 3 -->

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

<!-- page: 4 -->

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

<!-- page: 5 -->

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

<!-- page: 6 -->

Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


                                                                                     JS Aula 03:
                                                                                          Classes
