#include <stdio.h>
#include <stdlib.h>

typedef struct Livro{
	char titulo[20];
	int ano_edicao;
	int paginas;
	float preco;
}Livro;
/* run this program using the console pauser or add your own getch, system("pause") or input loop */

int main(int argc, char *argv[]) {
	
	Livro livros[5];
	int qtd_paginas = 0;
	
	for(int i = 0; i < 5; i++){
		
		printf("Titulo\n");
		printf("> ");
		scanf("%s", &livros[i].titulo);
		
		printf("Ano da edicao\n");
		printf("> ");
		scanf("%d", &livros[i].ano_edicao);
		
		printf("Quantidade de paginas\n");
		printf("> ");
		scanf("%d", &livros[i].paginas);
		qtd_paginas += livros[i].paginas;
		
		printf("Preco do livro\n");
		printf("> ");
		scanf("%s", &livros[i].preco);
		
	}
	
	float media_paginas = qtd_paginas / 5;
	
	printf("Media das paginas: %.2f", media_paginas);
	
	
	return 0;
}