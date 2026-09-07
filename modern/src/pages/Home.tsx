import { Link } from "react-router-dom";
import { useDataset } from "../data/dataset";
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
  const lignes = [...data.lignes].sort((a, b) => a.name.localeCompare(b.name, "fr"));

  return (
    <section>
      <h1>Le réseau en un coup d’œil</h1>

      <div className="cards">
        <StatCard label="Lignes" value={c.ligne} />
        <StatCard label="Gares / stations" value={c.gare} />
        <StatCard label="Projets" value={c.prol} />
        <StatCard label="Communes" value={c.commune} />
        <StatCard label="Pôles" value={c.pole} />
      </div>

      <h2>Lignes</h2>
      <div className="line-list">
        {lignes.map((l) => (
          <LineCard key={l.uid} line={l} />
        ))}
      </div>
    </section>
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
  return (
    <Link to={`/ligne/${encodeURIComponent(line.uid)}`} className="card line-card">
      <div className="line-row">
        <span className="line-mode">{line.mode ?? "réseau"}</span>
        <h3>{line.name}</h3>
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
