import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createJournalEntry, getJournalEntries } from "@/services/journalService";
import { MOCK_ENTRIES } from "@/mock/journalMock";
import "./page.css";
import Sidebar from "@/components/layout/sidebar";
import "@/components/layout/sidebar.css";

// react icons
// editor
import { RiPriceTag3Line, RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri";
// mood
import { RiEmotionHappyLine, RiEmotionNormalLine, RiEmotionUnhappyLine, RiEmotionLine, RiEmotionSadLine } from "react-icons/ri";
// chatbot
import { RiChat3Line, RiCheckLine, RiSparklingLine } from "react-icons/ri";

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
  "Personal",
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
function EntryCard({ entry, isExpanded, onToggle }) {
  const moodIcon = MOODS.find((m) => m.label === entry.mood)?.icon;
  const analysis = entry?.analysis || {};
  const activities = analysis.recommended_activities || [];
  const affirmations = analysis.recommended_affirmations || [];

  return (
    <Card className="entry-card" style={{ transition: "all 0.2s" }}>
      <div onClick={onToggle} style={{ cursor: "pointer", opacity: isExpanded ? 1 : 0.9 }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = isExpanded ? 1 : 0.9}>
      <CardHeader className="entry-card-header">
        <span className="entry-time">{formatRelativeTime(entry.createdAt)}</span>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <Badge className={`mood-badge ${getMoodColor(entry.mood)}`}>
            {moodIcon} {entry.mood}
          </Badge>
          {/* {entry.sentiment_label && (
            <Badge className={`mood-badge ${getSentimentVariant(entry.sentiment_label)}`}>
              {entry.sentiment_label}
            </Badge>
          )} */}
          {entry.emotion && (
            <Badge className={`mood-badge ${getMoodColor(entry.mood)}`} style={{ opacity: 0.7 }}>
              {entry.emotion}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="entry-card-body">
        {entry.content
          ? <p className="entry-content">"{entry.content}"</p>
          : <p className="entry-content entry-content-empty">Tidak ada catatan.</p>
        }
        {entry.tags?.length > 0 && (
          <div className="entry-footer" style={{ justifyContent: "center" }}>
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="emotion-chip">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      </div>

      {isExpanded && (activities.length > 0 || affirmations.length > 0) && (
        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed var(--border)" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Rekomendasi AI
          </div>
          
          {activities.length > 0 && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", color: "var(--green-dark)", fontWeight: "600", marginBottom: "6px" }}>Aktivitas:</div>
              {activities.map((act, i) => (
                <div key={i} style={{ padding: "10px", borderRadius: "8px", background: "var(--cream)", border: "1px solid var(--border)", marginBottom: "6px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "2px" }}>{act.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-body)" }}>{act.summary}</div>
                </div>
              ))}
            </div>
          )}

          {affirmations.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", color: "#b07d2b", fontWeight: "600", marginBottom: "6px" }}>Afirmasi:</div>
              {affirmations.map((aff, i) => (
                <div key={i} style={{ padding: "10px", borderRadius: "8px", background: "rgba(61, 92, 74, 0.04)", border: "1px solid rgba(61, 92, 74, 0.1)", marginBottom: "6px", fontStyle: "italic", fontSize: "12px", color: "var(--text-dark)" }}>
                  "{aff.main_affirmation || aff.text || aff}"
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
  const [expandedEntryId, setExpandedEntryId] = useState(null);

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
    if (!selectedMood) return;
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

  // tombol simpan hanya aktif jika mood sudah diisi
  const canSave = !!selectedMood;
  const hasContent = content.trim().length > 0;

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
                      <div key={i} className="success-activity-card">
                        <h4 className="success-activity-title">{act.title}</h4>
                        <p className="success-activity-desc">{act.summary}</p>
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
                      <div key={i} className="success-affirmation-card">
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
              </section>

              {/* langkah 2: tulis isi jurnal */}
              <section className="journal-section">
                <div className="section-step">
                  <span className="step-num">2</span>
                  <h2 className="step-title">Apa yang sedang kamu pikirkan?</h2>
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
                  className="cancel-btn"
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
                  {isSaving ? "Menyimpan..." : hasContent ? "Simpan Jurnal" : "Simpan Mood"}
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
            {entries.slice(0, 6).map((entry, index) => (
              <div key={entry.id}>
                <EntryCard 
                  entry={entry} 
                  isExpanded={expandedEntryId === entry.id}
                  onToggle={() => setExpandedEntryId(expandedEntryId === entry.id ? null : entry.id)} 
                />
                {index < Math.min(entries.length, 6) - 1 && (
                  <Separator className="entry-separator" />
                )}
              </div>
            ))}
          </>
        )}
      </aside>

    </div>
  );
}
