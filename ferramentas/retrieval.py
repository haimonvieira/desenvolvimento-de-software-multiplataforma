#!/usr/bin/env python3
"""Núcleo de recuperação reutilizável.

Este módulo é a única implementação de busca. A CLI (buscar.py) e um futuro
servidor MCP devem importar daqui, nunca reimplementar.
"""
from __future__ import annotations

import json
import re
import sqlite3
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DB = RAIZ / "conhecimento" / "_indice" / "materiais.db"
TOKEN_RE = re.compile(r"[0-9A-Za-zÀ-ÖØ-öø-ÿ_]+")


def _conectar() -> sqlite3.Connection:
    if not DB.exists():
        raise FileNotFoundError(
            "Índice não encontrado. Rode: python ferramentas/indexar.py"
        )
    con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    return con


def _tokens(consulta: str) -> list[str]:
    tokens = [t.lower() for t in TOKEN_RE.findall(consulta)]
    vistos: list[str] = []
    for t in tokens:
        if len(t) >= 2 and t not in vistos:
            vistos.append(t)
    return vistos[:16]


def _expressoes(consulta: str) -> list[str]:
    tokens = _tokens(consulta)
    if not tokens:
        return []
    frase = " ".join(tokens)
    return [
        f'"{frase}"',
        " AND ".join(f"{t}*" for t in tokens),
        " OR ".join(f"{t}*" for t in tokens),
    ]


def _executar(expr: str, disciplina: str | None, limite: int) -> list[dict]:
    sql = """
        SELECT disciplina, caminho, titulo, pagina, trecho,
               bm25(trechos, 0.0, 1.0, 1.0, 0.0, 1.0) AS score
        FROM trechos
        WHERE trechos MATCH ?
    """
    params: list = [expr]
    if disciplina:
        sql += " AND disciplina = ?"
        params.append(disciplina)
    sql += " ORDER BY score LIMIT ?"
    params.append(limite)

    with _conectar() as con:
        linhas = con.execute(sql, params).fetchall()

    resultados = []
    for l in linhas:
        trecho = " ".join(l["trecho"].split())
        if len(trecho) > 900:
            trecho = trecho[:900].rstrip() + "…"
        resultados.append({
            "disciplina": l["disciplina"],
            "caminho": l["caminho"],
            "titulo": l["titulo"],
            "pagina": l["pagina"],
            "trecho": trecho,
            "score": round(-float(l["score"]), 4),
        })
    return resultados


def buscar(consulta: str, disciplina: str | None = None, limite: int = 8) -> list[dict]:
    """Busca tolerante: tenta frase, depois AND, depois OR."""
    for expr in _expressoes(consulta):
        resultados = _executar(expr, disciplina, limite)
        if resultados:
            return resultados
    return []


def ler_documento(caminho: str, inicio: int = 1, fim: int = 40) -> str:
    destino = (RAIZ / caminho).resolve()
    if not str(destino).startswith(str(RAIZ.resolve())):
        raise ValueError("Caminho fora da raiz do curso.")
    if not destino.is_file():
        raise FileNotFoundError(f"Documento não encontrado: {caminho}")
    linhas = destino.read_text(encoding="utf-8", errors="ignore").splitlines()
    inicio = max(1, inicio)
    fim = max(inicio, min(fim, len(linhas)))
    return "\n".join(linhas[inicio - 1:fim])


def listar_disciplinas() -> list[str]:
    with _conectar() as con:
        return [r[0] for r in con.execute(
            "SELECT DISTINCT disciplina FROM fontes ORDER BY disciplina"
        )]


def listar_fontes(disciplina: str) -> list[dict]:
    with _conectar() as con:
        linhas = con.execute(
            "SELECT caminho, titulo, fonte_original, paginas, tokens "
            "FROM fontes WHERE disciplina = ? ORDER BY caminho",
            (disciplina,),
        ).fetchall()
    return [dict(l) for l in linhas]


def obter_meta(disciplina: str) -> dict:
    sem, sigla = disciplina.split("/", 1)
    caminho = RAIZ / "conhecimento" / sem / sigla / "_meta.json"
    if not caminho.exists():
        return {}
    return json.loads(caminho.read_text(encoding="utf-8"))
