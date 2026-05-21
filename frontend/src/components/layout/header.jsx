import { useNavigate, useLocation } from "react-router-dom";
import { RiMoonLine, RiNotification3Line, RiUserLine } from "react-icons/ri";

// Route yang pakai App Header (bukan landing)
const APP_ROUTES = ["/dashboard", "/journal", "/screening", "/chatbot", "/rekomendasi", "/progress", "/settings", "/profile"];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAppRoute = APP_ROUTES.some((r) => location.pathname.startsWith(r));

  // ── App Header (untuk halaman dalam app) ─────────────────────────────────
  if (isAppRoute) {
    const appNavLinks = [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Screening", path: "/screening" },
      { label: "Journal", path: "/journal" },
    ];

    return (
      <nav className="app-navbar">
        <span className="navbar-logo" onClick={() => navigate("/")}>
          RuangRasa
        </span>
        <div className="app-navbar-links">
          {appNavLinks.map((l) => (
            <button
              key={l.path}
              className={`app-nav-link ${location.pathname.startsWith(l.path) ? "app-nav-link-active" : ""}`}
              onClick={() => navigate(l.path)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="app-navbar-actions">
          <button className="app-nav-icon-btn" title="Dark mode">
            <RiMoonLine />
          </button>
          {/* <button className="app-nav-icon-btn" title="Notifikasi">
            <RiNotification3Line />
          </button> */}
          <button className="app-nav-icon-btn app-nav-profile-btn" onClick={() => navigate("/profile")} title="Profil">
            <RiUserLine />
          </button>
        </div>
      </nav>
    );
  }

  // ── Landing Header (untuk /, /about, /login, /register) ─────────────────
  const links = [
    { key: "home", label: "Fitur" },
    { key: "cara-kerja", label: "Cara Kerja" },
    { key: "about", label: "Tentang Kami" },
  ];

  const handleNav = (key) => {
    if (key === "home") {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById("fitur")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById("fitur")?.scrollIntoView({ behavior: "smooth" });
      }
    } else if (key === "cara-kerja") {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById("cara-kerja")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById("cara-kerja")?.scrollIntoView({ behavior: "smooth" });
      }
    } else if (key === "about") {
      navigate("/about");
    } else if (key === "login") {
      navigate("/login");
    } else if (key === "logo") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getActiveKey = () => {
    if (location.pathname === "/about") return "about";
    if (location.pathname === "/") return "home";
    return "";
  };

  return (
    <nav className="navbar">
      <span className="navbar-logo" onClick={() => handleNav("logo")}>
        RuangRasa
      </span>
      <div className="navbar-links">
        {links.map((l) => (
          <button
            key={l.key}
            className={`nav-link ${getActiveKey() === l.key ? "active" : ""}`}
            onClick={() => handleNav(l.key)}
          >
            {l.label}
          </button>
        ))}
        <button className="nav-link-masuk" onClick={() => handleNav("login")}>
          Masuk
        </button>
      </div>
    </nav>
  );
}
