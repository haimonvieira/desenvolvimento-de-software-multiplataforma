#include <stdio.h>
#include <stdlib.h>

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

void main() {
	
	int vetor1 [5];
	int vetor2 [5];
	
	for(int i = 0; i < 5; i++){
		
		printf("Insira na posicao [%d] do vetor 1\n", i);
		printf("> ");
		scanf("%d", &vetor1[i]);
		
	}
	
	printf("\n\n");
	
	for(int i = 0; i < 5; i++){
		
		printf("Insira na posicao [%d] do vetor 2\n", i);
		printf("> ");
		scanf("%d", &vetor2[i]);
		
	}
	
	int soma = 0;
	
	for(int i = 0; i < 5; i++){
		
		soma += vetor1[i] + vetor2[i];
		
	}
	
	printf("Soma dos vetores eh igual a: %d", soma);
	
	
	
	
}