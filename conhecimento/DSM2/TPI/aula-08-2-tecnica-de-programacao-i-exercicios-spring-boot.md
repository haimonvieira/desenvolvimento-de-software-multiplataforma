---
disciplina: DSM2/TPI
titulo: aula 08.2  Técnica de Programação I  Exercícios Spring Boot
fonte: DSM2/TPI/aula 08.2- Técnica de Programação I- Exercícios Spring Boot.pdf
tipo: pdf
paginas: 5
extraido_em: 2026-10-24
---

<!-- page: 1 -->

Técnica de Programação I
       Profº Luiz Cláudio

<!-- page: 2 -->


<!-- page: 3 -->

Exercício 1: Mostrar dados Produto


1.No seu Controller, crie um @GetMapping("/produto").
2.Adicione ao model os atributos: "nomeProduto", “preco" e “descricao"
3.Crie um arquivo produto.html.
4.No HTML, exiba:
“Nome Produto é [nomeProduto], Preco: [preco] , Descrição: [descricao]."

<!-- page: 4 -->

Exercício 2: Informações IPTU

1.No Controller: Crie um @GetMapping("/iptu").
2. No Model: Adicione:
• localTerreno
• areaTerreno
• valorIPTU

3. Crie um arquivo iptu.html:

4. No HTML, exiba:
Local do Terreno: [localTerreno],
Area Terreno: [areaTerreno]
Valor IPTU: [valorIptu]

<!-- page: 5 -->

Exercício 3: Dados Imposto Renda

1.No Controller: Crie um @GetMapping("/imposto").
2. No Model: Adicione:

• nomeFisico
• valorTotalRecebido
• quantidadeDependentes
• valorPagar

3. Crie um arquivo imposto.html:

4. No HTML, exiba:
Nome Pessoa Física: [nomeFisico], Valor Total Recebido Fonte Pagadora: [valorTotalRecebido]
Quantidade Dependentes: [quantidadeDependentes] , Valor Pagar Imposto: [valorPagar]
