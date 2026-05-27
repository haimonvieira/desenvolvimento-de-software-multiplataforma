#include <stdio.h>

#define TAMANHO 10

void copiarVetor(float origem[], float destino[]) {

    for (int i = 0; i < TAMANHO; i++) {
        destino[i] = origem[i];
    }
}

void imprimirVetor(float vetor[]) {
    
    for (int i = 0; i < TAMANHO; i++) 0{
        printf("R$ %.2f ", vetor[i]);
    }

    printf("\n");
}

void bubbleSort(float vetor[]) {

    float aux;

    for (int i = 0; i < TAMANHO - 1; i++) {
    	
        for (int j = 0; j < TAMANHO - 1 - i; j++) {
        	
            if (vetor[j] < vetor[j + 1]) {
            	
                aux = vetor[j];
                vetor[j] = vetor[j + 1];
                vetor[j + 1] = aux;
                
            }
        }
    }
}

void selectionSort(float vetor[]) {
	
    int maior;
    float aux;

    for (int i = 0; i < TAMANHO - 1; i++) {
        maior = i;

        for (int j = i + 1; j < TAMANHO; j++) {
        	
            if (vetor[j] > vetor[maior]) {
            	
                maior = j;
                
            }
        }

        aux = vetor[i];
        vetor[i] = vetor[maior];
        vetor[maior] = aux;
    }
}

void insertionSort(float vetor[]) {
	
    float chave;

    for (int i = 1; i < TAMANHO; i++) {
        chave = vetor[i];
        j = i - 1;

        while (int j >= 0 && vetor[j] < chave) {
            vetor[j + 1] = vetor[j];
            j--;
        }

        vetor[j + 1] = chave;
    }
}

void merge(float vetor[], int inicio, int meio, int fim) {
    float auxiliar[TAMANHO];
    int i = inicio;
    int j = meio + 1;
    int k = inicio;

    while (i <= meio && j <= fim) {
        if (vetor[i] > vetor[j]) {
            auxiliar[k] = vetor[i];
            i++;
        } else {
            auxiliar[k] = vetor[j];
            j++;
        }

        k++;
    }

    while (i <= meio) {
        auxiliar[k] = vetor[i];
        i++;
        k++;
    }

    while (j <= fim) {
        auxiliar[k] = vetor[j];
        j++;
        k++;
    }

    for (i = inicio; i <= fim; i++) {
        vetor[i] = auxiliar[i];
    }
}

void mergeSort(float vetor[], int inicio, int fim) {
    int meio;

    if (inicio < fim) {
        meio = (inicio + fim) / 2;

        mergeSort(vetor, inicio, meio);
        mergeSort(vetor, meio + 1, fim);

        merge(vetor, inicio, meio, fim);
    }
}

int particionar(float vetor[], int inicio, int fim) {
    float pivo = vetor[fim];
    float aux;
    int i = inicio - 1;

    for (int j = inicio; j < fim; j++) {
    	
        if (vetor[j] > pivo) {
        	
            i++;

            aux = vetor[i];
            vetor[i] = vetor[j];
            vetor[j] = aux;
            
        }
    }

    aux = vetor[i + 1];
    vetor[i + 1] = vetor[fim];
    vetor[fim] = aux;

    return i + 1;
}

void quickSort(float vetor[], int inicio, int fim) {
	
    int posicaoPivo;

    if (inicio < fim) {
        posicaoPivo = particionar(vetor, inicio, fim);

        quickSort(vetor, inicio, posicaoPivo - 1);
        quickSort(vetor, posicaoPivo + 1, fim);
    }
    
}

int main() {
	
    float precos[TAMANHO];
    float v1[TAMANHO], v2[TAMANHO], v3[TAMANHO], v4[TAMANHO], v5[TAMANHO];

    printf("=== ORDENACAO DE PRECOS EM ORDEM DECRESCENTE ===\n");

    for (int i = 0; i < TAMANHO; i++) {
        printf("Digite o preco do produto %d: R$ ", i + 1);
        scanf("%f", &precos[i]);
    }

    copiarVetor(precos, v1);
    copiarVetor(precos, v2);
    copiarVetor(precos, v3);
    copiarVetor(precos, v4);
    copiarVetor(precos, v5);

    bubbleSort(v1);
    selectionSort(v2);
    insertionSort(v3);
    mergeSort(v4, 0, TAMANHO - 1);
    quickSort(v5, 0, TAMANHO - 1);

    printf("\n=== RESULTADOS ===\n");

    printf("Bubble Sort:    ");
    imprimirVetor(v1);

    printf("Selection Sort: ");
    imprimirVetor(v2);

    printf("Insertion Sort: ");
    imprimirVetor(v3);

    printf("Merge Sort:     ");
    imprimirVetor(v4);

    printf("Quick Sort:     ");
    imprimirVetor(v5);

    return 0;
}