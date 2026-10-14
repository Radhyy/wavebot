"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { 
  Camera, 
  User, 
  Mail, 
  ShieldCheck, 
  KeyRound, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lock,
  Calendar,
  Sparkles,
  Eye,
  EyeOff,
  XCircle
} from "lucide-react";
import { 
  updateProfileName, 
  updateProfileAvatar, 
  requestPasswordOtp, 
  verifyOtpOnly,
  updatePasswordAfterOtp 
} from "@/app/actions/settings";

interface SettingsClientProps {
  initialName: string;
  initialEmail: string;
  initialAvatar: string | null;
  isGoogleUser: boolean;
  createdAt: string;
}

export default function SettingsClient({
  initialName,
  initialEmail,
  initialAvatar,
  isGoogleUser,
  createdAt,
}: SettingsClientProps) {
  // State Profile
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State Avatar Upload
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State OTP & Reset Password Flow: 'idle' -> 'otp' -> 'password'
  const [otpStep, setOtpStep] = useState<"idle" | "otp" | "password">("idle");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [otpMsg, setOtpMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Simpan Nama
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameLoading(true);
    setNameMsg(null);

    const res = await updateProfileName(name);
    setNameLoading(false);

    if (res.success) {
      setNameMsg({ type: "success", text: "Nama profil berhasil diperbarui!" });
      setTimeout(() => setNameMsg(null), 3000);
    } else {
      setNameMsg({ type: "error", text: res.error || "Gagal memperbarui nama" });
    }
  };

  // 2. Upload Foto Profil ke S3
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview lokal langsung
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);

    setAvatarLoading(true);
    setAvatarMsg(null);

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await updateProfileAvatar(formData);
    setAvatarLoading(false);

    if (res.success && res.avatarUrl) {
      setAvatar(res.avatarUrl);
      setAvatarMsg({ type: "success", text: "Foto profil berhasil diunggah ke AWS S3!" });
      setTimeout(() => setAvatarMsg(null), 3500);
    } else {
      setAvatarMsg({ type: "error", text: res.error || "Gagal mengunggah foto" });
      setAvatar(initialAvatar);
    }
  };

  // 3. Minta Kode OTP
  const handleRequestOtp = async () => {
    setOtpLoading(true);
    setOtpMsg(null);

    const res = await requestPasswordOtp();
    setOtpLoading(false);

    if (res.success) {
      setOtpStep("otp");
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpMsg({ type: "success", text: res.message || "Kode OTP 6-digit terkirim ke Gmail Anda!" });
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } else {
      setOtpMsg({ type: "error", text: res.error || "Gagal mengirim OTP" });
    }
  };

  // Handler Kotak Input OTP (Auto Focus & Backspace)
  const handleOtpBoxChange = (index: number, value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, "");
    if (!cleanVal) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = "";
      setOtpDigits(nextDigits);
      return;
    }

    // Jika paste banyak angka sekaligus (misal 6 digit)
    if (cleanVal.length > 1) {
      const nextDigits = [...otpDigits];
      const chars = cleanVal.slice(0, 6).split("");
      chars.forEach((c, i) => {
        if (index + i < 6) nextDigits[index + i] = c;
      });
      setOtpDigits(nextDigits);
      const nextIndex = Math.min(index + chars.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    // 1 digit per kotak
    const nextDigits = [...otpDigits];
    nextDigits[index] = cleanVal.slice(-1);
    setOtpDigits(nextDigits);

    // Auto pindah ke kotak berikutnya
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // 4. Verifikasi Kode OTP (Step 2)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length !== 6) {
      setOtpMsg({ type: "error", text: "Lengkapi 6 digit kode OTP" });
      return;
    }

    setVerifyLoading(true);
    setOtpMsg(null);

    const res = await verifyOtpOnly(code);
    setVerifyLoading(false);

    if (res.success) {
      setOtpStep("password");
      setOtpMsg({ type: "success", text: "Kode OTP valid! Silakan masukkan kata sandi baru Anda." });
    } else {
      setOtpMsg({ type: "error", text: res.error || "Kode OTP tidak valid atau kedaluwarsa" });
    }
  };

  // 5. Simpan Kata Sandi Baru (Step 3)
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setOtpMsg({ type: "error", text: "Konfirmasi password tidak cocok" });
      return;
    }

    if (newPassword.length < 6) {
      setOtpMsg({ type: "error", text: "Password baru minimal 6 karakter" });
      return;
    }

    setResetLoading(true);
    setOtpMsg(null);

    const code = otpDigits.join("");
    const res = await updatePasswordAfterOtp(code, newPassword);
    setResetLoading(false);

    if (res.success) {
      setOtpMsg({ type: "success", text: "Password berhasil diperbarui! Silakan gunakan password baru saat login." });
      setOtpDigits(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
      setOtpStep("idle");
    } else {
      setOtpMsg({ type: "error", text: res.error || "Gagal mengubah password" });
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.025em", margin: 0 }}>
          Pengaturan Akun & Profil
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.925rem", marginTop: "0.35rem" }}>
          Kelola informasi identitas, foto profil cloud, dan keamanan kata sandi Anda.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
        
        {/* CARD 1: INFORMASI PROFIL & FOTO */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          border: "1px solid #e2e8f0",
          padding: "1.75rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <User size={20} color="#2563eb" />
            <h2 style={{ fontSize: "1.15rem", fontWeight: 600, color: "#0f172a", margin: 0 }}>
              Profil Pengguna
            </h2>
          </div>

          {/* Upload Foto Profil */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.75rem" }}>
            <div style={{ position: "relative", width: "104px", height: "104px" }}>
              <div style={{
                width: "104px",
                height: "104px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #e2e8f0",
                backgroundColor: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Foto Profil"
                    fill
                    sizes="104px"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                ) : (
                  <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "#2563eb" }}>
                    {name.charAt(0).toUpperCase()}
                  </span>
                )}

                {avatarLoading && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff"
                  }}>
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                )}
              </div>

              {/* Tombol Kamera */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                title="Ganti Foto Profil"
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "2px solid #ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
                }}
              >
                <Camera size={15} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            <p style={{ fontSize: "0.775rem", color: "#64748b", marginTop: "0.75rem", textAlign: "center" }}>
              Klik ikon kamera untuk mengunggah foto ke <b>AWS S3</b> (Maks 5MB)
            </p>

            {avatarMsg && (
              <div style={{
                marginTop: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                backgroundColor: avatarMsg.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: avatarMsg.type === "success" ? "#059669" : "#dc2626",
              }}>
                {avatarMsg.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {avatarMsg.text}
              </div>
            )}
          </div>

          {/* Form Ubah Nama */}
          <form onSubmit={handleSaveName} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>
                Nama / Username
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} color="#94a3b8" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Masukkan nama Anda"
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.875rem 0.65rem 2.4rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.925rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>
                Alamat Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="#94a3b8" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="email"
                  value={initialEmail}
                  disabled
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.875rem 0.65rem 2.4rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    color: "#64748b",
                    fontSize: "0.925rem",
                    cursor: "not-allowed",
                  }}
                />
              </div>
              <span style={{ fontSize: "0.725rem", color: "#94a3b8", marginTop: "0.25rem", display: "block" }}>
                Email terdaftar digunakan untuk menerima notifikasi & OTP.
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", border: "1px solid #f1f5f9" }}>
              <Calendar size={15} color="#64748b" />
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Bergabung sejak: <b>{createdAt}</b>
              </span>
            </div>

            {nameMsg && (
              <div style={{
                padding: "0.6rem 0.75rem",
                borderRadius: "0.375rem",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                backgroundColor: nameMsg.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: nameMsg.type === "success" ? "#059669" : "#dc2626",
              }}>
                {nameMsg.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                {nameMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={nameLoading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.7rem",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: 600,
                fontSize: "0.925rem",
                cursor: nameLoading ? "not-allowed" : "pointer",
                marginTop: "0.5rem"
              }}
            >
              {nameLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {nameLoading ? "Menyimpan..." : "Simpan Perubahan Nama"}
            </button>
          </form>
        </div>


        {/* CARD 2: RESET PASSWORD DENGAN OTP GMAIL */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          border: "1px solid #e2e8f0",
          padding: "1.75rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <KeyRound size={20} color="#2563eb" />
            <h2 style={{ fontSize: "1.15rem", fontWeight: 600, color: "#0f172a", margin: 0 }}>
              Ganti Password (OTP Gmail)
            </h2>
          </div>

          <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
            Untuk keamanan akun, reset password membutuhkan verifikasi kode OTP 6-digit yang dikirimkan langsung ke kotak masuk email Anda.
          </p>

          {isGoogleUser && (
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              padding: "0.75rem",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "0.5rem",
              color: "#1e40af",
              fontSize: "0.8rem",
              marginBottom: "1.5rem"
            }}>
              <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>
                Akun ini terhubung dengan <b>Google Sign-In</b>. Anda juga dapat membuat password manual di sini agar dapat login dengan email & password biasa.
              </span>
            </div>
          )}

          {otpMsg && (
            <div style={{
              padding: "0.75rem",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              marginBottom: "1.25rem",
              backgroundColor: otpMsg.type === "success" ? "#ecfdf5" : "#fef2f2",
              color: otpMsg.type === "success" ? "#065f46" : "#991b1b",
              border: `1px solid ${otpMsg.type === "success" ? "#a7f3d0" : "#fecaca"}`
            }}>
              {otpMsg.type === "success" ? <CheckCircle2 size={16} style={{ marginTop: "2px", flexShrink: 0 }} /> : <AlertCircle size={16} style={{ marginTop: "2px", flexShrink: 0 }} />}
              <span>{otpMsg.text}</span>
            </div>
          )}

          {otpStep === "idle" && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem 1rem",
              textAlign: "center",
              backgroundColor: "#f8fafc",
              borderRadius: "0.75rem",
              border: "1px dashed #cbd5e1"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem"
              }}>
                <Send size={22} />
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.25rem" }}>
                Kirim Kode OTP ke Email
              </h3>
              <p style={{ fontSize: "0.825rem", color: "#64748b", maxWidth: "280px", margin: "0 0 1.25rem" }}>
                Kode OTP rahasia akan dikirimkan ke <b>{initialEmail}</b>
              </p>

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={otpLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.5rem",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: otpLoading ? "not-allowed" : "pointer"
                }}
              >
                {otpLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {otpLoading ? "Mengirim OTP..." : "Kirim Kode OTP Sekarang"}
              </button>
            </div>
          )}

          {/* STEP 2: MASUKKAN 6 DIGIT KOTAK OTP */}
          {otpStep === "otp" && (
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.5rem"
                }}>
                  <ShieldCheck size={22} />
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.25rem" }}>
                  Verifikasi Kode OTP
                </h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
                  Masukkan 6 digit angka yang kami kirim ke <b>{initialEmail}</b>
                </p>
              </div>

              {/* 6 KOTAK KODE OTP */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={idx === 0 ? 6 : 1}
                    value={digit}
                    onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    style={{
                      width: "44px",
                      height: "52px",
                      textAlign: "center",
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      color: "#1e293b",
                      borderRadius: "0.5rem",
                      border: digit ? "2px solid #2563eb" : "1.5px solid #cbd5e1",
                      backgroundColor: digit ? "#eff6ff" : "#ffffff",
                      outline: "none",
                      transition: "all 0.15s ease",
                      boxShadow: digit ? "0 0 0 2px rgba(37,99,235,0.15)" : "none"
                    }}
                  />
                ))}
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpLoading}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: otpLoading ? "not-allowed" : "pointer"
                  }}
                >
                  {otpLoading ? "Mengirim ulang..." : "Tidak menerima kode? Kirim Ulang"}
                </button>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep("idle");
                    setOtpMsg(null);
                  }}
                  style={{
                    padding: "0.7rem 1.1rem",
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer"
                  }}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={verifyLoading || otpDigits.join("").length !== 6}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.7rem",
                    backgroundColor: otpDigits.join("").length === 6 ? "#2563eb" : "#94a3b8",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: verifyLoading || otpDigits.join("").length !== 6 ? "not-allowed" : "pointer",
                    boxShadow: otpDigits.join("").length === 6 ? "0 2px 4px rgba(37,99,235,0.2)" : "none"
                  }}
                >
                  {verifyLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {verifyLoading ? "Memverifikasi OTP..." : "Verifikasi OTP"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: OTP VALID, FORM BIKIN PASSWORD BARU MUNCUL */}
          {otpStep === "password" && (
            <form onSubmit={handleSaveNewPassword} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "0.5rem",
                color: "#065f46",
                fontSize: "0.85rem",
                fontWeight: 600
              }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>OTP Terverifikasi! Masukkan kata sandi baru Anda.</span>
              </div>

              {/* Password Baru */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>
                  Password Baru
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} color="#94a3b8" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Minimal 6 karakter"
                    style={{
                      width: "100%",
                      padding: "0.65rem 2.5rem 0.65rem 2.4rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.925rem",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center"
                    }}
                    title={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password Baru */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>
                    Konfirmasi Password Baru
                  </label>
                  {confirmPassword.length > 0 && (
                    <span style={{
                      fontSize: "0.775rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      color: newPassword === confirmPassword ? "#059669" : "#dc2626"
                    }}>
                      {newPassword === confirmPassword ? (
                        <>
                          <CheckCircle2 size={13} />
                          Password Cocok
                        </>
                      ) : (
                        <>
                          <XCircle size={13} />
                          Belum Sesuai
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div style={{ position: "relative" }}>
                  <Lock size={16} color="#94a3b8" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Ulangi password baru"
                    style={{
                      width: "100%",
                      padding: "0.65rem 4.5rem 0.65rem 2.4rem",
                      borderRadius: "0.5rem",
                      border: confirmPassword.length > 0 
                        ? (newPassword === confirmPassword ? "1.5px solid #10b981" : "1.5px solid #ef4444")
                        : "1px solid #cbd5e1",
                      backgroundColor: confirmPassword.length > 0 
                        ? (newPassword === confirmPassword ? "#f0fdf4" : "#fef2f2")
                        : "#ffffff",
                      fontSize: "0.925rem",
                      outline: "none",
                      transition: "all 0.15s ease"
                    }}
                  />

                  {/* Indikator Status & Tombol Mata */}
                  <div style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    {confirmPassword.length > 0 && (
                      newPassword === confirmPassword ? (
                        <CheckCircle2 size={18} color="#10b981" />
                      ) : (
                        <XCircle size={18} color="#ef4444" />
                      )
                    )}

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center"
                      }}
                      title={showConfirmPassword ? "Sembunyikan password" : "Lihat password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep("otp");
                    setOtpMsg(null);
                  }}
                  style={{
                    padding: "0.7rem 1.1rem",
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer"
                  }}
                >
                  Kembali
                </button>

                <button
                  type="submit"
                  disabled={resetLoading || newPassword.length < 6 || newPassword !== confirmPassword}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.7rem",
                    backgroundColor: newPassword.length >= 6 && newPassword === confirmPassword ? "#2563eb" : "#94a3b8",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: resetLoading || newPassword.length < 6 ? "not-allowed" : "pointer",
                  }}
                >
                  {resetLoading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                  {resetLoading ? "Menyimpan..." : "Simpan Password Baru"}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
