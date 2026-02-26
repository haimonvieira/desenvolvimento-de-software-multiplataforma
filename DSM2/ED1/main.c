#include <stdio.h>
#include <stdlib.h>

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

void main() {
	
	double notas[] = {5, 9.6, 8, 6.7};
	double media = 0;
	double soma = 0;
	
	for(int i = 0; i < 4; i++){
		
		soma += notas[i];
		
	}
	
	media = soma / 4;
	
	printf("Media: %.2f", media);
	
}