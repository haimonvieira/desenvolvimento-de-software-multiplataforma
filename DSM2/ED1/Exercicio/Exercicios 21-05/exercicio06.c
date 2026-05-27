#include <stdio.h>
#include <string.h>

#define MAX 100
#define TAM_NOME 100

struct Fila {
    char documentos[MAX][TAM_NOME];
    int inicio;
    int fim;
};

void inicializar(struct Fila *f) {
    f->inicio = 0;
    f->fim = -1;
}

int isVazia(struct Fila *f) {
    return f->fim < f->inicio;
}

int isCheia(struct Fila *f) {
    return f->fim == MAX - 1;
}

void adicionar_documento(struct Fila *f) {
    char nome[TAM_NOME];

    if (isCheia(f)) {
        printf("Fila de impressao cheia!\n");
    } else {
        printf("Digite o nome do documento: ");
        scanf(" %[^\n]", nome);

        f->fim++;
        strcpy(f->documentos[f->fim], nome);

        printf("Documento adicionado a fila!\n");
    }
}

void exibir_fila(struct Fila *f) {
    int i;

    if (isVazia(f)) {
        printf("Nao ha documentos aguardando impressao.\n");
    } else {
        printf("\n=== DOCUMENTOS NA FILA ===\n");

        for (i = f->inicio; i <= f->fim; i++) {
            printf("%d - %s\n", i - f->inicio + 1, f->documentos[i]);
        }
    }
}

void imprimir_documento(struct Fila *f) {
    if (isVazia(f)) {
        printf("Nao ha documentos para imprimir.\n");
    } else {
        printf("Imprimindo documento: %s\n", f->documentos[f->inicio]);
        f->inicio++;

        if (f->inicio > f->fim) {
            inicializar(f);
        }
    }
}

int main() {
    struct Fila filaImpressao;
    int opcao;

    inicializar(&filaImpressao);

    do {
        printf("\n=== FILA DE IMPRESSAO ===\n");
        printf("1 - Adicionar documento\n");
        printf("2 - Exibir documentos aguardando impressao\n");
        printf("3 - Imprimir proximo documento\n");
        printf("0 - Sair\n");
        printf("Escolha uma opcao: ");
        scanf("%d", &opcao);

        switch (opcao) {
            case 1:
                adicionar_documento(&filaImpressao);
                break;

            case 2:
                exibir_fila(&filaImpressao);
                break;

            case 3:
                imprimir_documento(&filaImpressao);
                break;

            case 0:
                printf("Encerrando programa...\n");
                break;

            default:
                printf("Opcao invalida!\n");
        }

    } while (opcao != 0);

    return 0;
}