import { Link } from "react-router-dom";
import { useDataset } from "../data/dataset";
import { compareLineNames, displayName, groupeLignes } from "../network";
import { logoSrc } from "../logos";

export default function Blog() {
  const { data, loading, error, reload } = useDataset();

  if (loading) return <p className="notice">Chargement…</p>;
  if (error)
    return (
      <div className="notice error">
        <p>Erreur : {error}</p>
        <button onClick={() => void reload()}>Réessayer</button>
      </div>
    );
  if (!data) return <p className="notice">Aucune donnée.</p>;

  const groupes = groupeLignes(
    [...data.lignes].sort((a, b) =>
      compareLineNames(
        { name: displayName(a) },
        { name: displayName(b) }
      )
    )
  );

  return (
    <section>
      <p className="eyebrow">Blog</p>
      <h1>Le blog du réseau</h1>
      <p className="hero-sub">
        Une série d’articles consacrés aux lignes — grandes radiales, tangentielles
        et projets — qui dessinent les transports en Île-de-France.
      </p>

      {groupes.map(({ reseau, lignes }) => (
        <div key={reseau} className="reseau-group">
          <h3 className="reseau-title">
            <span>{reseau}</span>
            <span className="reseau-count">{lignes.length}</span>
          </h3>
          <div className="blog-list">
            {lignes.map((l) => (
              <Link
                key={l.uid}
                to={`/blog/${encodeURIComponent(l.uid)}`}
                className="card blog-card"
              >
                <div className="blog-card-head">
                  {logoSrc(l.uid) && (
                    <img className="line-logo" src={logoSrc(l.uid)!} alt="" aria-hidden="true" />
                  )}
                  <h3>{displayName(l)}</h3>
                </div>
                <p className="line-meta blog-excerpt">
                  {l.description && l.description.length > 0
                    ? l.description
                    : `${l.stations.length > 0 ? l.stations.length + " stations" : "Pas encore de stations listées"} · ${l.communes.length} communes`}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
