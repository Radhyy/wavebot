import nodemailer from "nodemailer";

export async function sendOtpEmail(
  to: string, 
  otpCode: string, 
  type: "RESET_PASSWORD" | "REGISTER" = "RESET_PASSWORD"
): Promise<{ success: boolean; error?: string }> {
  const user = process.env.GMAIL_USER || "wavebotwhatsapp@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD || "lgbwpmfvvdpefimq";

  const isRegister = type === "REGISTER";
  const subject = isRegister 
    ? `Kode Verifikasi Pendaftaran WaveBot: ${otpCode}`
    : `Kode Verifikasi Reset Password WaveBot: ${otpCode}`;

  const messageText = isRegister
    ? "Terima kasih telah mendaftar di WaveBot! Gunakan kode OTP berikut untuk menyelesaikan verifikasi akun Anda:"
    : "Halo, kami menerima permintaan untuk mengatur ulang kata sandi akun WaveBot Anda. Gunakan kode OTP berikut:";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"WaveBot Support" <${user}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 700;">WaveBot</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">
            ${isRegister ? "Verifikasi Email Pendaftaran Akun" : "Keamanan Akun & Verifikasi"}
          </p>
        </div>

        <p style="color: #334155; font-size: 15px; line-height: 1.5;">
          ${messageText}
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <div style="display: inline-block; padding: 14px 28px; background-color: #f1f5f9; border: 1px dashed #2563eb; border-radius: 8px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e40af;">
            ${otpCode}
          </div>
          <p style="color: #ef4444; font-size: 12px; margin-top: 8px; font-weight: 500;">
            *Kode ini hanya berlaku selama 5 menit.
          </p>
        </div>

        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          Jika Anda tidak merasa melakukan pendaftaran ini, abaikan email ini.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
          &copy; ${new Date().getFullYear()} WaveBot Platform. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error("GMAIL OTP SEND ERROR:", error);
    return { success: false, error: error?.message || "Gagal menghubungi server Gmail" };
  }
}
