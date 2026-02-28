#include <stdio.h>
#include <stdlib.h>
#include <time.h>   // Required for time()


void main(){
	
	//Gerar matriz identidade para lXc
	srand(time(NULL));

	int matriz[7][5];
	
	for(int i = 0; i < 7; i++){
		
		for(int j = 0; j < 5; j++){
			
			printf("Insira o numero inteiro na posicao [%d][%d]", i, j);
			printf("> ");
			scanf("%d", &matriz[i][j]);
			
		}
		
	}
	
	
	int maior = matriz[0][0];
	int posMaiorLinha;
	int posMaiorColuna;
	int menor = matriz[0][0];
	
	for(int i = 0; i < 7; i++){
		
		for(int j = 0; j < 5; j++){
			
			if(matriz[i][j] >= maior){
				
				maior = matriz[i][j];
				posMaiorLinha = i;
				posMaiorColuna = j;
				
			}

		}
		
	}
	
	printf("Maior numero: %d\n", maior);
	printf("posicao: [%d][%d]\n", posMaiorLinha, posMaiorColuna);
	
	for(int i = 0; i < 7; i++){
		
		for(int j = 0; j < 5; j++){
			
			printf("%d ", matriz[i][j]);
			
		}
		printf("\n");
		
	}
	
	
	
}