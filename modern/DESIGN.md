# Charte graphique — Le Plan Île-de-France (version moderne)

Charte « PLIDF 2026 » : l'identité du site évolue depuis la version legacy
(miroir `legacy/`) sans la renier — on en garde la matière (teal, encre, esprit
éditorial) et on la structure en un système de design moderne et accessible.

---

## 1. Principes

| Principe | Traduction |
|---|---|
| **Clarté éditoriale** | L'héritage serif (Georgia) reste réservé aux titres ; le corps passe en sans-serif pour le confort de lecture à l'écran. |
| **Réseau & territoire** | Filets teal (hérités des soulignements legacy), puces/pastilles inspirées des plans de lignes, palette évoquant la Seine. |
| **Accessibilité d'abord** | Contrastes AA, focus visible, cibles tactiles ≥ 40 px, contenus lisibles sans couleur. |

## 2. Logotype & pictogramme

- **Mot** : « Le**Plan** » (encre) + « Île-de-France » (teal) — reflet du wordmark legacy.
- **Pictogramme** `Logo.tsx` : pastille teal arrondie + arc blanc de « ligne » terminé par une station ambre. Évoque un tracé de transport.
- Ne pas déformer, ni re-coloriser hors palette.

## 3. Couleurs

Le legacy utilisait 3 couleurs (teal `#3c948b`, encre `#313131`, fond `#e1e3e4`).
La charte les enrichit en échelle tout en gardant les mêmes teintes dominantes.

### Teal — « Seine » (couleur de marque)
| Jeton | Hex | Usage |
|---|---|---|
| `--teal-50` | `#eff8f6` | fonds de puces, hover légers |
| `--teal-100` | `#d9efeb` | fonds de badges |
| `--teal-200` | `#b4dfd7` | bordures douces |
| `--teal-300` | `#86c9bf` | bordures interactives |
| `--teal-400` | `#4fb0a3` | accents décoratifs |
| `--teal-500` | `#26988b` | survol liens secondaires |
| `--teal-600` | `#15877c` | **primaire / liens** |
| `--teal-700` | `#0f6f66` | survol boutons, titres chapeaux |
| `--teal-800` | `#0e5a53` | texte sur fond clair fort |
| `--teal-900` | `#0b4742` | pied de page, contrastes |

### Ambre — « Signal » (accent secondaire, usage rare)
`--amber-400 #f2b23c` · `--amber-500 #e39a1b`
Réservé aux points d'attention (station d'arrivée du pictogramme, marqueurs
d'état). Ne jamais l'utiliser pour du texte de petite taille.

### Neutres
| Jeton | Hex | Usage |
|---|---|---|
| `--ink` | `#23312d` | texte principal (remplace `#313131`) |
| `--muted` | `#5f6b67` | texte secondaire |
| `--faint` | `#87928d` | métadonnées |
| `--bg` | `#f1f4f2` | fond de page |
| `--surface` | `#fbfcfb` | surfaces en appui |
| `--card-bg` | `#ffffff` | cartes |
| `--border` | `#e0e6e3` | bordures |

> Règles : texte principal sur fond clair ≥ 7:1 ; liens teal-700 sur blanc ≥ 4.5:1 ;
> ne pas associer vert/teal et ambre pour porter seuls une information.

## 4. Typographie

| Rôle | Famille | Échelle |
|---|---|---|
| Affichage / titres | Georgia, serif (héritage) | `h1` clamp(2.2→3.4rem) · `h2` 1.9rem · `h3` 1.3rem |
| Corps / UI | system-ui, Segoe UI, Roboto, sans-serif | 1rem / 1.6 · labels 0.875rem |
| Chapeaux (`eyebrow`) | sans-serif, uppercase, 0.75rem, +0.14em | teal-800 |

Titres en graisse normale (héritage éditorial), habillage sémantique préservé.

## 5. Espace, forme & mouvement

- **Échelle d'espace** : 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 px.
- **Rayons** : `--r-sm 6` · `--r-md 10` · `--r-lg 16` · `--r-pill 999`.
- **Ombres** : douces, 1-2 niveaux (`--shadow-sm/md`).
- **Mouvement** : 140–220 ms, easing `cubic-bezier(.2,.7,.3,1)`, réservé au retour visuel (hover, focus, apparitions) — jamais gênant.

## 6. Composants

| Composant | Règle |
|---|---|
| En-tête | sticky, surface translucide + blur, wordmark + picto, nav uppercase à filet actif teal |
| Boutons | pill ; primaire teal-600/blanc ; fantôme bordure teal ; focus visible 3px |
| Cartes | fond blanc, rayon lg, ombre douce, hover : élévation + bordure teal |
| Cartes de ligne | pastille de mode (réseau) + nom + compteur de stations |
| Puces de correspondance | pill teal-50/bordure, hover teal plein |
| Listes de stations | numéro d'ordre serif teal + lignes secondaires muted |
| Détail gare | grille d'infos (dt/dd), puces de lignes, propositions |
| Carte Leaflet | marqueurs = pastilles teal à liseré blanc (cohérents avec la charte) |

## 7. UX / accessibilité (non négociable)

- `:focus-visible` visible sur tous les éléments interactifs.
- Zone de clic ≥ 40 px (navigation, boutons, puces).
- Contenu non porté par la couleur seule ; `aria-label` sur les navigations.
- Conteneur max ~1160 px, grilles fluides (responsive), texte jamais en colonnes étroites < 45 caractères.
- États de chargement/erreur explicites (retry sur erreur).

## 8. Évolution depuis la legacy — ce qu'on garde / transforme

| Legacy | Moderne |
|---|---|
| Teal `#3c948b` seul | Échelle teal complète (même teinte dominante) |
| Encre `#313131` | `#23312d` (contraste préservé) |
| Body serif 15px | Corps sans-serif 16px (lisibilité) |
| Serif pour tout | Serif réservé aux titres/affichage |
| Filets teal 3-4px | Repris en filets d'onglet actif & soulignés de section |
| Menu uppercase borduré | Nav uppercase à filet actif, moderne |
| Pas de logo | Pictogramme arc + station |
