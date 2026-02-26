import java.util.Scanner;
public static void main(){

    double nota1, nota2, nota3, nota4, nota5, nota6;
    double media1 = 0, media2 = 0, soma = 0;

    Scanner scanner = new Scanner(System.in);

    System.out.println("Digite a primeira nota");
    System.out.printf("> ");
    nota1 = scanner.nextDouble();

    System.out.println("Digite a primeira nota");
    System.out.printf("> ");
    nota2 = scanner.nextDouble();

    System.out.println("Digite a primeira nota");
    System.out.printf("> ");
    nota3 = scanner.nextDouble();

    System.out.println("Digite a primeira nota");
    System.out.printf("> ");
    nota4 = scanner.nextDouble();

    System.out.println("Digite a primeira nota");
    System.out.printf("> ");
    nota5 = scanner.nextDouble();

    System.out.println("Digite a primeira nota");
    System.out.printf("> ");
    nota6 = scanner.nextDouble();

    media1 = (nota1 + nota2 + nota3) / 3;
    media2 = (nota4 + nota5 + nota6) / 3;
    soma = media1 + media2;

    System.out.printf("Soma das médias: %.2f", soma);

}