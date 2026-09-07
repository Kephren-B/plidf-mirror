import { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDataset } from "../data/dataset";
import type { LineRef } from "../types";

// Pastille sans dépendre des images par défaut de Leaflet (souvent absentes
// avec les bundlers). La couleur vient du CSS (.gare-dot).
const dotIcon = L.divIcon({
  className: "gare-dot",
  html: '<span class="gare-dot-inner"></span>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface GeoGare {
  uid: string;
  name: string;
  lines: LineRef[];
  lat: number;
  lon: number;
}

export default function Carte() {
  const { data, loading, error, reload } = useDataset();

  const gares = useMemo<GeoGare[]>(() => {
    if (!data) return [];
    const out: GeoGare[] = [];
    for (const g of data.gares) {
      const lat = g.lat ? Number.parseFloat(g.lat) : NaN;
      const lon = g.lon ? Number.parseFloat(g.lon) : NaN;
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        out.push({ uid: g.uid, name: g.name, lines: g.lines, lat, lon });
      }
    }
    return out;
  }, [data]);

  if (loading) return <p className="notice">Chargement des gares…</p>;
  if (error)
    return (
      <div className="notice error">
        <p>Erreur : {error}</p>
        <button onClick={() => void reload()}>Réessayer</button>
      </div>
    );
  if (!data) return <p className="notice">Aucune donnée.</p>;

  return (
    <section>
      <h1>Carte des gares</h1>
      <p className="line-meta">
        {gares.length} gares/stations géolocalisées sur {data.gares.length}.
      </p>
      <div className="map-wrap">
        <MapContainer
          center={[48.85, 2.35]}
          zoom={10}
          scrollWheelZoom
          className="map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {gares.map((g) => (
            <Marker key={g.uid} position={[g.lat, g.lon]} icon={dotIcon}>
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                {g.name}
              </Tooltip>
              <Popup>
                <strong>
                  <Link to={`/gare/${encodeURIComponent(g.uid)}`}>{g.name}</Link>
                </strong>
                {g.lines.length > 0 && (
                  <div className="popup-lines">
                    {g.lines.map((l) => l.name ?? l.uid).join(" · ")}
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
