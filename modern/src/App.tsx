import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LigneDetail from "./pages/LigneDetail";
import GareDetail from "./pages/GareDetail";
import Carte from "./pages/Carte";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="brand">
            <span className="brand-main">
              Le<span>Plan</span>
            </span>
            <span className="brand-sub">Ile-de-France</span>
          </div>
          <nav className="app-nav">
            <NavLink to="/" end>
              Accueil
            </NavLink>
            <NavLink to="/carte">Carte des gares</NavLink>
          </nav>
          <p className="tagline">
            Une initiative citoyenne pour l'amélioration des transports en commun.
          </p>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ligne/:uid" element={<LigneDetail />} />
            <Route path="/gare/:uid" element={<GareDetail />} />
            <Route path="/carte" element={<Carte />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <footer className="app-footer">
          Version moderne — données extraites du miroir legacy.
        </footer>
      </div>
    </BrowserRouter>
  );
}
