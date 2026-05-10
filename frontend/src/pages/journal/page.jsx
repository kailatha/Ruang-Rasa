// pages/journal/page.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  createJournalEntry,
  getJournalEntries,
} from "@/services/journalService";
import { MOCK_ENTRIES, TAGS_OPTIONS, MOODS } from "@/mock/journalMock";

// React Icons
import { RiDashboardLine } from "react-icons/ri";
import { RiSearchEyeLine } from "react-icons/ri";
import { RiBookOpenLine } from "react-icons/ri";
import { RiChat3Line } from "react-icons/ri";
import { RiSparklingLine } from "react-icons/ri";
import { RiBarChartBoxLine } from "react-icons/ri";
import { RiSettings3Line } from "react-icons/ri";
import { RiBold } from "react-icons/ri";
import { RiItalic } from "react-icons/ri";
import { RiListUnordered } from "react-icons/ri";
import { RiTable2 } from "react-icons/ri";
import { RiPriceTag3Line } from "react-icons/ri";
import { RiCheckLine } from "react-icons/ri";
import { RiCloseLine } from "react-icons/ri";
import { RiAddLine } from "react-icons/ri";
import { RiArrowRightLine } from "react-icons/ri";

import "./page.css";

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function getSentimentColor(label) {
  if (label === "Positif") return "sentiment-positive";
  if (label === "Negatif") return "sentiment-negative";
  return "sentiment-neutral";
}

function getMoodColor(mood) {
  const map = {
    Senang: "mood-senang",
    Netral: "mood-netral",
    Sedih: "mood-sedih",
    Marah: "mood-marah",
    Stress: "mood-stress",
  };
  return map[mood] || "mood-netral";
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function EntryCard({ entry }) {
  return (
    <div className="entry-card">
      <div className="entry-card-header">
        <span className="entry-time">{formatRelativeTime(entry.createdAt)}</span>
        <span className={`mood-badge ${getMoodColor(entry.mood)}`}>
          {entry.moodEmoji} {entry.mood}
        </span>
      </div>
      <p className="entry-content">"{entry.content}"</p>
      <div className="entry-footer">
        {entry.sentiment && (
          <span className={`sentiment-chip ${getSentimentColor(entry.sentiment.label)}`}>
            {entry.sentiment.label} {entry.sentiment.score}%
          </span>
        )}
        {entry.emotion && <span className="emotion-chip">{entry.emotion}</span>}
      </div>
    </div>
  );
}

function MoodPicker({ selected, onSelect }) {
  return (
    <div className="mood-picker">
      {MOODS.map((m) => (
        <button
          key={m.label}
          onClick={() => onSelect(m.label)}
          className={`mood-option ${selected === m.label ? "mood-option-active" : ""}`}
        >
          <span className="mood-option-emoji">{m.emoji}</span>
          <span className="mood-option-label">{m.label}</span>
        </button>
      ))}
    </div>
  );
}

function TagSelector({ selected, onToggle }) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTag, setCustomTag] = useState("");

  function handleAddCustom() {
    if (customTag.trim()) {
      onToggle(customTag.trim());
      setCustomTag("");
      setShowCustomInput(false);
    }
  }

  return (
    <div className="tag-selector">
      {TAGS_OPTIONS.map((tag) => (
        <button
          key={tag}
          onClick={() => onToggle(tag)}
          className={`tag-chip ${selected.includes(tag) ? "tag-chip-active" : ""}`}
        >
          {tag}
          {selected.includes(tag) && <RiCloseLine className="tag-close-icon" />}
        </button>
      ))}
      {selected
        .filter((t) => !TAGS_OPTIONS.includes(t))
        .map((t) => (
          <button key={t} className="tag-chip tag-chip-active" onClick={() => onToggle(t)}>
            {t} <RiCloseLine className="tag-close-icon" />
          </button>
        ))}
      {showCustomInput ? (
        <div className="custom-tag-input">
          <input
            autoFocus
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            placeholder="Nama tagar..."
            className="custom-tag-field"
          />
          <button className="custom-tag-confirm" onClick={handleAddCustom}>
            <RiCheckLine />
          </button>
        </div>
      ) : (
        <button className="tag-chip tag-chip-add" onClick={() => setShowCustomInput(true)}>
          <RiAddLine />
        </button>
      )}
    </div>
  );
}

