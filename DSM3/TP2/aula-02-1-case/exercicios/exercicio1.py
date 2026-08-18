is_vogal = input("Insira uma vogal ou consoante: ")

match is_vogal.lower():
    case "a"|"e"|"i"|"o"|"u":
        print("Vogal")
    case _:
        print("Consoante")