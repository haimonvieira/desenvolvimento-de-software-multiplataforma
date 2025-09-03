**entidade:**atributo

**clientes**: id, endereço, nome, telefone 

**bicicletas**: id, id\_cliente, marca, modelo, tipo, ano\_fabricação

**atendimento**: id, data\_entrada, data\_saida, status, observação, id\_servico

**serviços**: id, tipo\_servico, id\_produto, quantidade, valor, id\_atendimento

**produtos**: id, quantidade, valor\_unitario

**personalização**: id, id\_produto, valor

**vendas**: id, id\_cliente, data, id\_servico



Comentarios:

*tabela clientes para registrar os clientes;*

*bicicletas para o registro da bicicleta do cliente;*

*atendimento para registrar os séricos, pode ter mais de um;*

*serviços registra os serviços feitos na bicicleta;*

*produtos armazena a quantidade que cada produto tem;*

*personalização verifica qual produto foi utilizado;*

*vendas calcula o valor final para o cliente;*



