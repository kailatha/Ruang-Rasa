import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import Sidebar from "@/components/layout/sidebar";

import "@/components/layout/sidebar.css";
import "./page.css";

// React Icons - keterangan
import { FiHeart } from "react-icons/fi";
import { FiFeather } from "react-icons/fi";
import { FiZap } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";

const SCALE_LEVELS = [
  {
    icon: <FiHeart />,
    label: "Tenang",
    range: "Skala 1–3",
    description: "Kondisi emosional stabil dan terkontrol dengan baik.",
    color: "level-tenang",
  },
  {
    icon: <FiFeather />,
    label: "Terkendali",
    range: "Skala 4–6",
    description: "Ada tekanan ringan namun masih dapat dikelola.",
    color: "level-terkendali",
  },
  {
    icon: <FiZap />,
    label: "Tinggi",
    range: "Skala 7–8",
    description: "Tekanan emosional cukup tinggi, perlu perhatian lebih.",
    color: "level-tinggi",
  },
  {
    icon: <FiAlertTriangle />,
    label: "Kritis",
    range: "Skala 9–10",
    description: "Kondisi membutuhkan bantuan profesional segera.",
    color: "level-kritis",
  },
];

const QUESTIONS = [
  "Seberapa sering kamu merasa cemas atau khawatir berlebihan dalam seminggu terakhir?",
  "Apakah kamu mengalami kesulitan tidur atau tidur terlalu banyak?",
  "Seberapa sering kamu merasa lelah atau kehilangan energi?",
  "Apakah kamu merasa sulit berkonsentrasi pada pekerjaan atau aktivitas sehari-hari?",
  "Seberapa sering kamu merasa sedih atau kosong tanpa alasan yang jelas?",
  "Apakah kamu kehilangan minat pada hal-hal yang biasanya kamu nikmati?",
  "Seberapa sering kamu merasa mudah marah atau tersinggung?",
  "Apakah kamu merasa terisolasi dari orang-orang di sekitarmu?",
  "Seberapa sering kamu merasa tidak berdaya atau putus asa?",
  "Apakah pikiran negatif tentang diri sendiri sering muncul?",
];

const SCALE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// sub components

function LevelCard({ level, isActive }) {
  return (
    <div className={`level-card ${level.color} ${isActive || level.active ? "level-card-active" : ""}`}>
      <span className="level-icon">{level.icon}</span>
      <div className="level-label">{level.label}</div>
      <div className="level-range">{level.range}</div>
    </div>
  );
}

