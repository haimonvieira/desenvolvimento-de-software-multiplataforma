#include <stdio.h>
#include <stdlib.h>

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

typedef struct {
	int idade;
	char sexo[1];
	float salario;
	int numero_filhos;
}Habitante;

int main(int argc, char *argv[]) {
	
	Habitante habitantes[1];
	
	float media_salario;
	float soma_salario = 0;
	
	for(int i = 0; i < 500; i++){
		
		printf("Informe a idade\n");
		printf("> ");
		scanf("%d", &habitantes[i].idade);
		
		printf("Informe o sexo (M - Masculuno/ F - Feminino)\n");
		printf("> ");
		scanf("%s", &habitantes[i].sexo);
		
		printf("Informe o salario\n");
		printf("> ");
		scanf("%f", &habitantes[i].salario);
		soma_salario += habitantes[i].salario;
		
		printf("Informe o numero de filhos\n");
		printf("> ");
		scanf("%d", &habitantes[i].numero_filhos);
		
	}
	
	media_salario = soma_salario / 1;
	printf("Media dos salarios: %.2f", media_salario);
	
	return 0;
}