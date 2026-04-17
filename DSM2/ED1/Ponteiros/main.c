#include <stdio.h>
#include <stdlib.h>

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

int main(int argc, char *argv[]) {
	
	int *p1;
	int num = 6;
	
	p1 = &num;
	printf("Endereco: %d\n", p1);// Imprime o endereço para onde p1 aponta
	printf("Conteudo: %d", *p1); // Imprime o valor para onde p1 aponta
	return 0;
	
}