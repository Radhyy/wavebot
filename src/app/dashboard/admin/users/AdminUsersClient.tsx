"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  MessageSquare, 
  ReceiptText, 
  Calendar, 
  Trash2, 
  Edit3, 
  X,
  Crown
} from "lucide-react";
import { 
  updateUserRoleAction, 
  updateUserPlanAction, 
  deleteUserAction 
} from "@/app/actions/adminUsers";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  role: string;
  plan: string;
  planExpiresAt: string | null;
  createdAt: string;
  _count: {
    devices: number;
    messages: number;
    subscriptions: number;
  };
}

interface AdminUsersClientProps {
  initialUsers: UserItem[];
  currentAdminEmail: string;
}

export default function AdminUsersClient({ initialUsers, currentAdminEmail }: AdminUsersClientProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal Edit State
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [editRole, setEditRole] = useState<"USER" | "ADMIN">("USER");
  const [editPlan, setEditPlan] = useState<"FREE" | "PAKET_1" | "PAKET_2" | "PAKET_3">("FREE");
  const [durationDays, setDurationDays] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Delete State
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter Data
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(term)) ||
      u.email.toLowerCase().includes(term) ||
      u.id.toLowerCase().includes(term);

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesPlan = planFilter === "ALL" || u.plan === planFilter;

    return matchesSearch && matchesRole && matchesPlan;
  });

  const totalUsersCount = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const premiumCount = users.filter((u) => u.plan !== "FREE").length;

  const openEditModal = (u: UserItem) => {
    setSelectedUser(u);
    setEditRole(u.role === "ADMIN" ? "ADMIN" : "USER");
    setEditPlan((u.plan as any) || "FREE");
    setDurationDays(30);
    setNotification(null);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    setNotification(null);

    try {
      // 1. Update role jika berubah
      if (selectedUser.role !== editRole) {
        const roleRes = await updateUserRoleAction(selectedUser.id, editRole);
        if (roleRes?.error) {
          setNotification({ type: "error", text: roleRes.error });
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Update plan jika berubah
      if (selectedUser.plan !== editPlan) {
        const planRes = await updateUserPlanAction(selectedUser.id, editPlan, durationDays);
        if (planRes?.error) {
          setNotification({ type: "error", text: planRes.error });
          setIsSubmitting(false);
          return;
        }
      }

      // Update state lokal
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                role: editRole,
                plan: editPlan,
                planExpiresAt: editPlan === "FREE" ? null : new Date(Date.now() + durationDays * 86400000).toISOString(),
              }
            : u
        )
      );

      setNotification({ type: "success", text: `Data pengguna ${selectedUser.email} berhasil diperbarui.` });
      setSelectedUser(null);
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Gagal memperbarui pengguna" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setNotification(null);

    try {
      const res = await deleteUserAction(userToDelete.id);
      if (res?.error) {
        setNotification({ type: "error", text: res.error });
      } else {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setNotification({ type: "success", text: `Pengguna ${userToDelete.email} berhasil dihapus.` });
        setUserToDelete(null);
      }
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Gagal menghapus pengguna" });
    } finally {
      setIsDeleting(false);
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
              Manajemen Pengguna
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
              Admin Control
            </span>
          </div>
          <p style={{ color: "#64748b", margin: 0, fontSize: "1.02rem", lineHeight: 1.5 }}>
            Kelola seluruh akun pengguna terdaftar, atur hak akses (Role), ubah tingkatan paket berlangganan secara instan, atau kelola status akun.
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
              backgroundColor: "#8b5cf6",
              display: "inline-block",
              boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.2)"
            }} />
            <span style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 500 }}>Total Pengguna</span>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>{totalUsersCount}</span>
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
              backgroundColor: "#2563eb",
              display: "inline-block",
              boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)"
            }} />
            <span style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 500 }}>Premium / Admin</span>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>
              <span>{premiumCount}</span>
              <span style={{ color: "#94a3b8", margin: "0 0.2rem", fontWeight: 400 }}>/</span>
              <span>{adminCount}</span>
            </span>
          </div>
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
            placeholder="Cari nama, email, atau ID user..."
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
          {/* Role Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
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
              <option value="ALL">Semua Role</option>
              <option value="USER">USER (Pengguna Biasa)</option>
              <option value="ADMIN">ADMIN (Administrator)</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Paket:</span>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
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
              <option value="ALL">Semua Paket</option>
              <option value="FREE">Free Trial</option>
              <option value="PAKET_1">Paket 1</option>
              <option value="PAKET_2">Paket 2</option>
              <option value="PAKET_3">Paket 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                <th style={{ padding: "0.9rem 1.25rem" }}>Pengguna</th>
                <th style={{ padding: "0.9rem 1.25rem" }}>Role</th>
                <th style={{ padding: "0.9rem 1.25rem" }}>Paket Langganan</th>
                <th style={{ padding: "0.9rem 1.25rem" }}>Perangkat & Pesan</th>
                <th style={{ padding: "0.9rem 1.25rem" }}>Terdaftar Pada</th>
                <th style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                    Tidak ada data pengguna yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === "ADMIN" || u.email === "raaakb87@gmail.com";
                  const isPrimaryAdmin = u.email === "raaakb87@gmail.com";

                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {/* User Info */}
                      <td style={{ padding: "1.1rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            backgroundColor: isAdmin ? "#eff6ff" : "#f1f5f9",
                            color: isAdmin ? "#2563eb" : "#475569",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            overflow: "hidden"
                          }}>
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              (u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase())
                            )}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <span style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.9rem" }}>
                                {u.name || "Tanpa Nama"}
                              </span>
                              {isPrimaryAdmin && (
                                <span style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  backgroundColor: "#fef3c7",
                                  color: "#b45309",
                                  padding: "0.15rem 0.4rem",
                                  borderRadius: "4px"
                                }}>
                                  SUPER ADMIN
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: "1.1rem 1.25rem" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          backgroundColor: isAdmin ? "#eff6ff" : "#f1f5f9",
                          color: isAdmin ? "#2563eb" : "#475569",
                          border: `1px solid ${isAdmin ? "#bfdbfe" : "#e2e8f0"}`
                        }}>
                          {isAdmin ? <ShieldCheck size={13} /> : <UserCheck size={13} />}
                          {u.role}
                        </span>
                      </td>

                      {/* Plan */}
                      <td style={{ padding: "1.1rem 1.25rem" }}>
                        <div>
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            backgroundColor: u.plan === "FREE" ? "#f1f5f9" : "#ecfdf5",
                            color: u.plan === "FREE" ? "#64748b" : "#047857",
                            border: `1px solid ${u.plan === "FREE" ? "#e2e8f0" : "#a7f3d0"}`
                          }}>
                            {u.plan === "PAKET_3" && <Crown size={12} />}
                            {u.plan ? u.plan.replace("_", " ") : "FREE"}
                          </span>
                          {u.planExpiresAt && (
                            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                              Hingga: {new Date(u.planExpiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Usage */}
                      <td style={{ padding: "1.1rem 1.25rem" }}>
                        <div style={{ display: "flex", gap: "0.85rem", fontSize: "0.82rem", color: "#475569" }}>
                          <span title="Perangkat WhatsApp Terhubung" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <Smartphone size={14} style={{ color: "#64748b" }} />
                            {u._count.devices} Device
                          </span>
                          <span title="Riwayat Pesan Terkirim" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <MessageSquare size={14} style={{ color: "#64748b" }} />
                            {u._count.messages} Pesan
                          </span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: "1.1rem 1.25rem", color: "#64748b", fontSize: "0.82rem" }}>
                        {new Date(u.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.45rem", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              padding: "0.4rem 0.75rem",
                              backgroundColor: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: "0.5rem",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "#2563eb",
                              cursor: "pointer",
                              transition: "all 0.15s ease"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#eff6ff";
                              e.currentTarget.style.borderColor = "#bfdbfe";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#ffffff";
                              e.currentTarget.style.borderColor = "#e2e8f0";
                            }}
                          >
                            <Edit3 size={13} />
                            Edit
                          </button>

                          {!isPrimaryAdmin && u.email !== currentAdminEmail && (
                            <button
                              type="button"
                              onClick={() => setUserToDelete(u)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "0.4rem",
                                backgroundColor: "#ffffff",
                                border: "1px solid #fee2e2",
                                borderRadius: "0.5rem",
                                color: "#ef4444",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                              }}
                              title="Hapus Pengguna"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#fef2f2";
                                e.currentTarget.style.borderColor = "#fca5a5";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#ffffff";
                                e.currentTarget.style.borderColor = "#fee2e2";
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
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

      {/* Edit User Modal */}
      {selectedUser && (
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
            maxWidth: "480px",
            padding: "1.75rem",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            position: "relative"
          }}>
            <button
              onClick={() => setSelectedUser(null)}
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

            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.35rem 0", color: "#0f172a" }}>
              Kelola Akun Pengguna
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1.5rem 0" }}>
              {selectedUser.name ? `${selectedUser.name} (${selectedUser.email})` : selectedUser.email}
            </p>

            <form onSubmit={handleSaveUser}>
              {/* Role Setting */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "0.45rem" }}>
                  Role Akun
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  disabled={selectedUser.email === "raaakb87@gmail.com"}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.6rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.9rem",
                    color: "#0f172a",
                    outline: "none",
                    backgroundColor: selectedUser.email === "raaakb87@gmail.com" ? "#f1f5f9" : "#ffffff"
                  }}
                >
                  <option value="USER">USER (Hak Akses Biasa)</option>
                  <option value="ADMIN">ADMIN (Hak Akses Administrator)</option>
                </select>
                {selectedUser.email === "raaakb87@gmail.com" && (
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.3rem", display: "block" }}>
                    Akun Super Admin permanen tidak dapat diubah ke User biasa.
                  </span>
                )}
              </div>

              {/* Plan Setting */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "0.45rem" }}>
                  Tingkatan Paket (Plan)
                </label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.6rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.9rem",
                    color: "#0f172a",
                    outline: "none"
                  }}
                >
                  <option value="FREE">Free Trial (500 Pesan)</option>
                  <option value="PAKET_1">Paket 1 (1.000 Pesan + Auto Reply)</option>
                  <option value="PAKET_2">Paket 2 (4.000 Pesan + Broadcast + Reminder)</option>
                  <option value="PAKET_3">Paket 3 (10.000 Pesan + Full AI Chatbot)</option>
                </select>
              </div>

              {/* Duration Setting (jika bukan FREE) */}
              {editPlan !== "FREE" && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "0.45rem" }}>
                    Durasi Masa Aktif Paket
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "0.6rem",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.9rem",
                      color: "#0f172a",
                      outline: "none"
                    }}
                  >
                    <option value={7}>7 Hari (1 Minggu Trial)</option>
                    <option value={30}>30 Hari (1 Bulan Standar)</option>
                    <option value={90}>90 Hari (3 Bulan)</option>
                    <option value={365}>365 Hari (1 Tahun)</option>
                  </select>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.75rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
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
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.6rem",
                    border: "none",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
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
            maxWidth: "420px",
            padding: "1.75rem",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#fee2e2",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem auto"
            }}>
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#0f172a" }}>
              Hapus Pengguna?
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1.5rem 0", lineHeight: 1.5 }}>
              Apakah Anda yakin ingin menghapus akun <strong>{userToDelete.email}</strong>? Semua perangkat, pesan, dan pengaturannya akan dihapus secara permanen.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
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
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "0.6rem",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  opacity: isDeleting ? 0.7 : 1
                }}
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Akun"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
