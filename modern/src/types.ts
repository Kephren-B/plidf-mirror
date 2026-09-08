/**
 * Modèle de données du plan Ile-de-France.
 *
 * Il reflète la structure du dataset généré par `tools/parse_legacy.py`
 * (lui-même produit à partir du miroir statique `../legacy`).
 *
 * Le back étant encore indéterminé, ces types constituent le « contrat »
 * que devra exposer l'API future. Pour l'instant ils sont servis par un
 * JSON statique (voir `src/data/dataset.ts`).
 */

/** Logo / relation d'une ligne (réseau + uid + libellé). */
export interface LineRef {
  uid: string;
  name: string | null;
  network: string | null;
}

/** Station listée dans une ligne / un projet / une commune / un pôle. */
export interface Station {
  gare_uid: string;
  name: string;
  communes: string[];
  lines: LineRef[];
}

export interface Gare {
  type: "gare";
  uid: string;
  name: string;
  kind: string;
  region: string | null;
  lat: string | null;
  lon: string | null;
  communes: string[];
  lines: LineRef[];
  propositions: { uid: string; name: string }[];
  description?: string;
  file: string;
}

/** Base commune aux lignes existantes et aux projets (prolongements). */
export interface LineEntity {
  uid: string;
  name: string;
  mode: string | null;
  stationsCount: string | null;
  len: string | null;
  communes: string[];
  stations: Station[];
  projects: { uid: string; name: string }[];
  relatedProjects?: { uid: string; name: string; desc: string }[];
  subtitle?: string;
  content?: string[];
  description?: string;
  file: string;
}

export type Ligne = LineEntity & { type: "ligne" };
export type Projet = LineEntity & { type: "prol" };

export interface Commune {
  type: "commune";
  uid: string;
  name: string;
  gares: { gare_uid: string; name: string; lines: LineRef[] }[];
  projets: { uid: string; name: string }[];
  file: string;
}

export interface Pole {
  type: "pole";
  uid: string;
  name: string;
  communes: string[];
  lines: LineRef[];
  stations: Station[];
  projets: { uid: string; name: string }[];
  file: string;
}

export interface PlidfDataset {
  meta: {
    source: string;
    generated_from: string;
    files_scanned: number;
    counts: Record<string, number>;
  };
  gares: Gare[];
  lignes: Ligne[];
  projets: Projet[];
  communes: Commune[];
  poles: Pole[];
}

/** Type discriminant commun à toutes les entités. */
export type Entity = Gare | Ligne | Projet | Commune | Pole;
