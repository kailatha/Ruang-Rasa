import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// shadcn ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// react icons
import { RiCheckLine, RiCloseLine, RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";

import "./page.css";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) setTokenValid(false);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Kata sandi min. 8 karakter, huruf besar, angka & karakter unik.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) setTokenValid(false);
        throw new Error(data.message || "Terjadi kesalahan.");
      }

      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // state: token tidak ada / tidak valid
  if (!tokenValid) {
    return (
      <main className="forgot-container">
        <Card className="forgot-card">
          <div className="forgot-header">
            <div className="reset-icon reset-icon--error" aria-hidden="true">
              <RiCloseCircleLine size={24} />
            </div>
            <h1 className="forgot-title">Link Tidak Valid</h1>
            <p className="forgot-subtitle">
              Link reset kata sandi ini tidak valid <br />
              atau sudah kadaluarsa.
            </p>
          </div>
          <CardContent className="p-0">
            <div className="forgot-success-message">
              <p>Silakan minta link baru melalui halaman berikut.</p>
              <p className="mt-4">
                <Link to="/forgot-password" className="forgot-back-link">
                  Minta Link Baru
                </Link>
              </p>
              <p className="mt-2">
                <Link to="/login" className="reset-secondary-link">
                  Kembali ke Halaman Masuk
                </Link>
              </p>
            </div>
          </CardContent>
          <div className="forgot-footer">
            <p>Keamanan Anda adalah prioritas kami</p>
          </div>
        </Card>
      </main>
    );
  }

  // state: berhasil reset
  if (isSuccess) {
    return (
      <main className="forgot-container">
        <Card className="forgot-card">
          <div className="forgot-header">
            <div className="reset-icon reset-icon--success" aria-hidden="true">
              <RiCheckboxCircleLine size={24} />
            </div>
            <h1 className="forgot-title">Kata Sandi Diperbarui!</h1>
            <p className="forgot-subtitle">
              Kata sandi Anda berhasil diubah. <br />
              Anda akan diarahkan ke halaman masuk.
            </p>
          </div>
          <CardContent className="p-0">
            <div className="forgot-success-message">
              <p className="mt-4">
                <Link to="/login" className="forgot-back-link">
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </CardContent>
          <div className="forgot-footer">
            <p>Mengarahkan dalam 3 detik...</p>
          </div>
        </Card>
      </main>
    );
  }

  // state: form utama
  return (
    <main className="forgot-container">
      <Card className="forgot-card">
        <div className="forgot-header">
          <h1 className="forgot-title">Buat Kata Sandi Baru</h1>
          <p className="forgot-subtitle">
            Pastikan kata sandi baru Anda <br />
            mudah diingat namun sulit ditebak.
          </p>
          <p className="forgot-instruction">Min. 8 karakter, huruf besar, angka & unik.</p>
        </div>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="forgot-form">
            {/* Password Baru */}
            <div className="form-group">
              <Label htmlFor="password" className="form-label">
                Kata Sandi Baru
              </Label>
              <div className="reset-input-wrapper">
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 karakter"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  className="form-input"
                />
                {password.length > 0 && (
                  <div className="reset-strength">
                    <div
                      className={`reset-strength-bar ${
                        password.length < 6
                          ? "reset-strength-bar--weak"
                          : password.length < 10
                          ? "reset-strength-bar--medium"
                          : "reset-strength-bar--strong"
                      }`}
                    />
                    <span className="reset-strength-label">
                      {password.length < 6
                        ? "Terlalu pendek"
                        : password.length < 10
                        ? "Cukup"
                        : "Kuat"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div className="form-group">
              <Label htmlFor="confirmPassword" className="form-label">
                Konfirmasi Kata Sandi
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                required
                className={`form-input ${
                  confirmPassword.length > 0 && confirmPassword !== password
                    ? "form-input--error"
                    : ""
                }`}
              />
              {confirmPassword.length > 0 && confirmPassword === password && (
                <span className="reset-match-hint reset-match-hint--ok">
                  <RiCheckLine
                    size={13}
                    style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }}
                  />
                  Kata sandi cocok
                </span>
              )}
            </div>

            {/* Error message */}
            {error && (
              <p className="reset-error-message" role="alert">
                <RiCloseLine
                  size={15}
                  style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}
                />
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="submit-button"
            >
              {isLoading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
            </Button>
          </form>
        </CardContent>

        <div className="forgot-footer">
          <p>
            Ingat kata sandi lama?{" "}
            <Link to="/login" className="forgot-back-link">
              Masuk
            </Link>
            {/* blm: yg Daftar Sekarang di login disamain sama ini ya */}
          </p>
        </div>
      </Card>
    </main>
  );
}