import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, ChevronRight, LayoutDashboard, BarChart2, BookOpen, Loader2, User, LogOut } from 'lucide-react';

import "./page.css";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getProfile, getProfileStats } from "@/services/profileService";
import { useNotification } from "@/context/NotificationContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { moodNotifEnabled, journalNotifEnabled, toggleMoodNotif, toggleJournalNotif } = useNotification();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ screeningCount: 0, journalCount: 0 });
  const [screeningHistory, setScreeningHistory] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileData, statsData] = await Promise.all([
          getProfile(),
          getProfileStats(),
        ]);

        setProfile(profileData);
        setStats(statsData);

        // Ambil riwayat screening terbaru
        const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const screeningRes = await fetch(`${BASE_URL}/screening/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (screeningRes.ok) {
          const screeningData = await screeningRes.json();
          const items = screeningData.data || screeningData;
          setScreeningHistory(Array.isArray(items) ? items.slice(0, 5) : []);
        }
      } catch (err) {
        console.error(err);
        // Jika token expired, redirect ke login
        if (err.message?.includes('401') || err.message?.includes('token')) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--cream)] min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--green-dark)]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[var(--cream)]">
        <div>Failed to load profile</div>
      </div>
    );
  }

  // Handle potential nested data object from backend
  const userData = profile.data || profile;

  // Helper untuk format level skrining
  const getLevelLabel = (level) => {
    const map = {
      low: "Rendah",
      medium: "Sedang",
      high: "Tinggi",
      minimal: "Minimal",
    };
    return map[level?.toLowerCase()] || level || "-";
  };

  return (
    <div className="pr-layout">
      
      <div className="pr-content mx-auto w-full max-w-5xl">
        <main className="pr-main fade-up">
          <div className="pr-greeting">
            <h1 className="pr-title">Profil Pengguna</h1>
          </div>

          {/* Header Profile Section */}
          <Card className="pr-section overflow-hidden">
            <CardContent className="pr-section-content flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-6">
                <div className="pr-avatar-wrapper">
                  <Avatar className="pr-avatar">
                    <AvatarFallback className="pr-avatar-fallback">
                      <User size={48} />
                    </AvatarFallback>
                  </Avatar>
                  <button className="pr-edit-btn" onClick={() => navigate('/profile/edit')}>
                    <Edit2 size={12} />
                  </button>
                </div>
                <div className="space-y-1">
                  <h2 className="pr-username">{userData.name || "User"}</h2>
                  <p className="pr-email">{userData.email || "user@email.id"}</p>
                  <Badge variant="secondary" className="pr-badge">
                    Anggota Sejak: {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : "Jan 2024"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto w-full sm:w-auto justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="pr-logout-btn"
                >
                  <LogOut size={16} className="mr-2" />
                  <span className="hidden sm:inline">Keluar</span>
                </Button>
                <Link to="/profile/edit">
                  <Button className="pr-edit-profile-btn">
                    Edit Profil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Ringkasan Aktivitas — Data Real */}
            <Card className="pr-section mb-0">
              <CardContent className="pr-section-content h-full flex flex-col justify-center">
                <h3 className="pr-section-title text-center mb-6">Ringkasan Aktivitas</h3>
                <div className="pr-stats-card">
                  <div>
                    <h2 className="pr-stat-value">{stats.screeningCount}</h2>
                    <p className="pr-stat-label">Skrining</p>
                  </div>
                  <div className="pr-divider" />
                  <div>
                    <h2 className="pr-stat-value">{stats.journalCount}</h2>
                    <p className="pr-stat-label">Jurnal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifikasi */}
            <Card className="pr-section mb-0">
              <CardContent className="pr-section-content h-full">
                <h3 className="pr-section-title">Notifikasi</h3>
                <div className="space-y-3 mt-4">
                  <div className="pr-notification-item">
                    <div className="flex items-center gap-3">
                      <div className="pr-history-icon">
                        <span className="text-xl leading-none">😊</span>
                      </div>
                      <span className="text-sm font-medium">Pengingat Mood Check In</span>
                    </div>
                    <Switch 
                      checked={moodNotifEnabled} 
                      onCheckedChange={toggleMoodNotif} 
                    />
                  </div>
                  <div className="pr-notification-item">
                    <div className="flex items-center gap-3">
                      <div className="pr-history-icon">
                        <BookOpen size={18} />
                      </div>
                      <span className="text-sm font-medium">Pengingat Jurnal</span>
                    </div>
                    <Switch 
                      checked={journalNotifEnabled} 
                      onCheckedChange={toggleJournalNotif} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Riwayat Section — Data Real */}
          <Card className="pr-section">
            <CardContent className="pr-section-content">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="pr-history-icon">
                    <BarChart2 size={18} />
                  </div>
                  <h3 className="pr-section-title mb-0">Riwayat Skrining</h3>
                </div>
              </div>

              <div className="space-y-3">
                {screeningHistory.length > 0 ? (
                  screeningHistory.map((item, idx) => (
                    <div key={item.id || idx} className="pr-history-item">
                      <div className="flex items-center gap-4">
                        <div className="pr-history-icon">
                          <LayoutDashboard size={18} />
                        </div>
                        <div>
                          <h4 className="pr-history-title">
                            Skrining Kesehatan Mental
                          </h4>
                          <p className="pr-history-date">
                            {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • Skor: {item.total_score} ({getLevelLabel(item.level)})
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-[var(--text-muted)]" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[var(--text-muted)]">
                    <p className="text-sm mb-3">Belum ada riwayat skrining</p>
                    <Link to="/screening">
                      <Button variant="outline" className="border-[var(--green-dark)] text-[var(--green-dark)] hover:bg-[var(--green-dark)] hover:text-white transition-colors">
                        Mulai Skrining
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {screeningHistory.length > 0 && (
                <Link to="/screening" className="block mt-6">
                  <Button variant="outline" className="w-full border-dashed border-2 border-[var(--border)] text-[var(--green-dark)] bg-transparent hover:bg-[rgba(61,92,74,0.04)] h-12">
                    Lihat Semua Riwayat
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}