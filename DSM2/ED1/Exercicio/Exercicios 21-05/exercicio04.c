#include <stdio.h>

#define MAX 100

typedef struct Paciente {
    char nome[100];
    int idade;
    char cpf[20];
    char tipo_sanguineo[5];
}Paciente;

int main() {
	
    Paciente paciente[MAX];
    int quantidade;
    int i;

    printf("CADASTRO DE PACIENTES\n");

    printf("Quantos pacientes deseja cadastrar? ");
    scanf("%d", &quantidade);

    for (i = 0; i < quantidade; i++) {
        printf("\nPaciente %d\n", i + 1);

        printf("Nome: ");
        scanf(" %[^\n]", paciente[i].nome);

        printf("Idade: ");
        scanf("%d", &paciente[i].idade);

        printf("CPF: ");
        scanf(" %[^\n]", paciente[i].cpf);

        printf("Tipo sanguineo: ");
        scanf(" %[^\n]", paciente[i].tipo_sanguineo);
    }

    printf("\nPACIENTES CADASTRADOS\n");

    for (i = 0; i < quantidade; i++) {
        printf("\nPaciente %d\n", i + 1);
        printf("Nome: %s\n", paciente[i].nome);
        printf("Idade: %d\n", paciente[i].idade);
        printf("CPF: %s\n", paciente[i].cpf);
        printf("Tipo sanguineo: %s\n", paciente[i].tipo_sanguineo);
    }

    return 0;
}