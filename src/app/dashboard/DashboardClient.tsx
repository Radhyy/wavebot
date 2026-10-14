"use client";

import { 
  Smartphone, 
  MessageSquare, 
  Users, 
  Activity,
  ArrowUpRight,
  Send,
  ListTree,
  Code,
  ArrowRight,
  ExternalLink,
  User,
  Clock
} from "lucide-react";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

function formatTimeAgo(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  } catch {
    return "Recent";
  }
}

export default function DashboardClient({ 
  userName, 
  stats, 
  hourlyData = [], 
  recentActivities = [] 
}: any) {
  const cards = [
    {
      title: "Connected Devices",
      value: stats.devices,
      icon: Smartphone,
      trend: "+1 this week",
      trendColor: "#16a34a" // green
    },
    {
      title: "Total Messages Sent",
      value: stats.messages,
      icon: Send,
      trend: "All time",
      trendColor: "var(--muted-foreground)"
    },
    {
      title: "Active Auto Replies",
      value: stats.autoReplies,
      icon: MessageSquare,
      trend: "Listening...",
      trendColor: "var(--muted-foreground)"
    },
    {
      title: "Active Menu Flows",
      value: stats.menus,
      icon: ListTree,
      trend: "Interactive",
      trendColor: "var(--muted-foreground)"
    },
  ];

  const aiTokenData = [
    { name: 'Used Tokens', value: 4320 },
    { name: 'Remaining Tokens', value: 5680 }
  ];
  const COLORS = ['#2563eb', '#f1f5f9'];
  
  // Extract first name from real logged in user
  const firstName = userName ? userName.split(' ')[0] : 'User';

  return (
    <div className="dashboard-container" style={{ paddingBottom: "2rem" }}>
      
      {/* Greeting Section */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h1 style={{ fontFamily: "var(--font-poppins)", fontSize: "2.25rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem", letterSpacing: "-0.025em" }}>
          Welcome back, {firstName}!
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: "1.05rem" }}>
          Berikut adalah ringkasan performa dan metrik Gateway WhatsApp Anda hari ini.
        </p>
      </div>

      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
        {cards.map((stat, idx) => {
          const Icon = stat.icon;
          // Colors based on index to give variety like the screenshot
          const colors = [
            { bg: "#dcfce7", color: "#16a34a" }, // green
            { bg: "#fee2e2", color: "#dc2626" }, // red
            { bg: "#ffedd5", color: "#ea580c" }, // orange
            { bg: "#f1f5f9", color: "#475569" }, // slate
          ];
          const colorTheme = colors[idx % colors.length];

          return (
            <div key={idx} style={{ 
              backgroundColor: "var(--card)", 
              border: "1px solid var(--border)", 
              borderRadius: "1.25rem", 
              padding: "1.5rem", 
              display: "flex", 
              flexDirection: "column", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "10px", 
                  backgroundColor: colorTheme.bg, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: colorTheme.color
                }}>
                  <Icon size={20} />
                </div>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  cursor: "pointer"
                }}>
                  <ArrowUpRight size={16} />
                </div>
              </div>
              
              <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.75rem" }}>
                {stat.title}
              </div>
              
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--foreground)", lineHeight: 1, marginBottom: "0.5rem" }}>
                {stat.value}
              </div>
              
              <div style={{ fontSize: "0.85rem", color: stat.trendColor, fontWeight: stat.trendColor !== "var(--muted-foreground)" ? 500 : 400 }}>
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginTop: "1rem" }}>
        
        {/* Main Chart: Professional Volume Bar Chart (Inspired by reference screenshot) */}
        <div style={{ 
          background: "var(--card)", 
          borderRadius: "1.25rem", 
          padding: "1.75rem", 
          border: "1px solid var(--border)", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Header & Metric Pill */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--foreground)", margin: 0, letterSpacing: "-0.015em" }}>
                Traffic & Volume Pesan (24h)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginTop: "0.25rem", margin: 0 }}>
                Distribusi pengiriman pesan keluar masuk real-time
              </p>
            </div>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.4rem", 
              backgroundColor: "#eff6ff", 
              color: "#2563eb", 
              padding: "0.35rem 0.75rem", 
              borderRadius: "9999px",
              fontSize: "0.8rem",
              fontWeight: 600,
              border: "1px solid #dbeafe"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#2563eb" }}></span>
              Live Gateway
            </div>
          </div>

          <div style={{ width: "100%", height: "290px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={hourlyData.length > 0 ? hourlyData : [
                  { time: '00', volume: 0 },
                  { time: '04', volume: 0 },
                  { time: '08', volume: 0 },
                  { time: '12', volume: 0 },
                  { time: '16', volume: 0 },
                  { time: '20', volume: 0 },
                  { time: '23', volume: 0 },
                ]} 
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barCategoryGap="15%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "#94a3b8" }} 
                  dy={8}
                  interval={2}
                  tickFormatter={(val) => `${val}:00`}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${v}`}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: "rgba(56, 189, 248, 0.08)", radius: 4 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{
                          backgroundColor: "#0f172a",
                          color: "#ffffff",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.8rem",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)"
                        }}>
                          <div style={{ color: "#94a3b8", fontSize: "0.7rem", marginBottom: "0.2rem" }}>Jam {label}:00</div>
                          <div style={{ fontWeight: 700, color: "#38bdf8" }}>{payload[0].value} Pesan</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="volume" 
                  fill="#38bdf8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Card (Matching user reference UI) */}
        <div style={{ 
          background: "var(--card)", 
          borderRadius: "1.25rem", 
          padding: "1.5rem 1.5rem 1.25rem", 
          border: "1px solid var(--border)", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.01em" }}>
                Recent Activity
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "0.2rem", margin: 0 }}>
                Live transactions from top gateways
              </p>
            </div>
            <Link 
              href="/dashboard/send" 
              title="View all activities"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                textDecoration: "none",
                padding: "4px",
                borderRadius: "6px",
                transition: "color 0.15s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "#374151"}
              onMouseOut={(e) => e.currentTarget.style.color = "#9ca3af"}
            >
              <ExternalLink size={15} strokeWidth={2.2} />
            </Link>
          </div>

          {/* Activities List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", flex: 1, justifyContent: recentActivities.length === 0 ? "center" : "flex-start" }}>
            {recentActivities.length > 0 ? (
              recentActivities.map((act: any) => {
              const isSent = act.status === "SENT";
              const isPending = act.status === "PENDING";
              const isFailed = act.status === "FAILED";

              // Style button exactly like the reference screenshot (Orange "Buy" vs Gray "Sold")
              let btnBg = "#f97316";
              let btnColor = "#ffffff";
              let btnBorder = "none";
              let btnShadow = "0 1px 3px rgba(249, 115, 22, 0.35)";
              let btnText = "Sent";

              if (isSent) {
                btnBg = "linear-gradient(180deg, #ff7a1a 0%, #ea580c 100%)";
                btnColor = "#ffffff";
                btnText = "Sent";
              } else if (isPending) {
                btnBg = "linear-gradient(180deg, #fb923c 0%, #f97316 100%)";
                btnColor = "#ffffff";
                btnText = "Pending";
              } else {
                // Failed / Sold style like the 3rd row in screenshot
                btnBg = "transparent";
                btnColor = "#9ca3af";
                btnBorder = "1px solid #e5e7eb";
                btnShadow = "none";
                btnText = "Failed";
              }

              return (
                <div 
                  key={act.id} 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem"
                  }}
                >
                  {/* Left: Avatar + Details */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: 0, flex: 1 }}>
                    {/* User silhouette icon exactly matching reference */}
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9ca3af",
                      flexShrink: 0
                    }}>
                      <User size={17} strokeWidth={2.2} />
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      {/* Top line: Name/Target in bold + action */}
                      <div style={{ 
                        fontSize: "0.88rem", 
                        color: "#111827", 
                        whiteSpace: "nowrap", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis",
                        lineHeight: 1.3
                      }}>
                        <span style={{ fontWeight: 700 }}>{act.target}</span>{" "}
                        <span style={{ color: "#6b7280", fontWeight: 400 }}>sent to</span>{" "}
                        <span style={{ fontWeight: 700 }}>{act.deviceName}</span>
                      </div>

                      {/* Bottom line: amount/detail | time ago */}
                      <div style={{ 
                        fontSize: "0.78rem", 
                        color: "#9ca3af", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "0.45rem",
                        marginTop: "0.15rem",
                        lineHeight: 1.2
                      }}>
                        <span style={{ color: "#4b5563", fontWeight: 500 }}>
                          {act.message}
                        </span>
                        <span>|</span>
                        <span>{formatTimeAgo(act.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Rounded Pill Button matching screenshot orange / light gray */}
                  <div style={{
                    background: btnBg,
                    color: btnColor,
                    border: btnBorder,
                    boxShadow: btnShadow,
                    minWidth: "62px",
                    textAlign: "center",
                    padding: "0.38rem 0.85rem",
                    borderRadius: "0.6rem",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    flexShrink: 0,
                    letterSpacing: "0.01em",
                    cursor: "pointer"
                  }}>
                    {btnText}
                  </div>
                </div>
              );
            })
            ) : (
              <div style={{ 
                textAlign: "center", 
                padding: "2.5rem 1rem", 
                color: "var(--muted-foreground)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  backgroundColor: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.5rem",
                  color: "#cbd5e1"
                }}>
                  <Send size={18} />
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--foreground)" }}>Belum ada aktivitas</div>
                <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", margin: "0.25rem 0 0" }}>
                  Pesan yang dikirim melalui gateway akan tercatat secara langsung di sini.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section: API Banner and AI Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
        
        {/* API Banner */}
        <div style={{ 
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          borderRadius: "1.25rem", 
          padding: "2rem", 
          color: "white", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          position: "relative", 
          overflow: "hidden", 
          boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)" 
        }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem", position: "relative", zIndex: 1 }}>Kembangkan Bisnis Anda dengan API</h3>
          <p style={{ opacity: 0.9, marginBottom: "1.5rem", maxWidth: "80%", lineHeight: 1.6, position: "relative", zIndex: 1 }}>
            Integrasikan pengiriman pesan WhatsApp secara instan ke dalam sistem internal, website, atau aplikasi lain milik Anda menggunakan REST API Gateway kami.
          </p>
          <div style={{ position: "relative", zIndex: 1 }}>
            <Link href="/dashboard/api-docs" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "white", color: "#1d4ed8", padding: "0.75rem 1.25rem", borderRadius: "0.5rem", fontWeight: 600, textDecoration: "none", transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              Lihat Panduan API <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* AI Usage Chart */}
        <div style={{ background: "var(--card)", borderRadius: "1.25rem", padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem", width: "100%" }}>Groq AI Token Usage</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", width: "100%", marginBottom: "1rem" }}>Batas harian rate limit API (Mock)</p>
          <div style={{ width: "100%", height: "200px", position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aiTokenData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {aiTokenData.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: "0.5rem", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", top: "0", left: "0", right: "0", bottom: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>43%</span>
              <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Terpakai</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
