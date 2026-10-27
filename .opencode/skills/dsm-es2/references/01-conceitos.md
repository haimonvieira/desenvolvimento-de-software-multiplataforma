# Conceitos consolidados — ES2

## Parte 1 — Estudo de viabilidade

### 1. O que é

O estudo de viabilidade visa tanto a **tomada de decisão** quanto a sugestão de
alternativas de solução: verificar se um sistema de informação pode ser
desenvolvido e se vale a pena (aula 01, p. 7).

### 2. Os quatro tipos

| Tipo | Pergunta central |
| --- | --- |
| Operacional | A solução se adequa à organização e as pessoas a aceitam? |
| Técnica | A tecnologia existe e a equipe tem conhecimento para aplicá-la? |
| Cronograma | Os prazos são razoáveis e obrigatórios ou desejáveis? |
| Econômica | Os benefícios superam os custos (custo-benefício)? |

Fonte: aula 01, p. 8.

### 3. Viabilidade operacional

Avalia a urgência do problema ou a aceitação da solução. Considera se o problema
vale a pena ser resolvido e como o usuário final se sente em relação a ele
(aula 01, p. 9).

### 4. Viabilidade técnica

Pergunta se a solução é prática, se a tecnologia já existe e se há conhecimento
técnico. Ter a tecnologia não garante ter as habilidades; a curva de
aprendizagem impacta o cronograma (aula 01, p. 10–11).

### 5. Viabilidade de cronograma

Avalia se os prazos são razoáveis. É preciso distinguir prazo obrigatório de
desejável. O material afirma que é preferível entregar um sistema excelente dois
meses depois do que um sistema com erros e inútil no prazo (aula 01, p. 12–13).

### 6. Viabilidade econômica

"Talvez a mais crítica." Nas fases iniciais, julga se os benefícios de resolver
o problema são vantajosos. Depois, comparar custos e benefícios de cada
alternativa é a **análise de custo-benefício** (aula 01, p. 14).

### 7. Custos de desenvolvimento

Ocorrem **uma vez**: pessoal, uso do computador, treinamento, equipamentos,
duplicação e suprimentos (aula 01, p. 15).

### 8. Custos de operação

São **contínuos** durante a vida do sistema e se dividem em:

- **Fixos:** intervalos regulares e taxas relativamente estáveis (aluguel,
  licença de software, salários).
- **Variáveis:** proporcionais a um fator de uso (tempo de CPU, conexão,
  armazenamento, suprimentos, manutenção, telefone, energia, água).

Fonte: aula 01, p. 16–18.

### 9. Métricas e pontos de função

Métrica é técnica de planejamento que ajuda a medir custo e prazo e a firmar
contratos (aula 01, p. 19).

Pontos de função (PF) medem o **tamanho funcional**: a medida das
funcionalidades descobertas no levantamento de requisitos. A analogia do corpus:
PF está para software como metros quadrados estão para uma casa (p. 20).

Exemplo do material (p. 21–22):

- Aplicação com 130 PF.
- Equipe de 6 desenvolvedores, 8 h/dia.
- `ESFORÇO = PF / RECURSOS = 130 / 6 = 21,66 "horas"`.
- `(ESFORÇO / HORAS TRABALHADAS) / RECURSOS = (21,66 / 8) / 6 = 0,45 dias`.
- Preço: `PF × valor do ponto = 130 × 50 = R$ 6.500,00`.

**Atenção:** a conta do material é dimensionalmente confusa. Reproduza citando a
fonte e sinalize que a fórmula não fecha; não a apresente como boa prática.

## Parte 2 — Diagrama de classes UML

### 10. Por que importa

É "a ferramenta mais importante da UML". Se OO fosse um prédio, o diagrama de
classes seria a planta baixa. Serve para visualizar a estrutura, definir
responsabilidades, documentar e manter o sistema (aula 03, p. 2–4).

### 11. Conceitos de OO usados

- **Classificação:** organizar em classes (moldes).
- **Abstração:** focar no essencial e esconder detalhes.
- **Instanciação:** criar um objeto a partir de uma classe.

Fonte: aula 03, p. 5–10.

### 12. Classe, atributos e métodos

- A classe é representada por um retângulo com nome, atributos e métodos
  (p. 13).
- Atributos ficam na segunda divisão e normalmente têm nome e tipo (p. 14).
- Métodos (operações/comportamentos) ficam na terceira divisão (p. 15).

### 13. Visibilidade

| Símbolo | Nome | Quem acessa |
| --- | --- | --- |
| `+` | Pública | Qualquer classe |
| `-` | Privada | Só a própria classe |
| `#` | Protegida | A classe e suas subclasses |

Fonte: aula 03, p. 16–18.

### 14. Associação e multiplicidade

Associação binária liga duas classes. Multiplicidade indica quantos objetos
participam (aula 03, p. 19–22):

| Notação | Significado |
| --- | --- |
| `0..1` | No mínimo zero e no máximo um |
| `1..1` | Um e somente um |
| `0..*` | No mínimo nenhum e no máximo muitos |
| `*` | Muitos |
| `1..*` | No mínimo um e no máximo muitos |
| `3..5` | No mínimo 3 e no máximo 5 |

### 15. Agregação

Associação especial entre um objeto-todo e um objeto-parte. Símbolo: **losango
vazio** do lado do todo. Não força a destruição da parte quando o todo é
destruído; o exemplo do corpus é equipe e jogador (aula 03, p. 23–24).

### 16. Composição

Variação mais forte da agregação. A parte pertence **exclusivamente** a um todo
e só faz sentido existir se o todo existir. Símbolo: **losango preenchido** do
lado do todo (aula 03, p. 26).

### 17. Herança

Identifica classes-mãe (gerais) e classes-filhas (especializadas) e permite
métodos polimórficos nas filhas (aula 03, p. 28).

### 18. Classes associativas

Criadas quando uma associação tem multiplicidade **muitos (`*`) em todas as
extremidades**. São necessárias porque não há onde armazenar os dados da
associação (aula 03, p. 29).

### 19. Notas

Comentários presos à classe, método ou atributo para registrar uma observação
(aula 03, p. 30).
