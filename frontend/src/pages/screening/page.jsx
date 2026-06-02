import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./page.css";
import Sidebar from "@/components/layout/sidebar";
import "@/components/layout/sidebar.css";

// react icons
import { FiHeart, FiFeather, FiZap, FiAlertTriangle, FiX, FiStar, FiSun } from "react-icons/fi";

// shadcn ui
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

// sub-component
// level kondisi emosional
function LevelCard({ level, isActive }) {
  return (
    <Card className={`level-card ${level.color} ${isActive ? "level-card-active" : ""}`}>
      <CardContent className="level-card-content">
        <span className="level-icon">{level.icon}</span>
        <div className="level-label">{level.label}</div>
        <div className="level-range">{level.range}</div>
      </CardContent>
    </Card>
  );
}

// pertanyaan dengan skala 1–10
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

      {/* tombol skala (lingkaran) */}
      <div className="scale-options">
        {SCALE_OPTIONS.map((opt) => (
          <button
            key={opt}
            className={`scale-option ${value === opt ? "scale-option-active" : ""}`}
            onClick={() => onChange(opt)}
          >
            <span className="scale-num">{opt}</span>
          </button>
        ))}
      </div>

      <div className="question-actions">
        {index > 0 && (
          <Button
            variant="outline"
            onClick={onPrev}
            className="screening-btn-outline"
            disabled={isSubmitting}
          >
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

// modal rekomendasi aktivitas dan afirmasi setelah hasil screening
function RecommendationModal({ backendResult, onClose }) {
  const activityDetail = backendResult?.activityDetail;
  const affirmation = backendResult?.affirmation;

  const activityTitle = activityDetail?.title || activityDetail?.name || null;
  const activityDesc = activityDetail?.description || null;
  const affirmationText =
    affirmation?.text ||
    affirmation?.content ||
    (typeof affirmation === "string" ? affirmation : null);

  return (
    <div className="reco-modal-overlay" onClick={onClose}>
      <div className="reco-modal" onClick={(e) => e.stopPropagation()}>
        <button className="reco-modal-close" onClick={onClose}>
          <FiX />
        </button>

        <h2 className="reco-modal-title">Rekomendasi untuk Kamu</h2>
        <p className="reco-modal-subtitle">
          Berdasarkan hasil screening, berikut saran yang bisa kamu coba.
        </p>

        {/* kartu aktivitas yang disarankan */}
        {activityTitle && (
          <Card className="reco-card reco-card-activity">
            <CardContent className="reco-card-inner">
              <div className="reco-card-icon"><FiStar /></div>
              <div className="reco-card-content">
                <div className="reco-card-label">Aktivitas yang Disarankan</div>
                <div className="reco-card-title">{activityTitle}</div>
                {activityDesc && <p className="reco-card-desc">{activityDesc}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* kartu afirmasi positif */}
        {affirmationText && (
          <Card className="reco-card reco-card-affirmation">
            <CardContent className="reco-card-inner">
              <div className="reco-card-icon"><FiSun /></div>
              <div className="reco-card-content">
                <div className="reco-card-label">Afirmasi Positif</div>
                <p className="reco-card-desc reco-affirmation-text">
                  "{affirmationText}"
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* fallback jika tidak ada aktivitas maupun afirmasi */}
        {!activityTitle && !affirmationText && (
          <Card className="reco-card">
            <CardContent className="reco-card-inner">
              <div className="reco-card-content">
                <p className="reco-card-desc">
                  {backendResult?.recommendation ||
                    "Tetap jaga kesehatan mentalmu dengan istirahat cukup, olahraga, dan berbagi cerita dengan orang terdekat."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button className="screening-btn-primary reco-modal-btn" onClick={onClose}>
          Mengerti
        </Button>
      </div>
    </div>
  );
}

// hasil screening dengan skor, badge level, dan breakdown jawaban
function ResultView({ answers, backendResult, onReset, onShowRecommendation }) {
  // mapping level dari backend ke data tampilan ui
  const getLevelUI = (levelStr) => {
    switch (levelStr) {
      case "Minimal":  return SCALE_LEVELS[0];
      case "Ringan":   return SCALE_LEVELS[1];
      case "Sedang":   return SCALE_LEVELS[2];
      case "Berat":    return SCALE_LEVELS[3];
      default:         return SCALE_LEVELS[1];
    }
  };

  const result = backendResult ? getLevelUI(backendResult.level) : SCALE_LEVELS[1];
  const score = backendResult ? Math.round(backendResult.total_score / 10) : 0;

  return (
    <div className="result-wrapper fade-up">
      {/* skor visual */}
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

      {/* badge level hasil screening menggunakan shadcn badge */}
      <Badge className={`result-badge ${result.color}`}>
        <span>{result.icon}</span> {backendResult?.level || result.label}
      </Badge>

      <p className="result-desc">{backendResult?.recommendation || result.description}</p>

      {/* breakdown jawaban per pertanyaan menggunakan shadcn card */}
      <Card className="result-breakdown">
        <CardContent className="result-breakdown-content">
          <div className="breakdown-title">Jawaban kamu</div>
          <Separator className="breakdown-separator" />
          {answers.map((ans, i) => (
            <div key={i} className="breakdown-row">
              <span className="breakdown-q">P{i + 1}</span>
              <div className="breakdown-bar-wrap">
                <div
                  className="breakdown-bar-fill"
                  style={{ width: `${(ans / 10) * 100}%` }}
                />
              </div>
              <span className="breakdown-val">{ans}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="result-actions">
        <Button variant="outline" className="screening-btn-outline" onClick={onReset}>
          Ulangi Screening
        </Button>
        <Button className="screening-btn-primary" onClick={onShowRecommendation}>
          Lihat Rekomendasi
        </Button>
      </div>
    </div>
  );
}

// halaman utama screening (main)
export default function ScreeningPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro"); // "intro" | "questions" | "result"
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendResult, setBackendResult] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [refreshSidebar, setRefreshSidebar] = useState(0);

  // simpan jawaban untuk pertanyaan saat ini
  function handleAnswer(val) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = val;
      return next;
    });
  }

  // lanjut ke pertanyaan berikutnya & submit
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
          setRefreshSidebar((prev) => prev + 1);
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

  // kembali ke pertanyaan sebelumnya
  function handlePrev() {
    setCurrentQ((q) => q - 1);
  }

  // reset ke kondisi awal
  function handleReset() {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setBackendResult(null);
  }

  return (
    <div className="screening-layout">
      <Sidebar refreshTrigger={refreshSidebar} />

      <main className="screening-main">
        {/* fase intro: penjelasan screening dan keterangan level */}
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
              Screening terdiri dari 10 pertanyaan yang harus dijawab dengan memilih skala
              berdasarkan apa yang Anda alami atau rasakan. Pastikan menjawab pertanyaan dengan
              jujur untuk mendapatkan hasil yang sesuai.
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

        {/* fase pertanyaan: satu pertanyaan per langkah */}
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

        {/* fase hasil: tampilkan skor, level, dan opsi rekomendasi */}
        {phase === "result" && (
          <>
            <ResultView
              answers={answers.map((a) => a ?? 1)}
              backendResult={backendResult}
              onReset={handleReset}
              onShowRecommendation={() => setShowRecommendation(true)}
            />
            {showRecommendation && (
              <RecommendationModal
                backendResult={backendResult}
                onClose={() => setShowRecommendation(false)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
