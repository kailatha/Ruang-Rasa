import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createJournalEntry, getJournalEntries } from "@/services/journalService";
import { MOCK_ENTRIES } from "@/mock/journalMock";
import "./page.css";
import Sidebar from "@/components/layout/sidebar";
import "@/components/layout/sidebar.css";

// react icons
// editor
import { RiBold, RiItalic, RiListUnordered, RiTable2, RiPriceTag3Line, RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri";
// mood
import { RiEmotionHappyLine, RiEmotionNormalLine, RiEmotionUnhappyLine, RiEmotionLine, RiEmotionSadLine } from "react-icons/ri";
// chatbot
import { RiChat3Line, RiCheckLine, RiSparklingLine } from "react-icons/ri";
import { FiX, FiStar, FiSun } from "react-icons/fi";

// shadcn ui
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MOODS = [
  { label: "Senang", icon: <RiEmotionHappyLine /> },
  { label: "Netral", icon: <RiEmotionNormalLine /> },
  { label: "Sedih",  icon: <RiEmotionUnhappyLine /> },
  { label: "Marah",  icon: <RiEmotionLine /> },
  { label: "Stress", icon: <RiEmotionSadLine /> },
];

const TAGS_OPTIONS = [
  "Pekerjaan",
  "Keluarga",
  "Kesehatan",
  "Hubungan",
  "Akademik",
];

// utility
// format waktu relatif dari iso string
function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffHours < 24)
    return `Hari ini, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
  if (diffHours < 48)
    return `Kemarin, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
  return `${date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
}

// warna kelas berdasarkan label sentimen
function getSentimentVariant(label) {
  if (label === "Positif") return "sentiment-positive";
  if (label === "Negatif") return "sentiment-negative";
  return "sentiment-neutral";
}

// warna kelas berdasarkan mood
function getMoodColor(mood) {
  const map = {
    Senang: "mood-senang",
    Netral: "mood-netral",
    Sedih:  "mood-sedih",
    Marah:  "mood-marah",
    Stress: "mood-stress",
  };
  return map[mood] || "mood-netral";
}

// sub-component
// kartu entri jurnal sebelumnya
function EntryCard({ entry, onClick }) {
  const moodIcon = MOODS.find((m) => m.label === entry.mood)?.icon;

  return (
    <Card className="entry-card" onClick={onClick} style={{ cursor: "pointer", transition: "opacity 0.2s" }} onMouseOver={(e) => e.currentTarget.style.opacity = 0.7} onMouseOut={(e) => e.currentTarget.style.opacity = 1}>
      <CardHeader className="entry-card-header">
        <span className="entry-time">{formatRelativeTime(entry.createdAt)}</span>
        <Badge className={`mood-badge ${getMoodColor(entry.mood)}`}>
          {moodIcon} {entry.mood}
        </Badge>
      </CardHeader>
      <CardContent className="entry-card-body">
        <p className="entry-content">"{entry.content}"</p>
        <div className="entry-footer">
          {entry.sentiment && (
            <Badge className={`sentiment-chip ${getSentimentVariant(entry.sentiment.label)}`}>
              {entry.sentiment.label} {entry.sentiment.score}%
            </Badge>
          )}
          {entry.emotion && (
            <Badge className="emotion-chip">{entry.emotion}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// pilihan mood
function MoodPicker({ selected, onSelect }) {
  return (
    <div className="mood-picker">
      {MOODS.map((m) => (
        <button
          key={m.label}
          onClick={() => onSelect(m.label)}
          className={`mood-option ${selected === m.label ? "mood-option-active" : ""}`}
        >
          <span className="mood-option-emoji">{m.icon}</span>
          <span className="mood-option-label">{m.label}</span>
        </button>
      ))}
    </div>
  );
}

// selector tag/kategori
function TagSelector({ selected, onToggle }) {
  return (
    <div className="tag-selector">
      {TAGS_OPTIONS.map((tag) => (
        <button
          key={tag}
          onClick={() => onToggle(tag)}
          className={`tag-chip ${selected.includes(tag) ? "tag-chip-active" : ""}`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

// Modal rekomendasi untuk melihat jurnal secara detail beserta rekomendasinya
function JournalRecommendationModal({ entry, onClose }) {
  const analysis = entry?.analysis || {};
  const activities = analysis.recommended_activities || [];
  const affirmations = analysis.recommended_affirmations || [];

  return (
    <div className="reco-modal-overlay" onClick={onClose}>
      <div className="reco-modal" onClick={(e) => e.stopPropagation()}>
        <button className="reco-modal-close" onClick={onClose}>
          <FiX />
        </button>

        <h2 className="reco-modal-title">Rekomendasi Jurnal</h2>
        <p className="reco-modal-subtitle">
          Berdasarkan jurnal kamu sebelumnya, ini analisis dari AI.
        </p>

        {activities.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Aktivitas Disarankan
            </h3>
            {activities.map((act, i) => (
              <Card key={i} className="reco-card reco-card-activity">
                <CardContent className="reco-card-inner">
                  <div className="reco-card-icon"><FiStar /></div>
                  <div className="reco-card-content">
                    <div className="reco-card-label">Saran Aktivitas</div>
                    <div className="reco-card-title">{act.title}</div>
                    <p className="reco-card-desc">{act.summary}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {affirmations.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Afirmasi Positif
            </h3>
            {affirmations.map((aff, i) => (
              <Card key={i} className="reco-card reco-card-affirmation">
                <CardContent className="reco-card-inner">
                  <div className="reco-card-icon"><FiSun /></div>
                  <div className="reco-card-content">
                    <div className="reco-card-label">Afirmasi</div>
                    <p className="reco-card-desc reco-affirmation-text">
                      "{aff.main_affirmation || aff.text || aff}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activities.length === 0 && affirmations.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
            Belum ada rekomendasi khusus untuk jurnal ini.
          </div>
        )}
      </div>
    </div>
  );
}

// mock data (false = pakai api)
const USE_MOCK = false;

// halaman utama jurnal (main)
export default function JournalPage() {
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState(null);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState(null);
  const [viewingEntry, setViewingEntry] = useState(null);

  // autosave draft setiap konten berubah
  useEffect(() => {
    if (!content) return;
    const timer = setTimeout(() => setSaveStatus("saved"), 500);
    return () => clearTimeout(timer);
  }, [content]);

  // load entri jurnal saat halaman pertama dibuka
  useEffect(() => {
    async function loadEntries() {
      setLoadingEntries(true);
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 400));
          setEntries(MOCK_ENTRIES);
        } else {
          const data = await getJournalEntries();
          setEntries(data.entries || data);
        }
      } catch (err) {
        console.error("gagal memuat entri:", err);
      } finally {
        setLoadingEntries(false);
      }
    }
    loadEntries();
  }, []);

  // toggle aktif/nonaktif tag
  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  // simpan entri jurnal baru ke server atau mock
  async function handleSave() {
    if (!selectedMood || !content.trim()) return;
    setIsSaving(true);
    try {
      const payload = { mood: selectedMood, content: content.trim(), tags: selectedTags };
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600));
        const newEntry = {
          id: Date.now().toString(),
          ...payload,
          sentiment: { label: "Positif", score: Math.floor(Math.random() * 40) + 60 },
          emotion: null,
          analysis: {
            recommended_activities: [
              { title: "Jeda napas 3 menit", summary: "Latihan napas singkat untuk membantu tubuh merasa lebih stabil." }
            ],
            recommended_affirmations: [
              { text: "Saya mengizinkan diri saya untuk beristirahat." }
            ]
          },
          createdAt: new Date().toISOString(),
        };
        setEntries((prev) => [newEntry, ...prev]);
        setSubmittedEntry(newEntry);
      } else {
        const response = await createJournalEntry(payload);
        setEntries((prev) => [response.entry, ...prev]);
        setSubmittedEntry(response.entry);
      }
      // reset form setelah berhasil simpan
      setSelectedMood(null);
      setContent("");
      setSelectedTags([]);
      setSaveStatus(null);
    } catch (err) {
      console.error("gagal menyimpan jurnal:", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  }

  // tombol simpan hanya aktif jika mood dan konten sudah diisi
  const canSave = selectedMood && content.trim().length > 0;

  return (
    <div className={"journal-layout" + (sidebarCollapsed ? " collapsed" : "")}>

      <Sidebar entryCount={entries.length} />

      <main className="journal-main fade-up">
        <div className="journal-form-area">

          {/* header halaman dengan tombol navigasi ke chatbot */}
          <div className="journal-header">
            <div>
              <h1 className="journal-title">Bagaimana harimu?</h1>
              <p className="journal-subtitle">Ambil waktu sejenak untuk beristirahat.</p>
            </div>
            <Button
              variant="outline"
              className="chatbot-btn"
              onClick={() => navigate("/chatbot")}
            >
              <RiChat3Line style={{ marginRight: 6 }} />
              Chatbot
            </Button>
          </div>

          {submittedEntry ? (
            <section className="journal-section" style={{ background: "var(--white)", padding: "32px", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(61, 92, 74, 0.1)", color: "var(--green-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 16px" }}>
                  <RiCheckLine />
                </div>
                <h2 className="step-title" style={{ marginBottom: "8px" }}>Jurnal Berhasil Disimpan!</h2>
                <p className="journal-subtitle">Terima kasih sudah berbagi hari ini. Berikut adalah beberapa rekomendasi dari AI untukmu.</p>
              </div>

              {submittedEntry.analysis?.recommended_activities?.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <RiSparklingLine color="var(--green-dark)" /> Aktivitas Disarankan
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {submittedEntry.analysis.recommended_activities.map((act, i) => (
                      <div key={i} style={{ padding: "16px", borderRadius: "12px", background: "var(--cream)", border: "1px solid var(--border)" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-dark)", margin: "0 0 4px" }}>{act.title}</h4>
                        <p style={{ fontSize: "13px", color: "var(--text-body)", margin: "0" }}>{act.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {submittedEntry.analysis?.recommended_affirmations?.length > 0 && (
                <div style={{ marginBottom: "32px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <RiSparklingLine color="var(--green-dark)" /> Afirmasi Positif
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {submittedEntry.analysis.recommended_affirmations.map((aff, i) => (
                      <div key={i} style={{ padding: "16px", borderRadius: "12px", background: "rgba(61, 92, 74, 0.04)", border: "1px solid rgba(61, 92, 74, 0.1)", fontStyle: "italic", color: "var(--green-dark)" }}>
                        "{aff.main_affirmation || aff}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={() => setSubmittedEntry(null)} className="save-journal-btn">
                  Tulis Jurnal Baru
                </Button>
              </div>
            </section>
          ) : (
            <>
              {/* langkah 1: pilih mood */}
              <section className="journal-section">
                <div className="section-step">
                  <span className="step-num">1</span>
                  <h2 className="step-title">Pilih mood kamu sekarang</h2>
                </div>
                <MoodPicker selected={selectedMood} onSelect={setSelectedMood} />
                {selectedMood && (
                  <Button className="save-mood-btn" onClick={() => {}} variant="default">
                    Simpan Mood
                  </Button>
                )}
              </section>

              {/* langkah 2: tulis isi jurnal */}
              <section className="journal-section">
                <div className="section-step">
                  <span className="step-num">2</span>
                  <h2 className="step-title">Apa yang sedang kamu pikirkan?</h2>
                </div>
                <div className="editor-toolbar">
                  <button className="toolbar-btn"><RiBold /></button>
                  <button className="toolbar-btn"><RiItalic /></button>
                  <button className="toolbar-btn"><RiListUnordered /></button>
                  <button className="toolbar-btn"><RiTable2 /></button>
                </div>
                <Textarea
                  className="journal-textarea"
                  placeholder="Mulailah menulis apa yang ada di pikiranmu..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                />
              </section>

              {/* pilih tag/kategori */}
              <section className="journal-section journal-section-tags">
                <div className="tags-label">
                  <RiPriceTag3Line className="tags-label-icon" />
                  Tagar
                </div>
                <TagSelector selected={selectedTags} onToggle={toggleTag} />
              </section>

              {/* status autosave draf */}
              {saveStatus === "saved" && (
                <div className="draft-status">
                  ● Tersimpan sebagai draf pukul{" "}
                  {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </div>
              )}

              {/* aksi: batal atau simpan */}
              <div className="journal-actions">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMood(null);
                    setContent("");
                    setSelectedTags([]);
                  }}
                >
                  Batal
                </Button>
                <Button
                  className="save-journal-btn"
                  disabled={!canSave || isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? "Menyimpan..." : "Simpan Jurnal"}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* sidebar kanan: entri jurnal sebelumnya */}
      <aside className={"journal-entries-sidebar" + (sidebarCollapsed ? " collapsed" : "")}>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <RiArrowLeftLine /> : <RiArrowRightLine />}
        </button>

        <div className="entries-header">
          <h3 className="entries-title">Entri Sebelumnya</h3>
        </div>

        {loadingEntries ? (
          <div className="entries-loading">Memuat...</div>
        ) : entries.length === 0 ? (
          <div className="entries-empty">Belum ada jurnal. Mulai tulis hari ini!</div>
        ) : (
          <>
            {entries.slice(0, 4).map((entry, index) => (
              <div key={entry.id}>
                <EntryCard entry={entry} onClick={() => setViewingEntry(entry)} />
                {index < Math.min(entries.length, 4) - 1 && (
                  <Separator className="entry-separator" />
                )}
              </div>
            ))}
          </>
        )}
      </aside>

      {/* modal rekomendasi dari entri yang diklik */}
      {viewingEntry && (
        <JournalRecommendationModal
          entry={viewingEntry}
          onClose={() => setViewingEntry(null)}
        />
      )}
    </div>
  );
}
