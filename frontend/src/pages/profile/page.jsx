import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, ChevronRight, LayoutDashboard, BarChart2, BookOpen, Loader2, User, LogOut } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getProfile, getProfileStats } from "@/services/profileService";

export default function ProfilePage() {
  const navigate = useNavigate();
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
      <div className="flex-1 flex items-center justify-center bg-[#f8f9f4]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4a7c6d]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
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
    <div className="flex-1 bg-[#f8f9f4] dark:bg-[#151718] font-sans text-slate-700 dark:text-slate-200 w-full">
      <main className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Header Profile Section */}
        <Card className="border-none shadow-sm bg-white dark:bg-[#1a1d1e] overflow-hidden">
          <CardContent className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-2 border-[#e2f0e9] dark:border-[#2e3335] bg-[#eef7f6] dark:bg-[#222628] flex items-center justify-center">
                  <AvatarFallback className="bg-transparent text-[#4a7c6d] dark:text-[#7EC896]">
                    <User size={48} />
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-[#4a7c6d] text-white rounded-full border-2 border-white dark:border-[#1a1d1e]">
                  <Edit2 size={12} />
                </button>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-[#2d5a4c] dark:text-[#7EC896]">{userData.name || "User"}</h1>
                <p className="text-slate-400 text-sm">{userData.email || "user@email.id"}</p>
                <Badge variant="secondary" className="bg-[#e2f0e9] dark:bg-[#222628] text-[#2d5a4c] dark:text-[#7EC896] hover:bg-[#d4eadd] dark:hover:bg-[#2e3335] font-normal rounded-full px-4">
                  Anggota Sejak: {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : "Jan 2024"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 px-4 rounded-md flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Keluar</span>
              </Button>
              <Link to="/profile/edit">
                <Button className="bg-[#4a7c6d] dark:bg-[#3a6d4a] hover:bg-[#3d665a] dark:hover:bg-[#4a8a5e] text-white px-6 rounded-md">
                  Edit Profil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ringkasan Aktivitas — Data Real */}
          <Card className="bg-[#eef7f6] dark:bg-[#1a1d1e] border-none shadow-none p-6 flex items-center justify-around text-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Ringkasan Aktivitas</p>
              <div className="space-y-0">
                <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{stats.screeningCount}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skrining</p>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-xs invisible mb-2">Spacer</p>
              <div className="space-y-0">
                <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{stats.journalCount}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jurnal</p>
              </div>
            </div>
          </Card>

          {/* Notifikasi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">Notifikasi</h3>
            <Card className="border-none shadow-sm bg-white dark:bg-[#1a1d1e] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#eef7f6] dark:bg-[#222628] rounded-full text-[#4a7c6d] dark:text-[#7EC896]">
                  <span className="text-xl">😊</span>
                </div>
                <span className="text-sm font-medium dark:text-slate-200">Pengingat Mood Check In</span>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#4a7c6d]" />
            </Card>
            <Card className="border-none shadow-sm bg-white dark:bg-[#1a1d1e] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#eef7f6] dark:bg-[#222628] rounded-full text-[#4a7c6d] dark:text-[#7EC896]">
                  <BookOpen size={18} />
                </div>
                <span className="text-sm font-medium dark:text-slate-200">Pengingat Jurnal</span>
              </div>
              <Switch className="data-[state=checked]:bg-[#4a7c6d]" />
            </Card>
          </div>
        </div>

        {/* Riwayat Section — Data Real */}
        <Card className="border-none shadow-sm bg-white dark:bg-[#1a1d1e] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#eef7f6] dark:bg-[#222628] rounded text-[#4a7c6d] dark:text-[#7EC896]">
                <BarChart2 size={18} />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Riwayat Skrining</h3>
            </div>
          </div>

          <div className="space-y-3">
            {screeningHistory.length > 0 ? (
              screeningHistory.map((item, idx) => (
                <div key={item.id || idx} className="flex items-center justify-between p-4 border border-slate-100 dark:border-[#2e3335] rounded-xl hover:bg-slate-50 dark:hover:bg-[#222628] cursor-pointer transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-[#eef7f6] dark:bg-[#222628] text-[#4a7c6d] dark:text-[#7EC896]">
                      <LayoutDashboard size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Skrining Kesehatan Mental
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • Skor: {item.total_score} ({getLevelLabel(item.level)})
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 dark:text-slate-500" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">Belum ada riwayat skrining</p>
                <Link to="/screening">
                  <Button variant="outline" className="mt-3 border-[#d4eadd] dark:border-[#2e3335] text-[#4a7c6d] dark:text-[#7EC896] hover:bg-[#f0f9f5] dark:hover:bg-[#222628]">
                    Mulai Skrining
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {screeningHistory.length > 0 && (
            <Link to="/screening">
              <Button variant="outline" className="w-full mt-6 border-dashed border-2 border-[#d4eadd] dark:border-[#2e3335] text-[#4a7c6d] dark:text-[#7EC896] bg-transparent hover:bg-[#f0f9f5] dark:hover:bg-[#222628] hover:text-[#4a7c6d] dark:hover:text-[#7EC896] h-12">
                Lihat Semua Riwayat
              </Button>
            </Link>
          )}
        </Card>


      </main>
    </div>
  );
}