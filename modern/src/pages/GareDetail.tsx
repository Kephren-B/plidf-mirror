import { Link, useParams } from "react-router-dom";
import { useDataset } from "../data/dataset";
import type { LineRef } from "../types";

export default function GareDetail() {
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
  const gare = data.gares.find((g) => g.uid === key);

  if (!gare) {
    return (
      <p className="notice">
        Gare introuvable (<code>{key}</code>). <Link to="/">Retour à l’accueil</Link>.
      </p>
    );
  }

  const hasGeo = gare.lat && gare.lon;

  return (
    <section>
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">Accueil</Link>
        <span>·</span>
        <Link to="/carte">Carte</Link>
        <span>·</span>
        <span aria-current="page">{gare.name}</span>
      </nav>
      <h1>{gare.kind ? `${gare.kind} ` : ""}{gare.name}</h1>

      <dl className="info-grid">
        {gare.communes.length > 0 && (
          <>
            <dt>Communes</dt>
            <dd>{gare.communes.join(", ")}</dd>
          </>
        )}
        {gare.region && (
          <>
            <dt>Département</dt>
            <dd>{gare.region}</dd>
          </>
        )}
        {hasGeo && (
          <>
            <dt>Coordonnées</dt>
            <dd>
              {gare.lat}, {gare.lon}
            </dd>
          </>
        )}
        <dt>UID</dt>
        <dd>
          <code>{gare.uid}</code>
        </dd>
      </dl>

      <h2>Lignes desservies</h2>
      {gare.lines.length === 0 ? (
        <p className="notice">Aucune ligne listée.</p>
      ) : (
        <div className="corresp">
          {gare.lines.map((ln) => (
            <LineChip key={ln.uid} line={ln} />
          ))}
        </div>
      )}

      {gare.propositions.length > 0 && (
        <>
          <h2>Propositions associées</h2>
          <ul className="proposition-list">
            {gare.propositions.map((p) => (
              <li key={p.uid}>
                <span className="proposition-name">{p.name}</span>
                <code className="proposition-uid">{p.uid}</code>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function LineChip({ line }: { line: LineRef }) {
  if (!line.uid) return null;
  return (
    <Link to={`/ligne/${encodeURIComponent(line.uid)}`} className="corresp-chip">
      {line.name ?? line.uid}
    </Link>
  );
}
