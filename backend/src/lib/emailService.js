import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4, // Force IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (toEmail, resetToken) => {
  console.log("Mencoba kirim email ke:", toEmail);
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { email: process.env.EMAIL_FROM, name: 'RuangRasa' },
      to: [{ email: toEmail }],
      subject: 'Reset Kata Sandi - RuangRasa',
      htmlContent: `
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
    }),
  });

  const result = await response.json();
  console.log("Brevo result:", JSON.stringify(result));
};