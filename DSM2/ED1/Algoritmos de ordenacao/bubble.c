#include <stdio.h>
#include <stdlib.h>


//vetor = [5, 6, 9, 1]
void bubbleSort(int* vetor, int numero){
	//numero = 5
	int i, fim, aux;
	//1a - fim = 4
	for(fim = numero - 1; fim > 0; --fim){
		
		//fim = 4;
		for(i = 0; i < fim; ++i){
			
			//vetor[0]
			if(vetor[i] > vetor[i + 1]){
				
				aux = vetor[i];
				
				//Ele pega a posicao com numero maior
				vetor[i] = vetor[i + 1];
				
				//É colocado o menor numero na posicao seguinte
				vetor[i + 1] = aux;
				
			}
			
		}
		
	}
	
}

void main(){
	
	int vetor[] = {10, 5, 7, 8, 9};
	int n = 5, i;
	
	bubbleSort(vetor, n);
	
	for(i = 0; i < n; i++){
		
		printf("%d ", vetor[i]);
		
	}
	
}


