import { Link, useParams } from "react-router-dom";
import { useDataset } from "../data/dataset";
import { logoSrc } from "../logos";
import type { LineRef } from "../types";

export default function LigneDetail() {
  const { uid = "" } = useParams();
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

  const key = decodeURIComponent(uid);
  const line =
    data.lignes.find((l) => l.uid === key) ??
    data.projets.find((p) => p.uid === key);

  if (!line) {
    return (
      <p className="notice">
        Ligne introuvable (<code>{key}</code>).{" "}
        <Link to="/">Retour à l’accueil</Link>.
      </p>
    );
  }

  const logo = logoSrc(line.uid);

  return (
    <section>
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">Accueil</Link>
        <span>·</span>
        <span aria-current="page">{line.name}</span>
      </nav>
      <div className="detail-heading">
        {logo && <img className="line-logo line-logo-lg" src={logo} alt="" aria-hidden="true" />}
        <h1>{line.name}</h1>
      </div>
      <div className="detail-meta">
        {line.mode && <span className="badge">{line.mode}</span>}
        {line.stationsCount && <span>Stations : {line.stationsCount}</span>}
        {line.len && line.len !== "-" && <span>Longueur : {line.len}</span>}
      </div>

      {line.communes.length > 0 && (
        <p className="line-meta">Communes : {line.communes.join(", ")}</p>
      )}

      <h2>Stations ({line.stations.length})</h2>
      {line.stations.length === 0 ? (
        <p className="notice">
          Aucune station listée pour cette ligne dans le dataset.
        </p>
      ) : (
        <ol className="station-list">
          {line.stations.map((st, i) => (
            <li key={`${st.gare_uid}-${i}`} className="station-item">
              <span className="station-order">{i + 1}</span>
              <div>
                <Link
                  to={`/gare/${encodeURIComponent(st.gare_uid)}`}
                  className="station-name-link"
                >
                  <strong>{st.name}</strong>
                </Link>
                {st.communes.length > 0 && (
                  <span className="station-communes"> — {st.communes.join(", ")}</span>
                )}
                {st.lines.length > 0 && <Corresp lines={st.lines} />}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Corresp({ lines }: { lines: LineRef[] }) {
  return (
    <div className="corresp">
      {lines.map((ln) => (
        <Link
          key={ln.uid}
          to={`/ligne/${encodeURIComponent(ln.uid)}`}
          className="corresp-chip"
          title={ln.name ?? ln.uid}
        >
          {ln.name ?? ln.uid}
        </Link>
      ))}
    </div>
  );
}
