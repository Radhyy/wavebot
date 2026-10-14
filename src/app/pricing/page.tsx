"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, Zap, HelpCircle, ShieldCheck, Clock, MessageSquare, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";

const pricingPlans = [
  {
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
    a: "Ya! Anda dapat melakukan upgrade atau downgrade paket kapan saja melalui Dashboard. Kuota pesan baru akan langsung aktif setelah konfirmasi."
  },
  {
    q: "Apakah nomor WhatsApp saya aman dari banned?",
    a: "WaveBot menggunakan engine Baileys modern yang mengirimkan request layaknya WhatsApp Web resmi. Kami juga menyediakan fitur delay acak pada broadcast untuk meminimalkan risiko deteksi spam."
  },
  {
    q: "Bagaimana cara melakukan pembayaran?",
    a: "Kami mendukung berbagai metode pembayaran otomatis melalui QRIS (GoPay, OVO, Dana, ShopeePay), Transfer Bank (BCA, Mandiri, BRI, BNI), serta Virtual Account."
  },
  {
    q: "Apa yang terjadi jika kuota pesan bulanan saya habis?",
    a: "Pengiriman pesan via API akan tertahan sementara. Anda dapat melakukan top-up kuota tambahan atau upgrade ke paket yang lebih tinggi secara instan dari Dashboard."
  }
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "var(--font-inter)", color: "#0f172a" }}>
      {/* Floating Capsule Navbar */}
      <Navbar activePage="pricing" />

      {/* Main Content Area */}
      <main style={{ paddingTop: "7.5rem", paddingBottom: "6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
          
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <h1 style={{ 
              fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)", 
              fontWeight: 600, 
              color: "#0f172a", 
              letterSpacing: "-0.03em",
              marginBottom: "1rem"
            }}>
              Pilihan Paket & Harga Transparan
            </h1>
            <p style={{ 
              fontSize: "1.15rem", 
              color: "#64748b", 
              maxWidth: "650px", 
              margin: "0 auto", 
              lineHeight: 1.6 
            }}>
              Pilih paket yang paling sesuai dengan kebutuhan skala bisnis Anda. Tanpa biaya tersembunyi, mulai gratis kapan saja.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="pricing-grid-container" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
            alignItems: "stretch",
            marginBottom: "6rem"
          }}>
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "1.25rem",
                  padding: "2.25rem 1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: plan.isPopular ? "2px solid #2563eb" : "1px solid #e2e8f0",
                  boxShadow: plan.isPopular 
                    ? "0 20px 40px -15px rgba(37, 99, 235, 0.2)" 
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
                      {plan.price}
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

                {/* CTA Button */}
                <Link
                  href="/register"
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
                    textDecoration: "none",
                    textAlign: "center",
                    backgroundColor: plan.isPopular ? "#2563eb" : "#f8fafc",
                    color: plan.isPopular ? "white" : "#0f172a",
                    border: plan.isPopular ? "1px solid #2563eb" : "1px solid #cbd5e1",
                    transition: "all 0.2s ease"
                  }}
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            borderRadius: "1.25rem", 
            border: "1px solid #e2e8f0", 
            padding: "2.5rem", 
            marginBottom: "6rem",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)"
          }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 600, color: "#0f172a", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
              Tabel Komparasi Lengkap
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "2rem" }}>
              Bandingkan fitur secara mendalam antar tiap paket WaveBot.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                    <th style={{ padding: "1rem", color: "#475569", fontWeight: 700 }}>Fitur Utama</th>
                    <th style={{ padding: "1rem", color: "#0f172a", fontWeight: 700, textAlign: "center" }}>Free Trial</th>
                    <th style={{ padding: "1rem", color: "#0f172a", fontWeight: 700, textAlign: "center" }}>Paket 1</th>
                    <th style={{ padding: "1rem", color: "#2563eb", fontWeight: 700, textAlign: "center" }}>Paket 2 (Populer)</th>
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
                    <td style={{ padding: "1rem", fontWeight: 600 }}>Auto-Reply & Menu</td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>—</td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "#16a34a" }}>✓ Keyword</td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "#16a34a" }}>✓ Menu Interaktif</td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "#16a34a" }}>✓ Menu Dinamis Penuh</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem", fontWeight: 600 }}>Broadcast Massal</td>
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
          </div>

          {/* FAQ Section */}
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 600, color: "#0f172a", textAlign: "center", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748b", textAlign: "center", marginBottom: "2.5rem" }}>
              Pertanyaan seputar paket, pembayaran, serta keandalan layanan kami.
            </p>

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

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1100px) {
          .pricing-grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 640px) {
          .pricing-grid-container {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}} />
    </div>
  );
}
