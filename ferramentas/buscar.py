#!/usr/bin/env python3
"""CLI de busca no corpus do curso.

Uso:
    python ferramentas/buscar.py "LEFT JOIN WHERE"
    python ferramentas/buscar.py "autovetor" --disciplina DSM3/AL --limite 5
    python ferramentas/buscar.py "normalizacao" --json
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import retrieval  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("consulta")
    parser.add_argument("--disciplina", help="Ex.: DSM2/BD2")
    parser.add_argument("--limite", type=int, default=8)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    resultados = retrieval.buscar(args.consulta, args.disciplina, args.limite)
    if args.json:
        print(json.dumps(resultados, ensure_ascii=False, indent=2))
        return 0

    if not resultados:
        print("Nenhum trecho encontrado. Tente termos mais gerais.")
        return 1

    for i, r in enumerate(resultados, 1):
        print(f"\n{i}. [{r['disciplina']}] {r['titulo']} (p. {r['pagina'] or '-'})")
        print(f"   {r['caminho']}")
        print(f"   {r['trecho'][:500]}{'…' if len(r['trecho']) > 500 else ''}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
