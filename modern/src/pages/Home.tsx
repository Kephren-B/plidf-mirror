import { Link } from "react-router-dom";
import { useDataset } from "../data/dataset";
import { compareLineNames, displayName, groupeLignes } from "../network";
import { logoSrc } from "../logos";
import type { Ligne } from "../types";

export default function Home() {
  const { data, loading, error, reload } = useDataset();

  if (loading) {
    return <p className="notice">Chargement du dataset…</p>;
  }
  if (error) {
    return (
      <div className="notice error">
        <p>Erreur : {error}</p>
        <button onClick={() => void reload()}>Réessayer</button>
      </div>
    );
  }
  if (!data) {
    return <p className="notice">Aucune donnée.</p>;
  }

  const c = data.meta.counts;
  const lignes = [...data.lignes].sort((a, b) =>
    compareLineNames({ name: displayName(a) }, { name: displayName(b) })
  );
  const groupes = groupeLignes(lignes);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Blog · Transports en commun</p>
        <h1>
          Le réseau,
          <br />
          <span className="hero-accent">en un coup d’œil.</span>
        </h1>
        <p className="hero-sub">
          Lignes, gares, projets d’extension : une vue d’ensemble du plan
          francilien pour imaginer les transports de demain.
        </p>
        <div className="hero-actions">
          <Link to="/carte" className="btn btn-primary">
            Explorer la carte
          </Link>
          <a href="#lignes" className="btn btn-ghost">
            Parcourir les lignes
          </a>
        </div>
      </section>

      <section className="stats" aria-label="Chiffres clés">
        <StatCard label="Lignes" value={c.ligne} />
        <StatCard label="Gares / stations" value={c.gare} />
        <StatCard label="Projets" value={c.prol} />
        <StatCard label="Communes" value={c.commune} />
        <StatCard label="Pôles" value={c.pole} />
      </section>

      <section id="lignes">
        <div className="section-head">
          <p className="eyebrow">Le réseau</p>
          <h2>Lignes par mode</h2>
        </div>
        {groupes.map(({ reseau, lignes }) => (
          <div key={reseau} className="reseau-group">
            <h3 className="reseau-title">
              <span>{reseau}</span>
              <span className="reseau-count">{lignes.length}</span>
            </h3>
            <div className="line-list">
              {lignes.map((l) => (
                <LineCard key={l.uid} line={l} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="card stat">
      <span className="stat-value">{value ?? "–"}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function LineCard({ line }: { line: Ligne }) {
  const n = line.stations.length;
  const src = logoSrc(line.uid);
  return (
    <Link to={`/ligne/${encodeURIComponent(line.uid)}`} className="card line-card">
      <div className="line-row">
        {src && <img className="line-logo" src={src} alt="" aria-hidden="true" />}
        <h3>{displayName(line)}</h3>
        <span className="line-count">{n > 0 ? `${n} stations` : "—"}</span>
      </div>
      <p className="line-meta">
        {line.communes.length > 0
          ? line.communes.slice(0, 6).join(", ") + (line.communes.length > 6 ? "…" : "")
          : "Communes non renseignées"}
      </p>
    </Link>
  );
}
