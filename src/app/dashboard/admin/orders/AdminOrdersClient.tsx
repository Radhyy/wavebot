"use client";

import { useState } from "react";
import { 
  ReceiptText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  User, 
  ArrowUpDown,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface AdminOrdersClientProps {
  initialOrders: any[];
}

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [planFilter, setPlanFilter] = useState<string>("ALL");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user?.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const matchesPlan = planFilter === "ALL" || order.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const totalRevenue = orders
    .filter((o) => o.status === "SUCCESS")
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  const successCount = orders.filter((o) => o.status === "SUCCESS").length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

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
              Monitoring Orderan
            </h1>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              color: "#2563eb",
              border: "1px solid rgba(37, 99, 235, 0.25)",
              fontSize: "0.78rem",
              fontWeight: 700
            }}>
              {filteredOrders.length} Order Tercatat
            </span>
          </div>
          <p style={{ color: "var(--muted-foreground)", fontSize: "1.02rem", margin: 0 }}>
            Pantau dan kelola seluruh transaksi paket langganan pengguna WaveBot secara real-time.
          </p>
        </div>

        {/* Metric Quick Counter - Ultra Minimalist Pill & Clean Stats */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
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
            <span style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 500 }}>Omset Lunas</span>
            <span style={{ fontWeight: 600, color: "#0f172a", letterSpacing: "-0.01em" }}>
              Rp {totalRevenue.toLocaleString("id-ID")}
            </span>
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
              backgroundColor: "#3b82f6",
              display: "inline-block",
              boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)"
            }} />
            <span style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 500 }}>Sukses / Pending</span>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>
              <span style={{ color: "#0f172a" }}>{successCount}</span>
              <span style={{ color: "#94a3b8", margin: "0 0.2rem", fontWeight: 400 }}>/</span>
              <span style={{ color: "#64748b" }}>{pendingCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "1.25rem",
        padding: "1.25rem 1.5rem",
        marginBottom: "0.75rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
      }}>
        {/* Search input */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "0.75rem",
          padding: "0.6rem 0.85rem",
          flex: 1,
          minWidth: "260px"
        }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Cari Order ID, Nama pelanggan, atau Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "none",
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
              <option value="SUCCESS">SUCCESS (Lunas)</option>
              <option value="PENDING">PENDING (Menunggu)</option>
              <option value="EXPIRED">EXPIRED (Kedaluwarsa)</option>
              <option value="FAILED">FAILED (Gagal)</option>
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
              <option value="PAKET_1">Paket 1 (Rp 15.000)</option>
              <option value="PAKET_2">Paket 2 (Rp 30.000)</option>
              <option value="PAKET_3">Paket 3 (Rp 50.000)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "1.25rem",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "1rem 1.25rem", color: "#64748b", fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: "1rem 1.25rem", color: "#64748b", fontWeight: 600 }}>Pelanggan</th>
                <th style={{ padding: "1rem 1.25rem", color: "#64748b", fontWeight: 600 }}>Paket</th>
                <th style={{ padding: "1rem 1.25rem", color: "#64748b", fontWeight: 600 }}>Nominal</th>
                <th style={{ padding: "1rem 1.25rem", color: "#64748b", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "1rem 1.25rem", color: "#64748b", fontWeight: 600 }}>Waktu Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3.5rem 1rem", textAlign: "center", color: "#64748b" }}>
                    <ReceiptText size={40} style={{ margin: "0 auto 0.75rem auto", opacity: 0.35 }} />
                    <div style={{ fontWeight: 600, fontSize: "1rem", color: "#334155" }}>Tidak ada order yang cocok</div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>Coba ubah kata kunci pencarian atau filter status.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSuccess = order.status === "SUCCESS";
                  const isPending = order.status === "PENDING";

                  return (
                    <tr 
                      key={order.id} 
                      style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.15s ease" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {/* Order ID */}
                      <td style={{ padding: "1.1rem 1.25rem", fontWeight: 600, color: "#0f172a", fontFamily: "monospace", fontSize: "0.88rem" }}>
                        {order.orderId}
                      </td>

                      {/* Customer */}
                      <td style={{ padding: "1.1rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "#eff6ff",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {order.user?.name ? order.user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>
                              {order.user?.name || "Pelanggan"}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                              {order.user?.email || "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td style={{ padding: "1.1rem 1.25rem" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          backgroundColor: "#eff6ff",
                          color: "#2563eb",
                          border: "1px solid #bfdbfe"
                        }}>
                          {order.plan ? order.plan.replace("_", " ") : "Paket"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: isSuccess ? "#16a34a" : "#0f172a" }}>
                        Rp {Number(order.amount).toLocaleString("id-ID")}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "1.1rem 1.25rem" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          backgroundColor: isSuccess ? "#dcfce7" : isPending ? "#ffedd5" : "#fee2e2",
                          color: isSuccess ? "#15803d" : isPending ? "#c2410c" : "#b91c1c"
                        }}>
                          {isSuccess && <CheckCircle2 size={13} />}
                          {isPending && <Clock size={13} />}
                          {!isSuccess && !isPending && <AlertCircle size={13} />}
                          {order.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "1.1rem 1.25rem", color: "#64748b", fontSize: "0.85rem" }}>
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
