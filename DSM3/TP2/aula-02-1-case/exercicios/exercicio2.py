indice_poluicao = int(input("Insira o indice de poluicao: "))

match indice_poluicao:
    case 0|1|2:
        print("Aceitável")
    case 3|4|5:
        print("Suspender atividades do grupo 1")
    case 6|7:
        print("Suspender atividades do grupo 2")
    case _:
        print("Suspender atividades de todos os grupos")