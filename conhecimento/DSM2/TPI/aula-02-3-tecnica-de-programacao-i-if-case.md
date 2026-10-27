---
disciplina: DSM2/TPI
titulo: aula 02.3  Técnica de Programação I   IF Case
fonte: DSM2/TPI/aula 02.3- Técnica de Programação I - IF-Case.pdf
tipo: pdf
paginas: 12
extraido_em: 2026-10-24
---

<!-- page: 1 -->

TÉCNICA DE PROGRAMAÇÃO I
        PROFº LUIZ CLÁUDIO

<!-- page: 2 -->

    Função         Sinal
    Adição           +
   Subtração         -
 Multiplicação       *
    Divisão          /
Resto da divisão     %
  Incremento        ++
 Decremento          --

<!-- page: 3 -->

   Função          Sinal
     Igual          ==
  Diferente         !=
  Maior que          >
Maior ou igual a    >=
  Menor que          <
Menor ou igual a    <=

<!-- page: 4 -->

Função   Sinal
   E      &&
  OU      ||
 Não       !

<!-- page: 5 -->

     Supondo a variável x    Converter em     y recebe o valor convertido
 De string para numéricos
        String x = “10”          int             int y = Integer.parseInt(x)
       String x = “20.5”        float          float y = Float.parseFloat(x)
       String x = “20.5”       double       double y = Double.parseDouble(x)
 De numéricos para string
                                               String y = Integer.toString()
           int x = 10           String

         float x = 10.5         String          String y = Float.toString()

       double x = 10.5          String         String y = Double.toString()

<!-- page: 6 -->


<!-- page: 7 -->


<!-- page: 8 -->

int num1;
Scanner entrada = new Scanner(System.in);
System.out.println("Digite o número:");
num1 = entrada.nextInt();
If(num1 > 10)
{
    System.out.println(“O número é maior que 10”);
}
else {
    System.out.println(“O número é menor que 10”);
}

<!-- page: 9 -->

setMedia(Double.parseDouble(
JOptionPane.showInputDialog("Digite a média:")));


If ( (media > 0) &&(media <= 5)){
    System.out.println("Reprovado");
JOptionPane.showMessageDialog(null,”Reprovado”);
}

Else if (( media > 5) && (media <=10))
{
    System.out.println(“Aprovado");
JOptionPane.showMessageDialog(null,”Aprovado”);
    }

<!-- page: 10 -->

setMedia(Double.parseDouble(
JOptionPane.showInputDialog("Digite a média:")));


If ( (media == 6) || (media == 7))
System.out.println(“Aprovado");
{JOptionPane.showMessageDialog(null,”Aprovado”);
}
Else if (( media == 5) || (media < 5)){
System.out.println("Reprovado");
JOptionPane.showMessageDialog(null,”Reprovado”);}

<!-- page: 11 -->


<!-- page: 12 -->

   Classe JOptionPane e a diretiva import.(javax.swing.JOptionPane)
