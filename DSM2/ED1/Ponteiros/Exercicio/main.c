#include <stdio.h>
#include <stdlib.h>

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

int main(int argc, char *argv[]) {
	
	
	int *p1, *p2;
	int num1 = 1, num2 = 1;
	
	p1 = &num1;
	p2 = &num2;
	
	*p1 = *p1 + *p2; // 2
	printf("*p1 + *p2: %d\n", *p1);
	*p1 = *p1 - *p2; // 1
	printf("*p1 - *p2: %d\n", *p1);
	*p1 = (*p1) * (*p2); // 1
	printf("(*p1) * (*p2): %d\n", *p1);
	*p1 = *p1 / *p2; // 1
	printf("*p1 / *p2: %d\n", *p1);
	
	return 0;
	
}