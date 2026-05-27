#include <stdio.h>

#define ALUNOS 5
#define AVALIACOES 4

int main() {
	
    float notas[ALUNOS][AVALIACOES];
    float media_aluno[ALUNOS];
    float soma_turma = 0;
    float media_turma;
    float maior_nota;

    printf("=== SISTEMA DE NOTAS ===\n");

    for (int i = 0; i < ALUNOS; i++) {
        float soma_aluno = 0;

        printf("\nAluno %d\n", i + 1);

        for (int j = 0; j < AVALIACOES; j++) {
        	
            printf("Digite a nota da avaliacao %d: ", j + 1);
            scanf("%f", &notas[i][j]);

            soma_aluno += notas[i][j];
            soma_turma += notas[i][j];

            if (i == 0 && j == 0) {
            	
                maior_nota = notas[i][j];
                
            } else {
            	
                if (notas[i][j] > maior_nota) {
                	
                    maior_nota = notas[i][j];
                    
                }
                
            }
            
        }

        media_aluno[i] = soma_aluno / AVALIACOES;
        
    }

    media_turma = soma_turma / (ALUNOS * AVALIACOES);

    printf("\nRESULTADO\n");

    for (i = 0; i < ALUNOS; i++) {
        printf("Media final do aluno %d: %.2f\n", i + 1, media_aluno[i]);
    }

    printf("Media geral da turma: %.2f\n", media_turma);
    printf("Maior nota registrada: %.2f\n", maior_nota);

    return 0;
}