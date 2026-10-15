"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  Headphones, 
  Search, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Send, 
  Trash2, 
  X, 
  User, 
  Filter, 
  HelpCircle,
  CornerDownRight
} from "lucide-react";
import { replySupportTicketAction, updateTicketStatusAction, deleteTicketAction } from "@/app/actions/adminTickets";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

interface TicketItem {
  id: string;
  ticketId: string;
  userId: string;
  subject: string;
  category: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: string;
  adminReply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  user?: {
    name?: string | null;
    email: string;
    avatar?: string | null;
    plan?: string;
  };
}

interface AdminTicketsClientProps {
  initialTickets: TicketItem[];
}

export default function AdminTicketsClient({ initialTickets }: AdminTicketsClientProps) {
  const [tickets, setTickets] = useState<TicketItem[]>(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal Jawab Tiket
  const [activeTicket, setActiveTicket] = useState<TicketItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [targetStatus, setTargetStatus] = useState<"OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED">("RESOLVED");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReplyTicketId, setSuccessReplyTicketId] = useState<string | null>(null);

  // Filter List
  const filteredTickets = tickets.filter((t) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      t.ticketId.toLowerCase().includes(term) ||
      t.subject.toLowerCase().includes(term) ||
      t.message.toLowerCase().includes(term) ||
      (t.user?.name && t.user.name.toLowerCase().includes(term)) ||
      (t.user?.email && t.user.email.toLowerCase().includes(term));

    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalTickets = tickets.length;
  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  const openReplyModal = (t: TicketItem) => {
    setActiveTicket(t);
    setReplyText(t.adminReply || "");
    setTargetStatus(t.status === "RESOLVED" ? "RESOLVED" : "RESOLVED");
    setNotification(null);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;
    setIsSubmitting(true);
    setNotification(null);

    try {
      const res = await replySupportTicketAction(activeTicket.ticketId, replyText, targetStatus);
      if (res?.error) {
        setNotification({ type: "error", text: res.error });
      } else {
        const tid = activeTicket.ticketId;
        setTickets((prev) =>
          prev.map((t) =>
            t.ticketId === tid
              ? {
                  ...t,
                  adminReply: replyText,
                  status: targetStatus,
                  repliedAt: new Date().toISOString(),
                }
              : t
          )
        );
        setActiveTicket(null);
        setSuccessReplyTicketId(tid);
      }
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Gagal mengirimkan balasan tiket" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm(`Hapus tiket laporan #${ticketId}? Tindakan ini permanen.`)) return;
    try {
      const res = await deleteTicketAction(ticketId);
      if (res?.error) {
        setNotification({ type: "error", text: res.error });
      } else {
        setTickets((prev) => prev.filter((t) => t.ticketId !== ticketId));
        setNotification({ type: "success", text: `Tiket #${ticketId} berhasil dihapus.` });
      }
    } catch (e: any) {
      setNotification({ type: "error", text: e.message || "Gagal menghapus tiket" });
    }
  };

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
              Tiket Laporan & CS
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
              Admin Helpdesk
            </span>
          </div>
          <p style={{ color: "#64748b", margin: 0, fontSize: "1.02rem", lineHeight: 1.5 }}>
            Terima, tinjau, dan balas laporan kendala pengguna secara langsung. Tanggapan Anda akan langsung dapat dibaca oleh pengguna di dasbor mereka.
          </p>
        </div>

        {/* Minimalist Metrics Pills - Aligned to right */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", flexShrink: 0, marginLeft: "auto", alignSelf: "center" }}>
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.6rem",
            padding: "0.45rem 0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.65rem",
            fontSize: "0.85rem"
          }}>
            <span style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#f59e0b",
              display: "inline-block",
              boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.2)"
            }} />
            <span style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 500 }}>Menunggu Respon</span>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>{openCount}</span>
          </div>

          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.6rem",
            padding: "0.45rem 0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.65rem",
            fontSize: "0.85rem"
          }}>
            <span style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
              display: "inline-block",
              boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)"
            }} />
            <span style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 500 }}>Selesai Dijawab</span>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>{resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div style={{
          padding: "0.85rem 1.25rem",
          borderRadius: "0.75rem",
          marginBottom: "1.25rem",
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

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "1rem",
        padding: "1rem 1.25rem",
        marginBottom: "0.75rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        {/* Search Input */}
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          minWidth: "260px",
          flex: 1
        }}>
          <Search size={16} style={{ position: "absolute", left: "0.85rem", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Cari ID tiket, subjek, pesan, atau email pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.55rem 0.85rem 0.55rem 2.4rem",
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
              background: "transparent",
              outline: "none",
              width: "100%",
              fontSize: "0.9rem",
              color: "#0f172a"
            }}
          />
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                padding: "0.55rem 0.85rem",
                fontSize: "0.85rem",
                color: "#0f172a",
                outline: "none",
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              <option value="ALL">Semua Status</option>
              <option value="OPEN">OPEN (Menunggu Respon)</option>
              <option value="IN_PROGRESS">IN PROGRESS (Sedang Diproses)</option>
              <option value="RESOLVED">RESOLVED (Selesai)</option>
              <option value="CLOSED">CLOSED (Ditutup)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Kategori:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                padding: "0.55rem 0.85rem",
                fontSize: "0.85rem",
                color: "#0f172a",
                outline: "none",
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              <option value="ALL">Semua Kategori</option>
              <option value="TECHNICAL">Kendala Teknis</option>
              <option value="BILLING">Pembayaran & Langganan</option>
              <option value="API">Integrasi REST API</option>
              <option value="BUG">Laporan Bug</option>
              <option value="GENERAL">Umum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "1.25rem",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#64748b"
              }}>
                <th style={{ padding: "0.9rem 1.25rem" }}>Tiket & Pengguna</th>
                <th style={{ padding: "0.9rem 1.25rem" }}>Kategori</th>
                <th style={{ padding: "0.9rem 1.25rem" }}>Subjek & Isi Masalah</th>
                <th style={{ padding: "0.9rem 1.25rem" }}>Status & Urgensi</th>
                <th style={{ padding: "0.9rem 1.25rem" }}>Waktu Kirim</th>
                <th style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                    Tidak ada laporan tiket yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => {
                  const isOpen = t.status === "OPEN";
                  const isProgress = t.status === "IN_PROGRESS";
                  const isResolved = t.status === "RESOLVED";

                  return (
                    <tr
                      key={t.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {/* Ticket & User */}
                      <td style={{ padding: "1.1rem 1.25rem" }}>
                        <div>
                          <span style={{
                            display: "inline-block",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            backgroundColor: "#f1f5f9",
                            color: "#334155",
                            marginBottom: "0.35rem"
                          }}>
                            #{t.ticketId}
                          </span>
                          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0f172a" }}>
                            {t.user?.name || "Pengguna"}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                            {t.user?.email}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "1.1rem 1.25rem" }}>
                        <span style={{
                          display: "inline-flex",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          backgroundColor: "#eff6ff",
                          color: "#2563eb",
                          border: "1px solid #bfdbfe"
                        }}>
                          {t.category}
                        </span>
                      </td>

                      {/* Subject & Message */}
                      <td style={{ padding: "1.1rem 1.25rem", maxWidth: "340px" }}>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                          {t.subject}
                        </div>
                        <div style={{
                          fontSize: "0.82rem",
                          color: "#475569",
                          lineHeight: 1.45,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}>
                          {t.message}
                        </div>

                        {/* Indikator jika sudah dijawab */}
                        {t.adminReply && (
                          <div style={{
                            marginTop: "0.45rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            fontSize: "0.75rem",
                            color: "#16a34a",
                            fontWeight: 600
                          }}>
                            <CornerDownRight size={13} />
                            <span>Telah Dijawab</span>
                          </div>
                        )}
                      </td>

                      {/* Status & Priority */}
                      <td style={{ padding: "1.1rem 1.25rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "9999px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            width: "fit-content",
                            backgroundColor: isOpen ? "#fef3c7" : isProgress ? "#eff6ff" : isResolved ? "#dcfce7" : "#f1f5f9",
                            color: isOpen ? "#b45309" : isProgress ? "#1e40af" : isResolved ? "#15803d" : "#475569",
                            border: `1px solid ${isOpen ? "#fde68a" : isProgress ? "#bfdbfe" : isResolved ? "#bbf7d0" : "#e2e8f0"}`
                          }}>
                            {isOpen && <Clock size={12} />}
                            {isResolved && <CheckCircle2 size={12} />}
                            {t.status}
                          </span>

                          <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                            Prioritas: <strong style={{ color: t.priority === "URGENT" ? "#dc2626" : "#475569" }}>{t.priority}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "1.1rem 1.25rem", color: "#64748b", fontSize: "0.82rem" }}>
                        {new Date(t.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>

                      {/* Action */}
                      <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.45rem", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => openReplyModal(t)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              padding: "0.45rem 0.85rem",
                              backgroundColor: isOpen ? "#2563eb" : "#ffffff",
                              border: isOpen ? "none" : "1px solid #e2e8f0",
                              color: isOpen ? "#ffffff" : "#2563eb",
                              borderRadius: "0.55rem",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              boxShadow: isOpen ? "0 2px 4px rgba(37, 99, 235, 0.2)" : "none",
                              transition: "all 0.15s ease"
                            }}
                          >
                            <Send size={13} />
                            {t.adminReply ? "Edit Balasan" : "Balas Tiket"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteTicket(t.ticketId)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "0.45rem",
                              backgroundColor: "#ffffff",
                              border: "1px solid #fee2e2",
                              borderRadius: "0.55rem",
                              color: "#ef4444",
                              cursor: "pointer"
                            }}
                            title="Hapus Tiket"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {activeTicket && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "1.25rem",
            width: "100%",
            maxWidth: "540px",
            padding: "1.75rem",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            position: "relative"
          }}>
            <button
              onClick={() => setActiveTicket(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                border: "none",
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer"
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                padding: "0.15rem 0.45rem",
                borderRadius: "4px"
              }}>
                #{activeTicket.ticketId}
              </span>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                Kategori: <strong>{activeTicket.category}</strong>
              </span>
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#0f172a" }}>
              {activeTicket.subject}
            </h3>

            {/* User message block */}
            <div style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              padding: "0.9rem",
              marginBottom: "1.25rem",
              fontSize: "0.85rem",
              color: "#334155",
              maxHeight: "140px",
              overflowY: "auto",
              lineHeight: 1.5
            }}>
              <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, marginBottom: "0.25rem" }}>
                Pesan dari: {activeTicket.user?.name || "Customer"} ({activeTicket.user?.email})
              </div>
              {activeTicket.message}
            </div>

            <form onSubmit={handleSendReply}>
              {/* Balasan Admin */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "0.4rem" }}>
                  Tulis Balasan / Solusi Resmi *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Ketikkan solusi atau klarifikasi yang ramah dan solutif untuk pengguna..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "0.6rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.9rem",
                    color: "#0f172a",
                    outline: "none",
                    resize: "vertical"
                  }}
                />
              </div>

              {/* Status Update */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "0.4rem" }}>
                  Status Tiket Setelah Dibalas
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as any)}
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
                  <option value="RESOLVED">RESOLVED (Masalah Selesai Ditangani)</option>
                  <option value="IN_PROGRESS">IN PROGRESS (Sedang Dalam Investigasi)</option>
                  <option value="OPEN">OPEN (Tetap Buka)</option>
                  <option value="CLOSED">CLOSED (Tutup Tiket)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  disabled={isSubmitting}
                  style={{
                    padding: "0.6rem 1.1rem",
                    borderRadius: "0.6rem",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#64748b",
                    cursor: "pointer"
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.6rem",
                    border: "none",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)"
                  }}
                >
                  <Send size={15} />
                  {isSubmitting ? "Mengirim..." : "Kirimkan Balasan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Jendela Konfirmasi Berhasil Membalas Tiket dengan Lottie Loop */}
      {successReplyTicketId && (
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
          zIndex: 1100,
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
              onClick={() => setSuccessReplyTicketId(null)}
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
              Balasan Berhasil Dikirim!
            </h3>

            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Tanggapan dan solusi Anda untuk tiket laporan <strong>#{successReplyTicketId}</strong> telah berhasil disimpan dan langsung dapat dilihat oleh pengguna di dashboard akun mereka.
            </p>

            <button
              type="button"
              onClick={() => setSuccessReplyTicketId(null)}
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
              Oke, Tutup Jendela
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
