import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import "./page.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/profile");
      } else {
        alert(data.message || "Login gagal. Periksa kembali email dan kata sandi Anda.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-container">
      <Card className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="login-icon-wrapper">
            <Heart className="login-icon" fill="currentColor" />
          </div>
          <h1 className="login-title">Selamat Datang Kembali</h1>
          <p className="login-subtitle">
            Luangkan sejenak waktu untuk bernapas <br className="hidden md:block" />
            dan kembali ke dalam diri.
          </p>
        </div>

        {/* Form Section */}
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <Label htmlFor="email" className="form-label">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="form-label-row">
                <Label htmlFor="password" className="form-label">
                  Password
                </Label>
                <Link to="/forgot-password" className="forgot-password-link">
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="input-with-icon">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input pr-12"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle-btn"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>

        {/* Footer Section */}
        <div className="login-footer">
          <p>
            Belum punya akun?{" "}
            <Link to="/register" className="register-link">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
}
