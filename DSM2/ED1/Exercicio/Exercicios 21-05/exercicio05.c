#include <stdio.h>
#include <string.h>

#define MAX 100
#define TAM_URL 100

typedef struct Historico {
    char paginas[MAX][TAM_URL];
    int topo;
}Historico;

void inicializar(Historico *p) {
    p->topo = -1;
}

int isVazia(Historico *p) {
    return p->topo == -1;
}

int isCheia(Historico *p) {
    return p->topo == MAX - 1;
}

void visitar_pagina(Historico *p) {
    char url[TAM_URL];

    if (isCheia(p)) {
        printf("Historico cheio!\n");
    } else {
        printf("Digite a URL da pagina: ");
        scanf(" %[^\n]", url);

        p->topo++;
        strcpy(p->paginas[p->topo], url);

        printf("Pagina visitada com sucesso!\n");
    }
}

void exibir_pagina_atual(Historico *p) {
    if (isVazia(p)) {
        printf("Nenhuma pagina visitada.\n");
    } else {
        printf("Pagina atual: %s\n", p->paginas[p->topo]);
    }
}

void voltar_pagina(Historico *p) {
    if (isVazia(p)) {
        printf("Nao ha paginas para voltar.\n");
    } else {
        printf("Saindo da pagina: %s\n", p->paginas[p->topo]);
        p->topo--;

        if (!isVazia(p)) {
            printf("Pagina atual agora: %s\n", p->paginas[p->topo]);
        } else {
            printf("Nao ha pagina anterior.\n");
        }
    }
}

void exibir_historico(Historico *p) {
    int i;

    if (isVazia(p)) {
        printf("Historico vazio.\n");
    } else {
        printf("\n=== HISTORICO DE NAVEGACAO ===\n");

        for (i = p->topo; i >= 0; i--) {
            printf("%s\n", p->paginas[i]);
        }
    }
}

int main() {
	
    Historico historico;
    int opcao;

    inicializar(&historico);

    do {
        printf("\n=== NAVEGADOR SIMPLES ===\n");
        printf("1 - Visitar nova pagina\n");
        printf("2 - Exibir pagina atual\n");
        printf("3 - Voltar para pagina anterior\n");
        printf("4 - Exibir historico\n");
        printf("0 - Sair\n");
        printf("Escolha uma opcao: ");
        scanf("%d", &opcao);

        switch (opcao) {
            case 1:
                visitar_pagina(&historico);
                break;

            case 2:
                exibir_pagina_atual(&historico);
                break;

            case 3:
                voltar_pagina(&historico);
                break;

            case 4:
                exibir_historico(&historico);
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