#include <stdio.h>
#include <stdlib.h>


void main(){
	
	int matriz [7][7];
	
	for(int i = 0; i < 7; i++){
		
		for(int j = 0; j < 7; j++){
			
			matriz[i][j] = 0;
			
		}
		
	}
	
	
	for(int i = 0; i < 7; i++){
		
		for(int j = 0; j < 7; j++){
			
			printf("%d ", matriz[i][j]);
			
		}
		
		printf("\n");
		
	}
	
	
	
}