import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (toEmail, resetToken) => {
  console.log("Mencoba kirim email ke:", toEmail); // debug
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"RuangRasa" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset Kata Sandi - RuangRasa',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Reset Kata Sandi Anda</h2>
        <p>Klik tombol di bawah untuk mereset kata sandi kamu. Link berlaku <strong>10 menit</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#45624E;color:#fff;border-radius:24px;text-decoration:none;">
          Reset Kata Sandi
        </a>
        <p style="margin-top:16px;color:#888;font-size:13px;">
          Jika kamu tidak merasa meminta reset kata sandi akun RuangRasa, abaikan email ini.
        </p>
      </div>
    `,
  });
};