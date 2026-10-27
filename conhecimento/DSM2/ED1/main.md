---
disciplina: DSM2/ED1
titulo: main
fonte: DSM2/ED1/main.c
tipo: c
paginas: 0
extraido_em: 2026-10-24
---

```c
#include <stdio.h>
#include <stdlib.h>

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

int main(int argc, char *argv[]) {
	
	int *p2;
	int num = 6;
	
	p2 = &num;// Atribuindo endereco de 'num' para 'p2'
	*p2 = *p2 + 1; // Atribuindo o valor para 'p2'
	printf("%d", *p2);
	
	return 0;
	
}
```
