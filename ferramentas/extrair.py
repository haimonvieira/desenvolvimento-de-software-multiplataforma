#!/usr/bin/env python3
"""Extrai o texto das fontes inventariadas para conhecimento/<SEM>/<DISC>/*.md.

Uso:
    python ferramentas/extrair.py                # respeita cache por mtime
    python ferramentas/extrair.py --forcar       # regenera tudo
    python ferramentas/extrair.py --disciplina DSM2/BD2
"""
from __future__ import annotations

import argparse
import csv
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
import zipfile
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
INDICE = RAIZ / "conhecimento" / "_indice"
INVENTARIO = INDICE / "inventario.csv"
LOG = INDICE / "extracao.log"

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"


def log(msg: str) -> None:
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(f"{datetime.now(timezone.utc).isoformat()} {msg}\n")


def limpar(texto: str) -> str:
    texto = texto.replace("\r\n", "\n").replace("\r", "\n")
    texto = re.sub(r"[ \t]+\n", "\n", texto)
    texto = re.sub(r"\n{4,}", "\n\n\n", texto)
    return texto.strip()


def extrair_pdf(caminho: Path) -> str:
    saida = subprocess.run(
        ["pdftotext", "-layout", "-enc", "UTF-8", str(caminho), "-"],
        capture_output=True, text=True, timeout=120,
    )
    if saida.returncode != 0:
        raise RuntimeError(saida.stderr.strip() or "pdftotext falhou")
    paginas = saida.stdout.split("\f")
    partes = []
    for i, pagina in enumerate(paginas, 1):
        pagina = pagina.strip("\n")
        if not pagina.strip() and i == len(paginas):
            continue
        partes.append(f"<!-- page: {i} -->\n\n{pagina}")
    return limpar("\n\n".join(partes))


def extrair_docx(caminho: Path) -> str:
    with zipfile.ZipFile(caminho) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    corpo = root.find(f"{{{W}}}body")
    if corpo is None:
        return ""
    saida: list[str] = []

    def texto_de(el) -> str:
        return "".join(t.text or "" for t in el.iter(f"{{{W}}}t")).strip()

    for el in corpo:
        tag = el.tag.split("}")[-1]
        if tag == "p":
            txt = texto_de(el)
            if not txt:
                continue
            estilo = el.find(f"{{{W}}}pPr/{{{W}}}pStyle")
            if estilo is not None:
                val = (estilo.get(f"{{{W}}}val") or "").lower()
                if val.startswith("heading"):
                    nivel = "".join(c for c in val if c.isdigit()) or "1"
                    txt = "#" * min(int(nivel), 6) + " " + txt
            saida.append(txt)
        elif tag == "tbl":
            for tr in el.findall(f"{{{W}}}tr"):
                celulas = [texto_de(tc) for tc in tr.findall(f"{{{W}}}tc")]
                if any(celulas):
                    saida.append("| " + " | ".join(celulas) + " |")
    return limpar("\n\n".join(saida))


def extrair_pptx(caminho: Path) -> str:
    with zipfile.ZipFile(caminho) as z:
        slides = sorted(
            [n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)],
            key=lambda n: int(re.search(r"(\d+)", n).group(1)),
        )
        partes = []
        for i, nome in enumerate(slides, 1):
            root = ET.fromstring(z.read(nome))
            textos = []
            for par in root.iter(f"{{{A}}}p"):
                txt = "".join(t.text or "" for t in par.iter(f"{{{A}}}t")).strip()
                if txt:
                    textos.append(txt)
            partes.append(f"## Slide {i}\n\n" + "\n".join(textos))
            notas = nome.replace("slides/slide", "notesSlides/notesSlide")
            if notas in z.namelist():
                nroot = ET.fromstring(z.read(notas))
                ntxt = " ".join(
                    t.text or "" for t in nroot.iter(f"{{{A}}}t")
                ).strip()
                if ntxt:
                    partes.append(f"**Notas do slide {i}:** {ntxt}")
    return limpar("\n\n".join(partes))


