#!/usr/bin/env python3
"""Inventaria as fontes didáticas do curso DSM.

Gera conhecimento/_indice/inventario.csv e resumo.json.
Não altera nenhum arquivo original.
"""
from __future__ import annotations

import csv
import json
import os
import re
import subprocess
import sys
import unicodedata
import zipfile
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
INDICE = RAIZ / "conhecimento" / "_indice"

SEMESTRES = ("DSM1", "DSM2", "DSM3")

# Pastas que nunca entram no corpus.
EXCLUIR_DIRS = {
    "node_modules", ".git", ".idea", ".vscode", ".next", ".vinext", ".wrangler",
    "dist", "build", "target", "out", "bin", "obj", "coverage", "venv", ".venv",
    "__pycache__", ".mvn", ".gradle", "playwright-report", "test-results",
    ".pytest_cache", ".mypy_cache", ".turbo",
}

# Projetos completos: entram apenas os documentos (README, docs), não o código.
PROJETOS = {
    "dw2-nodejs-express", "dw3-api-express-mongodb", "hub-solidario-api",
    "hub-solidario-web", "exemplo-vscode-mongo", "Arquivo Criminal Brasileiro",
}

DOC_EXT = {".pdf", ".pptx", ".ppt", ".docx", ".doc", ".md", ".txt", ".sql",
           ".html", ".htm", ".css"}
CODE_EXT = {".py", ".java", ".c", ".cpp", ".cs", ".js", ".ts", ".ejs", ".php"}

PADRAO_DIDATICO = re.compile(
    r"(aula|exerc|ativid|lista|simulad|prova|revis|reposic|exemplo|script|main|teste)",
    re.IGNORECASE,
)
DISCIPLINAS_CODIGO = {"AL", "DW1", "TP2", "ED1", "TPI"}


def slug(texto: str) -> str:
    texto = unicodedata.normalize("NFKD", texto)
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    texto = texto.lower()
    texto = re.sub(r"[^a-z0-9]+", "-", texto).strip("-")
    return re.sub(r"-{2,}", "-", texto) or "documento"


def disciplina_de(caminho: Path) -> tuple[str, str, str] | None:
    rel = caminho.relative_to(RAIZ)
    if len(rel.parts) < 2 or rel.parts[0] not in SEMESTRES:
        return None
    return rel.parts[0], rel.parts[1], f"{rel.parts[0]}/{rel.parts[1]}"


def destino_de(caminho: Path, disc_dir: Path) -> Path:
    rel = caminho.relative_to(disc_dir)
    nome = slug("-".join(rel.with_suffix("").parts))
    sem, sigla = disc_dir.parts[-2], disc_dir.parts[-1]
    return Path("conhecimento") / sem / sigla / f"{nome}.md"


def paginas_pdf(caminho: Path) -> int:
    try:
        saida = subprocess.run(
            ["pdfinfo", str(caminho)], capture_output=True, text=True, timeout=30
        ).stdout
    except Exception:
        return 0
    for linha in saida.splitlines():
        if linha.startswith("Pages:"):
            try:
                return int(linha.split()[1])
            except (IndexError, ValueError):
                return 0
    return 0


def chars_pdf(caminho: Path) -> int:
    try:
        saida = subprocess.run(
            ["pdftotext", "-layout", "-enc", "UTF-8", str(caminho), "-"],
            capture_output=True, text=True, timeout=90,
        )
        return len(saida.stdout)
    except Exception:
        return 0


def chars_office(caminho: Path) -> int:
    """Estimativa barata: tamanho do texto XML dos slides/documento."""
    try:
        with zipfile.ZipFile(caminho) as z:
            nomes = [
                n for n in z.namelist()
                if (n.startswith("ppt/slides/slide") or n.startswith("word/document"))
                and n.endswith(".xml")
            ]
            total = 0
            for n in nomes:
                xml = z.read(n).decode("utf-8", "ignore")
                total += len(re.sub(r"<[^>]+>", " ", xml))
            return total
    except Exception:
        return 0


def chars_texto(caminho: Path) -> int:
    try:
        return len(caminho.read_text(encoding="utf-8", errors="ignore"))
    except Exception:
        return 0


