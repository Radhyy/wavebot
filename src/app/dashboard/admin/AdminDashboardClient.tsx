"use client";

import { useState } from "react";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Calendar,
  Filter
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

interface AdminDashboardClientProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    successOrders: number;
    totalUsers: number;
  };
  monthlyRevenue: { month: string; amount: number; count: number }[];
  recentTransactions: any[];
}

export default function AdminDashboardClient({
  stats,
  monthlyRevenue,
  recentTransactions
}: AdminDashboardClientProps) {
  const [filterPeriod, setFilterPeriod] = useState<"all" | "month">("month");

  const statCards = [
    {
      title: "Total Saldo Masuk",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      subtitle: "Akumulasi saldo transaksi berhasil",
      icon: DollarSign,
      color: "#16a34a",
      bg: "#dcfce7"
    },
    {
      title: "Total Order / Transaksi",
      value: stats.totalOrders.toLocaleString("id-ID"),
      subtitle: `${stats.successOrders} pembayaran lunas`,
      icon: ShoppingCart,
      color: "#2563eb",
      bg: "#eff6ff"
    },
    {
      title: "Pengguna Terdaftar",
      value: stats.totalUsers.toLocaleString("id-ID"),
      subtitle: "Total akun customer aktif",
      icon: Users,
      color: "#8b5cf6",
      bg: "#f3e8ff"
    },
    {
      title: "Metode Bayar Midtrans",
      value: "Snap Active",
      subtitle: "QRIS, VA & Kartu Kredit",
      icon: CreditCard,
      color: "#ea580c",
      bg: "#ffedd5"
    }
  ];

  return (
    <div className="dashboard-container" style={{ paddingBottom: "3rem" }}>
      {/* Header Banner */}
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
              Admin Executive Panel
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
              fontWeight: 700,
              textTransform: "uppercase"
            }}>
              <ShieldCheck size={14} />
              Administrator
            </span>
          </div>
          <p style={{ color: "var(--muted-foreground)", fontSize: "1.02rem", margin: 0 }}>
            Ringkasan omset penjualan paket langganan, statistik pesanan, dan arus saldo masuk WaveBot.
          </p>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "0.75rem",
          padding: "0.35rem 0.5rem"
        }}>
          <button
            onClick={() => setFilterPeriod("month")}
            style={{
              padding: "0.4rem 0.85rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: filterPeriod === "month" ? "#2563eb" : "transparent",
              color: filterPeriod === "month" ? "#ffffff" : "#64748b",
              transition: "all 0.15s ease"
            }}
          >
            Tahun Ini
          </button>
          <button
            onClick={() => setFilterPeriod("all")}
            style={{
              padding: "0.4rem 0.85rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: filterPeriod === "all" ? "#2563eb" : "transparent",
              color: filterPeriod === "all" ? "#ffffff" : "#64748b",
              transition: "all 0.15s ease"
            }}
          >
            Semua Periode
          </button>
        </div>
      </div>

      {/* 4 Cards Ringkasan */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "1.25rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  backgroundColor: card.bg,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Icon size={22} />
                </div>
                <div style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  backgroundColor: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8"
                }}>
                  <ArrowUpRight size={15} />
                </div>
              </div>

              <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "0.4rem" }}>
                {card.title}
              </div>

              <div style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.02em", marginBottom: "0.35rem" }}>
                {card.value}
              </div>

              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                {card.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Saldo Masuk Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "1.75rem", alignItems: "stretch" }}>
        
        {/* Chart Order & Omset */}
        <div style={{
          backgroundColor: "var(--card)",
          borderRadius: "1.25rem",
          padding: "1.75rem",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--foreground)", margin: 0, letterSpacing: "-0.015em" }}>
                Grafik Order & Arus Pendapatan
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginTop: "0.25rem", margin: 0 }}>
                Tren total saldo pesanan yang berhasil dibayar setiap bulan
              </p>
            </div>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "#dcfce7",
              color: "#16a34a",
              padding: "0.35rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.8rem",
              fontWeight: 700,
              border: "1px solid #bbf7d0"
            }}>
              <TrendingUp size={14} />
              Revenue Flow
            </div>
          </div>

          <div style={{ width: "100%", height: "320px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyRevenue}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="orderRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#94a3b8" }} 
                  dy={8} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(val) => `Rp ${(val / 1000).toLocaleString()}k`}
                />
                <Tooltip 
                  formatter={(val: any) => [`Rp ${Number(val).toLocaleString("id-ID")}`, "Saldo Masuk"]}
                  labelFormatter={(lbl) => `Bulan: ${lbl}`}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "0.85rem"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#2563eb" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#orderRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Saldo Masuk (Recent Income Transactions) */}
        <div style={{
          backgroundColor: "var(--card)",
          borderRadius: "1.25rem",
          padding: "1.75rem",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--foreground)", margin: 0, letterSpacing: "-0.015em" }}>
                Saldo Masuk Terbaru
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginTop: "0.25rem", margin: 0 }}>
                Arus kas masuk dari order langganan
              </p>
            </div>
            
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#2563eb",
              backgroundColor: "#eff6ff",
              padding: "0.25rem 0.6rem",
              borderRadius: "9999px"
            }}>
              Live Income
            </span>
          </div>

          <div 
            className="hide-scrollbar" 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.85rem", 
              overflowY: "auto", 
              maxHeight: "330px",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
          >
            {recentTransactions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--muted-foreground)" }}>
                <Clock size={36} style={{ margin: "0 auto 0.75rem auto", opacity: 0.4 }} />
                <p style={{ margin: 0, fontSize: "0.9rem" }}>Belum ada transaksi saldo masuk.</p>
              </div>
            ) : (
              recentTransactions.map((tx) => {
                const isSuccess = tx.status === "SUCCESS";
                const isPending = tx.status === "PENDING";

                return (
                  <div
                    key={tx.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.85rem 1rem",
                      borderRadius: "0.85rem",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #f1f5f9",
                      gap: "0.75rem"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: isSuccess ? "#dcfce7" : isPending ? "#ffedd5" : "#fee2e2",
                        color: isSuccess ? "#16a34a" : isPending ? "#ea580c" : "#dc2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {tx.user?.name || tx.user?.email || "Pelanggan"}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                          {tx.plan?.replace("_", " ") || "Langganan"} • {new Date(tx.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: isSuccess ? "#16a34a" : "#64748b"
                      }}>
                        {isSuccess ? `+Rp ${Number(tx.amount).toLocaleString("id-ID")}` : `Rp ${Number(tx.amount).toLocaleString("id-ID")}`}
                      </div>
                      <span style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        padding: "0.1rem 0.45rem",
                        borderRadius: "9999px",
                        backgroundColor: isSuccess ? "#dcfce7" : isPending ? "#ffedd5" : "#f1f5f9",
                        color: isSuccess ? "#16a34a" : isPending ? "#ea580c" : "#64748b"
                      }}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
