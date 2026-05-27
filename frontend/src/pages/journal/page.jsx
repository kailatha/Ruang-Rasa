import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createJournalEntry, getJournalEntries } from "@/services/journalService";
import { MOCK_ENTRIES } from "@/mock/journalMock";
import "./page.css";
import Sidebar from "@/components/layout/sidebar";
import "@/components/layout/sidebar.css";

// react icons
// editor
import { RiBold } from "react-icons/ri";
import { RiItalic } from "react-icons/ri";
import { RiListUnordered } from "react-icons/ri";
import { RiTable2 } from "react-icons/ri";
import { RiPriceTag3Line } from "react-icons/ri";
import { RiArrowRightLine } from "react-icons/ri";
import { RiArrowLeftLine } from "react-icons/ri";
// mood
import { RiEmotionHappyLine } from "react-icons/ri";
import { RiEmotionNormalLine } from "react-icons/ri";
import { RiEmotionUnhappyLine } from "react-icons/ri";
import { RiEmotionLine } from "react-icons/ri";
import { RiEmotionSadLine } from "react-icons/ri";
// chatbot
import { RiChat3Line } from "react-icons/ri";

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
function EntryCard({ entry }) {
  const moodIcon = MOODS.find((m) => m.label === entry.mood)?.icon;

  return (
    <Card className="entry-card">
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

// mock data (false = pakai api)
const USE_MOCK = false;

// halaman utama jurnal
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
          createdAt: new Date().toISOString(),
        };
        setEntries((prev) => [newEntry, ...prev]);
      } else {
        const response = await createJournalEntry(payload);
        setEntries((prev) => [response.entry, ...prev]);
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
          <div className="entries-empty">Belum ada entri. Mulai tulis hari ini!</div>
        ) : (
          <>
            {entries.slice(0, 4).map((entry, index) => (
              <div key={entry.id}>
                <EntryCard entry={entry} />
                {index < Math.min(entries.length, 4) - 1 && (
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