def deve_entrar(caminho: Path, disc_dir: Path) -> bool:
    ext = caminho.suffix.lower()
    if ext in DOC_EXT:
        return True
    if ext not in CODE_EXT:
        return False

    rel = caminho.relative_to(disc_dir)
    if any(parte in PROJETOS for parte in rel.parts[:-1]):
        return False
    if any(PADRAO_DIDATICO.search(parte) for parte in rel.parts[:-1]):
        return True
    if disc_dir.name in DISCIPLINAS_CODIGO and len(rel.parts) <= 2:
        return True
    return bool(PADRAO_DIDATICO.search(caminho.stem))


def main() -> int:
    INDICE.mkdir(parents=True, exist_ok=True)
    linhas: list[dict] = []
    ignorados: dict[str, int] = {}

    for sem in SEMESTRES:
        sem_dir = RAIZ / sem
        if not sem_dir.is_dir():
            continue
        for disc_dir in sorted(p for p in sem_dir.iterdir() if p.is_dir()):
            for raiz, dirs, arquivos in os.walk(disc_dir):
                dirs[:] = sorted(d for d in dirs if d not in EXCLUIR_DIRS)
                for nome in sorted(arquivos):
                    caminho = Path(raiz) / nome
                    ext = caminho.suffix.lower()
                    if not deve_entrar(caminho, disc_dir):
                        ignorados[ext or "(sem extensão)"] = ignorados.get(ext or "(sem extensão)", 0) + 1
                        continue

                    if ext == ".pdf":
                        paginas = paginas_pdf(caminho)
                        chars = chars_pdf(caminho)
                    elif ext in {".pptx", ".ppt", ".docx", ".doc"}:
                        paginas = 0
                        chars = chars_office(caminho)
                    else:
                        paginas = 0
                        chars = chars_texto(caminho)

                    destino = destino_de(caminho, disc_dir)
                    status = "ok" if chars >= 50 else "vazio"
                    linhas.append({
                        "disciplina": f"{sem}/{disc_dir.name}",
                        "semestre": sem,
                        "sigla": disc_dir.name,
                        "tipo": ext.lstrip(".") or "bin",
                        "caminho": str(caminho.relative_to(RAIZ)),
                        "paginas": paginas,
                        "chars": chars,
                        "tokens_estimados": chars // 4,
                        "status": status,
                        "destino": str(destino),
                    })

    csv_path = INDICE / "inventario.csv"
    with csv_path.open("w", encoding="utf-8", newline="") as f:
        campos = ["disciplina", "semestre", "sigla", "tipo", "caminho",
                  "paginas", "chars", "tokens_estimados", "status", "destino"]
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
        writer.writerows(linhas)

    por_disc: dict[str, dict] = {}
    for l in linhas:
        d = por_disc.setdefault(l["disciplina"], {"fontes": 0, "tokens": 0,
                                                 "pdfs": 0, "ok": 0, "vazio": 0})
        d["fontes"] += 1
        d["tokens"] += l["tokens_estimados"]
        d["pdfs"] += 1 if l["tipo"] == "pdf" else 0
        d[l["status"]] = d.get(l["status"], 0) + 1

    resumo = {
        "gerado_em": datetime.now(timezone.utc).isoformat(),
        "total_fontes": len(linhas),
        "total_tokens_estimados": sum(l["tokens_estimados"] for l in linhas),
        "disciplinas": len(por_disc),
        "por_disciplina": por_disc,
        "ignorados_por_tipo": dict(sorted(ignorados.items(), key=lambda x: -x[1])),
    }
    (INDICE / "resumo.json").write_text(
        json.dumps(resumo, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"Inventário: {csv_path.relative_to(RAIZ)}")
    print(f"Fontes incluídas: {len(linhas)} | disciplinas: {len(por_disc)}")
    print(f"Tokens estimados: {resumo['total_tokens_estimados']:,}")
    print("Por disciplina:")
    for disc, d in sorted(por_disc.items()):
        print(f"  {disc:<12} fontes={d['fontes']:<4} ~tokens={d['tokens']:<8} vazias={d.get('vazio', 0)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
