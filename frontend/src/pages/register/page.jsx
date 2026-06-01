import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Eye,
  EyeOff,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import "./page.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const FormField = ({ id, label, type = "text", placeholder, value, onChange, options, rightIcon: RightIcon, onRightIconClick, error }) => (
  <div className="register-form-content">
    <Label htmlFor={id} className="register-label">
      {label}
    </Label>
    <div className="relative mt-2">
      {type === "select" ? (
        <>
          <select
            id={id}
            value={value}
            onChange={onChange}
            required
            className="register-select"
          >
            <option value="" disabled>{placeholder || "Pilih..."}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A8F82]">
            <ChevronDown size={18} />
          </div>
        </>
      ) : type === "date" ? (
        <DatePicker
          value={value}
          onChange={(val) => onChange({ target: { id, value: val } })}
          placeholder={placeholder}
          triggerClassName={cn("register-input hover:bg-[var(--cream, #F5F2EC)]", !value && "text-[var(--text-muted, #7A8F82)]")}
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="register-input"
        />
      )}
      {RightIcon && type !== "date" && (
        <div 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A8F82] cursor-pointer"
          onClick={onRightIconClick}
        >
          <RightIcon size={18} />
        </div>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    job: "",
    status: "",
    agree: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (id, value, currentFormData) => {
    let error = "";
    if (id === "name") {
      if (!value.trim()) error = "Nama wajib diisi";
      else if (/\d/.test(value)) error = "Nama tidak boleh mengandung angka";
    }
    else if (id === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = "Email wajib diisi";
      else if (!emailRegex.test(value)) error = "Format email tidak valid";
    }
    else if (id === "password") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!value) error = "Kata sandi wajib diisi";
      else if (!passwordRegex.test(value)) error = "Kata sandi min. 8 karakter, huruf besar, angka & karakter unik";
    }
    else if (id === "confirmPassword") {
      if (!value) error = "Konfirmasi kata sandi wajib diisi";
      else if (value !== currentFormData.password) error = "Kata sandi dan konfirmasi tidak cocok";
    }
    else if (id === "dob") {
      if (!value) error = "Tanggal lahir wajib diisi";
      else {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate > today) error = "Tanggal lahir tidak boleh lebih dari hari ini";
      }
    }
    else if (id === "gender" && !value) error = "Jenis kelamin wajib diisi";
    else if (id === "job" && !value) error = "Pekerjaan wajib diisi";
    else if (id === "status" && !value) error = "Status wajib diisi";
    else if (id === "agree" && !value) error = "Anda harus menyetujui syarat & ketentuan";

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key], formData);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    
    setFormData((prev) => {
      const newData = { ...prev, [id]: finalValue };
      const error = validateField(id, finalValue, newData);
      
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (error) newErrors[id] = error;
        else delete newErrors[id];
        
        if (id === "password" && newData.confirmPassword) {
           const confirmError = validateField("confirmPassword", newData.confirmPassword, newData);
           if (confirmError) newErrors.confirmPassword = confirmError;
           else delete newErrors.confirmPassword;
        }
        return newErrors;
      });
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          dob: formData.dob,
          job: formData.job,
          status: formData.status
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.");
        navigate("/login");
      } else {
        alert(data.message || "Registrasi gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-main">
      <div className="register-header-text">
        <h1 className="register-title-main">
          Mulailah perjalanan<br />
          ketenanganmu di <span>ruang rasa</span>
        </h1>
        <p className="register-subtitle-main">
          Ruang aman untuk bercerita, bertumbuh, dan menemukan kembali harmoni dalam dirimu.
        </p>
      </div>

      <Card className="register-card">
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="pt-6 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              
              <FormField
                id="name"
                label="Nama"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />

              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="email@contoh.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <FormField
                id="password"
                label="Kata Sandi"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                rightIcon={showPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowPassword(!showPassword)}
                error={errors.password}
              />

              <FormField
                id="confirmPassword"
                label="Konfirmasi Kata Sandi"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                rightIcon={showConfirmPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword}
              />

              <FormField
                id="dob"
                label="Tanggal Lahir"
                type="date"
                placeholder="mm / dd / yyyy"
                value={formData.dob}
                onChange={handleChange}
                error={errors.dob}
              />

              <FormField
                id="gender"
                label="Jenis Kelamin"
                type="select"
                placeholder="Pilih Jenis Kelamin"
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
                options={[
                  { value: "laki-laki", label: "Laki-laki" },
                  { value: "perempuan", label: "Perempuan" },
                ]}
              />

              <FormField
                id="job"
                label="Pekerjaan"
                type="select"
                placeholder="Pilih Pekerjaan"
                value={formData.job}
                onChange={handleChange}
                error={errors.job}
                options={[
                  { value: "Pelajar", label: "Pelajar" },
                  { value: "Mahasiswa", label: "Mahasiswa" },
                  { value: "PNS / Pegawai Pemerintahan", label: "PNS / Pegawai Pemerintahan" },
                  { value: "Karyawan Swasta", label: "Karyawan Swasta" },
                  { value: "Wirausaha", label: "Wirausaha / Pemilik Usaha" },
                  { value: "Pekerja Lepas / Freelancer", label: "Pekerja Lepas / Freelancer" },
                  { value: "Ibu Rumah Tangga", label: "Ibu Rumah Tangga" },
                  { value: "Belum / Tidak Bekerja", label: "Belum / Tidak Bekerja" },
                  { value: "Lainnya", label: "Lainnya" },
                ]}
              />

              <FormField
                id="status"
                label="Status"
                type="select"
                placeholder="Pilih Status"
                value={formData.status}
                onChange={handleChange}
                error={errors.status}
                options={[
                  { value: "Belum Menikah", label: "Belum Menikah" },
                  { value: "Menikah", label: "Menikah" },
                ]}
              />

            </div>

            <div>
              <div className="register-checkbox-wrap">
                <input
                  type="checkbox"
                  id="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#3D5C4A] focus:ring-[#3D5C4A] mt-1"
                />
                <Label htmlFor="agree" className="register-checkbox-text cursor-pointer select-none">
                  Saya menyetujui Kebijakan Privasi dan Syarat & Ketentuan yang berlaku di RuangRasa.
                </Label>
              </div>
              {errors.agree && <p className="text-red-500 text-xs mt-1">{errors.agree}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.agree}
              className="register-submit-btn"
            >
              {isLoading ? "Memproses..." : "Daftar Sekarang"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </main>
  );
}
