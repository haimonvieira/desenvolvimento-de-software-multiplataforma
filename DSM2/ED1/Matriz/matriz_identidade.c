#include <stdio.h>
#include <stdlib.h>


void main(){
	
	//Gerar matriz identidade para lXc
	
	int matriz[3][3];
	
	for(int i = 0; i < 3; i++){
		
		for(int j = 0; j < 3; j++){
			
			if(i == j){
				matriz[i][j] = 1;
			}else{
				matriz[i][j] = 0;	
			}
			
		}
		
	}
	
	for(int i = 0; i < 3; i++){
		
		for(int j = 0; j < 3; j++){
			
			printf("%d ", matriz[i][j]);	
			
		}
		
		printf("\n");
		
	}
	
}