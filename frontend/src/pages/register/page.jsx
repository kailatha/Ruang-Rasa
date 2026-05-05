import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Users,
  Calendar,
  Briefcase,
  Settings,
  Shield,
  ChevronDown
} from "lucide-react";
import "./page.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Buat form input
const FormField = ({ id, label, icon: Icon, type = "text", placeholder, value, onChange, options, colSpan2 }) => (
  <div className={`space-y-2 register-form-content ${colSpan2 ? "md:col-span-2" : ""}`}>
    <Label htmlFor={id} className="register-label">
      {label}
    </Label>
    <div className="relative">
      <div className="register-icon-wrap">
        <Icon size={18} />
      </div>
      {type === "select" ? (
        <>
          <select
            id={id}
            value={value}
            onChange={onChange}
            required
            className="register-select"
          >
            <option value="" disabled>Pilih...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A8F82]">
            <ChevronDown size={16} />
          </div>
        </>
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

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Register attempt:", formData);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="register-main">
      <Card className="register-card">
        <CardHeader className="text-center pb-2 pt-6">
          <div className="register-subtitle">Selamat Datang</div>
          <CardTitle className="register-title">Daftar Akun</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              
              <FormField
                id="name"
                label="Nama Lengkap"
                icon={User}
                placeholder="Masukkan nama lengkap Anda"
                value={formData.name}
                onChange={handleChange}
                colSpan2
              />

              <FormField
                id="email"
                label="Alamat Email"
                icon={Mail}
                type="email"
                placeholder="contoh@gmail.com"
                value={formData.email}
                onChange={handleChange}
                colSpan2
              />

              <FormField
                id="password"
                label="Kata Sandi"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />

              <FormField
                id="confirmPassword"
                label="Konfirmasi Kata Sandi"
                icon={ShieldCheck}
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <FormField
                id="gender"
                label="Jenis Kelamin"
                icon={Users}
                type="select"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: "laki-laki", label: "Laki-laki" },
                  { value: "perempuan", label: "Perempuan" },
                ]}
              />

              <FormField
                id="dob"
                label="Tanggal Lahir"
                icon={Calendar}
                type="date"
                value={formData.dob}
                onChange={handleChange}
              />

              <FormField
                id="job"
                label="Pekerjaan"
                icon={Briefcase}
                placeholder="Contoh: Desainer Grafis"
                value={formData.job}
                onChange={handleChange}
              />

              <FormField
                id="status"
                label="Status Pernikahan"
                icon={Settings}
                type="select"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "lajang", label: "Lajang" },
                  { value: "menikah", label: "Menikah" },
                  { value: "lainnya", label: "Lainnya" },
                ]}
              />

            </div>

            {/* Checkbox */}
            <div className="register-checkbox-wrap">
              <input
                type="checkbox"
                id="agree"
                checked={formData.agree}
                onChange={handleChange}
                required
                className="w-4 h-4 rounded border-gray-300 text-[#3D5C4A] focus:ring-[#3D5C4A]"
              />
              <Label htmlFor="agree" className="register-checkbox-text cursor-pointer select-none">
                Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi RuangRasa.
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading || !formData.agree}
              className="register-submit-btn"
            >
              {isLoading ? "Memproses..." : "Daftar Sekarang"}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="justify-center pb-8 pt-2">
          <p className="register-footer-text">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="register-login-link"
            >
              Masuk di sini
            </button>
          </p>
        </CardFooter>
      </Card>

      <div className="register-bottom-secure">
        <Shield size={14} />
        Data Anda diamankan dengan enkripsi standar industri.
      </div>
    </main>
  );
}
