PY ?= python3

.PHONY: help inventariar extrair indexar buscar validar avaliar tudo limpar

help:
	@echo "Alvos disponíveis:"
	@echo "  make inventariar          lista as fontes do curso"
	@echo "  make extrair              gera conhecimento/**/*.md"
	@echo "  make extrair FORCAR=1     regenera tudo"
	@echo "  make indexar              reconstrói o índice FTS5"
	@echo "  make buscar Q=\"termo\"      busca no corpus"
	@echo "  make validar              valida skills e conhecimento"
	@echo "  make avaliar              mede recall das evals"
	@echo "  make tudo                 inventariar + extrair + indexar + validar"

inventariar:
	$(PY) ferramentas/inventariar.py

extrair:
	$(PY) ferramentas/extrair.py $(if $(FORCAR),--forcar,)

indexar:
	$(PY) ferramentas/indexar.py

buscar:
	@test -n "$(Q)" || (echo 'Use: make buscar Q="termo"' && exit 1)
	$(PY) ferramentas/buscar.py "$(Q)" $(ARGS)

validar:
	$(PY) ferramentas/validar.py

avaliar:
	$(PY) ferramentas/avaliar.py $(ARGS)

tudo: inventariar extrair indexar validar

limpar:
	rm -f conhecimento/_indice/materiais.db conhecimento/_indice/extracao.log
