import java.util.Scanner;

public static void main(){

    int idade, dias;
    Scanner scanner = new Scanner(System.in);

    System.out.println("Insira sua idade");
    System.out.printf("> ");
    idade = scanner.nextInt();

    dias = idade * 365;

    System.out.printf("Você já viveu %d dias!", dias);


}