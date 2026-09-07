#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère `modern/public/data/plidf_dataset.json` à partir du miroir statique
`legacy/` (copies .php.html du site www.plidf.fr).

Usage :
    python tools/parse_legacy.py

Notes :
- Seuls les fichiers canoniques (sans '@') sont lus ; les artefacts de crawl
  `?fs=` / `?ps=` sont ignorés.
- Chaque fichier est classé par son URL canonique interne (og:url / canonical)
  et non par son dossier (certains fichiers sont recopiés au mauvais endroit).
- Sortie : un objet JSON {meta, gares, lignes, projets, communes, poles}.
"""

from __future__ import annotations

import json
import re
import sys
from collections import OrderedDict
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.exit("BeautifulSoup requis. Installe : pip install beautifulsoup4 lxml")

ROOT = Path(__file__).resolve().parent.parent.parent   # racine www.plidf.fr
SRC = ROOT / "legacy"                                   # source du miroir
OUT = ROOT / "modern" / "public" / "data" / "plidf_dataset.json"

DIRS = {"gare", "ligne", "commune", "prol", "pole"}


# --------------------------------------------------------------------------- #
# utilitaires
# --------------------------------------------------------------------------- #

def _decode(path: Path) -> str:
    data = path.read_bytes()
    for enc in ("utf-8", "latin-1"):
        try:
            return data.decode(enc)
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="replace")


def load_soup(path: Path):
    try:
        html = _decode(path)
    except Exception:
        return None
    if not html.lstrip().startswith("<"):
        return None
    return BeautifulSoup(html, "lxml")


def clean(t) -> str:
    if not t:
        return ""
    return re.sub(r"\s+", " ", t).strip()


def uid_from_filename(name: str) -> str:
    for ext in (".php.html", ".php", ".html"):
        if name.endswith(ext):
            return name[: -len(ext)]
    return name


def href_info(href):
    if not href:
        return None, None
    href = href.split("#")[0].split("?")[0]
    href = (
        href.replace("http://www.plidf.fr/", "")
        .replace("https://www.plidf.fr/", "")
        .replace("//www.plidf.fr/", "")
        .replace("\\", "/")
    )
    parts = [p for p in href.split("/") if p]
    if not parts:
        return None, None
    base = re.sub(r"\.(php\.html|php|html)$", "", parts[-1])
    dirpart = parts[-2] if len(parts) > 1 else None
    return (dirpart if dirpart in DIRS else None), base


def text_of(node) -> str:
    return clean(node.get_text(" ", strip=True)) if node is not None else ""


def first_text(soup, selector: str) -> str:
    n = soup.select_one(selector)
    return text_of(n) if n is not None else ""


# --------------------------------------------------------------------------- #
# logos de lignes / liens projets
# --------------------------------------------------------------------------- #

def _line_from_anchor(a, last_network):
    img = a.find("img")
    _, uid = href_info(a.get("href"))
    return {
        "uid": uid,
        "name": clean(img.get("title")) if img is not None else None,
        "network": last_network,
    }


def parse_line_logos(container):
    lines, seen, last_network = [], set(), None
    if container is None:
        return lines
    for el in container.find_all(["img", "a"]):
        if el.name == "img":
            cls = el.get("class", [])
            if any(c.startswith("line-logo-network-") for c in cls):
                last_network = clean(el.get("title")) or last_network
        elif el.name == "a" and "line-link" in el.get("class", []):
            if el.find("img") is None:
                continue
            ln = _line_from_anchor(el, last_network)
            if ln["uid"] and ln["uid"] not in seen:
                seen.add(ln["uid"])
                lines.append(ln)
    return lines


def parse_project_links(soup):
    out, seen = [], set()
    for a in soup.select("a.project-link"):
        typ, uid = href_info(a.get("href"))
        if uid and uid not in seen and (typ == "prol" or "/prol/" in (a.get("href") or "")):
            seen.add(uid)
            out.append({"uid": uid, "name": text_of(a) or uid})
    return out


def collect_communes(soup, scope=None):
    names, seen = [], set()
    scope = scope or soup
    for a in scope.select("a[href]"):
        typ, _ = href_info(a.get("href"))
        if typ == "commune":
            names.append(text_of(a))
    for sp in soup.select(".commune-name-span"):
        names.append(text_of(sp))
    uniq = []
    for n in names:
        if n and n not in seen:
            seen.add(n)
            uniq.append(n)
    return uniq


def _station_communes(cell):
    out = []
    if cell is None:
        return out
    for a in cell.select("a[href]"):
        typ, _ = href_info(a.get("href"))
        if typ == "commune":
            out.append(text_of(a))
    return out


def _station_lines(cell):
    if cell is None:
        return []
    lines, seen, last_network = [], set(), None
    for el in cell.find_all(["img", "a"]):
        if el.name == "img":
            cls = el.get("class", [])
            if any(c.startswith("line-logo-network-") for c in cls):
                last_network = clean(el.get("title")) or last_network
        elif el.name == "a" and "line-link" in el.get("class", []):
            if el.find("img") is None:
                continue
            ln = _line_from_anchor(el, last_network)
            if ln["uid"] and ln["uid"] not in seen:
                seen.add(ln["uid"])
                lines.append(ln)
    return lines


def parse_stations_table(soup):
    table = soup.select_one("#stations-table")
    if table is None:
        return []
    rows = []
    for tr in table.select("tbody tr"):
        tds = tr.find_all("td", recursive=False)
        if not tds:
            continue
        name_td = tr.select_one(".station-name-td") or tds[0]
        lines_td = tr.select_one(".station-lines-td") or (tds[1] if len(tds) > 1 else None)
        comm_td = tr.select_one(".station-communes-td") or (tds[2] if len(tds) > 2 else None)
        name_link = name_td.select_one("a[href]") if name_td else None
        gare_uid, name = None, ""
        if name_link:
            typ, u = href_info(name_link.get("href"))
            if typ == "gare":
                gare_uid = u
            name = text_of(name_link) or text_of(name_td)
        else:
            name = text_of(name_td)
        rows.append({
            "gare_uid": gare_uid or name,
            "name": name or (gare_uid or ""),
            "communes": _station_communes(comm_td),
            "lines": _station_lines(lines_td),
        })
    return rows


def infobox_value(soup, key: str) -> str:
    td = soup.select_one(f'td[ib-key="{key}"]')
    return text_of(td) if td is not None else ""


def _infobox_communes(soup):
    td = soup.select_one('td[ib-key="communes"]')
    out = []
    if td is not None:
        for li in td.select("li"):
            out.append(text_of(li))
    return out


# --------------------------------------------------------------------------- #
# parsers par entité
# --------------------------------------------------------------------------- #

def parse_gare(soup, uid, rel):
    h1 = soup.select_one("article h1") or soup.select_one("h1")
    super_em = soup.select_one("em.super-em")
    kind = clean(super_em.get_text(" ", strip=True)) if super_em else ""
    gp = soup.select_one('meta[name="geo.position"]')
    gr = soup.select_one('meta[name="geo.region"]')
    geo_pos = clean(gp.get("content")) if gp is not None else ""
    geo_region = clean(gr.get("content")) if gr is not None else ""
    lat = lon = None
    if ";" in geo_pos:
        a, b = geo_pos.split(";", 1)
        lat, lon = a.strip() or None, b.strip() or None
    lines = parse_line_logos(soup.select_one("#description") or soup)
    if not lines:
        lines = parse_line_logos(soup)
    return {
        "type": "gare", "uid": uid, "name": text_of(h1) or uid, "kind": kind,
        "region": geo_region or None, "lat": lat, "lon": lon,
        "communes": collect_communes(soup), "lines": lines,
        "propositions": parse_project_links(soup), "file": rel,
    }


def parse_ligne(soup, uid, rel, kind):
    h1 = soup.select_one("#top") or soup.select_one("h1")
    name = text_of(h1) or uid
    mode = infobox_value(soup, "mode")
    stations = parse_stations_table(soup)
    communes = _infobox_communes(soup) or [c for st in stations for c in st["communes"]]
    return {
        "type": kind, "uid": uid, "name": name, "mode": mode or None,
        "stationsCount": infobox_value(soup, "stationsCount") or None,
        "len": infobox_value(soup, "len") or None,
        "communes": communes, "stations": stations,
        "projects": parse_project_links(soup), "file": rel,
    }


def parse_commune(soup, uid, rel):
    h1 = soup.select_one("h1")
    name = text_of(h1) or uid
    gares = []
    for st in parse_stations_table(soup):
        gares.append({"gare_uid": st["gare_uid"], "name": st["name"], "lines": st["lines"]})
    return {
        "type": "commune", "uid": uid, "name": name, "gares": gares,
        "projets": parse_project_links(soup), "file": rel,
    }


def parse_pole(soup, uid, rel):
    h1 = soup.select_one("h1")
    lines = parse_line_logos(soup.select_one("#description") or soup)
    if not lines:
        lines = parse_line_logos(soup)
    return {
        "type": "pole", "uid": uid, "name": text_of(h1) or uid,
        "communes": collect_communes(soup), "lines": lines,
        "stations": parse_stations_table(soup),
        "projets": parse_project_links(soup), "file": rel,
    }


# --------------------------------------------------------------------------- #
# orchestration
# --------------------------------------------------------------------------- #

def identify(soup, path: Path):
    cand = None
    og = soup.select_one('meta[property="og:url"]')
    if og is not None:
        cand = og.get("content")
    if not cand:
        can = soup.select_one('link[rel="canonical"]')
        if can is not None:
            cand = can.get("href")
    if cand:
        url = (cand.replace("http://www.plidf.fr/", "")
               .replace("https://www.plidf.fr/", "")
               .replace("//www.plidf.fr/", "").strip("/"))
        parts = [p for p in url.split("/") if p]
        if len(parts) >= 2:
            if parts[-2] in DIRS:
                return parts[-2], re.sub(r"\.php$", "", parts[-1])
            return None, None
    return path.parent.name, uid_from_filename(path.name)


def iter_files():
    for d in sorted(DIRS):
        folder = SRC / d
        if not folder.is_dir():
            continue
        for f in sorted(folder.glob("*.php.html")):
            if "@" in f.name:
                continue
            yield d, f


def main() -> int:
    seen, errors, scanned = OrderedDict(), [], 0
    for _d, f in iter_files():
        soup = load_soup(f)
        scanned += 1
        if soup is None:
            errors.append((str(f), "unparseable"))
            continue
        try:
            kind, uid = identify(soup, f)
            if kind is None:
                continue
            rel = str(f.relative_to(SRC)).replace("\\", "/")
            if (kind, uid) in seen:
                continue
            if kind == "gare":
                seen[(kind, uid)] = parse_gare(soup, uid, rel)
            elif kind in ("ligne", "prol"):
                seen[(kind, uid)] = parse_ligne(soup, uid, rel, kind)
            elif kind == "commune":
                seen[(kind, uid)] = parse_commune(soup, uid, rel)
            elif kind == "pole":
                seen[(kind, uid)] = parse_pole(soup, uid, rel)
        except Exception as e:  # noqa: BLE001
            errors.append((str(f), repr(e)))

    buckets = {"gare": [], "ligne": [], "prol": [], "commune": [], "pole": []}
    for (kind, _u), ent in seen.items():
        buckets[kind].append(ent)
    counts = {k: len(v) for k, v in buckets.items()}

    dataset = {
        "meta": {
            "source": "www.plidf.fr", "generated_from": "legacy/ snapshots",
            "files_scanned": scanned, "counts": counts,
        },
        "gares": buckets["gare"], "lignes": buckets["ligne"],
        "projets": buckets["prol"], "communes": buckets["commune"],
        "poles": buckets["pole"],
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(dataset, fh, ensure_ascii=False, indent=1)

    print("=== Génération du dataset terminée ===")
    print("Fichiers balayés :", scanned)
    print("Entités :", json.dumps(counts, ensure_ascii=False))
    if errors:
        print(f"\n{len(errors)} erreur(s) (échantillon) :")
        for src, msg in errors[:10]:
            print("  -", src, "::", msg)
    print("\nSortie :", OUT)
    return 0


if __name__ == "__main__":
    sys.exit(main())