def extrair_html(caminho: Path) -> str:
    bruto = caminho.read_text(encoding="utf-8", errors="ignore")
    try:
        from bs4 import BeautifulSoup
        sopa = BeautifulSoup(bruto, "html.parser")
        for tag in sopa(["script", "style", "noscript", "svg"]):
            tag.decompose()
        return limpar(sopa.get_text("\n"))
    except Exception:
        return limpar(re.sub(r"<[^>]+>", " ", bruto))


def extrair_texto(caminho: Path, ext: str) -> str:
    bruto = caminho.read_text(encoding="utf-8", errors="ignore")
    if ext == ".sql":
        return f"```sql\n{bruto.strip()}\n```"
    if ext in {".py", ".java", ".c", ".cpp", ".cs", ".js", ".ts", ".ejs", ".php"}:
        lang = {".py": "python", ".java": "java", ".c": "c", ".cpp": "cpp",
                ".cs": "csharp", ".js": "javascript", ".ts": "typescript",
                ".ejs": "html", ".php": "php"}.get(ext, "")
        return f"```{lang}\n{bruto.strip()}\n```"
    return limpar(bruto)


def frontmatter(meta: dict) -> str:
    linhas = ["---"]
    for chave, valor in meta.items():
        linhas.append(f"{chave}: {valor}")
    linhas.append("---")
    return "\n".join(linhas)


def titulo_de(caminho: Path) -> str:
    return caminho.stem.replace("_", " ").replace("-", " ").strip()


def processar(linha: dict, forcar: bool) -> str:
    origem = RAIZ / linha["caminho"]
    destino = RAIZ / linha["destino"]
    ext = "." + linha["tipo"]

    if destino.exists() and not forcar:
        if destino.stat().st_mtime >= origem.stat().st_mtime:
            return "cache"

    destino.parent.mkdir(parents=True, exist_ok=True)

    if ext == ".pdf":
        corpo = extrair_pdf(origem)
    elif ext == ".docx":
        corpo = extrair_docx(origem)
    elif ext == ".pptx":
        corpo = extrair_pptx(origem)
    elif ext in {".html", ".htm"}:
        corpo = extrair_html(origem)
    elif ext in {".md", ".txt", ".sql", ".py", ".java", ".c", ".cpp", ".cs",
                 ".js", ".ts", ".ejs", ".php", ".css"}:
        corpo = extrair_texto(origem, ext)
    else:
        return "ignorado"

    if len(corpo) < 50:
        log(f"VAZIO {linha['caminho']}")
        return "vazio"

    meta = {
        "disciplina": linha["disciplina"],
        "titulo": titulo_de(origem),
        "fonte": linha["caminho"],
        "tipo": linha["tipo"],
        "paginas": linha["paginas"] or "-",
        "extraido_em": datetime.now(timezone.utc).date().isoformat(),
    }
    destino.write_text(frontmatter(meta) + "\n\n" + corpo + "\n", encoding="utf-8")
    return "ok"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--forcar", action="store_true")
    parser.add_argument("--disciplina", help="Ex.: DSM2/BD2")
    args = parser.parse_args()

    if not INVENTARIO.exists():
        print("Rode primeiro: python ferramentas/inventariar.py", file=sys.stderr)
        return 2

    with INVENTARIO.open(encoding="utf-8") as f:
        linhas = list(csv.DictReader(f))

    contagem = {"ok": 0, "cache": 0, "vazio": 0, "ignorado": 0, "erro": 0}
    for linha in linhas:
        if args.disciplina and linha["disciplina"] != args.disciplina:
            continue
        if linha["status"] != "ok":
            contagem["vazio"] += 1
            continue
        try:
            resultado = processar(linha, args.forcar)
        except Exception as exc:  # noqa: BLE001
            contagem["erro"] += 1
            log(f"ERRO {linha['caminho']}: {exc}")
            print(f"ERRO {linha['caminho']}: {exc}", file=sys.stderr)
            continue
        contagem[resultado] = contagem.get(resultado, 0) + 1

    print("Extração concluída:", ", ".join(f"{k}={v}" for k, v in contagem.items()))
    print(f"Log: {LOG.relative_to(RAIZ)}")
    return 1 if contagem["erro"] else 0


if __name__ == "__main__":
    sys.exit(main())
