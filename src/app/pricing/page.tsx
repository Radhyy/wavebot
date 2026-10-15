"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Check, 
  ArrowRight, 
  Zap, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Script from "next/script";
import dynamic from "next/dynamic";
import { createSubscriptionOrder, simulateSuccessPayment } from "@/app/actions/payment";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

declare global {
  interface Window {
    snap: any;
  }
}

const pricingPlans = [
  {
    id: "FREE",
    name: "Free Trial",
    price: "Rp 0",
    period: "/selamanya",
    messages: "500 Pesan",
    description: "Ideal untuk pengujian fitur, coba koneksi bot, dan kirim pesan standar.",
    isPopular: false,
    cta: "Coba Gratis",
    features: [
      { text: "500 Pesan WhatsApp", included: true },
      { text: "1 Nomor WhatsApp Terhubung", included: true },
      { text: "Kirim Pesan Teks & Gambar", included: true },
      { text: "REST API Endpoint Dasar", included: true },
      { text: "Auto-Reply Keyword Otomatis", included: false },
      { text: "Pesan Terjadwal & Pengingat", included: false },
      { text: "Broadcast & Pesan Massal", included: false },
      { text: "Integrasi AI Chatbot (Groq LLM)", included: false },
      { text: "Webhook Real-Time Notifikasi", included: false },
      { text: "Dukungan Prioritas 24/7", included: false },
    ]
  },
  {
    id: "PAKET_1",
    name: "Paket 1",
    price: "Rp 15.000",
    period: "/bulan",
    messages: "1.000 Pesan",
    description: "Solusi hemat dan fleksibel untuk online shop atau UMKM skala awal.",
    isPopular: false,
    cta: "Pilih Paket 1",
    features: [
      { text: "1.000 Pesan WhatsApp / Bulan", included: true },
      { text: "1 Nomor WhatsApp Terhubung", included: true },
      { text: "Kirim Pesan Teks, Media & File", included: true },
      { text: "REST API Lengkap & Cepat", included: true },
      { text: "Auto-Reply Keyword Otomatis", included: true },
      { text: "Manajemen Kontak & Grup", included: true },
      { text: "Broadcast & Pesan Massal", included: false },
      { text: "Integrasi AI Chatbot (Groq LLM)", included: false },
      { text: "Webhook Real-Time Notifikasi", included: false },
      { text: "Dukungan Prioritas 24/7", included: false },
    ]
  },
  {
    id: "PAKET_2",
    name: "Paket 2",
    price: "Rp 30.000",
    period: "/bulan",
    messages: "4.000 Pesan",
    description: "Paling populer untuk bisnis berkembang yang butuh promosi broadcast & jadwal pengingat.",
    isPopular: true,
    cta: "Pilih Paket 2",
    features: [
      { text: "4.000 Pesan WhatsApp / Bulan", included: true },
      { text: "2 Nomor WhatsApp (Multi-Session)", included: true },
      { text: "Kirim Pesan Teks, Media & File", included: true },
      { text: "REST API Lengkap & Cepat", included: true },
      { text: "Auto-Reply & Menu Interaktif", included: true },
      { text: "Pesan Terjadwal & Pengingat Otomatis", included: true },
      { text: "Broadcast & Pesan Massal Cepat", included: true },
      { text: "Webhook Status Pesan Real-Time", included: true },
      { text: "Integrasi AI Chatbot (Groq LLM)", included: false },
      { text: "Dukungan Prioritas 24/7", included: false },
    ]
  },
  {
    id: "PAKET_3",
    name: "Paket 3",
    price: "Rp 50.000",
    period: "/bulan",
    messages: "10.000 Pesan",
    description: "Paket terlengkap untuk volume tinggi dengan kecerdasan AI dan semua fitur terbuka penuh.",
    isPopular: false,
    cta: "Pilih Paket 3",
    features: [
      { text: "10.000 Pesan WhatsApp / Bulan", included: true },
      { text: "Multi-Nomor WhatsApp Bebas", included: true },
      { text: "Kirim Pesan Teks, Media & Dokumen", included: true },
      { text: "REST API Prioritas Latensi Rendah", included: true },
      { text: "Auto-Reply Dinamis & Interaktif", included: true },
      { text: "Pesan Terjadwal & Kalender Otomasi", included: true },
      { text: "Broadcast & Blast Massal Tanpa Batas", included: true },
      { text: "Webhook Real-Time Notifikasi Lengkap", included: true },
      { text: "Integrasi AI Chatbot (Groq LLM Penuh)", included: true },
      { text: "Dukungan Prioritas 24/7 & SLA 99.9%", included: true },
    ]
  }
];

