import type { PlidfDataset } from "../types";

/**
 * Le back est encore indéterminé : on découple donc l'accès aux données
 * derrière une interface `DatasetSource`. Aujourd'hui on charge un JSON
 * statique (servi par le navigateur via fetch) ; demain on pourra fournir
 * une implémentation qui appelle une vraie API sans toucher aux pages.
 */
export interface DatasetSource {
  load(): Promise<PlidfDataset>;
}

/**
 * Source actuelle : un fichier JSON statique dans `public/data/`.
 * Généré depuis le miroir legacy avec `npm run build:data`.
 */
export class JsonDatasetSource implements DatasetSource {
  constructor(private readonly url = "/data/plidf_dataset.json") {}

  async load(): Promise<PlidfDataset> {
    const res = await fetch(this.url);
    if (!res.ok) {
      throw new Error(`Impossible de charger le dataset (${this.url}): ${res.status}`);
    }
    return (await res.json()) as PlidfDataset;
  }
}

/** Source par défaut. À remplacer par une source API quand le back existera. */
export const defaultSource: DatasetSource = new JsonDatasetSource();
