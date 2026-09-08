import { Link, useParams } from "react-router-dom";
import { useDataset } from "../data/dataset";
import { reseauOf } from "../network";
import { logoSrc } from "../logos";

export default function BlogArticle() {
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
  const line = data.lignes.find((l) => l.uid === key);

  if (!line) {
    return (
      <p className="notice">
        Article introuvable (<code>{key}</code>). <Link to="/blog">Retour au blog</Link>.
      </p>
    );
  }

  const reseau = reseauOf(line);
  const n = line.stations.length;
  const hasIntro = !!line.subtitle;
  const hasProse = (line.content?.length ?? 0) > 0 || !!line.description;
  const hasProjets = (line.relatedProjects?.length ?? 0) > 0;

  const sections = [
    { id: "presentation", label: "Présentation" },
    { id: "stations", label: `Stations (${n})` },
    ...(hasProjets ? [{ id: "projets", label: "Projets associés" }] : []),
    { id: "liens", label: "Liens et fiches" },
  ];

  return (
    <article className="wiki">
      <div className="wiki-toolbar">
        <nav aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link> <span>/</span> <Link to="/blog">Blog</Link>{" "}
          <span>/</span> <span aria-current="page">{line.name}</span>
        </nav>
        <div className="wiki-tabs" aria-hidden="true">
          <span className="active">Article</span>
          <span>Discuter</span>
          <span>Voir</span>
          <span>Historique</span>
        </div>
      </div>

      <header className="wiki-head">
        <h1>{line.name}</h1>
        <p className="wiki-sub">
          {reseau} · article du blog « Le plan Île-de-France »
        </p>
      </header>

      {hasIntro && <p className="wiki-accroche">{line.subtitle}</p>}

      <div className="wiki-grid">
        <aside className="infobox">
          <header className="infobox-head">
            {logoSrc(line.uid) && (
              <img className="line-logo" src={logoSrc(line.uid)!} alt="" aria-hidden="true" />
            )}
            <strong>{line.name}</strong>
          </header>
          <dl className="infobox-body">
            <div>
              <dt>Réseau</dt>
              <dd>{reseau}</dd>
            </div>
            {line.mode && (
              <div>
                <dt>Mode</dt>
                <dd>{line.mode}</dd>
              </div>
            )}
            <div>
              <dt>Stations</dt>
              <dd>{n}</dd>
            </div>
            <div>
              <dt>Communes</dt>
              <dd>{line.communes.length > 0 ? line.communes.length : "—"}</dd>
            </div>
            {line.uid && (
              <div>
                <dt>Identifiant</dt>
                <dd>
                  <code>{line.uid}</code>
                </dd>
              </div>
            )}
          </dl>
        </aside>

        <div className="wiki-content">
          <nav className="toc" aria-label="Sommaire">
            <div className="toc-title">Sommaire</div>
            <ol>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.label}</a>
                </li>
              ))}
            </ol>
          </nav>

          {hasProse && (
            <section id="presentation" className="wiki-section">
              <h2>Présentation</h2>
              {line.content && line.content.length > 0 ? (
                line.content.map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p>{line.description}</p>
              )}
            </section>
          )}

          <section id="stations" className="wiki-section">
            <h2>Stations de la ligne</h2>
            {n === 0 ? (
              <p>
                Aucune station n’est encore listée pour cette ligne dans le dataset.
              </p>
            ) : (
              <ol className="wiki-stations">
                {line.stations.map((st, i) => (
                  <li key={`${st.gare_uid}-${i}`}>
                    <Link to={`/gare/${encodeURIComponent(st.gare_uid)}`}>
                      {st.name}
                    </Link>
                    {st.communes.length > 0 && (
                      <span className="wiki-station-communes">
                        {" "}
                        ({st.communes.join(", ")})
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>

          {hasProjets && (
            <section id="projets" className="wiki-section">
              <h2>Projets associés</h2>
              <dl className="wiki-projets">
                {line.relatedProjects!.map((p) => (
                  <div key={p.uid} className="wiki-projet">
                    <dt>{p.name}</dt>
                    {p.desc && <dd>{p.desc}</dd>}
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section id="liens" className="wiki-section">
            <h2>Liens et fiches</h2>
            <ul className="wiki-liens">
              <li>
                Fiche technique détaillée :{" "}
                <Link to={`/ligne/${encodeURIComponent(line.uid)}`}>{line.name}</Link>
              </li>
              <li>
                Index du blog : <Link to="/blog">toutes les lignes</Link>
              </li>
            </ul>
          </section>

          <p className="wiki-footnote">
            Article généré depuis les données du miroir legacy — il s’agit d’une
            page de blog d’information, non d’un document officiel.
          </p>
        </div>
      </div>
    </article>
  );
}