const faqs = [
  {
    q: "Apakah saya bisa mengubah paket langganan kapan saja?",
    a: "Ya! Anda dapat melakukan upgrade atau perpanjangan paket kapan saja. Kuota pesan baru dan fitur langsung aktif seketika setelah pembayaran terkonfirmasi."
  },
  {
    q: "Apakah nomor WhatsApp saya aman dari banned?",
    a: "WaveBot menggunakan engine Baileys modern yang mengirimkan request layaknya WhatsApp Web resmi. Kami juga menyediakan fitur delay acak pada broadcast untuk meminimalkan risiko deteksi spam."
  },
  {
    q: "Bagaimana cara melakukan pembayaran?",
    a: "Kami mendukung QRIS otomatis (GoPay, OVO, Dana, ShopeePay, LinkAja), Virtual Account bank (BCA, Mandiri, BNI, BRI, Permata), dan Alfamart / Indomaret via Midtrans."
  },
  {
    q: "Apa yang terjadi jika kuota pesan bulanan saya habis?",
    a: "Pengiriman pesan via API akan tertahan sementara. Anda dapat melakukan top-up kuota tambahan atau upgrade ke paket yang lebih tinggi secara instan dari Dashboard."
  }
];

export default function PricingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [user, setUser] = useState<any>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [paymentSuccessOrder, setPaymentSuccessOrder] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dynamicPrices, setDynamicPrices] = useState<Record<string, string>>({
    FREE: "Rp 0",
    PAKET_1: "Rp 15.000",
    PAKET_2: "Rp 30.000",
    PAKET_3: "Rp 50.000",
  });

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (e) {
      setUser(null);
      return null;
    }
  };

  // Cek apakah user sedang login dan fetch dynamic prices
  useEffect(() => {
    fetchCurrentUser().finally(() => setIsCheckingUser(false));

    fetch("/api/pricing", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.plans) {
          setDynamicPrices({
            FREE: data.plans.FREE.priceDisplay,
            PAKET_1: data.plans.PAKET_1.priceDisplay,
            PAKET_2: data.plans.PAKET_2.priceDisplay,
            PAKET_3: data.plans.PAKET_3.priceDisplay,
          });
        }
      })
      .catch((err) => console.error("Error fetching pricing:", err));
  }, []);

  const handleSelectPlan = async (plan: any) => {
    setErrorMessage(null);

    // 1. Jika belum login, selalu arahkan ke login terlebih dahulu sesuai permintaan user
    if (!user) {
      router.push(`/login?redirect=/pricing`);
      return;
    }

    // 2. Jika paket FREE
    if (plan.id === "FREE") {
      setProcessingPlanId(plan.id);
      const res = await createSubscriptionOrder("FREE");
      setProcessingPlanId(null);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        router.push("/dashboard");
      }
      return;
    }

    // 3. Paket berbayar (Midtrans Snap)
    setProcessingPlanId(plan.id);
    const res = await createSubscriptionOrder(plan.id);
    setProcessingPlanId(null);

    if (res.error) {
      setErrorMessage(res.error);
      return;
    }

    if (res.token && typeof window !== "undefined" && window.snap) {
      window.snap.pay(res.token, {
        onSuccess: async (result: any) => {
          if (res.orderId) {
            await simulateSuccessPayment(res.orderId);
          }
          await fetchCurrentUser();
          setPaymentSuccessOrder(res.orderId || "Sukses");
        },
        onPending: async (result: any) => {
          if (res.orderId) {
            await simulateSuccessPayment(res.orderId);
          }
          await fetchCurrentUser();
          setPaymentSuccessOrder(res.orderId || "Sukses");
        },
        onError: (err: any) => {
          setErrorMessage("Pembayaran gagal atau dibatalkan.");
        },
        onClose: async () => {
          if (res.orderId) {
            await simulateSuccessPayment(res.orderId);
            await fetchCurrentUser();
            setPaymentSuccessOrder(res.orderId);
          }
        }
      });
    } else if (res.redirect_url) {
      window.location.href = res.redirect_url;
    }
  };

  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "Mid-client-UgzlfN2Dhr3e1R3N";
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
  const snapScriptUrl = isProduction 
    ? "https://app.midtrans.com/snap/snap.js" 
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "var(--font-inter)", color: "#0f172a" }}>
      {/* Midtrans Snap JS (Production / Sandbox Auto) */}
      <Script
        src={snapScriptUrl}
        data-client-key={midtransClientKey}
        strategy="lazyOnload"
      />

      {/* Floating Capsule Navbar */}
      <Navbar activePage="pricing" />

      {/* Main Content Area */}
      <main style={{ paddingTop: "7.5rem", paddingBottom: "6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
          
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "rgba(37, 99, 235, 0.08)",
              color: "#2563eb",
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1rem"
            }}>
              <Zap size={14} />
              <span>PILIHAN PAKET WAVEBOT</span>
            </div>

            <h1 style={{ 
              fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)", 
              fontWeight: 700, 
              color: "#0f172a", 
              letterSpacing: "-0.03em",
              marginBottom: "1rem"
            }}>
              Pilihan Paket & Harga Transparan
            </h1>
            <p style={{ 
              fontSize: "1.12rem", 
              color: "#64748b", 
              maxWidth: "650px", 
              margin: "0 auto 1.5rem auto",
              lineHeight: 1.6 
            }}>
              Mulai dari uji coba gratis hingga kebutuhan broadcast otomatis skala perusahaan.
            </p>

            {/* Notification if User is Logged in */}
            {user && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                padding: "0.5rem 1.25rem",
                borderRadius: "9999px",
                fontSize: "0.9rem",
                color: "#1e40af",
                fontWeight: 600
              }}>
                <span>Login sebagai: <strong>{user.name || user.email}</strong></span>
                <span style={{ 
                  backgroundColor: "#2563eb", 
                  color: "#ffffff", 
                  padding: "0.15rem 0.6rem", 
                  borderRadius: "9999px", 
                  fontSize: "0.75rem",
                  fontWeight: 700
                }}>
                  {user.plan === "PAKET_1" ? "Paket 1" : user.plan === "PAKET_2" ? "Paket 2" : user.plan === "PAKET_3" ? "Paket 3" : "Free Plan"}
                </span>
              </div>
            )}
          </div>

          {/* Success / Error alerts */}
          {paymentSuccessOrder && (
            <div style={{
              maxWidth: "600px",
              margin: "0 auto 2.5rem auto",
              backgroundColor: "#dcfce7",
              border: "1px solid #86efac",
              color: "#166534",
              padding: "1rem 1.5rem",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontWeight: 600
            }}>
              <CheckCircle2 size={22} color="#16a34a" />
              <span>Pembayaran Berhasil! Paket Anda sedang diaktifkan, mengalihkan ke dashboard...</span>
            </div>
          )}

          {errorMessage && (
            <div style={{
              maxWidth: "600px",
              margin: "0 auto 2.5rem auto",
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              padding: "1rem 1.5rem",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontWeight: 600
            }}>
              <AlertCircle size={22} color="#dc2626" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pricing Grid (4 Cards) */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: "2rem",
            marginBottom: "5rem",
            alignItems: "stretch"
          }}>
            {pricingPlans.map((plan, idx) => {
              const isCurrentPlan = user?.plan === plan.id || (!user?.plan && plan.id === "FREE" && user);
              const isLoading = processingPlanId === plan.id;

              return (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "1.25rem",
                    border: plan.isPopular ? "2px solid #2563eb" : "1px solid #e2e8f0",
                    padding: "2.25rem 1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    boxShadow: plan.isPopular 
                      ? "0 20px 40px -15px rgba(37, 99, 235, 0.15)" 
                      : "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                  }}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#2563eb",
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      padding: "0.3rem 1rem",
                      borderRadius: "9999px",
                      boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)"
                    }}>
                      Paling Populer
                    </div>
                  )}

                  {/* Plan Title & Desc */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
                      {plan.name}
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.5, minHeight: "2.7rem" }}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                      <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
                        {dynamicPrices[plan.id] || plan.price}
                      </span>
                      <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: 500 }}>
                        {plan.period}
                      </span>
                    </div>
                    {/* Messages Pill */}
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      backgroundColor: plan.isPopular ? "#eff6ff" : "#f1f5f9",
                      color: plan.isPopular ? "#2563eb" : "#334155",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      padding: "0.4rem 0.85rem",
                      borderRadius: "0.5rem",
                      marginTop: "0.75rem"
                    }}>
                      <Zap size={15} />
                      {plan.messages}
                    </div>
                  </div>

                  {/* Features List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginBottom: "2rem", flex: 1 }}>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                        {feat.included ? (
                          <div style={{ 
                            width: "18px", 
                            height: "18px", 
                            borderRadius: "50%", 
                            backgroundColor: "#dcfce7", 
                            color: "#16a34a", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            marginTop: "2px",
                            flexShrink: 0
                          }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                        ) : (
                          <div style={{ 
                            width: "18px", 
                            height: "18px", 
                            borderRadius: "50%", 
                            backgroundColor: "#f1f5f9", 
                            color: "#94a3b8", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            marginTop: "2px",
                            flexShrink: 0,
                            fontSize: "12px",
                            fontWeight: 700,
                            lineHeight: 1
                          }}>
                            ×
                          </div>
                        )}
                        <span style={{ 
                          fontSize: "0.9rem", 
                          color: feat.included ? "#334155" : "#94a3b8", 
                          lineHeight: 1.4,
                          textDecoration: feat.included ? "none" : "line-through"
                        }}>
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Action Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isLoading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      width: "100%",
                      padding: "0.85rem 1.25rem",
                      borderRadius: "0.75rem",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      cursor: isLoading ? "not-allowed" : "pointer",
                      textAlign: "center",
                      backgroundColor: isCurrentPlan
                        ? "#10b981"
                        : plan.isPopular
                        ? "#2563eb"
                        : "#f8fafc",
                      color: isCurrentPlan || plan.isPopular ? "white" : "#0f172a",
                      border: isCurrentPlan
                        ? "1px solid #10b981"
                        : plan.isPopular
                        ? "1px solid #2563eb"
                        : "1px solid #cbd5e1",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Memproses...
                      </>
                    ) : isCurrentPlan ? (
                      <>
                        <Check size={16} />
                        Paket Aktif Anda
                      </>
                    ) : !user ? (
                      <>
                        Masuk untuk Memilih
                        <ArrowRight size={16} />
                      </>
                    ) : (
                      <>
                        {plan.id === "FREE" ? "Pilih Free Trial" : `Bayar & Langganan`}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Feature Comparison Table */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            borderRadius: "1.25rem", 
            border: "1px solid #e2e8f0", 
            padding: "2.5rem", 
            marginBottom: "5rem",
            overflowX: "auto"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
              Perbandingan Detail Fitur
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "2rem" }}>
              Bandingkan setiap kapabilitas teknis dan fungsional pada masing-masing paket.
            </p>

            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600, width: "35%" }}>Fitur & Kapabilitas</th>
                  <th style={{ padding: "1rem", color: "#0f172a", fontWeight: 700, textAlign: "center" }}>Free Trial</th>
                  <th style={{ padding: "1rem", color: "#0f172a", fontWeight: 700, textAlign: "center" }}>Paket 1</th>
                  <th style={{ padding: "1rem", color: "#2563eb", fontWeight: 700, textAlign: "center" }}>Paket 2</th>
                  <th style={{ padding: "1rem", color: "#0f172a", fontWeight: 700, textAlign: "center" }}>Paket 3</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>Kuota Pesan / Bulan</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#475569" }}>500 Pesan</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#475569" }}>1.000 Pesan</td>
                  <td style={{ padding: "1rem", textAlign: "center", fontWeight: 600, color: "#2563eb" }}>4.000 Pesan</td>
                  <td style={{ padding: "1rem", textAlign: "center", fontWeight: 600, color: "#16a34a" }}>10.000 Pesan</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>Nomor WhatsApp Aktif</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#475569" }}>1 Nomor</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#475569" }}>1 Nomor</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#475569" }}>2 Nomor</td>
                  <td style={{ padding: "1rem", textAlign: "center", fontWeight: 600, color: "#16a34a" }}>Multi-Nomor Bebas</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>REST API & Webhook</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#475569" }}>API Dasar</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#475569" }}>API Lengkap</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#475569" }}>API + Webhook</td>
                  <td style={{ padding: "1rem", textAlign: "center", fontWeight: 600, color: "#16a34a" }}>API Prioritas + Webhook</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>Auto-Reply Otomatis</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>—</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#16a34a" }}>✓ Keyword</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#16a34a" }}>✓ Menu Interaktif</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#16a34a" }}>✓ Menu Dinamis Penuh</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>Broadcast & Pesan Massal</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>—</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>—</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#16a34a" }}>✓ Terjadwal</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#16a34a" }}>✓ Tanpa Batas</td>
                </tr>
                <tr>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>AI Chatbot (Groq LLM)</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>—</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>—</td>
                  <td style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>—</td>
                  <td style={{ padding: "1rem", textAlign: "center", fontWeight: 700, color: "#16a34a" }}>✓ Penuh Termasuk</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FAQ Section */}
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(37, 99, 235, 0.08)",
                color: "#2563eb",
                padding: "0.35rem 0.85rem",
                borderRadius: "9999px",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "0.75rem"
              }}>
                <HelpCircle size={15} />
                <span>FAQ</span>
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
                Pertanyaan yang Sering Diajukan
              </h2>
              <p style={{ color: "#64748b", fontSize: "1rem" }}>
                Masih ragu atau butuh informasi lebih mendalam? Simak jawaban di bawah ini.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((faq, fIdx) => (
                <div 
                  key={fIdx}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden"
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                    style={{
                      width: "100%",
                      padding: "1.25rem 1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "transparent",
                      border: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#0f172a",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={18} 
                      color="#64748b" 
                      style={{ 
                        transform: openFaq === fIdx ? "rotate(180deg)" : "rotate(0deg)", 
                        transition: "transform 0.2s ease",
                        flexShrink: 0,
                        marginLeft: "1rem"
                      }} 
                    />
                  </button>
                  {openFaq === fIdx && (
                    <div style={{ padding: "0 1.5rem 1.25rem", color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Jendela / Modal Konfirmasi Order Berhasil */}
      {paymentSuccessOrder && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1.25rem",
          animation: "fadeIn 0.25s ease-out"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "1.25rem",
            width: "100%",
            maxWidth: "460px",
            padding: "2.5rem 2rem",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{
              width: "90px",
              height: "90px",
              margin: "0 auto 1rem auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Player
                autoplay
                loop={true}
                src="/success-check.json"
                style={{ height: "90px", width: "90px" }}
              />
            </div>

            <h3 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
              Pembayaran Berhasil!
            </h3>
            
            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Selamat! Paket langganan WaveBot Anda telah aktif. Kuota pesan baru dan semua akses fitur paket telah berhasil diaktifkan ke akun Anda.
            </p>

            <div style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              padding: "0.85rem 1rem",
              marginBottom: "1.75rem",
              fontSize: "0.85rem",
              color: "#475569",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>Status Akun:</span>
              <strong style={{ color: "#16a34a", textTransform: "uppercase" }}>
                {user?.plan ? (user.plan === "PAKET_1" ? "Paket 1 Aktif" : user.plan === "PAKET_2" ? "Paket 2 Aktif" : user.plan === "PAKET_3" ? "Paket 3 Aktif" : "Paket Aktif") : "Paket Aktif"}
              </strong>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "0.85rem 1.25rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
                }}
              >
                <span>Buka Dashboard</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => setPaymentSuccessOrder(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  padding: "0.4rem"
                }}
              >
                Tutup jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        padding: "3rem 1.5rem",
        textAlign: "center",
        color: "#64748b",
        fontSize: "0.9rem"
      }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#0f172a" }}>
            <Image 
              src="/LogoNewNoBg.png" 
              alt="WaveBot Logo" 
              width={28} 
              height={28} 
              style={{ objectFit: "contain" }}
            />
            <span style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.025em" }}>WaveBot</span>
          </div>
          <p style={{ margin: 0 }}>
            © 2026 WaveBot. Solusi Modern WhatsApp API Gateway. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/#features" style={{ color: "#64748b", textDecoration: "none" }}>Fitur</Link>
            <Link href="/docs" style={{ color: "#64748b", textDecoration: "none" }}>Dokumentasi API</Link>
            <Link href="/pricing" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>Harga</Link>
            <Link href="/login" style={{ color: "#64748b", textDecoration: "none" }}>Masuk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
