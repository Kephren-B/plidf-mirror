import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import LigneDetail from "./pages/LigneDetail";
import GareDetail from "./pages/GareDetail";
import Carte from "./pages/Carte";
import Logo from "./components/Logo";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="container header-inner">
            <Link to="/" className="brand" aria-label="Le Plan Île-de-France — accueil">
              <Logo />
              <span className="brand-wordmark">
                <span className="brand-l1">
                  Le<em>Plan</em>
                </span>
                <span className="brand-l2">Île-de-France</span>
              </span>
            </Link>
            <nav className="app-nav" aria-label="Navigation principale">
              <NavLink to="/" end>
                Accueil
              </NavLink>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/carte">Carte</NavLink>
            </nav>
          </div>
        </header>

        <main className="app-main container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:uid" element={<BlogArticle />} />
            <Route path="/ligne/:uid" element={<LigneDetail />} />
            <Route path="/gare/:uid" element={<GareDetail />} />
            <Route path="/carte" element={<Carte />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container footer-inner">
            <Link to="/" className="footer-brand">
              <Logo size={26} />
              <span>Le Plan Île-de-France</span>
            </Link>
            <span>Données extraites du miroir legacy · un blog transports en commun</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
