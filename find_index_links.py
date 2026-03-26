#!/usr/bin/env python3
"""
find_index_links.py
Trouve et note tous les liens pointant vers index.html dans un fichier HTML.
Usage : python find_index_links.py <fichier.html>
"""

import sys
import re
from pathlib import Path


def find_index_links(filepath: str) -> None:
    path = Path(filepath)

    if not path.exists():
        print(f"[ERREUR] Fichier introuvable : {filepath}")
        sys.exit(1)

    content = path.read_text(encoding="utf-8", errors="replace")
    lines = content.splitlines()

    # Regex : attributs href, src, action, data-* contenant index.html
    pattern = re.compile(
        r'(?P<attr>href|src|action|data-[a-z\-]+)\s*=\s*["\'](?P<url>[^"\']*\bindex\.html\b[^"\']*)["\']',
        re.IGNORECASE,
    )

    results = []
    for lineno, line in enumerate(lines, start=1):
        for match in pattern.finditer(line):
            results.append({
                "ligne":   lineno,
                "attribut": match.group("attr"),
                "url":     match.group("url"),
                "contexte": line.strip(),
            })

    # ── Rapport ──────────────────────────────────────────────────────────────
    sep = "─" * 60
    print(f"\n{sep}")
    print(f"  Fichier analysé : {path.name}")
    print(f"  Liens vers index.html trouvés : {len(results)}")
    print(sep)

    if not results:
        print("  Aucun lien trouvé.\n")
        return

    for r in results:
        print(f"\n  Ligne {r['ligne']}  [{r['attribut']}]")
        print(f"    URL      : {r['url']}")
        print(f"    Contexte : {r['contexte'][:100]}{'…' if len(r['contexte']) > 100 else ''}")

    print(f"\n{sep}\n")

    # ── Export optionnel en .txt ──────────────────────────────────────────────
    output_file = path.with_stem(path.stem + "_index_links").with_suffix(".txt")
    with output_file.open("w", encoding="utf-8") as f:
        f.write(f"Fichier : {path.name}\n")
        f.write(f"Liens vers index.html : {len(results)}\n\n")
        for r in results:
            f.write(f"Ligne {r['ligne']} [{r['attribut']}]\n")
            f.write(f"  URL      : {r['url']}\n")
            f.write(f"  Contexte : {r['contexte']}\n\n")

    print(f"  Rapport exporté → {output_file}\n")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage : python find_index_links.py <fichier.html>")
        sys.exit(1)

    find_index_links(sys.argv[1])
