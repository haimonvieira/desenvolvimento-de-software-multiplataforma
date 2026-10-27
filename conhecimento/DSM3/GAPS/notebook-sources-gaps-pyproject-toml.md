---
disciplina: DSM3/GAPS
titulo: GAPS pyproject toml
fonte: DSM3/GAPS/notebook-sources/GAPS-pyproject-toml.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

===== hub-solidario-api\pyproject.toml =====

[project]
name = "hub-solidario-api"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
authors = [
    { name = "Haimon Vieira", email = "haimonvieira@pm.me" }
]
requires-python = ">=3.14"
dependencies = []

[project.scripts]
hub-solidario-api = "hub_solidario_api:main"

[build-system]
requires = ["uv_build>=0.12.2,<0.13.0"]
build-backend = "uv_build"
