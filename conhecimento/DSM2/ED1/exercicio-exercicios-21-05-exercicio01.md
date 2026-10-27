---
disciplina: DSM2/ED1
titulo: exercicio01
fonte: DSM2/ED1/Exercicio/Exercicios 21-05/exercicio01.c
tipo: c
paginas: 0
extraido_em: 2026-10-24
---

```c
#include <stdio.h>

#define DIAS 30

int main() {
    float vendas[DIAS];
    float maior, menor, soma = 0, media = 0;

    printf("-----ANALISE DE VENDAS DOS ULTIMOS 30 DIAS-----\n");

    for (int i = 0; i < DIAS; i++) {
        printf("Digite o valor vendido %d: R$ ", i + 1);
        scanf("%f", &vendas[i]);

        soma += vendas[i];

        if (i == 0) {
        	
            maior = vendas[i];
            menor = vendas[i];
            
        } else {
        	
            if (vendas[i] > maior) {
            	
                maior = vendas[i];
                
            }

            if (vendas[i] < menor) {
            	
                menor = vendas[i];
                
            }
            
        }
        
    }

    media = soma / DIAS;

    printf("\nRESULTADOS\n");
    printf("Maior venda: R$ %.2f\n", maior);
    printf("Menor venda: R$ %.2f\n", menor);
    printf("Media das vendas: R$ %.2f\n", media);
    printf("Valor total vendido: R$ %.2f\n", soma);

    return 0;
}
```
