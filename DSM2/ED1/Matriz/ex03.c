#include <stdio.h>
#include <stdlib.h>
#include <time.h>   // Required for time()


void main(){
	
	//Gerar matriz identidade para lXc
	srand(time(NULL));

	int matriz[7][5];
	
	for(int i = 0; i < 7; i++){
		
		for(int j = 0; j < 5; j++){
			
			matriz[i][j] = rand() % 100;
			
		}
		
	}
	
	
	int maior = matriz[0][0];
	int posMaior[2];
	int menor = matriz[0][0];
	
	for(int i = 0; i < 7; i++){
		
		for(int j = 0; j < 5; j++){
			
			if(matriz[i][j] >= maior){
				
				maior = matriz[i][j];
				posMaior[0] = i;
				posMaior[1] = j;
				
			}

		}
		
	}
	
	printf("Maior numero: %d\n", maior);
	printf("posicao: [%d][%d]\n", posMaior[0], posMaior[1]);
	
	for(int i = 0; i < 7; i++){
		
		for(int j = 0; j < 5; j++){
			
			printf("%d ", matriz[i][j]);
			
		}
		printf("\n");
		
	}
	
	
	
}