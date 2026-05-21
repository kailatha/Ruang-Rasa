import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/sidebar";
import "@/components/layout/sidebar.css";
import "./page.css";

import {
  RiEmotionHappyLine,
  RiEmotionNormalLine,
  RiEmotionUnhappyLine,
  RiEmotionLine,
  RiEmotionSadLine,
  RiBookOpenLine,
  RiSearchEyeLine,
  RiPlayCircleLine,
} from "react-icons/ri";

const MOOD_ICONS = {
  Senang: <RiEmotionHappyLine />,
  Netral: <RiEmotionNormalLine />,
  Sedih: <RiEmotionUnhappyLine />,
  Marah: <RiEmotionLine />,
  Stress: <RiEmotionSadLine />,
};

const MOOD_CLASS = {
  Senang: "mood-senang",
  Netral: "mood-netral",
  Sedih: "mood-sedih",
  Marah: "mood-marah",
  Stress: "mood-stress",
};

const SENTIMENT_CLASS = {
  Positif: "sentiment-positive",
  Negatif: "sentiment-negative",
  Netral: "sentiment-neutral",
};

function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffHours < 24) return `Hari ini, ${timeStr}`;
  if (diffHours < 48) return `Kemarin, ${timeStr}`;

  return `${date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  })}, ${timeStr}`;
}

function getGreeting() {
  const h = new Date().getHours();

  if (h < 12) return "Selamat pagi";
  if (h < 17) return "Selamat siang";

  return "Selamat malam";
}

