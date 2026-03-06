# PLIDF Mirror

[![GitHub Pages](https://img.shields.io/github/deployments/Kephren-B/plidf-mirror/github-pages?label=GitHub%20Pages\&logo=github)](https://kephren-b.github.io/plidf-mirror/)

Ce dépôt contient un **miroir du site [PLIDF](http://www.plidf.fr)**, publié via GitHub Pages. Le site en ligne est stable sur la branche `main`. La branche `dev` est réservée pour des modifications exceptionnelles.

---

## Branches

* **`main`** : Branche stable, utilisée pour GitHub Pages. Tout changement doit être testé avant d’y être mergé.
* **`dev`** : Branche de développement pour modifications expérimentales ou correctifs ponctuels. Ne jamais publier directement depuis `dev`.

---

## Mise à jour du site

1. Créer une branche depuis `dev` pour toute modification.
2. Tester les changements localement (ouvrir `index.html` dans un navigateur).
3. Faire un merge vers `main` une fois prêt pour la mise en ligne.
4. GitHub Pages publiera automatiquement le contenu de `main`.

---

## Structure du dépôt

* `www.plidf.fr/` : pages HTML, CSS, JS, images et médias du site.
* `hts-cache/` : cache interne du miroir (non utilisé pour GitHub Pages).
* `index.html` : page d’accueil miroir.
* Autres dossiers (`medias/`, `ligne/`, `commune/`) : ressources et pages spécifiques.

---

## GitHub Pages

Le site est disponible ici : [https://kephren-b.github.io/plidf-mirror/](https://kephren-b.github.io/plidf-mirror/)

---

## Licence et utilisation

Le contenu reste la propriété de [plidf.fr](http://www.plidf.fr). Ce dépôt est destiné à **l’hébergement via GitHub Pages et la sauvegarde personnelle**. Toute réutilisation doit respecter les droits du site original.
