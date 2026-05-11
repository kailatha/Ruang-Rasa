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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "./page.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const FormField = ({ id, label, type = "text", placeholder, value, onChange, options, rightIcon: RightIcon, onRightIconClick }) => (
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "register-input justify-start text-left font-normal hover:bg-[#F4F3EE]",
                !value && "text-muted-foreground"
              )}
            >
              {value ? format(new Date(value), "PPP") : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white z-50 rounded-xl" align="start">
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
      {type === "date" && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A8F82] pointer-events-none">
          <CalendarIcon size={18} />
        </div>
      )}
    </div>
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

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi konfirmasi password
    if (formData.password !== formData.confirmPassword) {
      alert("Kata sandi dan konfirmasi kata sandi tidak cocok!");
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
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              
              <FormField
                id="name"
                label="Nama"
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
              />

              <FormField
                id="dob"
                label="Tanggal Lahir"
                type="date"
                placeholder="mm / dd / yyyy"
                value={formData.dob}
                onChange={handleChange}
              />

              <FormField
                id="gender"
                label="Jenis Kelamin"
                type="select"
                placeholder="Pilih Jenis Kelamin"
                value={formData.gender}
                onChange={handleChange}
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
                options={[
                  { value: "Pelajar/Mahasiswa", label: "Pelajar/Mahasiswa" },
                  { value: "Pekerja", label: "Pekerja" },
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
                options={[
                  { value: "Belum Menikah", label: "Belum Menikah" },
                  { value: "Menikah", label: "Menikah" },
                ]}
              />

            </div>

            <div className="register-checkbox-wrap">
              <input
                type="checkbox"
                id="agree"
                checked={formData.agree}
                onChange={handleChange}
                required
                className="w-4 h-4 rounded border-gray-300 text-[#3D5C4A] focus:ring-[#3D5C4A] mt-1"
              />
              <Label htmlFor="agree" className="register-checkbox-text cursor-pointer select-none">
                Saya menyetujui Kebijakan Privasi dan Syarat & Ketentuan yang berlaku di RuangRasa.
              </Label>
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