function formatDateLong(date = new Date()) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// buat yt
function getYoutubeId(url) {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;

  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const AUDIO_PICKS = [
  {
    title: "Forest Sounds",
    url: "https://youtu.be/xNN7iTA57jM?si=ory1n4yqtvf8K0Pk",
    type: "AMBIENCE",
  },
  {
    title: "Lo-fi Jazz Cafe",
    url: "https://youtu.be/oGtH8v0qVBc?si=OeEFkyHy_fwNgN5F",
    type: "AMBIENCE",
  },
  {
    title: "Soft Melodies",
    url: "https://youtu.be/OxqooRcaw8w?si=X_zIlgceABRlCEMM",
    type: "PLAYLIST",
  },
];

function StatCard({ value, label, badge, badgeClass }) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-value">{value}</div>
      <div className="db-stat-label">{label}</div>

      {badge && (
        <span className={`db-stat-badge ${badgeClass}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

// jurnal
function JournalCard({ entry }) {
  const moodIcon = MOOD_ICONS[entry.mood];

  return (
    <div className="db-journal-card">
      <div className="db-journal-card-header">
        <span className="db-journal-time">
          {formatRelativeTime(entry.createdAt)}
        </span>

        <span
          className={`db-mood-badge ${
            MOOD_CLASS[entry.mood] || "mood-netral"
          }`}
        >
          {moodIcon} {entry.mood}
        </span>
      </div>

      <p className="db-journal-content">
        "{entry.content}"
      </p>

      <div className="db-journal-footer">
        {entry.sentiment && (
          <span
            className={`db-sentiment-chip ${
              SENTIMENT_CLASS[entry.sentiment.label] ||
              "sentiment-neutral"
            }`}
          >
            {entry.sentiment.label} {entry.sentiment.score}%
          </span>
        )}

        {entry.emotion && (
          <span className="db-emotion-chip">
            {entry.emotion}
          </span>
        )}
      </div>
    </div>
  );
}

// grafik mingguan
function WeeklyChart({ data }) {
  const max = Math.max(...data.map((d) => d.score), 1);

  return (
    <div className="db-chart-bars">
      {data.map((d, i) => (
        <div key={i} className="db-chart-col">
          <div className="db-bar-wrap">
            <div
              className={`db-bar ${
                d.isHighest ? "db-bar-highlight" : ""
              }`}
              style={{
                height: `${(d.score / max) * 100}%`,
              }}
            />
          </div>

          <span className="db-bar-label">
            {DAY_LABELS[d.day]}
          </span>
        </div>
      ))}
    </div>
  );
}

// MAIN PAGE

export default function DashboardPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("User");
  const [journalEntries, setJournalEntries] = useState([]);
  const [screeningHistory, setScreeningHistory] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    streak: 0,
    journalCount: 0,
    positiveMoodPct: 0,
    screeningCount: 0,
  });

  const [chartMode, setChartMode] = useState("week"); // day, week, month

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const base = import.meta.env.VITE_API_URL;

      try {
        // profil
        const profileRes = await fetch(`${base}/auth/me`, {
          headers,
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();

          setUserName(
            profileData.data?.name ||
              profileData.name ||
              profileData.data?.username ||
              "User"
          );
        }

        // jurnal
        const journalRes = await fetch(`${base}/journal`, {
          headers,
        });

        let entries = [];

        if (journalRes.ok) {
          const jd = await journalRes.json();

          entries = jd.entries || jd.data || jd || [];

          setJournalEntries(entries);
        }

        // screening history
        const screenRes = await fetch(
          `${base}/screening/history`,
          { headers }
        );

        let history = [];

        if (screenRes.ok) {
          const sd = await screenRes.json();

          history = sd.data || sd || [];

          setScreeningHistory(history);

          // rekomendasi dari AI screening terbaru
          if (history.length > 0) {
            const latest = history[0];

            const aiRecommendations = [];

            // recommendation dari AI
            if (latest.recommendation) {
              aiRecommendations.push({
                title: "Rekomendasi AI",
                description: latest.recommendation,
                duration: latest.level || "AI",
              });
            }

            // activity dari AI
            if (latest.activity) {
              aiRecommendations.push({
                title: "Aktivitas Disarankan",
                description: latest.activity,
                duration: "Self Care",
              });
            }

            setRecommendations(aiRecommendations);
          }
        }

        // stats
        const now = new Date();

        const thisMonth = entries.filter((e) => {
          const d = new Date(e.createdAt);

          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        });

        // streak
        const daySet = new Set(
          entries.map((e) =>
            new Date(e.createdAt).toDateString()
          )
        );

        let streak = 0;

        for (let i = 0; i < 365; i++) {
          const d = new Date();

          d.setDate(d.getDate() - i);

          if (daySet.has(d.toDateString())) streak++;
          else break;
        }

        // positive mood minggu ini
        const weekAgo = new Date();

        weekAgo.setDate(weekAgo.getDate() - 7);

        const weekEntries = entries.filter(
          (e) => new Date(e.createdAt) >= weekAgo
        );

        const positiveMoods = weekEntries.filter(
          (e) =>
            e.sentiment?.label === "Positif" ||
            e.mood === "Senang"
        ).length;

        const positivePct = weekEntries.length
          ? Math.round(
              (positiveMoods / weekEntries.length) * 100
            )
          : 0;

        const screeningThisMonth = history.filter((h) => {
          const d = new Date(h.createdAt);

          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        });

        setStats({
          streak,
          journalCount: thisMonth.length,
          positiveMoodPct: positivePct,
          screeningCount: screeningThisMonth.length,
        });

        // BUAT GRAFIK MINGGUAN
        const last7 = [];

        for (let i = 6; i >= 0; i--) {
          const d = new Date();

          d.setDate(d.getDate() - i);

          const dayEntries = entries.filter(
            (e) =>
              new Date(e.createdAt).toDateString() ===
              d.toDateString()
          );

          // score = avg sentiment or mood mapping
          const moodScore = (mood) =>
            ({
              Senang: 9,
              Netral: 6,
              Terkendali: 6,
              Sedih: 4,
              Marah: 3,
              Stress: 3,
            }[mood] || 5);

          const avgScore = dayEntries.length
            ? Math.round(
                dayEntries.reduce(
                  (acc, e) =>
                    acc +
                    (e.sentiment?.score
                      ? e.sentiment.score / 10
                      : moodScore(e.mood)),
                  0
                ) / dayEntries.length
              )
            : 0;

          last7.push({
            day: d.getDay(),
            score: avgScore,
            date: d,
          });
        }

        const maxScore = Math.max(
          ...last7.map((d) => d.score)
        );

        last7.forEach(
          (d) =>
            (d.isHighest =
              d.score === maxScore && d.score > 0)
        );

        setWeeklyData(last7);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  // buat STREAK
  const motivationMsg =
    stats.streak >= 4
      ? `Kamu mencapai target selama ${stats.streak} hari ini. Selalu jalani hidup dengan tersenyum!`
      : stats.streak > 0
      ? `Kamu sudah konsisten ${stats.streak} hari berturut-turut. Terus semangat!`
      : "Mulai perjalananmu hari ini. Tulis jurnal pertamamu!";

  // kalau belum screening
  const displayRecos =
    recommendations.length > 0
      ? recommendations
      : [
          {
            title: "Belum ada rekomendasi AI",
            description:
              "Lakukan screening terlebih dahulu untuk mendapatkan rekomendasi personal.",
            duration: "templet",
          },
        ];

  return (
    <div className="db-layout">
      <Sidebar entryCount={stats.journalCount} />

      <div className="db-content">
        <main className="db-main fade-up">
          {/* ── greeting ── */}
          <div className="db-greeting">
            <h1 className="db-greeting-title">
              {getGreeting()},{" "}
              <span className="db-greeting-name">
                {userName}
              </span>
            </h1>

            <p className="db-greeting-date">
              {formatDateLong()}
            </p>
          </div>

          {/* ── hero ── */}
          <div className="db-hero-cards">
            <div
              className="db-hero-card db-hero-mood"
              onClick={() => navigate("/journal")}
            >
              <div className="db-hero-icon">
                <RiEmotionHappyLine />
              </div>

              <h3 className="db-hero-card-title">
                Mood Tracker
              </h3>

              <p className="db-hero-card-sub">
                Catat mood kalian di sini
              </p>
            </div>

            <div
              className="db-hero-card db-hero-screening"
              onClick={() => navigate("/screening")}
            >
              <div className="db-hero-icon">
                <RiSearchEyeLine />
              </div>

              <h3 className="db-hero-card-title">
                Screening Kesehatan Mental
              </h3>

              <p className="db-hero-card-sub">
                Lakukan screening secara berkala
              </p>
            </div>

            <div
              className="db-hero-card db-hero-journal"
              onClick={() => navigate("/journal")}
            >
              <div className="db-hero-icon">
                <RiBookOpenLine />
              </div>

              <h3 className="db-hero-card-title">
                Mulai Membuat Jurnal
              </h3>

              <p className="db-hero-card-sub">
                Tuangkan pikiranmu dalam kanvas digital
              </p>
            </div>
          </div>

          {/* ── stats ── */}
          <div className="db-stats-row">
            <StatCard
              value={stats.streak}
              label="Hari streak"
              badge="Aktif"
              badgeClass="badge-active"
            />

            <StatCard
              value={stats.journalCount}
              label="Jurnal bulan ini"
              badge={`↑ +${Math.min(
                stats.journalCount,
                3
              )}`}
              badgeClass="badge-up"
            />

            <StatCard
              value={`${stats.positiveMoodPct}%`}
              label="Mood positif minggu ini"
              badge={
                stats.positiveMoodPct > 0
                  ? `↑ dari ${Math.max(
                      0,
                      stats.positiveMoodPct - 14
                    )}%`
                  : null
              }
              badgeClass="badge-up"
            />

            <StatCard
              value={`${stats.screeningCount}x`}
              label="Screening selesai"
              badge="✓ Terkini"
              badgeClass="badge-done"
            />
          </div>

          {/* ── progress mingguan ── */}
          <section className="db-section">
            <div className="db-section-header">
              <div>
                <h2 className="db-section-title">
                  Progress Mingguan
                </h2>

                <p className="db-section-sub">
                  Skor emosional harian
                </p>
              </div>

              <div className="db-chart-tabs">
                {[
                  ["month", "Bulan"],
                  ["week", "7 Hari Terakhir"],
                  ["day", "Hari ini"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className={`db-chart-tab ${
                      chartMode === key
                        ? "db-chart-tab-active"
                        : ""
                    }`}
                    onClick={() => setChartMode(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="db-loading">
                Memuat data...
              </div>
            ) : (
              <WeeklyChart data={weeklyData} />
            )}

            <div className="db-motivation-bar">
              {motivationMsg}
            </div>
          </section>

          <div className="db-bottom-grid">
            {/* jurnal terbaru */}
            <section className="db-section db-journal-section">
              <div className="db-section-header">
                <h2 className="db-section-title">
                  Jurnal Terbaru
                </h2>

                <button
                  className="db-see-all"
                  onClick={() => navigate("/journal")}
                >
                  Lihat semua
                </button>
              </div>

              {loading ? (
                <div className="db-loading">
                  Memuat...
                </div>
              ) : journalEntries.length === 0 ? (
                <div className="db-empty">
                  Belum ada jurnal. Mulai tulis hari ini!
                </div>
              ) : (
                journalEntries
                  .slice(0, 3)
                  .map((entry) => (
                    <JournalCard
                      key={entry.id || entry._id}
                      entry={entry}
                    />
                  ))
              )}
            </section>

            {/* rekomendasi */}
            <section className="db-section db-reco-section">
              <div className="db-section-header">
                <h2 className="db-section-title">
                  Rekomendasi Untukmu
                </h2>

                <span className="db-reco-badge">
                  Berdasarkan AI Screening
                </span>
              </div>

              <div className="db-reco-list">
                {displayRecos.map((reco, i) => (
                <div key={i} className="db-reco-item">
                <div className="db-reco-info">
                    <div className="db-reco-title">{reco.title}</div>
                    <div className="db-reco-desc">{reco.description}</div>
                </div>

                <span className="db-reco-duration">{reco.duration}</span>
                </div>
                ))}
              </div>
            </section>
          </div>

          {/* audio */}
          <section className="db-section">
            <h2 className="db-section-title">
              Pilihan Audio
            </h2>

            <p className="db-section-sub">
              Temani harimu dengan suara yang
              menenangkan
            </p>

            <div className="db-audio-grid">
              {AUDIO_PICKS.map((audio, i) => {
                const videoId = getYoutubeId(
                  audio.url
                );

                return (
                  <div
                    key={i}
                    className="db-audio-card"
                    style={{
                      backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`,
                    }}
                  >
                    <div className="db-audio-overlay" />

                    <div className="db-audio-type">
                      {audio.type}
                    </div>

                    <h3 className="db-audio-title">
                      {audio.title}
                    </h3>

                    <button
                      className="db-audio-play"
                      onClick={() =>
                        window.open(
                          audio.url,
                          "_blank"
                        )
                      }
                    >
                      <RiPlayCircleLine />
                      Play Now
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}