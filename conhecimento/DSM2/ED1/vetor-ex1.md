---
disciplina: DSM2/ED1
titulo: ex1
fonte: DSM2/ED1/Vetor/ex1.c
tipo: c
paginas: 0
extraido_em: 2026-10-24
---

```c
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
```