// ─── Sidebar config ──────────────────────────────────────────────────────────

const MENU_ITEMS = [
  { icon: <RiDashboardLine />, label: "Dashboard", path: "/dashboard" },
  { icon: <RiSearchEyeLine />, label: "Screening", path: "/screening" },
  { icon: <RiBookOpenLine />, label: "Journal", path: "/journal", active: true },
  { icon: <RiChat3Line />, label: "Chatbot", path: "/chatbot" },
  { icon: <RiSparklingLine />, label: "Rekomendasi", path: "/rekomendasi" },
];

const ANALITIK_ITEMS = [
  { icon: <RiBarChartBoxLine />, label: "Progress Mingguan", path: "/progress" },
  { icon: <RiSettings3Line />, label: "Pengaturan", path: "/settings" },
];

// ─── Main Page ───────────────────────────────────────────────────────────────

const USE_MOCK = true;

export default function JournalPage() {
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState(null);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  useEffect(() => {
    if (!content) return;
    const timer = setTimeout(() => setSaveStatus("saved"), 500);
    return () => clearTimeout(timer);
  }, [content]);

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
        console.error("Gagal memuat entri:", err);
      } finally {
        setLoadingEntries(false);
      }
    }
    loadEntries();
  }, []);

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

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
          moodEmoji: MOODS.find((m) => m.label === selectedMood)?.emoji || "😐",
          sentiment: { label: "Positif", score: Math.floor(Math.random() * 40) + 60 },
          emotion: null,
          createdAt: new Date().toISOString(),
        };
        setEntries((prev) => [newEntry, ...prev]);
      } else {
        const newEntry = await createJournalEntry(payload);
        setEntries((prev) => [newEntry, ...prev]);
      }
      setSelectedMood(null);
      setContent("");
      setSelectedTags([]);
      setSaveStatus(null);
    } catch (err) {
      console.error("Gagal menyimpan jurnal:", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  }

  const canSave = selectedMood && content.trim().length > 0;

  return (
    <div className="journal-layout">
      {/* ── Left Sidebar ─────────────────────────── */}
      <aside className="journal-sidebar">
        <div className="sidebar-label">MENU</div>
        <nav className="sidebar-nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`sidebar-item ${item.active ? "sidebar-item-active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-label sidebar-label-section">ANALITIK</div>
        <nav className="sidebar-nav">
          {ANALITIK_ITEMS.map((item) => (
            <button
              key={item.label}
              className="sidebar-item"
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
          <div className="stat-card-value">{entries.length}</div>
          <div className="stat-card-sub">dari 30 hari</div>
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{ width: `${Math.min((entries.length / 30) * 100, 100)}%` }}
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

      {/* ── Main Content ─────────────────────────── */}
      <main className="journal-main">
        <div className="journal-form-area">
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

          {/* Step 1: Mood */}
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

          {/* Step 2: Content */}
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
            <textarea
              className="journal-textarea"
              placeholder="Mulailah menulis apa yang ada di pikiranmu..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </section>

          {/* Tags */}
          <section className="journal-section journal-section-tags">
            <div className="tags-label">
              <RiPriceTag3Line className="tags-label-icon" />
              Tambahkan tagar
            </div>
            <TagSelector selected={selectedTags} onToggle={toggleTag} />
          </section>

          {saveStatus === "saved" && (
            <div className="draft-status">
              ● Saved as draft at{" "}
              {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}

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

      {/* ── Right Sidebar: Past Entries ─────────── */}
      <aside className="journal-entries-sidebar">
        <div className="entries-header">
          <h3 className="entries-title">Entri Sebelumnya</h3>
        </div>

        {loadingEntries ? (
          <div className="entries-loading">Memuat...</div>
        ) : entries.length === 0 ? (
          <div className="entries-empty">Belum ada entri. Mulai tulis hari ini!</div>
        ) : (
          <>
            {entries.slice(0, 4).map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
            <button className="see-all-btn">
              Lihat semua entri <RiArrowRightLine className="see-all-icon" />
            </button>
          </>
        )}
      </aside>
    </div>
  );
}