function QuestionStep({ question, index, total, value, onChange, onNext, onPrev, isSubmitting }) {
  return (
    <div className="question-wrapper fade-up">
      <div className="question-progress-bar">
        <div
          className="question-progress-fill"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
      <div className="question-counter">{index + 1} / {total}</div>
      <p className="question-text">{question}</p>

      <div className="scale-options">
        {SCALE_OPTIONS.map((opt) => (
          <button
            key={opt}
            className={`scale-option ${value === opt ? "scale-option-active" : ""}`}
            onClick={() => onChange(opt)}
          >
            <span className="scale-num">{opt}</span>
            <span className="scale-label">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="question-actions">
        {index > 0 && (
          <Button variant="outline" onClick={onPrev} className="screening-btn-outline" disabled={isSubmitting}>
            Kembali
          </Button>
        )}
        <Button
          className="screening-btn-primary"
          disabled={!value || isSubmitting}
          onClick={onNext}
        >
          {isSubmitting ? "Menyimpan..." : (index === total - 1 ? "Lihat Hasil" : "Lanjut")}
        </Button>
      </div>
    </div>
  );
}

function ResultView({ answers, backendResult, onReset }) {
  // Mapping dari backend level ke UI Card
  const getLevelUI = (levelStr) => {
    switch (levelStr) {
      case "Minimal": return SCALE_LEVELS[0];
      case "Ringan": return SCALE_LEVELS[1];
      case "Sedang": return SCALE_LEVELS[2];
      case "Berat": return SCALE_LEVELS[3];
      default: return SCALE_LEVELS[1];
    }
  };

  const result = backendResult ? getLevelUI(backendResult.level) : SCALE_LEVELS[1];
  const score = backendResult ? Math.round(backendResult.total_score / 10) : 0; // map ke 1–10 visual

  return (
    <div className="result-wrapper fade-up">
      <div className="result-score-ring">
        <svg viewBox="0 0 100 100" className="ring-svg">
          <circle cx="50" cy="50" r="40" className="ring-bg" />
          <circle
            cx="50" cy="50" r="40"
            className="ring-fill"
            strokeDasharray={`${(score / 10) * 251} 251`}
          />
        </svg>
        <div className="ring-label">
          <span className="ring-score">{score}</span>
          <span className="ring-sub">/ 10</span>
        </div>
      </div>

      <div className={`result-badge ${result.color}`}>
        <span>{result.icon}</span> {backendResult?.level || result.label}
      </div>
      <p className="result-desc">{backendResult?.recommendation || result.description}</p>

      <div className="result-breakdown">
        <div className="breakdown-title">Jawaban kamu</div>
        {answers.map((ans, i) => (
          <div key={i} className="breakdown-row">
            <span className="breakdown-q">P{i + 1}</span>
            <div className="breakdown-bar-wrap">
              <div
                className="breakdown-bar-fill"
                style={{ width: `${(ans / 5) * 100}%` }}
              />
            </div>
            <span className="breakdown-val">{SCALE_OPTIONS[ans - 1]?.label}</span>
          </div>
        ))}
      </div>

      <div className="result-actions">
        <Button variant="outline" className="screening-btn-outline" onClick={onReset}>
          Ulangi Screening
        </Button>
        <Button className="screening-btn-primary">
          Lihat Rekomendasi
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ScreeningPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro"); // "intro" | "questions" | "result"
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendResult, setBackendResult] = useState(null);

  function handleAnswer(val) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = val;
      return next;
    });
  }

  async function handleNext() {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/screening/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        });
        const data = await res.json();
        
        if (res.ok) {
          setBackendResult(data.data);
          setPhase("result");
        } else {
          alert("Gagal menyimpan hasil: " + data.message);
        }
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan jaringan.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  function handlePrev() {
    setCurrentQ((q) => q - 1);
  }

  function handleReset() {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setBackendResult(null);
  }

  return (
    <div className="screening-layout">
      <Sidebar />

      <main className="screening-main">
        {phase === "intro" && (
          <div className="screening-intro fade-up">
            <h1 className="screening-title">
              Apa itu <em>Screening?</em>
            </h1>
            <p className="screening-desc">
              Fitur yang mengidentifikasi kemungkinan penyebab kondisi emosional pengguna melalui
              beberapa pertanyaan atau kondisi yang diinput. Screening dapat dilakukan selama
              seminggu sekali.
            </p>
            <p className="screening-desc">
              Screening terdiri dari 10 pertanyaan yang harus dijawab dengan memilih skala berdasarkan
              apa yang Anda alami atau rasakan. Pastikan menjawab pertanyaan dengan jujur untuk
              mendapatkan hasil yang sesuai.
            </p>

            <h2 className="screening-keterangan-title">Keterangan</h2>
            <div className="level-cards-grid">
              {SCALE_LEVELS.map((lvl) => (
                <LevelCard key={lvl.label} level={lvl} />
              ))}
            </div>

            <Button
              className="screening-start-btn"
              onClick={() => setPhase("questions")}
            >
              Mulai Screening
            </Button>
          </div>
        )}

        {phase === "questions" && (
          <QuestionStep
            question={QUESTIONS[currentQ]}
            index={currentQ}
            total={QUESTIONS.length}
            value={answers[currentQ]}
            onChange={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
            isSubmitting={isSubmitting}
          />
        )}

        {phase === "result" && (
          <ResultView 
            answers={answers.map((a) => a ?? 1)} 
            backendResult={backendResult}
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
}
