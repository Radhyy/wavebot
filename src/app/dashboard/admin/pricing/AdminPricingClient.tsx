"use client";

import { useState } from "react";
import { 
  Tag, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Rocket, 
  Crown,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { updatePlanPricesAction } from "@/app/actions/pricing";

interface AdminPricingClientProps {
  initialPrices: {
    PAKET_1: number;
    PAKET_2: number;
    PAKET_3: number;
  };
}

export default function AdminPricingClient({ initialPrices }: AdminPricingClientProps) {
  const [prices, setPrices] = useState(initialPrices);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePriceChange = (planKey: keyof typeof prices, value: string) => {
    const numeric = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    setPrices((prev) => ({
      ...prev,
      [planKey]: numeric,
    }));
  };

  const handleResetDefault = () => {
    setPrices({
      PAKET_1: 15000,
      PAKET_2: 30000,
      PAKET_3: 50000,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      const res = await updatePlanPricesAction(prices);
      if (res?.error) {
        setNotification({ type: "error", text: res.error });
      } else {
        setNotification({ 
          type: "success", 
          text: "Harga paket berhasil diperbarui! Perubahan langsung aktif di landing page & pembayaran." 
        });
      }
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Terjadi kesalahan saat menyimpan harga." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const planCards = [
    {
      key: "PAKET_1" as const,
      name: "Paket 1",
      badge: "Starter",
      badgeColor: "#3b82f6",
      icon: Zap,
      messages: "1.000 Pesan / Bulan",
      features: ["Auto-Reply Otomatis", "Kirim Teks & Media", "REST API Endpoint", "Bebas Nomor WhatsApp"],
      defaultPrice: 15000,
    },
    {
      key: "PAKET_2" as const,
      name: "Paket 2",
      badge: "Most Popular",
      badgeColor: "#8b5cf6",
      icon: Rocket,
      messages: "4.000 Pesan / Bulan",
      features: ["Semua Fitur Paket 1", "Pesan Terjadwal / Reminder", "Broadcast & Pesan Massal", "Menu Flow Interaktif"],
      defaultPrice: 30000,
    },
    {
      key: "PAKET_3" as const,
      name: "Paket 3",
      badge: "Enterprise Pro",
      badgeColor: "#10b981",
      icon: Crown,
      messages: "10.000 Pesan / Bulan",
      features: ["Semua Fitur Paket 2", "AI Chatbot (Groq LLM)", "Konteks AI Cerdas", "Prioritas Eksekusi Queue"],
      defaultPrice: 50000,
    },
  ];

  return (
    <div className="dashboard-container" style={{ paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
            <h1 style={{ 
              fontFamily: "var(--font-poppins)", 
              fontSize: "2.25rem", 
              fontWeight: 700, 
              color: "var(--foreground)", 
              margin: 0, 
              letterSpacing: "-0.025em" 
            }}>
              Manajemen Harga Paket
            </h1>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.25rem 0.65rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundColor: "#f1f5f9",
              color: "#475569",
              border: "1px solid #e2e8f0"
            }}>
              <ShieldCheck size={13} style={{ color: "#2563eb" }} />
              Admin Only
            </span>
          </div>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.95rem" }}>
            Ubah nominal tarif paket berlangganan. Perubahan akan langsung tampil secara real-time di Landing Page, halaman Pricing, serta gateway Midtrans.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.55rem 0.95rem",
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.6rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#475569",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
          >
            <ExternalLink size={15} />
            Lihat Landing Page
          </Link>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div style={{
          padding: "0.85rem 1.25rem",
          borderRadius: "0.75rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontSize: "0.9rem",
          backgroundColor: notification.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${notification.type === "success" ? "#bbf7d0" : "#fecaca"}`,
          color: notification.type === "success" ? "#166534" : "#991b1b"
        }}>
          {notification.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontWeight: 500 }}>{notification.text}</span>
        </div>
      )}

      {/* Form Editor */}
      <form onSubmit={handleSave}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          {planCards.map((plan) => {
            const Icon = plan.icon;
            const currentPrice = prices[plan.key];

            return (
              <div 
                key={plan.key}
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "1.25rem",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
              >
                <div>
                  {/* Card Top */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "0.75rem",
                      backgroundColor: `${plan.badgeColor}15`,
                      color: plan.badgeColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Icon size={22} />
                    </div>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.65rem",
                      borderRadius: "9999px",
                      backgroundColor: `${plan.badgeColor}15`,
                      color: plan.badgeColor
                    }}>
                      {plan.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0 0 0.25rem 0", color: "#0f172a" }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1.25rem 0" }}>
                    {plan.messages}
                  </p>

                  {/* Input Harga */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "0.45rem" }}>
                      Tarif per Bulan (Rupiah)
                    </label>
                    <div style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center"
                    }}>
                      <span style={{
                        position: "absolute",
                        left: "1rem",
                        fontWeight: 700,
                        color: "#64748b",
                        fontSize: "0.95rem"
                      }}>
                        Rp
                      </span>
                      <input
                        type="text"
                        value={currentPrice.toLocaleString("id-ID")}
                        onChange={(e) => handlePriceChange(plan.key, e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem 0.75rem 2.85rem",
                          borderRadius: "0.75rem",
                          border: "1.5px solid #e2e8f0",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "#0f172a",
                          outline: "none",
                          fontFamily: "var(--font-poppins)",
                          transition: "border-color 0.2s ease"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.75rem", color: "#94a3b8" }}>
                      <span>Default: Rp {plan.defaultPrice.toLocaleString("id-ID")}</span>
                      {currentPrice !== plan.defaultPrice && (
                        <span style={{ color: "#2563eb", fontWeight: 600 }}>Terkustom</span>
                      )}
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748b", marginBottom: "0.6rem" }}>
                      Fitur Utama:
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {plan.features.map((feat, idx) => (
                        <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#334155", marginBottom: "0.35rem" }}>
                          <CheckCircle2 size={14} style={{ color: "#10b981", flexShrink: 0 }} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bottom Bar */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "1rem",
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", fontSize: "0.85rem" }}>
            <Sparkles size={16} style={{ color: "#f59e0b" }} />
            <span>Klik <strong>Simpan Perubahan</strong> untuk langsung memperbarui landing page dan Snap Midtrans.</span>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleResetDefault}
              disabled={isSubmitting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.65rem 1.1rem",
                borderRadius: "0.65rem",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#64748b",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <RotateCcw size={15} />
              Reset Default
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.65rem 1.35rem",
                borderRadius: "0.65rem",
                border: "none",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                transition: "all 0.2s ease"
              }}
            >
              <Save size={16} />
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
