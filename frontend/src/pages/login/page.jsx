import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Login attempt:", { email, password });

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="login-main">
      <Card className="login-card">
        <CardHeader className="text-center pb-2 pt-8">
          <CardTitle className="login-title">
            Selamat Datang
            <br />
            Kembali!
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-6 px-8">
            {/* Email */}
            <div className="space-y-2 login-form-content">
              <Label htmlFor="email" className="login-label">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input login-input-email"
              />
            </div>

            {/* Password */}
            <div className="space-y-2 login-form-content">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="login-label">
                  Kata Sandi
                </Label>
                <button type="button" className="login-forgot-btn">
                  Lupa Kata Sandi?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input login-input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye-btn"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div style={{ paddingTop: "4px" }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="login-submit-btn"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="login-spinner" />
                    Memproses...
                  </span>
                ) : (
                  "Masuk"
                )}
              </Button>
            </div>
          </CardContent>
        </form>

        <CardFooter className="justify-center pb-8 pt-2">
          <p className="login-footer-text">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="login-register-link"
            >
              Daftar Sekarang
            </button>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
