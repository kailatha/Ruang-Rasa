import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";

// React Icons - Navigation
import { RiDashboardLine } from "react-icons/ri";
import { RiSearchEyeLine } from "react-icons/ri";
import { RiBookOpenLine } from "react-icons/ri";
import { RiChat3Line } from "react-icons/ri";
import { RiSparklingLine } from "react-icons/ri";

const MENU_ITEMS = [
  { icon: <RiDashboardLine />, label: "Dashboard",   path: "/dashboard" },
  { icon: <RiSearchEyeLine />, label: "Screening",   path: "/screening" },
  { icon: <RiBookOpenLine />,  label: "Journal",     path: "/journal" },
  { icon: <RiChat3Line />,     label: "Chatbot",     path: "/chatbot" },
  { icon: <RiSparklingLine />, label: "Rekomendasi", path: "/rekomendasi" },
];

export default function LeftSidebar({ entryCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="journal-sidebar">
      <div className="sidebar-label">MENU</div>
      <nav className="sidebar-nav">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`sidebar-item ${location.pathname === item.path ? "sidebar-item-active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-label sidebar-label-section">STATISTIK</div>
      <div className="sidebar-stat-card">
        <div className="stat-card-label">Entri bulan ini</div>
        <div className="stat-card-value">{entryCount}</div>
        <div className="stat-card-sub">dari 30 hari</div>
        <div className="stat-bar">
          <div
            className="stat-bar-fill"
            style={{ width: `${Math.min((entryCount / 30) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="sidebar-label sidebar-label-section">SCREENING TERAKHIR</div>
      <div className="sidebar-screening-card">
        <div className="screening-date">27 April 2026</div>
        <div className="screening-result">Terkendali</div>
        <div className="screening-note">Skala 5 · Dapat dilakukan lagi dalam 3 hari</div>
      </div>
    </aside>
  );
}