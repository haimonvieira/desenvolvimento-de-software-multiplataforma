#include <stdio.h>
#include <stdlib.h>

typedef struct Aluno{
	char nome[30];
	float n1, n2, media;
}Aluno;

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

int main(int argc, char *argv[]) {
	
	Aluno alunos[1];
	
	for(int i = 0; i < 1; i++){
		
		printf("Informe o nome: ");
		scanf("%s", &alunos[i].nome);
		
		printf("Informe a nota1: ");
		scanf("%f", &alunos[i].n1);
		
		printf("Informe a nota2: ");
		scanf("%f", &alunos[i].n2);
		
		alunos[i].media = (alunos[i].n1 + alunos[i].n2) / 2;
				
	}
	
	for(int i = 0; i < 1; i++){
		
		printf("=========DADOS DOS ALUNOS=========\n");
		printf("Nome: %s\n", alunos[i].nome);
		printf("Nota 1: %.1f\n", alunos[i].n1);
		printf("Nota 2: %.1f\n", alunos[i].n2);
		printf("Media: %.1f\n\n", alunos[i].media);
		
	}
	
	
	return 0;
}