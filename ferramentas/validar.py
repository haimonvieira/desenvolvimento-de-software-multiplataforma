#!/usr/bin/env python3
"""Valida a camada de conhecimento e as skills.

Uso: python ferramentas/validar.py
Retorna 1 se houver erro.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SKILLS = RAIZ / ".opencode" / "skills"
CONHECIMENTO = RAIZ / "conhecimento"
DB = CONHECIMENTO / "_indice" / "materiais.db"
LINK_RE = re.compile(r"\(([^)]+\.md)\)")

erros: list[str] = []
avisos: list[str] = []


def ler_frontmatter(texto: str) -> dict:
    if not texto.startswith("---"):
        return {}
    partes = texto.split("---", 2)
    if len(partes) < 3:
        return {}
    meta = {}
    for linha in partes[1].strip().splitlines():
        if ":" in linha:
            chave, valor = linha.split(":", 1)
            meta[chave.strip()] = valor.strip()
    return meta


def validar_skills() -> None:
    if not SKILLS.is_dir():
        erros.append("Pasta .opencode/skills não existe.")
        return

    ids: dict[str, Path] = {}
    for pasta in sorted(p for p in SKILLS.iterdir() if p.is_dir()):
        skill_id = pasta.name
        ids[skill_id] = pasta
        arquivo = pasta / "SKILL.md"
        if not arquivo.is_file():
            erros.append(f"{skill_id}: SKILL.md ausente.")
            continue

        texto = arquivo.read_text(encoding="utf-8")
        meta = ler_frontmatter(texto)
        if not meta.get("name"):
            erros.append(f"{skill_id}: frontmatter sem 'name'.")
        if not meta.get("description"):
            erros.append(f"{skill_id}: frontmatter sem 'description'.")
        elif len(meta["description"]) > 1024:
            erros.append(f"{skill_id}: description com {len(meta['description'])} caracteres (max 1024).")

        linhas = len(texto.splitlines())
        if linhas > 500:
            avisos.append(f"{skill_id}: SKILL.md com {linhas} linhas (recomendado < 500).")

        for link in LINK_RE.findall(texto):
            if link.startswith(("http://", "https://")):
                continue
            if not (pasta / link).resolve().is_file():
                erros.append(f"{skill_id}: link quebrado -> {link}")

    # IDs duplicados não são possíveis no filesystem, mas nomes repetidos sim.
    nomes: dict[str, str] = {}
    for skill_id, pasta in ids.items():
        arquivo = pasta / "SKILL.md"
        if not arquivo.is_file():
            continue
        meta = ler_frontmatter(arquivo.read_text(encoding="utf-8"))
        nome = meta.get("name", "")
        if nome in nomes:
            erros.append(f"Nome de skill duplicado: '{nome}' em {nomes[nome]} e {skill_id}.")
        nomes[nome] = skill_id


def validar_conhecimento() -> None:
    if not CONHECIMENTO.is_dir():
        erros.append("conhecimento/ não existe.")
        return

    arquivos = [p for p in CONHECIMENTO.rglob("*.md") if "_indice" not in p.parts]
    if not arquivos:
        erros.append("conhecimento/ não tem arquivos .md.")

    sem_fonte = 0
    for caminho in arquivos:
        meta = ler_frontmatter(caminho.read_text(encoding="utf-8", errors="ignore"))
        if not meta.get("fonte") or not meta.get("disciplina"):
            sem_fonte += 1
            if sem_fonte <= 5:
                avisos.append(f"Sem frontmatter completo: {caminho.relative_to(RAIZ)}")
    if sem_fonte > 5:
        avisos.append(f"... e mais {sem_fonte - 5} arquivos sem frontmatter completo.")

    if not DB.is_file():
        erros.append("Índice materiais.db ausente. Rode: python ferramentas/indexar.py")

    sem_meta: list[str] = []
    for pasta in sorted(p for p in CONHECIMENTO.glob("DSM*/*") if p.is_dir()):
        arquivo = pasta / "_meta.json"
        if not arquivo.is_file():
            sem_meta.append(str(pasta.relative_to(RAIZ)))
            continue
        try:
            dados = json.loads(arquivo.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            erros.append(f"{arquivo.relative_to(RAIZ)}: JSON inválido ({exc}).")
            continue
        for chave in ("disciplina", "skill", "topicos"):
            if chave not in dados:
                erros.append(f"{arquivo.relative_to(RAIZ)}: falta a chave '{chave}'.")

    if sem_meta:
        avisos.append(
            f"{len(sem_meta)} disciplinas sem _meta.json (curadoria pendente): "
            + ", ".join(sem_meta)
        )


def validar_evals() -> None:
    pasta = RAIZ / "evals"
    if not pasta.is_dir():
        avisos.append("Pasta evals/ não existe.")
        return
    for arquivo in sorted(pasta.glob("*/evals.json")):
        try:
            dados = json.loads(arquivo.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            erros.append(f"{arquivo.relative_to(RAIZ)}: JSON inválido ({exc}).")
            continue
        perguntas = dados.get("perguntas", [])
        if len(perguntas) < 10:
            avisos.append(f"{arquivo.relative_to(RAIZ)}: {len(perguntas)} perguntas (recomendado >= 10).")

    for arquivo in sorted(pasta.glob("*/triggers.json")):
        try:
            dados = json.loads(arquivo.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            erros.append(f"{arquivo.relative_to(RAIZ)}: JSON inválido ({exc}).")
            continue
        queries = dados.get("queries", [])
        if len(queries) < 20:
            avisos.append(f"{arquivo.relative_to(RAIZ)}: {len(queries)} gatilhos (recomendado >= 20).")
        sem_skill = [q.get("id", "?") for q in queries if not q.get("skill_esperada")]
        if sem_skill:
            erros.append(
                f"{arquivo.relative_to(RAIZ)}: itens sem skill_esperada: {', '.join(sem_skill)}"
            )


def main() -> int:
    validar_skills()
    validar_conhecimento()
    validar_evals()

    print("== Validação ==")
    if erros:
        print(f"\nERROS ({len(erros)}):")
        for e in erros:
            print(f"  ✗ {e}")
    if avisos:
        print(f"\nAVISOS ({len(avisos)}):")
        for a in avisos:
            print(f"  ! {a}")
    if not erros:
        print("\n✓ Nenhum erro encontrado.")
    return 1 if erros else 0


if __name__ == "__main__":
    sys.exit(main())
