import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./page.css";

const FormField = ({ id, label, type = "text", placeholder, value, onChange, options }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-slate-700">
      {label}
    </Label>
    <div className="relative">
      {type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-[#4a7c6d] focus:border-transparent outline-none transition-all appearance-none"
        >
          <option value="" disabled>{placeholder || "Pilih..."}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "date" ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full h-11 px-4 justify-start text-left font-normal rounded-xl border-slate-200 hover:bg-slate-50",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-[#4a7c6d]" />
              {value ? format(new Date(value), "PPP") : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white z-50 rounded-xl shadow-xl border-slate-100" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => {
                onChange({ target: { id, value: date ? format(date, "yyyy-MM-dd") : "" } });
              }}
              initialFocus
              captionLayout="dropdown"
              startMonth={new Date(1900, 0)}
              endMonth={new Date()}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-11 px-4 rounded-xl border-slate-200 focus-visible:ring-[#4a7c6d]"
        />
      )}
    </div>
  </div>
);

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
    job: "",
    status: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const user = data.data || data;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          gender: user.gender || "",
          dob: user.dob ? format(new Date(user.dob), "yyyy-MM-dd") : "",
          job: user.job || "",
          status: user.status || "",
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/profile");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f9f4]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4a7c6d]" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f8f9f4] text-slate-700 w-full min-h-screen pb-12">
      <div className="max-w-2xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/profile")}
            className="rounded-full hover:bg-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-[#2d5a4c]">Edit Profil</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-8 flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-28 h-28 border-4 border-[#f0f9f5]">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256" />
                  <AvatarFallback>{formData.name ? formData.name.substring(0, 2).toUpperCase() : 'CN'}</AvatarFallback>
                </Avatar>
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 p-2 bg-[#4a7c6d] text-white rounded-full border-2 border-white shadow-md hover:bg-[#3d665a] transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-400 font-medium">Klik ikon kamera untuk mengubah foto profil</p>
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-700">Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <FormField
                id="name"
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={handleChange}
              />
              
              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="email@contoh.com"
                value={formData.email}
                onChange={handleChange}
                disabled // Email usually not editable directly
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="gender"
                  label="Jenis Kelamin"
                  type="select"
                  placeholder="Pilih jenis kelamin"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { label: "Laki-laki", value: "Laki-laki" },
                    { label: "Perempuan", value: "Perempuan" },
                  ]}
                />
                
                <FormField
                  id="dob"
                  label="Tanggal Lahir"
                  type="date"
                  placeholder="Pilih tanggal"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="job"
                  label="Pekerjaan"
                  type="select"
                  placeholder="Pilih pekerjaan"
                  value={formData.job}
                  onChange={handleChange}
                  options={[
                    { label: "Pelajar/Mahasiswa", value: "Pelajar/Mahasiswa" },
                    { label: "Karyawan Swasta", value: "Karyawan Swasta" },
                    { label: "PNS/BUMN", value: "PNS/BUMN" },
                    { label: "Wiraswasta", value: "Wiraswasta" },
                    { label: "Lainnya", value: "Lainnya" },
                  ]}
                />
                
                <FormField
                  id="status"
                  label="Status"
                  type="select"
                  placeholder="Pilih status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { label: "Lajang", value: "Lajang" },
                    { label: "Menikah", value: "Menikah" },
                    { label: "Cerai", value: "Cerai" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl border-slate-200 text-slate-500 font-medium"
              onClick={() => navigate("/profile")}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 h-12 rounded-xl bg-[#4a7c6d] hover:bg-[#3d665a] text-white font-medium shadow-md shadow-emerald-900/10"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
