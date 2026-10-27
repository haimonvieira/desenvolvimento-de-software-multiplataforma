---
disciplina: DSM2/ED1
titulo: main
fonte: DSM2/ED1/Ponteiros/Exercicio/main.c
tipo: c
paginas: 0
extraido_em: 2026-10-24
---

```c
#include <stdio.h>
#include <stdlib.h>

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

int main(int argc, char *argv[]) {
	
	
	int *p1, *p2;
	int num1 = 1, num2 = 1;
	
	p1 = &num1;
	p2 = &num2;
	
	printf("*p1 + *p2: %d\n", *p1 + *p2);
	printf("*p1 - *p2: %d\n", *p1 - *p2);
	printf("(*p1) * (*p2): %d\n", (*p1) * (*p2));
	printf("*p1 / *p2: %d\n", *p1 / *p2);
	
	return 0;
	
}
```
