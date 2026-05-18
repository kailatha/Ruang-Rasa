import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";

// React Icons - Navigation
import { RiDashboardLine, RiSearchEyeLine, RiBookOpenLine, RiChat3Line, RiSparklingLine } from "react-icons/ri";
import { FiMenu } from "react-icons/fi";
import { RiMenuUnfold2Line } from "react-icons/ri";

const MENU_ITEMS = [
  { icon: <RiDashboardLine />, label: "Dashboard",   path: "/dashboard" },
  { icon: <RiSearchEyeLine />, label: "Screening",   path: "/screening" },
  { icon: <RiBookOpenLine />,  label: "Journal",     path: "/journal" },
  { icon: <RiChat3Line />,     label: "Chatbot",     path: "/chatbot" },
  { icon: <RiSparklingLine />, label: "Rekomendasi", path: "/rekomendasi" },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function LeftSidebar({ entryCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [lastScreening, setLastScreening] =
    useState(null);

  const [screeningCount, setScreeningCount] =
    useState(0);

  useEffect(() => {
    const fetchLastScreening = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/screening/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const json = await res.json();

          const history = json.data || [];

          if (history.length > 0) {
            setLastScreening(history[0]);
          }

          // screening bulan ini
          const now = new Date();

          const thisMonth = history.filter((item) => {
            const d = new Date(item.createdAt);

            return (
              d.getMonth() === now.getMonth() &&
              d.getFullYear() === now.getFullYear()
            );
          });

          setScreeningCount(thisMonth.length);
        }
      } catch (err) {
        console.error(
          "Error fetching screening history:",
          err
        );
      }
    };

    fetchLastScreening();
  }, [location.pathname]);

  // cooldown 7 hari
  const getDaysRemaining = () => {
    if (!lastScreening?.createdAt) return null;

    const lastDate = new Date(
      lastScreening.createdAt
    );

    const nextDate = new Date(lastDate);

    nextDate.setDate(nextDate.getDate() + 7);

    const now = new Date();

    const diff = Math.ceil(
      (nextDate - now) /
        (1000 * 60 * 60 * 24)
    );

    return diff > 0 ? diff : 0;
  };

  const daysRemaining = getDaysRemaining();

  const displayCount =
    entryCount ?? screeningCount;

  return (
    <aside
      className={`journal-sidebar ${
        sidebarCollapsed ? "collapsed" : ""
      }`}
    >
      <button
        className="sidebar-toggle"
        onClick={() =>
          setSidebarCollapsed(
            !sidebarCollapsed
          )
        }
      >
        {sidebarCollapsed ? <FiMenu /> : <RiMenuUnfold2Line />}
      </button>

      {/* MENU */}

      {!sidebarCollapsed && (
        <div className="sidebar-label">
          MENU
        </div>
      )}

      <nav className="sidebar-nav">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`sidebar-item ${
              location.pathname === item.path
                ? "sidebar-item-active"
                : ""
            }`}
            onClick={() =>
              navigate(item.path)
            }
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            {!sidebarCollapsed && (
              <span className="sidebar-text">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* STATISTIK */}

      {!sidebarCollapsed && (
        <>
          <div className="sidebar-label sidebar-label-section">
            STATISTIK
          </div>

          <div className="sidebar-stat-card">
            <div className="stat-card-label">
              Entri bulan ini
            </div>

            <div className="stat-card-value">
              {displayCount}
            </div>

            <div className="stat-card-sub">
              dari 30 hari
            </div>

            <div className="stat-bar">
              <div
                className="stat-bar-fill"
                style={{
                  width: `${Math.min(
                    (displayCount / 30) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* SCREENING */}

          <div className="sidebar-label sidebar-label-section">
            SCREENING TERAKHIR
          </div>

          <div className="sidebar-screening-card">
            {lastScreening ? (
              <>
                <div className="screening-date">
                  {formatDate(
                    lastScreening.createdAt
                  )}
                </div>

                <div className="screening-result">
                  {lastScreening.level}
                </div>

                <div className="screening-note">
                  Skor{" "}
                  {
                    lastScreening.total_score
                  }

                  {daysRemaining !==
                    null &&
                  daysRemaining > 0
                    ? ` · Dapat dilakukan lagi dalam ${daysRemaining} hari`
                    : " · Dapat melakukan screening baru"}
                </div>
              </>
            ) : (
              <>
                <div className="screening-date">
                  Belum ada data
                </div>

                <div className="screening-note">
                  Lakukan screening
                  pertamamu
                </div>
              </>
            )}
          </div>
        </>
      )}
    </aside>
  );
}