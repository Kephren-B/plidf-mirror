/**
 * Chemin des logos de lignes SVG.
 *
 * Les fichiers sont servis depuis `public/logos/` (copiés du miroir legacy
 * `legacy/medias/logos/`). Les noms legacy ne suivent pas toujours l'UID de
 * la ligne (RER/Transilien/Tramway en particulier) — ce module fait le lien.
 */
export const LOGOS_URL = "/logos";

/** URL du logo réseau (ex. « Métro », « RER ») ou undefined. */
export function logoSrc(uid: string): string | undefined {
  if (uid.startsWith("cv_") || uid.startsWith("m_") || uid.startsWith("tg_")) {
    return `${LOGOS_URL}/${uid}.svg`;
  }
  if (uid.startsWith("rer_")) {
    return `${LOGOS_URL}/rer_${uid.slice(4).toUpperCase()}.svg`;
  }
  if (uid.startsWith("tr_")) {
    return `${LOGOS_URL}/transilien_${uid.slice(3).toUpperCase()}.svg`;
  }
  if (uid.startsWith("t_")) {
    return `${LOGOS_URL}/tram_${uid.slice(2)}.svg`;
  }
  return undefined;
}
