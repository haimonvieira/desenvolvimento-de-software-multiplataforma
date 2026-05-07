#include <stdio.h>
#include <stdlib.h>

typedef struct Fila{
	int valor;
	struct Fila *prox;
}F;

void exibir(F *cabeca){
	
	F *aux;
	aux = cabeca->prox;
	
	if(cabeca->prox == NULL){
		
		printf("\nFila vazia\n");
		
	}else{
		
		printf("\n");
		
		do{
			
			printf("%d ", aux->valor);
			aux = aux->prox;
			
		}while(aux->prox != NULL);
		
		printf("\n");
		
	}
	
	
}

void remover(F *cabeca){
	
	F *aux;
	
	if(cabeca->prox == NULL){
		
		printf("\nFila vazia\n");
		
	}else{
		
		aux = cabeca->prox;
		cabeca->prox = aux->prox;
		free(aux);
		
		
	}
	
	
}

void inserir(F *cabeca){
	
	F *novo = (F*) malloc(sizeof(F));
	
	printf("\nDigite o valor: ");
	scanf("%d", &novo->valor);
	novo->prox = NULL;
	
	//Fila vazia
	if(cabeca->prox == NULL){
		
		cabeca->prox = novo;
		
	}else{
		//Fila que possui elementos
		F *aux;
		aux = cabeca->prox;//Elemento que cabeca aponta
		
		while(aux->prox != NULL){
			
			aux = aux->prox;
			
		}
		
		aux->prox = novo;
		
	}
	
}


void menu(F *cabeca){
	
	int op;
	
	do{
		
		printf("\nDigite a opcao:");
		printf("\n0 - SAIR");
		printf("\n1 - Inserir");
		printf("\n2 - Remover");
		printf("\n3 - Exibir\n");
		scanf("%d", &op);
		
		switch(op){
			
			case 0:
				printf("Saindo...");
				break;
			case 1:
				inserir(cabeca);
				break;
			case 2:
				remover(cabeca);
				break;
			case 3:
				exibir(cabeca);
				break;
			default:
				printf("Opcao invalida");
				break;
			
		}
		
		
	}while(op != 0);
	
}



int main(){
	
	F *cabeca;
	cabeca = (F*) malloc(sizeof(F));
	cabeca->valor = 0;
	cabeca->prox = NULL;
	
	menu(cabeca);
	
	return 0;
}