---
disciplina: DSM2/ED1
titulo: matriz identidade
fonte: DSM2/ED1/Matriz/matriz_identidade.c
tipo: c
paginas: 0
extraido_em: 2026-10-24
---

```c
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
```
