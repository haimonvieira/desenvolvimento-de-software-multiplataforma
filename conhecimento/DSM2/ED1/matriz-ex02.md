---
disciplina: DSM2/ED1
titulo: ex02
fonte: DSM2/ED1/Matriz/ex02.c
tipo: c
paginas: 0
extraido_em: 2026-10-24
---

```c
#include <stdio.h>
#include <stdlib.h>


void main(){
	
	//Gerar matriz identidade para lXc
	
	int matriz[5][5];
	int vetor[5];
	
	for(int i = 0; i < 5; i++){
		
		for(int j = 0; j < 5; j++){
			
			if(i == j){
				matriz[i][j] = 1;
				vetor[i] = matriz[i][j];
			}else{
				matriz[i][j] = 0;	
			}
			
		}
		
	}
	
	for(int i = 0; i < 5; i++){
		
		for(int j = 0; j < 5; j++){
			
			printf("[%d] ", matriz[i][j]);	
			
		}
		
		printf("\n");
		
	}
	
	
	printf("\n");

	
	for(int i = 0; i < 5; i++){
			
		printf("[%d] ", vetor[i]);					
		
	}
	
}
```
