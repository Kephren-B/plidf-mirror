# PLIDF — version moderne

Réécriture moderne de [www.plidf.fr](https://www.plidf.fr) (Le plan Île-de-France).

- **Front** : React 18 + Vite + TypeScript
- **Gestionnaire de paquets** : pnpm (`packageManager: pnpm@11.14.0`)
- **Back** : *indéterminé pour l'instant* — les données sont chargées depuis un
  JSON statique via une interface d'accès découplée (prête à être branchée sur
  une vraie API).

## Structure

```
modern/
├─ public/data/plidf_dataset.json   # dataset généré (servi au navigateur)
├─ src/
│  ├─ types.ts                      # modèle de données (contrat API futur)
│  ├─ data/
│  │  ├─ sources.ts                 # interface DatasetSource + source JSON
│  │  └─ dataset.ts                 # hook useDataset (data/loading/error/reload)
│  ├─ pages/Home.tsx                # 1re page : compteurs + liste des lignes
│  ├─ App.tsx / main.tsx / index.css
├─ pnpm-workspace.yaml              # autorise le postinstall d'esbuild
└─ tools/parse_legacy.py            # génère le dataset depuis ../legacy
```

## Commandes

```bash
pnpm install        # dépendances (autorise le build d'esbuild)
pnpm dev            # serveur de dev (http://localhost:5173)
pnpm build          # compilation TS + build de prod (dist/)
pnpm build:data     # régénère public/data/plidf_dataset.json depuis ../legacy
```

> Si pnpm n'est pas sur le PATH, l'utiliser via corepack :
> `corepack pnpm <commande>` (ou `corepack enable pnpm` une fois en admin).

## Données

Le fichier `public/data/plidf_dataset.json` est extrait du miroir statique
`../legacy` (copies `.php.html`). Il contient : `gares`, `lignes`, `projets`,
`communes`, `poles`, plus un bloc `meta.counts`.

Régénération :
```bash
python tools/parse_legacy.py   # exige python + beautifulsoup4 + lxml
```

## Back futur

L'accès aux données passe par l'interface `DatasetSource`
(`src/data/sources.ts`). Aujourd'hui `JsonDatasetSource` lit le JSON statique.
Quand un back sera choisi, il suffira d'ajouter une implémentation (ex.
`ApiDatasetSource`) qui appelle le serveur, sans modifier les pages.
