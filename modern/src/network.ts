/**
 * Classement des lignes par « mode / réseau » (métro, RER, transilien, tram…).
 *
 * Le dataset ne porte pas toujours un champ réseau fiable (le `mode` n'est
 * renseigné que sur certaines pages). On déduit donc le réseau du préfixe de
 * l'UID (m_ = métro, rer_ = RER, tr_ = transilien, t_ = tramway, tg_ =
 * tangentielles, cv_ = cergyval), avec quelques cas particuliers.
 */

import type { Ligne } from "./types";

export type Reseau = string;

/** Cas particuliers (UID -> réseau). */
const OVERRIDES: Record<string, Reseau> = {
  rer_aex: "Autres", // Aéroports express
  rer_pce: "Autres", // Petite ceinture express
  m_ov: "Autres", // Orlyval
  m_v: "Autres", // Liaison Buc - Bougival
  m_forts: "Autres", // Métro des forts (grand projet)
};

/** Ordre d'affichage des groupes. */
export const RESEAUX: Reseau[] = [
  "Métro",
  "RER",
  "Transilien",
  "Tramway",
  "Tangentielle",
  "Cergyval",
  "Autres",
];

function reseauOfPrefix(uid: string): Reseau | null {
  if (uid.startsWith("m_")) return "Métro";
  if (uid.startsWith("rer_")) return "RER";
  if (uid.startsWith("tr_")) return "Transilien";
  if (uid.startsWith("t_")) return "Tramway";
  if (uid.startsWith("tg_")) return "Tangentielle";
  if (uid.startsWith("cv_")) return "Cergyval";
  return null;
}

export function reseauOf(line: Pick<Ligne, "uid">): Reseau {
  return OVERRIDES[line.uid] ?? reseauOfPrefix(line.uid) ?? "Autres";
}

/** Regroupe les lignes par réseau, dans l'ordre de `RESEAUX`. */
export function groupeLignes(lignes: Ligne[]): Array<{ reseau: Reseau; lignes: Ligne[] }> {
  const map = new Map<Reseau, Ligne[]>();
  for (const reseau of RESEAUX) map.set(reseau, []);
  for (const ligne of lignes) {
    map.get(reseauOf(ligne))!.push(ligne);
  }
  return RESEAUX.filter((r) => (map.get(r)?.length ?? 0) > 0).map((reseau) => ({
    reseau,
    lignes: map.get(reseau)!,
  }));
}
