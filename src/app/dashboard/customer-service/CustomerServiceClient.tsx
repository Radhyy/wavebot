"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  Headphones, 
  Send, 
  MessageSquare, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  HelpCircle,
  Sparkles,
  PhoneCall,
  X
} from "lucide-react";
import { createSupportTicketAction } from "@/app/actions/supportTicket";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

function InstagramIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

interface TicketItem {
  id: string;
  ticketId: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  priority: string;
  adminReply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
}

interface CustomerServiceClientProps {
  user: any;
  initialTickets: TicketItem[];
}

export default function CustomerServiceClient({ user, initialTickets }: CustomerServiceClientProps) {
  const [tickets, setTickets] = useState<TicketItem[]>(initialTickets);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("TECHNICAL");
  const [priority, setPriority] = useState("NORMAL");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      const res = await createSupportTicketAction({
        subject,
        category,
        message,
        priority,
      });

      if (res?.error) {
        setNotification({ type: "error", text: res.error });
      } else {
        const ticketNum = res.ticketId || `TKT-${Date.now().toString().slice(-6)}`;
        setSuccessTicketId(ticketNum);
        setSubject("");
        setMessage("");

        // Tambah tiket baru ke list lokal
        const newTicket: TicketItem = {
          id: ticketNum,
          ticketId: ticketNum,
          subject,
          category,
          message,
          status: "OPEN",
          priority,
          createdAt: new Date().toISOString(),
        };
        setTickets([newTicket, ...tickets]);
      }
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Terjadi kesalahan saat mengirim tiket." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactChannels = [
    {
      title: "WhatsApp Official",
      value: "085738804915",
      description: "Chat langsung dengan tim CS kami via WhatsApp untuk respon cepat.",
      href: "https://wa.me/6285738804915?text=Halo%20Admin%20WaveBot%2C%20saya%20butuh%20bantuan%20terkait%20layanan.",
      icon: MessageSquare,
      color: "#16a34a",
      bg: "#dcfce7",
      btnText: "Chat WhatsApp",
    },
    {
      title: "Email Support",
      value: "wavebotwhatsapp@gmail.com",
      description: "Kirim email untuk kendala teknis mendalam, kerjasama, atau konfirmasi.",
      href: "mailto:wavebotwhatsapp@gmail.com?subject=Pertanyaan%20Layanan%20WaveBot",
      icon: Mail,
      color: "#2563eb",
      bg: "#eff6ff",
      btnText: "Kirim Email",
    },
    {
      title: "Instagram Resmi",
      value: "@elevra_digitalera",
      description: "Ikuti update fitur terbaru, info promo, dan DM official kami di Instagram.",
      href: "https://instagram.com/elevra_digitalera",
      icon: InstagramIcon,
      color: "#e11d48",
      bg: "#ffe4e6",
      btnText: "Buka Instagram",
    },
  ];

  return (
    <div className="dashboard-container" style={{ paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1.25rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ flex: "1 1 500px", minWidth: "280px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
            <h1 style={{ 
              fontFamily: "var(--font-poppins)", 
              fontSize: "2.25rem", 
              fontWeight: 700, 
              color: "var(--foreground)", 
              margin: 0, 
              letterSpacing: "-0.025em" 
            }}>
              Customer Service
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
              <Headphones size={13} style={{ color: "#2563eb" }} />
              Bantuan & Laporan
            </span>
          </div>
          <p style={{ color: "#64748b", margin: 0, fontSize: "1.02rem", lineHeight: 1.5 }}>
            Ada kendala, pertanyaan teknis, atau bug? Buat laporan tiket langsung ke sistem kami atau hubungi contact person resmi di bawah.
          </p>
        </div>

        {/* Minimalist Pill Stat */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "0.6rem",
          padding: "0.45rem 0.85rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.65rem",
          fontSize: "0.85rem",
          alignSelf: "center",
          marginLeft: "auto"
        }}>
          <span style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: "#10b981",
            display: "inline-block",
            boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)"
          }} />
          <span style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 500 }}>Tiket Laporan Saya</span>
          <span style={{ fontWeight: 600, color: "#0f172a" }}>{tickets.length}</span>
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

      {/* Direct Contact Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2rem"
      }}>
        {contactChannels.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                padding: "1.25rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
                  <div style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "0.6rem",
                    backgroundColor: c.bg,
                    color: c.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                      {c.title}
                    </h3>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: c.color }}>
                      {c.value}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0 0 1rem 0", lineHeight: 1.45 }}>
                  {c.description}
                </p>
              </div>

              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.45rem",
                  padding: "0.55rem 1rem",
                  borderRadius: "0.6rem",
                  border: `1px solid ${c.color}30`,
                  backgroundColor: c.bg,
                  color: c.color,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s ease"
                }}
              >
                <span>{c.btnText}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Ticket Form & Ticket History */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "1.5rem",
        alignItems: "flex-start"
      }}>
        {/* Form Pembuatan Laporan Tiket */}
        <div style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1.25rem",
          padding: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "0.5rem",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <FileText size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                Kirim Laporan Tiket Baru
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                Laporan akan tercatat ke database sistem WaveBot
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmitTicket}>
            {/* Subject */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
                Judul Laporan / Masalah *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: QR Code tidak muncul / Pertanyaan API"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.9rem",
                  color: "#0f172a",
                  outline: "none"
                }}
              />
            </div>

            {/* Category & Priority */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.6rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.85rem",
                    color: "#0f172a",
                    outline: "none",
                    backgroundColor: "#f8fafc"
                  }}
                >
                  <option value="TECHNICAL">Kendala Teknis (Koneksi WA)</option>
                  <option value="BILLING">Pembayaran & Langganan</option>
                  <option value="API">Integrasi REST API</option>
                  <option value="BUG">Laporan Bug / Error</option>
                  <option value="GENERAL">Lainnya / Pertanyaan Umum</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
                  Urgensi (Prioritas)
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.6rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.85rem",
                    color: "#0f172a",
                    outline: "none",
                    backgroundColor: "#f8fafc"
                  }}
                >
                  <option value="LOW">Rendah (Santai)</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">Tinggi (Mendesak)</option>
                  <option value="URGENT">Sangat Darurat (Bisnis Down)</option>
                </select>
              </div>
            </div>

            {/* Message Detail */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
                Rincian Pesan / Kendala yang Dialami *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Jelaskan secara detail kronologi kendala atau apa yang Anda butuhkan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.9rem",
                  color: "#0f172a",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Form Error / Success Message */}
            {notification && (
              <div style={{
                padding: "0.65rem 0.85rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.85rem",
                backgroundColor: notification.type === "success" ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${notification.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                color: notification.type === "success" ? "#166534" : "#991b1b"
              }}>
                {notification.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{notification.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "0.75rem 1.25rem",
                borderRadius: "0.65rem",
                border: "none",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                transition: "all 0.2s ease"
              }}
            >
              <Send size={16} />
              {isSubmitting ? "Mengirim Laporan..." : "Kirimkan Laporan Tiket"}
            </button>
          </form>
        </div>

        {/* Riwayat Tiket Saya */}
        <div style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1.25rem",
          padding: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "0.5rem",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Clock size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                Riwayat Laporan Saya
              </h2>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                Status laporan tiket yang pernah Anda kirimkan
              </span>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "3rem 1.5rem",
              color: "#94a3b8",
              backgroundColor: "#f8fafc",
              borderRadius: "0.75rem",
              border: "1px dashed #e2e8f0"
            }}>
              <HelpCircle size={32} style={{ margin: "0 auto 0.5rem auto", opacity: 0.6 }} />
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#475569" }}>Belum Ada Laporan</div>
              <div style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}>
                Jika ada kendala fitur atau pembayaran, kirimkan melalui formulir di samping.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "450px", overflowY: "auto" }}>
              {tickets.map((t) => {
                const isOpen = t.status === "OPEN";
                const isProgress = t.status === "IN_PROGRESS";
                const isResolved = t.status === "RESOLVED";

                return (
                  <div
                    key={t.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.75rem",
                      padding: "1rem",
                      backgroundColor: "#ffffff",
                      transition: "box-shadow 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                      <span style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.45rem",
                        borderRadius: "4px",
                        backgroundColor: "#f1f5f9",
                        color: "#475569"
                      }}>
                        #{t.ticketId}
                      </span>

                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "9999px",
                        backgroundColor: isOpen ? "#fef3c7" : isProgress ? "#eff6ff" : isResolved ? "#dcfce7" : "#f1f5f9",
                        color: isOpen ? "#b45309" : isProgress ? "#1e40af" : isResolved ? "#15803d" : "#475569"
                      }}>
                        {isOpen ? "Menunggu Respon" : isProgress ? "Sedang Diproses" : isResolved ? "Selesai" : t.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.35rem 0", color: "#0f172a" }}>
                      {t.subject}
                    </h4>

                    <p style={{
                      fontSize: "0.82rem",
                      color: "#64748b",
                      margin: "0 0 0.65rem 0",
                      lineHeight: 1.45,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {t.message}
                    </p>

                    {/* Balasan dari Admin WaveBot */}
                    {t.adminReply && (
                      <div style={{
                        marginTop: "0.65rem",
                        marginBottom: "0.65rem",
                        padding: "0.75rem 0.85rem",
                        borderRadius: "0.6rem",
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        fontSize: "0.82rem",
                        color: "#166534"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, marginBottom: "0.25rem", color: "#15803d" }}>
                          <CheckCircle2 size={13} />
                          <span>Tanggapan Resmi Tim Support WaveBot:</span>
                        </div>
                        <div style={{ lineHeight: 1.5, color: "#1e3a8a", backgroundColor: "#ffffff", padding: "0.5rem 0.65rem", borderRadius: "0.4rem", border: "1px solid #e0e7ff" }}>
                          {t.adminReply}
                        </div>
                        {t.repliedAt && (
                          <div style={{ fontSize: "0.7rem", color: "#16a34a", marginTop: "0.35rem", textAlign: "right" }}>
                            Dijawab pada {new Date(t.repliedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: "0.5rem",
                      fontSize: "0.75rem",
                      color: "#94a3b8"
                    }}>
                      <span>Kategori: <strong>{t.category}</strong></span>
                      <span>{new Date(t.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Jendela Konfirmasi Berhasil dengan Lottie Loop */}
      {successTicketId && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "1.5rem",
            maxWidth: "440px",
            width: "100%",
            padding: "2.25rem 2rem",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid #e2e8f0",
            position: "relative"
          }}>
            {/* Close icon button */}
            <button
              onClick={() => setSuccessTicketId(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                border: "none",
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "0.25rem"
              }}
            >
              <X size={20} />
            </button>

            {/* Animasi Lottie Centang Loop */}
            <div style={{
              width: "100px",
              height: "100px",
              margin: "0 auto 1rem auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Player
                autoplay
                loop={true}
                src="/ticket-success.json"
                style={{ height: "100px", width: "100px" }}
              />
            </div>

            <h3 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
              Laporan Berhasil Dikirim!
            </h3>

            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Laporan kendala Anda telah diterima oleh sistem helpdesk kami. Tim support WaveBot akan segera meninjau dan memberikan balasan solusi.
            </p>

            {/* Ticket ID Box */}
            <div style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              padding: "0.85rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              color: "#475569",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontWeight: 500 }}>Nomor Tiket:</span>
              <span style={{ fontWeight: 700, color: "#2563eb", fontFamily: "monospace", fontSize: "0.95rem" }}>
                #{successTicketId}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSuccessTicketId(null)}
              style={{
                width: "100%",
                padding: "0.75rem 1.25rem",
                borderRadius: "0.75rem",
                border: "none",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                transition: "all 0.2s ease"
              }}
            >
              Oke, Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
