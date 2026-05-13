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
  "Apakah Anda mendapatkan tidur malam yang cukup lama dalam sehari?",
  "Seberapa sering kamu menggunakan gadget (smartphone, tab, PC) dalam sehari?",
  "Seberapa sering kamu bermain media sosial (Instagram, X, Tiktok) dalam sehari?",
  "Seberapa sering pikiran atau ingatan tentang pengalaman buruk masa lalu, bahkan trauma muncul kembali dan mengganggu aktivitasmu sehari-hari?",
  "Seberapa besar dampak kondisi kesehatan mental yang pernah kamu alami (atau sedang kamu alami) terhadap kualitas hidupmu saat ini?",
  "Seberapa banyak kamu menghabiskan waktu atau energi untuk bekerja dalam satu minggu?",
  "Seberapa besar tekanan dan tuntutan pekerjaan membuat kamu merasa kewalahan, burnout, atau tidak mampu mengatasinya?",
  "Seberapa sering masalah keuangan membuat kamu kehilangan tidur, sulit fokus, atau merasa putus asa tentang masa depan?",
  "Seberapa sering suasana hatimu berubah secara tiba-tiba dan drastis tanpa alasan yang jelas hingga mengganggu hubungan atau aktivitasmu?",
  "Seberapa sering kamu merasa tidak ada yang benar-benar memahami kamu, atau merasa sendirian meskipun berada di tengah orang banyak?",
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

function QuestionStep({ question, index, total, value, onChange, onNext, onPrev }) {
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
          <Button variant="outline" onClick={onPrev} className="screening-btn-outline">
            Kembali
          </Button>
        )}
        <Button
          className="screening-btn-primary"
          disabled={!value}
          onClick={onNext}
        >
          {index === total - 1 ? "Lihat Hasil" : "Lanjut"}
        </Button>
      </div>
    </div>
  );
}

function ResultView({ answers, onReset }) {
  const total = answers.reduce((a, b) => a + b, 0);
  const avg = total / answers.length;

  let result;
  if (avg <= 1.5) result = SCALE_LEVELS[0];
  else if (avg <= 3)  result = SCALE_LEVELS[1];
  else if (avg <= 4)  result = SCALE_LEVELS[2];
  else                result = SCALE_LEVELS[3];

  const score = Math.round(avg * 2); // map ke 1–10

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
        <span>{result.icon}</span> {result.label}
      </div>
      <p className="result-desc">{result.description}</p>

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

// main

export default function ScreeningPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro"); // "intro" | "questions" | "result"
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));

  function handleAnswer(val) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = val;
      return next;
    });
  }

  function handleNext() {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setPhase("result");
    }
  }

  function handlePrev() {
    setCurrentQ((q) => q - 1);
  }

  function handleReset() {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
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
          />
        )}

        {phase === "result" && (
          <ResultView answers={answers.map((a) => a ?? 1)} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
