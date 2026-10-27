#!/usr/bin/env python3
"""Avalia a recuperação (recall@k) das perguntas de eval.

Não avalia a qualidade da resposta — isso exige o modelo. Mede se a fonte
mínima esperada aparece no top-k da busca.

Uso:
    python ferramentas/avaliar.py
    python ferramentas/avaliar.py --skill dsm-bd2 --k 5
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import retrieval  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skill", help="Ex.: dsm-bd2")
    parser.add_argument("--k", type=int, default=5)
    args = parser.parse_args()

    arquivos = sorted((RAIZ / "evals").glob("*/evals.json"))
    if args.skill:
        arquivos = [a for a in arquivos if a.parent.name == args.skill]
    if not arquivos:
        print("Nenhum evals.json encontrado.", file=sys.stderr)
        return 2

    total = acertos = 0
    for arquivo in arquivos:
        dados = json.loads(arquivo.read_text(encoding="utf-8"))
        skill = dados.get("skill", arquivo.parent.name)
        disciplina = dados.get("disciplina")
        print(f"\n== {skill} ==")
        for pergunta in dados.get("perguntas", []):
            esperadas = pergunta.get("fonte_minima", [])
            if isinstance(esperadas, str):
                esperadas = [esperadas]
            resultados = retrieval.buscar(
                pergunta["prompt"], disciplina, limite=args.k
            )
            caminhos = [r["caminho"] for r in resultados]
            achou = any(
                any(c == e or c.startswith(e) for c in caminhos)
                for e in esperadas
            )
            total += 1
            acertos += 1 if achou else 0
            marca = "✓" if achou else "✗"
            print(f"  {marca} {pergunta['id']}: {pergunta['prompt'][:70]}")
            if not achou:
                print(f"      esperado: {esperadas}")
                print(f"      obtido:   {caminhos[:args.k]}")

    print(f"\nRecall@{args.k}: {acertos}/{total} ({acertos / total:.0%})" if total else "Sem perguntas.")
    return 0 if acertos == total else 1


if __name__ == "__main__":
    sys.exit(main())
