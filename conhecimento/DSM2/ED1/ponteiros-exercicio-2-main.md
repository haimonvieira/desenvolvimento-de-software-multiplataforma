---
disciplina: DSM2/ED1
titulo: main
fonte: DSM2/ED1/Ponteiros/Exercicio 2/main.c
tipo: c
paginas: 0
extraido_em: 2026-10-24
---

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Carro{
	char modelo[30];
	char placa[12];
}Carro;

int main(int argc, char *argv[]) { 
	int *p;
	Carro *carro;
	p = (int*) malloc(sizeof(int));
	carro = (Carro*) malloc(sizeof(Carro));
	printf("Informe o modelo: ");
	scanf("%s", carro.modelo);
	
	printf("Informe o placa: ");
	scanf("%s", carro.placa);
	
	return 0;
}
```
