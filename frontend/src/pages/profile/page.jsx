import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, ChevronRight, LayoutDashboard, BarChart2, BookOpen } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // // DUMMY PROFILE DATA: Mencegah error jika backend belum menyala
    // if (token === "dummy-token-123") {
    //   setTimeout(() => {
    //     setProfile({
    //       name: "Sobat Rasa",
    //       email: "halo@ruangrasa.id",
    //       createdAt: new Date().toISOString()
    //     });
    //     setLoading(false);
    //   }, 500);
    //   return;
    // }

    fetch(`${import.meta.env.VITE_API_URL}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div>Loading...</div>
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

  return (
    <div className="flex-1 bg-[#f8f9f4] font-sans text-slate-700 w-full">
      <main className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Header Profile Section */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-2 border-slate-100">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256" />
                  <AvatarFallback>{userData.name ? userData.name.substring(0, 2).toUpperCase() : 'CN'}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-[#4a7c6d] text-white rounded-full border-2 border-white">
                  <Edit2 size={12} />
                </button>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-[#2d5a4c]">{userData.name || "User"}</h1>
                <p className="text-slate-400 text-sm">{userData.email || "user@email.id"}</p>
                <Badge variant="secondary" className="bg-[#e2f0e9] text-[#2d5a4c] hover:bg-[#d4eadd] font-normal rounded-full px-4">
                  Anggota Sejak: {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : "Jan 2024"}
                </Badge>
              </div>
            </div>
            <Link to="/profile/edit">
              <Button className="bg-[#4a7c6d] hover:bg-[#3d665a] text-white px-6 rounded-md">
                Edit Profil
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ringkasan Aktivitas */}
          <Card className="bg-[#eef7f6] border-none shadow-none p-6 flex items-center justify-around text-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Ringkasan Aktivitas</p>
              <div className="space-y-0">
                <h2 className="text-4xl font-bold text-slate-800">24</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skrining</p>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-200" />
            <div>
              <p className="text-xs invisible mb-2">Spacer</p>
              <div className="space-y-0">
                <h2 className="text-4xl font-bold text-slate-800">112</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jurnal</p>
              </div>
            </div>
          </Card>

          {/* Notifikasi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Notifikasi</h3>
            <Card className="border-none shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#eef7f6] rounded-full text-[#4a7c6d]">
                  <span className="text-xl">😊</span>
                </div>
                <span className="text-sm font-medium">Pengingat Mood Check In</span>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#4a7c6d]" />
            </Card>
            <Card className="border-none shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#eef7f6] rounded-full text-[#4a7c6d]">
                  <BookOpen size={18} />
                </div>
                <span className="text-sm font-medium">Pengingat Jurnal</span>
              </div>
              <Switch className="data-[state=checked]:bg-[#4a7c6d]" />
            </Card>
          </div>
        </div>

        {/* Riwayat Section */}
        <Card className="border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#eef7f6] rounded text-[#4a7c6d]">
                <BarChart2 size={18} />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Riwayat</h3>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-md text-xs p-2 outline-none">
              <option>7 Hari Terakhir</option>
            </select>
          </div>

          <div className="space-y-3">
            {[
              { title: "Skrining Kecemasan (GAD-7)", date: "14 Mei 2024", result: "Skor: 4 (Rendah)", icon: "check" },
              { title: "Evaluasi Kualitas Tidur", date: "10 Mei 2024", result: "Skor: Baik", icon: "file" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${item.icon === 'check' ? 'bg-[#eef7f6] text-[#4a7c6d]' : 'bg-blue-50 text-blue-500'}`}>
                    {item.icon === 'check' ? <LayoutDashboard size={18} /> : <BookOpen size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.date} • {item.result}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-6 border-dashed border-2 border-[#d4eadd] text-[#4a7c6d] bg-transparent hover:bg-[#f0f9f5] hover:text-[#4a7c6d] h-12">
            Lihat Semua Riwayat
          </Button>
        </Card>
      </main>
    </div>
  );
}