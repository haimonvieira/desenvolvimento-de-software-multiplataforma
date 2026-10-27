#!/usr/bin/env python3
"""Reconstrói o índice FTS5 a partir de conhecimento/**/*.md.

Uso: python ferramentas/indexar.py
"""
from __future__ import annotations

import re
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CONHECIMENTO = RAIZ / "conhecimento"
DB = CONHECIMENTO / "_indice" / "materiais.db"
PAGE_RE = re.compile(r"^<!--\s*page:\s*(\d+)\s*-->$")
MAX_CHARS = 4800  # ~1.200 tokens


def parse_frontmatter(texto: str) -> tuple[dict, str]:
    if not texto.startswith("---"):
        return {}, texto
    partes = texto.split("---", 2)
    if len(partes) < 3:
        return {}, texto
    meta: dict[str, str] = {}
    for linha in partes[1].strip().splitlines():
        if ":" in linha:
            chave, valor = linha.split(":", 1)
            meta[chave.strip()] = valor.strip()
    return meta, partes[2].lstrip("\n")


def chunkar(corpo: str, max_chars: int = MAX_CHARS):
    pagina = None
    pagina_chunk = None
    buffer: list[str] = []
    tamanho = 0

    for linha in corpo.splitlines():
        m = PAGE_RE.match(linha.strip())
        if m:
            pagina = int(m.group(1))
            continue

        if linha.startswith("#") and buffer:
            texto = "\n".join(buffer).strip()
            if texto:
                yield texto, pagina_chunk
            buffer, tamanho = [], 0

        if not buffer:
            pagina_chunk = pagina
        buffer.append(linha)
        tamanho += len(linha) + 1

        if tamanho >= max_chars:
            texto = "\n".join(buffer).strip()
            if texto:
                yield texto, pagina_chunk
            buffer, tamanho = [], 0

    if buffer:
        texto = "\n".join(buffer).strip()
        if texto:
            yield texto, pagina_chunk


def main() -> int:
    if not CONHECIMENTO.is_dir():
        print("conhecimento/ não existe. Rode a extração primeiro.", file=sys.stderr)
        return 2

    DB.parent.mkdir(parents=True, exist_ok=True)
    if DB.exists():
        DB.unlink()

    con = sqlite3.connect(DB)
    con.executescript(
        """
        CREATE TABLE fontes (
            caminho TEXT PRIMARY KEY,
            disciplina TEXT NOT NULL,
            titulo TEXT,
            fonte_original TEXT,
            paginas TEXT,
            tokens INTEGER
        );
        CREATE VIRTUAL TABLE trechos USING fts5(
            disciplina, caminho, titulo, pagina, trecho,
            tokenize = 'unicode61 remove_diacritics 2'
        );
        """
    )

    arquivos = sorted(
        p for p in CONHECIMENTO.rglob("*.md")
        if "_indice" not in p.parts
    )

    total_trechos = 0
    total_tokens = 0
    por_disc: dict[str, int] = {}

    for caminho in arquivos:
        texto = caminho.read_text(encoding="utf-8", errors="ignore")
        meta, corpo = parse_frontmatter(texto)
        disciplina = meta.get("disciplina", "?")
        titulo = meta.get("titulo", caminho.stem)
        rel = str(caminho.relative_to(RAIZ))
        tokens = len(corpo) // 4

        con.execute(
            "INSERT OR REPLACE INTO fontes VALUES (?,?,?,?,?,?)",
            (rel, disciplina, titulo, meta.get("fonte", ""),
             meta.get("paginas", "-"), tokens),
        )

        for trecho, pagina in chunkar(corpo):
            if len(trecho) < 40:
                continue
            con.execute(
                "INSERT INTO trechos (disciplina, caminho, titulo, pagina, trecho) "
                "VALUES (?,?,?,?,?)",
                (disciplina, rel, titulo, str(pagina or meta.get("paginas", "")), trecho),
            )
            total_trechos += 1

        total_tokens += tokens
        por_disc[disciplina] = por_disc.get(disciplina, 0) + 1

    con.commit()
    con.execute("INSERT INTO trechos(trechos) VALUES('optimize')")
    con.commit()
    con.close()

    print(f"Índice: {DB.relative_to(RAIZ)}")
    print(f"Arquivos: {len(arquivos)} | trechos: {total_trechos} | ~tokens: {total_tokens:,}")
    print(f"Gerado em: {datetime.now(timezone.utc).isoformat()}")
    for disc, n in sorted(por_disc.items()):
        print(f"  {disc:<12} arquivos={n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
