import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import "./page.css";
// shared components

function ChatPreview() {
  return (
    <div className="chat-preview">
      <div className="chat-titlebar">
        <span className="dot dot-r" />
        <span className="dot dot-y" />
        <span className="dot dot-g" />
        <span className="chat-tab">Chatbot</span>
      </div>
      <div className="chat-body">
        <div className="chat-bubble-ai">
          <div className="chat-avatar" />
          <div>
            <div className="bubble-ai">
              Hei, selamat datang kembali. Bagaimana kabarmu hari ini?
            </div>
            <div className="mood-chips">
              <button className="mood-chip chip-senang">Senang</button>
              <button className="mood-chip chip-netral">Netral</button>
              <button className="mood-chip chip-sedih">Sedih</button>
              <button className="mood-chip chip-marah">Marah</button>
              <button className="mood-chip chip-stres">Stres</button>
            </div>
          </div>
        </div>

        <div className="bubble-user">
          Aku lagi ngerasa suntuk dan bingung mau ngapain...
        </div>

        <div className="chat-bubble-ai">
          <div className="chat-avatar" />
          <div className="bubble-ai">
            Bagaimana kalau melakukan hobi kamu?
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <div className="stat-value">
          <span>5</span> fitur
        </div>
        <div className="stat-label">terintegrasi AI</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">
          <span>100%</span>
        </div>
        <div className="stat-label">privasi & terenkripsi</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">Non-diagnostik</div>
        <div className="stat-label">aman & etis</div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: "",
      name: "Mood Tracker",
      desc: "Catat mood harianmu dari hari pertama, hingga berapa waktu ke waktu. AI akan memahami tren emosimu untuk memberikan insight yang relevan.",
    },
    {
      icon: "",
      name: "Jurnal",
      desc: "Tuangkan pikiranmu dalam jurnal digital. AI akan menganalisis sentimen dan emosi dari tulisanmu.",
    },
    {
      icon: "",
      name: "Screening Kesehatan Mental",
      desc: "Ikuti screening yang telah divalidasi secara ilmiah. Dapatkan gambaran kondisi emosionalmu dan rekomendasi langkah selanjutnya — bukan diagnosis, tetapi panduan yang aman.",
    },
    {
      icon: "",
      name: "Chatbot Pendamping",
      desc: "Bicara dengan chatbot AI yang empatik kapan saja. Pilih modenya: sekadar bantu refleksi diri, cari saran praktis, atau solusi kegiatan yang tepat.",
    },
    {
      icon: "",
      name: "Rekomendasi",
      desc: "Berdasarkan pola mood, journaling, dan hasil screeningmu, AI akan merekomendasikan aktivitas sederhana dan afirmasi yang relevan dengan kondisimu saat ini.",
    },
  ];

  return (
    <section className="section" id="fitur">
      <div className="section-eyebrow">Fitur Unggulan</div>
      <h2 className="section-title">
        Semua yang kamu butuhkan
        <br />
        untuk <em>memahami dirimu</em>
      </h2>
      <p className="section-sub">
        Dari screening awal hingga refleksi harian, RuangRasa hadir sebagai teman yang peka dan aman.
      </p>
      <div className="features-grid">
        {features.map((f, i) => (
          <Card
            key={i}
            className={`feature-card${i === 4 ? " feature-card-full" : ""}`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <CardContent className="feature-card-content">
              <div className="feature-icon-wrap">{f.icon}</div>
              <div className="feature-name">{f.name}</div>
              <div className="feature-desc">{f.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function HowSection() {
  const steps = [
    {
      num: "01",
      title: "Buat akun gratis",
      desc: "Daftar dalam hitungan detik. Datamu tersimpan dan hanya dapat diakses oleh kamu sendiri, privasi terjaga.",
    },
    {
      num: "02",
      title: "Mulai screening awal",
      desc: "Jawab beberapa pertanyaan singkat untuk mendapatkan gambaran kondisi emosionalmu saat ini.",
    },
    {
      num: "03",
      title: "Check-in setiap hari",
      desc: "Catat moodmu, tulis jurnal, atau ngobrol dengan chatbot. AI akan membaca polamu dari waktu ke waktu.",
    },
  ];

  return (
    <div className="how-section" id="cara-kerja">
      <div className="how-inner">
        <div className="how-eyebrow">Cara Kerja</div>
        <h2 className="how-title">
          Sederhana, aman, dan
          <br />
          <em>mulai dari dirimu</em>
        </h2>
        <div className="how-steps">
          {steps.map((s, i) => (
            <div key={i}>
              <div className="how-step-num">{s.num}</div>
              <div className="how-step-title">{s.title}</div>
              <div className="how-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="cta-section">
      <div className="cta-card">
        <h2 className="cta-title">Mulai perjalananmu sekarang</h2>
        <p className="cta-sub">
          Bergabung dengan kami. RuangRasa hadir sebagai ruang aman dan nyaman
          untuk ceritamu.
        </p>
        <Button
          variant="secondary"
          className="cta-btn"
          onClick={() => navigate("/register")}
        >
          Buat Akun
        </Button>
        <div className="cta-note">Privasi & Enkripsi</div>
      </div>
    </section>
  );
}

// pages

export function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot" />
          AI-Powered Emotional Well-being
        </div>
        <h1 className="hero-title">
          Beri ruang untuk setiap
          <span className="hero-title-italic">rasa yang kamu punya</span>
        </h1>
        <p className="hero-sub">
          RuangRasa membantu kamu memahami kondisi emosional sehari-hari lewat
          screening, mood check-in, journaling, dan chatbot pendamping berbasis AI.
        </p>
        <Button className="hero-cta-btn" onClick={() => navigate("/register")}>
          Mulai Sekarang
        </Button>
        <div className="hero-note">Gratis · Privat · Bukan pengganti profesional</div>
        <ChatPreview />
      </section>

      <StatsBar />
      <FeaturesSection />
      <HowSection />
      <CTASection />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <div className="about-hero">
        <h1 className="about-title">tentang kami</h1>
      </div>

      <div className="about-card-section">
        <Card className="about-card">
          <CardContent className="about-card-content">
            <p>
              RuangRasa adalah platform digital yang dirancang untuk membantu
              individu memahami dan menjaga kesehatan emosional mereka dengan cara
              yang sederhana, aman, dan penuh empati. Kami percaya bahwa setiap
              orang berhak memiliki ruang untuk mengenali perasaannya, tanpa harus
              menunggu hingga semuanya terasa terlalu berat.
            </p>
            <p>
              Melalui RuangRasa, pengguna dapat melakukan mood check-in, menulis
              jurnal harian, serta mendapatkan insight dan rekomendasi berbasis
              teknologi kecerdasan buatan. Fitur-fitur ini dirancang untuk
              membantu pengguna memahami pola emosinya, memvalidasi perasaan yang
              dirasakan, dan menemukan langkah kecil yang dapat dilakukan untuk
              merasa lebih baik.
            </p>
            <p>
              Kami mengembangkan platform ini dengan pendekatan human-centered
              design, yang berfokus pada kebutuhan nyata pengguna dalam kehidupan
              sehari-hari. RuangRasa bukanlah alat diagnosis medis, melainkan
              ruang pendamping yang suportif untuk membantu pengguna lebih peka
              terhadap kondisi dirinya sendiri.
            </p>
            <p>
              Kami berharap RuangRasa dapat menjadi teman digital yang selalu
              ada—tempat di mana kamu bisa merasa didengar, dipahami, dan
              didukung, kapan pun dan di mana pun.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="about-section-title">tim kami</h2>

      <div className="about-card-section">
        <Card className="about-card">
          <CardContent className="about-card-content">
            <p>
              RuangRasa dikembangkan oleh tim capstone project Coding Camp 2026
              yang terdiri dari Data Scientist, AI Engineer, dan Full-Stack Web
              Developer yang berkolaborasi untuk menghadirkan solusi yang utuh dan
              berdampak.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
