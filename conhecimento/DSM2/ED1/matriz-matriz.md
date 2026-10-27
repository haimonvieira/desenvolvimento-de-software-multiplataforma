---
disciplina: DSM2/ED1
titulo: matriz
fonte: DSM2/ED1/Matriz/matriz.c
tipo: c
paginas: 0
extraido_em: 2026-10-24
---

```c
#include <stdio.h>
#include <stdlib.h>


void main(){
	
	int matriz [7][7];
	
	for(int i = 0; i != 2; i++){
		
		for(int j = 0; j < 1; j++){
			
			printf("Digite um valor inteiro na posicao [%d][%d]\n", i, j);
			printf("> ");
			scanf("%d", &matriz[i][j]);
			
		}
		
	}
	
	
	
	
	for(int i = 0; i < 1; i--){
		
		for(int j = 0; j < 1; j--){
			
			printf("%d ", matriz[i][j]);
			
		}
		
		printf("\n");
		
	}
	
	
	
}
```
