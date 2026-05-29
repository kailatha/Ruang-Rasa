import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Loader2, Calendar as CalendarIcon, Eye, EyeOff, Lock, User, ChevronDown } from "lucide-react";
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
import { getProfile, updateProfile, changePassword, getProfileStats } from "@/services/profileService";
import { DatePicker } from "@/components/ui/date-picker";
import "../page.css";
import "./page.css";

const FormField = ({ id, label, type = "text", placeholder, value, onChange, options, disabled }) => (
  <div className="pr-form-group">
    <Label htmlFor={id} className="pr-form-label">
      {label}
    </Label>
    <div className="relative mt-2">
      {type === "select" ? (
        <>
          <select
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="register-select"
          >
            <option value="" disabled>{placeholder || "Pilih..."}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
            <ChevronDown size={18} />
          </div>
        </>
      ) : type === "date" ? (
        <DatePicker
          value={value}
          onChange={(val) => onChange({ target: { id, value: val } })}
          placeholder={placeholder}
          triggerClassName={cn("register-input", !value && "text-[var(--text-muted)]")}
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="register-input"
        />
      )}
    </div>
  </div>
);

const PasswordField = ({ id, label, placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="pr-form-label">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="register-input pr-12"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ journalCount: 0 });
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
    job: "",
    status: "",
    avatarUrl: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          getProfile(),
          getProfileStats()
        ]);
        const user = profileRes.data || profileRes;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          gender: user.gender || "",
          dob: user.dob ? format(new Date(user.dob), "yyyy-MM-dd") : "",
          job: user.job || "",
          status: user.status || "",
          avatarUrl: user.avatarUrl || "",
        });
        setStats(statsRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
    if (passwordMessage.text) setPasswordMessage({ type: "", text: "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar tidak boleh lebih dari 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile(formData);
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert(error.message || "Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Semua field password wajib diisi" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password baru minimal 6 karakter" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Konfirmasi password tidak cocok" });
      return;
    }

    setChangingPassword(true);
    setPasswordMessage({ type: "", text: "" });

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordMessage({ type: "success", text: result.message || "Password berhasil diubah. Mengalihkan ke halaman login..." });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // Auto logout and redirect after 2 seconds
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login");
      }, 2000);

    } catch (error) {
      setPasswordMessage({ type: "error", text: error.message || "Gagal mengubah password" });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--cream)] min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--green-dark)]" />
      </div>
    );
  }

  return (
    <div className="pr-layout">

      <div className="pr-content mx-auto w-full max-w-5xl">
        <main className="pr-main fade-up">
          <div className="max-w-2xl mx-auto">
            <div className="pr-greeting flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/profile")}
                className="rounded-full hover:bg-[var(--white)] w-10 h-10"
              >
                <ChevronLeft className="w-6 h-6 text-[var(--green-dark)]" />
              </Button>
              <h1 className="pr-title m-0">Edit Profil</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 mb-6">
              {/* Avatar Section */}
              <Card className="pr-section mb-6">
                <CardContent className="pr-section-content flex flex-col items-center gap-4 py-8">
                  <div className="pr-avatar-wrapper">
                    <Avatar className="pr-avatar" style={{width: '112px', height: '112px'}}>
                      {formData.avatarUrl && <AvatarImage src={formData.avatarUrl} alt="Avatar" style={{ objectFit: 'cover' }} />}
                      <AvatarFallback className="pr-avatar-fallback">
                        <User size={56} />
                      </AvatarFallback>
                    </Avatar>
                    
                    <input 
                      type="file" 
                      accept="image/*" 
                      hidden 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                    />
                    <button 
                      type="button"
                      className="pr-edit-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-medium">Klik ikon kamera untuk mengubah foto profil (Maks 2MB)</p>
                </CardContent>
              </Card>

              {/* Form Section */}
              <Card className="pr-section">
                <CardHeader className="pb-2">
                  <CardTitle className="pr-section-title">Informasi Pribadi</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-5">
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
                    disabled
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      id="job"
                      label="Pekerjaan"
                      type="select"
                      placeholder="Pilih pekerjaan"
                      value={formData.job}
                      onChange={handleChange}
                      options={[
                        { label: "Pelajar/Mahasiswa", value: "Pelajar/Mahasiswa" },
                        { label: "Pekerja", value: "Pekerja" },
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
                        { label: "Belum Menikah", value: "Belum Menikah" },
                        { label: "Menikah", value: "Menikah" },
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
                  className="flex-1 h-12 pr-btn-outline"
                  onClick={() => navigate("/profile")}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-12 pr-btn-primary"
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

            {/* Change Password Section */}
            <form onSubmit={handleChangePassword} className="space-y-6">
              <Card className="pr-section">
                <CardHeader className="pb-2">
                  <CardTitle className="pr-section-title flex items-center gap-2">
                    <Lock size={18} className="text-[var(--green-dark)]" />
                    Ganti Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-5">
                  <PasswordField
                    id="currentPassword"
                    label="Password Lama"
                    placeholder="Masukkan password lama"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />

                  <PasswordField
                    id="newPassword"
                    label="Password Baru"
                    placeholder="Minimal 6 karakter"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />

                  <PasswordField
                    id="confirmPassword"
                    label="Konfirmasi Password Baru"
                    placeholder="Ulangi password baru"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />

                  {passwordMessage.text && (
                    <div className={`p-3 rounded-xl text-sm font-medium ${
                      passwordMessage.type === "success" 
                        ? "pr-feedback-success" 
                        : "pr-feedback-error"
                    }`}>
                      {passwordMessage.text}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full h-12 pr-btn-danger mt-2"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengubah Password...
                      </>
                    ) : (
                      "Ubah Password"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
