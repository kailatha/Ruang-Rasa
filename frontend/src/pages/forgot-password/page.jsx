import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import "./page.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setIsSuccess(true);
    } catch (error) {
      alert(error.message || 'Terjadi kesalahan koneksi ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="forgot-container">
      <Card className="forgot-card">
        {/* Header Section */}
        <div className="forgot-header">
          <h1 className="forgot-title">Lupa Kata Sandi Anda?</h1>
          <p className="forgot-subtitle">
            Jangan khawatir, <br />
            kami akan membantu Anda.
          </p>
          <p className="forgot-instruction">
            Masukkan email yang terdaftar di bawah ini.
          </p>
        </div>

        {/* Form Section */}
        <CardContent className="p-0">
          {isSuccess ? (
            <div className="forgot-success-message">
              <p>Instruksi pemulihan kata sandi telah dikirim ke <strong>{email}</strong>.</p>
              <p className="mt-4">
                <Link to="/login" className="forgot-back-link">
                  Kembali ke Halaman Masuk
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="forgot-form">
              {/* Email Field - Menggunakan reusable komponen bawaan UI, adoh ini masi templet yak */}
              <div className="form-group">
                <Label htmlFor="email" className="form-label">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="submit-button"
              >
                {isLoading ? "Mengirim..." : "Kirim Email"}
              </Button>
            </form>
          )}
        </CardContent>

        {/* Footer Section */}
        <div className="forgot-footer">
          <p>Keamanan Anda adalah prioritas kami</p>
        </div>
      </Card>
    </main>
  );
}
