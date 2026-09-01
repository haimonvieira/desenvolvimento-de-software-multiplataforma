voto_nulo = int(input("Votos nulos: "))
voto_branco = int(input("Voto branco: "))
voto_valido = int(input("Voto valido: "))
total_eleitores = voto_branco + voto_nulo + voto_valido
percentual_branco = (voto_branco * 100) / total_eleitores
print(f"Voto nulo: {voto_nulo}\n Voto branco: {voto_branco}\n Voto válido: {voto_valido} \n"
      + f"Porcentagem votos brancos: {percentual_branco}\n Total de eleitores: {total_eleitores}")