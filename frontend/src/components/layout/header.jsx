import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

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
          const el = document.getElementById("fitur");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.getElementById("fitur");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else if (key === "cara-kerja") {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById("cara-kerja");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.getElementById("cara-kerja");
        if (el) el.scrollIntoView({ behavior: "smooth" });
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
        <button className="nav-link-masuk" onClick={() => handleNav("login")}>Masuk</button>
      </div>
    </nav>
  );
}
