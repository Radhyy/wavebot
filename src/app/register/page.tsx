"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  UserPlus, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Send,
  ArrowLeft
} from "lucide-react";
import { sendRegisterOtp, completeRegistration } from "@/app/actions/auth";

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 6 boxes OTP
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 1: Submit Form Pendaftaran & Minta OTP
  const handleRequestRegisterOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    const res = await sendRegisterOtp(email, name);
    setLoading(false);

    if (res.success) {
      setStep("otp");
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } else {
      setError(res.error || "Gagal mengirim kode verifikasi OTP");
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

    // Jika user paste 6 digit sekaligus
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

    const nextDigits = [...otpDigits];
    nextDigits[index] = cleanVal.slice(-1);
    setOtpDigits(nextDigits);

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verifikasi OTP & Selesaikan Akun
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length !== 6) {
      setError("Silakan lengkapi 6 digit kode OTP");
      return;
    }

    setVerifyLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    const res = await completeRegistration(formData, code);
    setVerifyLoading(false);

    if (res?.error) {
      setError(res.error);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    const res = await sendRegisterOtp(email, name);
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Gagal mengirim ulang OTP");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: step === "otp" ? "420px" : "440px" }}>
        {/* Header */}
        <div className="auth-header" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Image
              src="/LogoNewNoBg.png"
              alt="WaveBot Logo"
              width={80}
              height={60}
              style={{ width: "56px", height: "auto" }}
              priority
            />
            <span style={{ 
              fontSize: "1.75rem", 
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.025em",
              lineHeight: 1
            }}>
              WaveBot
            </span>
          </div>
          <h1 className="auth-title">
            {step === "form" ? "Join WaveBot" : "Verifikasi Email"}
          </h1>
          <p className="auth-subtitle">
            {step === "form" 
              ? "Create an account to start building." 
              : `Masukkan 6-digit kode OTP yang dikirim ke ${email}`}
          </p>
        </div>

        {error && (
          <div style={{
            padding: "0.75rem",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            textAlign: "center",
            marginBottom: "1rem",
            border: "1px solid #fecaca"
          }}>
            {error}
          </div>
        )}

        {/* STEP 1: FORM PENGISIAN BIASA */}
        {step === "form" && (
          <>
            <form className="auth-form" onSubmit={handleRequestRegisterOtp}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    name="name"
                    type="text"
                    id="name"
                    className="form-input"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    name="email"
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-input"
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.875rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                    title={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password dengan Centang / Silang */}
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="confirmPassword">Konfirmasi Password</label>
                  {confirmPassword.length > 0 && (
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      color: password === confirmPassword ? "#059669" : "#dc2626"
                    }}>
                      {password === confirmPassword ? (
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

                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="form-input"
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{
                      paddingRight: "5rem",
                      borderColor: confirmPassword.length > 0 
                        ? (password === confirmPassword ? "#10b981" : "#ef4444")
                        : undefined,
                      backgroundColor: confirmPassword.length > 0
                        ? (password === confirmPassword ? "#f0fdf4" : "#fef2f2")
                        : undefined
                    }}
                  />

                  {/* Status Indicator & Eye Button */}
                  <div style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    zIndex: 10,
                  }}>
                    {confirmPassword.length > 0 && (
                      password === confirmPassword ? (
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
                        color: "#64748b",
                        cursor: "pointer",
                        padding: "0.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={showConfirmPassword ? "Sembunyikan password" : "Lihat password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: "0.5rem"
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                {loading ? "Mengirim OTP..." : "Lanjutkan Verifikasi OTP"}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", margin: "0.75rem 0", gap: "0.75rem" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }} />
              <span style={{ fontSize: "0.725rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Atau</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }} />
            </div>

            <a
              href="/api/auth/google"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                color: "#334155",
                fontSize: "0.925rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.borderColor = "#94a3b8";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Daftar dengan Google
            </a>
          </>
        )}

        {/* STEP 2: INPUT 6 DIGIT KOTAK OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyAndRegister} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem"
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.25rem" }}>
                Masukkan Kode OTP
              </h3>
              <p style={{ fontSize: "0.825rem", color: "#64748b", margin: 0 }}>
                Kode 6-digit rahasia telah dikirim ke <b>{email}</b>
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
                onClick={handleResendOtp}
                disabled={loading}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Mengirim ulang..." : "Tidak menerima kode? Kirim Ulang"}
              </button>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setError("");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  padding: "0.7rem 1rem",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer"
                }}
              >
                <ArrowLeft size={16} />
                Kembali
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
                {verifyLoading ? "Memverifikasi..." : "Verifikasi & Masuk"}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer" style={{ marginTop: "1.25rem" }}>
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
