#include <stdio.h>
#include <stdlib.h>


void main(){
	
	//Gerar matriz identidade para lXc
	
	int matriz[7][5];
	
	for(int i = 0; i < 7; i++){
		
		for(int j = 0; j < 5; j++){
			
			matriz[i][j] = j;
			
		}
		
	}
	
	int maior = matriz[0][0];
	int posMaior[1];
	int menor = matriz[0][0];
	
	for(int i = 0; i < 7; i++){
		
		for(int j = 0; j < 5; j++){
			
			if(maior > matriz[i][j]){
				
				maior = matriz[i][j];
				posMaior[i] = i;
				posMaior[i + 1] = j;
				
			}
			
		}
		
		printf("\n");
		
	}
	
	
	printf("\n");

	
}