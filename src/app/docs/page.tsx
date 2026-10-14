"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Terminal, Copy, Check, Send, Activity, 
  Users, Globe, Code2, Sparkles, Zap, Lock
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navItems = [
    { id: "overview", label: "Pengenalan & Arsitektur", icon: Globe },
    { id: "authentication", label: "Autentikasi & Session", icon: Lock },
    { id: "send-message", label: "POST Kirim Pesan Teks", icon: Send },
    { id: "send-poll", label: "POST Kirim Polling WhatsApp", icon: Sparkles },
    { id: "check-status", label: "GET Cek Status Sesi", icon: Activity },
    { id: "get-groups", label: "GET Daftar Grup WhatsApp", icon: Users },
    { id: "errors", label: "Error Codes & Status", icon: Terminal },
    { id: "sdks", label: "Contoh Bahasa / SDK", icon: Code2 },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "var(--font-inter)", color: "#0f172a" }}>
      {/* Reusable Floating Capsule Navbar */}
      <Navbar activePage="docs" />

      {/* Main Documentation Layout (padded top so it clears the floating navbar) */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        paddingTop: "6.5rem",
        paddingBottom: "5rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        display: "grid",
        gridTemplateColumns: "310px 1fr",
        gap: "2.5rem",
        alignItems: "start"
      }} className="docs-layout">
        
        {/* Sticky Card Navigation Wrapper */}
        <aside style={{
          position: "sticky",
          top: "6.5rem",
          zIndex: 10
        }} className="docs-nav-aside">
          {/* Main Card Container */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "1.25rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem"
          }}>
            {/* Header within Card */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              paddingBottom: "0.85rem", 
              marginBottom: "0.5rem", 
              borderBottom: "1px solid #f1f5f9" 
            }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                  Dokumentasi
                </span>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                  REST API v1.0
                </span>
              </div>
              <span style={{ 
                backgroundColor: "#eff6ff", 
                color: "#2563eb", 
                fontSize: "0.7rem", 
                fontWeight: 700, 
                padding: "0.2rem 0.55rem", 
                borderRadius: "9999px",
                border: "1px solid #dbeafe"
              }}>
                Docs
              </span>
            </div>

            {/* Nav Items */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      const el = document.getElementById(item.id);
                      if (el) {
                        const yOffset = -120; // offset for fixed floating navbar
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "0.75rem",
                      border: "none",
                      background: isActive ? "#eff6ff" : "transparent",
                      color: isActive ? "#2563eb" : "#475569",
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <IconComp size={16} color={isActive ? "#2563eb" : "#64748b"} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Card Footer Helper */}
            <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                <Zap size={14} color="#2563eb" />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f172a" }}>Session WhatsApp</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                Buka Dashboard &gt; Devices untuk scan QR dan mendapatkan Session ID.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area in Main Column */}
        <main style={{ maxWidth: "1000px" }} className="docs-main-content">
          
          {/* Section: Overview */}
          <section id="overview" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#2563eb", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              <Globe size={18} /> REST API REFERENCE
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.03em", color: "#0f172a", marginBottom: "1rem" }}>
              WaveBot WhatsApp API Documentation
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#475569", lineHeight: 1.7, marginBottom: "2rem" }}>
              WaveBot menyediakan REST API berkecepatan tinggi yang memungkinkan Anda mengintegrasikan notifikasi WhatsApp otomatis, blast pesan massal, polling interaktif, pengingat tagihan, hingga interaksi AI ke dalam aplikasi web, mobile, sistem ERP, maupun CRM Anda.
            </p>

            {/* Base URL Box */}
            <div className="docs-base-url-box" style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              padding: "1.25rem 1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Base URL Endpoint</span>
                <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a", fontFamily: "monospace", marginTop: "0.25rem" }}>
                  https://api.wavebot.id/api/wa <span style={{ color: "#94a3b8", fontWeight: 400 }}>(atau host domain Anda)</span>
                </div>
              </div>
              <button
                onClick={() => copyCode("base-url", "https://api.wavebot.id/api/wa")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 0.9rem",
                  borderRadius: "0.4rem",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  color: "#334155",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {copiedKey === "base-url" ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                {copiedKey === "base-url" ? "Tersalin" : "Salin URL"}
              </button>
            </div>

            {/* Key Features Quick Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="quick-grid">
              <div style={{ padding: "1.25rem", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem" }}>
                <div style={{ color: "#2563eb", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>Instant Send</div>
                <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>Latensi pengiriman rendah di bawah 1 detik menggunakan websocket engine.</p>
              </div>
              <div style={{ padding: "1.25rem", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem" }}>
                <div style={{ color: "#16a34a", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>Multi-Device</div>
                <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>Mendukung banyak nomor WhatsApp (session terpisah) dalam satu akun.</p>
              </div>
              <div style={{ padding: "1.25rem", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem" }}>
                <div style={{ color: "#9333ea", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>AI-Powered</div>
                <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>Integrasi Groq LLM untuk auto-reply kontekstual dan customer service otomatis.</p>
              </div>
            </div>
          </section>

          {/* Section: Authentication */}
          <section id="authentication" style={{ marginBottom: "5rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: "0.75rem" }}>
              Autentikasi & Identifikasi Session
            </h2>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Setiap panggilan API memerlukan parameter <code style={{ backgroundColor: "#f1f5f9", padding: "0.15rem 0.4rem", borderRadius: "4px", color: "#0f172a", fontWeight: 600 }}>sessionId</code>. Session ID ini merupakan identitas unik dari nomor WhatsApp Anda yang terhubung pada menu <strong>Devices / Perangkat</strong> di Dashboard.
            </p>
            <div style={{ padding: "1.25rem", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "0.75rem", color: "#1e40af", fontSize: "0.95rem" }}>
              <strong>Tips Praktis:</strong> Buka Dashboard &gt; <em>Devices</em> &gt; Tambah Perangkat &gt; Scan QR. Setelah status perangkat <code>CONNECTED</code>, gunakan nama atau ID sesi tersebut pada setiap request API.
            </div>
          </section>

          {/* Section: POST /api/wa/send */}
          <section id="send-message" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ backgroundColor: "#15803d", color: "white", fontWeight: 700, fontSize: "0.8rem", padding: "0.25rem 0.6rem", borderRadius: "0.35rem" }}>POST</span>
              <code style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>/api/wa/send</code>
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: "0.75rem" }}>
              Kirim Pesan Teks WhatsApp
            </h2>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Mengirimkan pesan teks personal, OTP, notifikasi order, atau broadcast ke nomor tujuan tertentu.
            </p>

            {/* Request Parameters Table */}
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>Request Body (JSON)</h3>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1.5rem", backgroundColor: "#ffffff" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                    <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#475569" }}>Field</th>
                    <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#475569" }}>Tipe</th>
                    <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#475569" }}>Wajib</th>
                    <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#475569" }}>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontWeight: 600, color: "#2563eb" }}>sessionId</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>string</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#dc2626", fontWeight: 600 }}>Ya</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#334155" }}>ID sesi perangkat WhatsApp yang terhubung</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontWeight: 600, color: "#2563eb" }}>number</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>string</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#dc2626", fontWeight: 600 }}>Ya</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#334155" }}>Nomor WhatsApp tujuan (format 628xxx atau 08xxx) atau Group ID (xxxx@g.us)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontWeight: 600, color: "#2563eb" }}>message</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>string</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#dc2626", fontWeight: 600 }}>Ya</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#334155" }}>Konten pesan teks yang ingin dikirimkan</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Code Example: cURL */}
            <div style={{ backgroundColor: "#0f172a", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1.25rem", borderBottom: "1px solid #1e293b", backgroundColor: "#1e293b" }}>
                <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>Contoh Request (cURL)</span>
                <button
                  onClick={() => copyCode("curl-send", `curl -X POST https://api.wavebot.id/api/wa/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "sessionId": "session_628123456789",
    "number": "6289876543210",
    "message": "Halo! Kode verifikasi OTP Anda adalah: 948210"
  }'`)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem" }}
                >
                  {copiedKey === "curl-send" ? <Check size={14} color="#4ade80" /> : <Copy size={14} />} Salin
                </button>
              </div>
              <pre style={{ margin: 0, padding: "1.25rem", color: "#e2e8f0", fontSize: "0.85rem", overflowX: "auto", fontFamily: "monospace", lineHeight: 1.5 }}>
{`curl -X POST https://api.wavebot.id/api/wa/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "sessionId": "session_628123456789",
    "number": "6289876543210",
    "message": "Halo! Kode verifikasi OTP Anda adalah: 948210"
  }'`}
              </pre>
            </div>

            {/* Response Example */}
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>Contoh Response Berhasil (200 OK)</h3>
            <div style={{ backgroundColor: "#0f172a", borderRadius: "0.75rem", overflow: "hidden" }}>
              <pre style={{ margin: 0, padding: "1.25rem", color: "#4ade80", fontSize: "0.85rem", overflowX: "auto", fontFamily: "monospace", lineHeight: 1.5 }}>
{`{
  "success": true,
  "result": {
    "key": {
      "remoteJid": "6289876543210@s.whatsapp.net",
      "fromMe": true,
      "id": "BAE53819A2BC391A"
    },
    "messageTimestamp": "1728892400"
  }
}`}
              </pre>
            </div>
          </section>

          {/* Section: POST Kirim Polling WhatsApp */}
          <section id="send-poll" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ backgroundColor: "#15803d", color: "white", fontWeight: 700, fontSize: "0.8rem", padding: "0.25rem 0.6rem", borderRadius: "0.35rem" }}>POST</span>
              <code style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>/api/wa/send (Polling)</code>
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: "0.75rem" }}>
              Kirim Polling WhatsApp Interaktif
            </h2>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Buat survei, voting, atau kuesioner interaktif langsung di chat WhatsApp dengan mengirimkan payload JSON polling pada field <code style={{ backgroundColor: "#f1f5f9", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>message</code>.
            </p>

            <div style={{ backgroundColor: "#0f172a", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1.25rem", borderBottom: "1px solid #1e293b", backgroundColor: "#1e293b" }}>
                <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>Payload Polling (JSON)</span>
                <button
                  onClick={() => copyCode("poll-code", `curl -X POST https://api.wavebot.id/api/wa/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "sessionId": "session_628123456789",
    "number": "6289876543210",
    "message": "{\\"type\\":\\"poll\\",\\"name\\":\\"Bagaimana kepuasan Anda belanja di toko kami?\\",\\"options\\":[\\"Sangat Puas\\",\\"Cukup Puas\\",\\"Kurang Puas\\"]}"
  }'`)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem" }}
                >
                  {copiedKey === "poll-code" ? <Check size={14} color="#4ade80" /> : <Copy size={14} />} Salin
                </button>
              </div>
              <pre style={{ margin: 0, padding: "1.25rem", color: "#e2e8f0", fontSize: "0.85rem", overflowX: "auto", fontFamily: "monospace", lineHeight: 1.5 }}>
{`curl -X POST https://api.wavebot.id/api/wa/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "sessionId": "session_628123456789",
    "number": "6289876543210",
    "message": "{\\"type\\":\\"poll\\",\\"name\\":\\"Bagaimana kepuasan belanja Anda?\\",\\"options\\":[\\"Sangat Puas\\",\\"Cukup Puas\\",\\"Kurang Puas\\"]}"
  }'`}
              </pre>
            </div>
          </section>

          {/* Section: GET /api/wa/status */}
          <section id="check-status" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ backgroundColor: "#2563eb", color: "white", fontWeight: 700, fontSize: "0.8rem", padding: "0.25rem 0.6rem", borderRadius: "0.35rem" }}>GET</span>
              <code style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>/api/wa/status</code>
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: "0.75rem" }}>
              Cek Status Koneksi Sesi Perangkat
            </h2>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Periksa apakah nomor WhatsApp sedang aktif terhubung (<code style={{ backgroundColor: "#f1f5f9", padding: "0.15rem 0.4rem" }}>CONNECTED</code>), terputus, atau sedang menunggu scan QR.
            </p>

            <div style={{ backgroundColor: "#0f172a", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #1e293b", backgroundColor: "#1e293b", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>
                Request (cURL)
              </div>
              <pre style={{ margin: 0, padding: "1.25rem", color: "#e2e8f0", fontSize: "0.85rem", overflowX: "auto", fontFamily: "monospace" }}>
{`curl -X GET "https://api.wavebot.id/api/wa/status?sessionId=session_628123456789"`}
              </pre>
            </div>

            <div style={{ backgroundColor: "#0f172a", borderRadius: "0.75rem", overflow: "hidden" }}>
              <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #1e293b", backgroundColor: "#1e293b", color: "#4ade80", fontSize: "0.8rem", fontWeight: 600 }}>
                Response (200 OK)
              </div>
              <pre style={{ margin: 0, padding: "1.25rem", color: "#4ade80", fontSize: "0.85rem", overflowX: "auto", fontFamily: "monospace" }}>
{`{
  "success": true,
  "sessionId": "session_628123456789",
  "status": "CONNECTED",
  "user": {
    "id": "628123456789:1@s.whatsapp.net",
    "name": "WaveBot Business"
  }
}`}
              </pre>
            </div>
          </section>

          {/* Section: GET /api/wa/groups */}
          <section id="get-groups" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ backgroundColor: "#2563eb", color: "white", fontWeight: 700, fontSize: "0.8rem", padding: "0.25rem 0.6rem", borderRadius: "0.35rem" }}>GET</span>
              <code style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>/api/wa/groups</code>
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: "0.75rem" }}>
              Ambil Daftar Grup WhatsApp
            </h2>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Mengambil semua daftar grup WhatsApp yang diikuti oleh nomor bot untuk keperluan broadcast ke grup atau otomasi komunitas.
            </p>

            <div style={{ backgroundColor: "#0f172a", borderRadius: "0.75rem", overflow: "hidden" }}>
              <pre style={{ margin: 0, padding: "1.25rem", color: "#4ade80", fontSize: "0.85rem", overflowX: "auto", fontFamily: "monospace" }}>
{`{
  "success": true,
  "count": 2,
  "groups": [
    {
      "id": "120363023910293847@g.us",
      "name": "Komunitas Pelanggan VIP"
    },
    {
      "id": "120363024829103842@g.us",
      "name": "Customer Support Internal"
    }
  ]
}`}
              </pre>
            </div>
          </section>

          {/* Section: Error Codes */}
          <section id="errors" style={{ marginBottom: "5rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: "0.75rem" }}>
              HTTP Status & Error Codes
            </h2>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Format respon error standar yang dikembalikan oleh WaveBot API:
            </p>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "0.75rem", overflow: "hidden", backgroundColor: "#ffffff" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                    <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#475569" }}>Code</th>
                    <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#475569" }}>Status</th>
                    <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#475569" }}>Penyebab & Solusi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontWeight: 700, color: "#16a34a" }}>200</td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>OK</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>Pesan atau permintaan berhasil diproses secara langsung.</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontWeight: 700, color: "#eab308" }}>400</td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Bad Request</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>Parameter wajib kurang (sessionId, number, atau message kosong).</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontWeight: 700, color: "#dc2626" }}>404</td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Not Found</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>Perangkat atau session ID tidak ditemukan di server.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontWeight: 700, color: "#dc2626" }}>500</td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Server Error</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>Sesi WhatsApp terputus atau nomor tujuan belum terdaftar di WA.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Code Examples & SDKs */}
          <section id="sdks" style={{ marginBottom: "5rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#0f172a", marginBottom: "0.75rem" }}>
              Contoh Implementasi Multi-Bahasa
            </h2>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Salin kode di bawah untuk mengintegrasikan WaveBot langsung ke dalam aplikasi Node.js, PHP, atau Python Anda.
            </p>

            {/* Node.js (Axios / Fetch) */}
            <div style={{ backgroundColor: "#0f172a", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1.25rem", borderBottom: "1px solid #1e293b", backgroundColor: "#1e293b" }}>
                <span style={{ color: "#38bdf8", fontSize: "0.8rem", fontWeight: 600 }}>JavaScript / Node.js (Fetch)</span>
                <button
                  onClick={() => copyCode("js-example", `const response = await fetch("https://api.wavebot.id/api/wa/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId: "YOUR_SESSION_ID",
    number: "6281234567890",
    message: "Halo dari Node.js!"
  })
});
const data = await response.json();
console.log(data);`)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem" }}
                >
                  {copiedKey === "js-example" ? <Check size={14} color="#4ade80" /> : <Copy size={14} />} Salin
                </button>
              </div>
              <pre style={{ margin: 0, padding: "1.25rem", color: "#e2e8f0", fontSize: "0.85rem", overflowX: "auto", fontFamily: "monospace", lineHeight: 1.5 }}>
{`const response = await fetch("https://api.wavebot.id/api/wa/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId: "YOUR_SESSION_ID",
    number: "6281234567890",
    message: "Halo dari Node.js!"
  })
});

const data = await response.json();
console.log(data);`}
              </pre>
            </div>

            {/* PHP Example */}
            <div style={{ backgroundColor: "#0f172a", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1.25rem", borderBottom: "1px solid #1e293b", backgroundColor: "#1e293b" }}>
                <span style={{ color: "#a855f7", fontSize: "0.8rem", fontWeight: 600 }}>PHP (cURL)</span>
                <button
                  onClick={() => copyCode("php-example", `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wavebot.id/api/wa/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode([
    "sessionId" => "YOUR_SESSION_ID",
    "number" => "6281234567890",
    "message" => "Halo dari PHP Backend!"
  ]),
  CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem" }}
                >
                  {copiedKey === "php-example" ? <Check size={14} color="#4ade80" /> : <Copy size={14} />} Salin
                </button>
              </div>
              <pre style={{ margin: 0, padding: "1.25rem", color: "#e2e8f0", fontSize: "0.85rem", overflowX: "auto", fontFamily: "monospace", lineHeight: 1.5 }}>
{`<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wavebot.id/api/wa/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode([
    "sessionId" => "YOUR_SESSION_ID",
    "number" => "6281234567890",
    "message" => "Halo dari PHP Backend!"
  ]),
  CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`}
              </pre>
            </div>

            {/* Python Example */}
            <div style={{ backgroundColor: "#0f172a", borderRadius: "0.75rem", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1.25rem", borderBottom: "1px solid #1e293b", backgroundColor: "#1e293b" }}>
                <span style={{ color: "#fbbf24", fontSize: "0.8rem", fontWeight: 600 }}>Python (Requests)</span>
                <button
                  onClick={() => copyCode("py-example", `import requests

url = "https://api.wavebot.id/api/wa/send"
payload = {
    "sessionId": "YOUR_SESSION_ID",
    "number": "6281234567890",
    "message": "Halo dari Python!"
}
response = requests.post(url, json=payload)
print(response.json())`)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem" }}
                >
                  {copiedKey === "py-example" ? <Check size={14} color="#4ade80" /> : <Copy size={14} />} Salin
                </button>
              </div>
              <pre style={{ margin: 0, padding: "1.25rem", color: "#e2e8f0", fontSize: "0.85rem", overflowX: "auto", fontFamily: "monospace", lineHeight: 1.5 }}>
{`import requests

url = "https://api.wavebot.id/api/wa/send"
payload = {
    "sessionId": "YOUR_SESSION_ID",
    "number": "6281234567890",
    "message": "Halo dari Python!"
}

response = requests.post(url, json=payload)
print(response.json())`}
              </pre>
            </div>
          </section>

        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          .docs-layout {
            grid-template-columns: 1fr !important;
            padding-top: 5.5rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            gap: 1.5rem !important;
          }
          .docs-nav-aside {
            position: static !important;
            margin-bottom: 1.5rem !important;
            top: auto !important;
          }
          .quick-grid {
            grid-template-columns: 1fr !important;
          }
          .docs-main-content {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
          .docs-main-content h1 {
            font-size: 1.65rem !important;
            line-height: 1.25 !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          .docs-main-content h2 {
            font-size: 1.3rem !important;
            line-height: 1.3 !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          .docs-main-content p {
            font-size: 0.92rem !important;
            line-height: 1.6 !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          .docs-base-url-box {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.85rem !important;
            padding: 1rem !important;
          }
          .docs-base-url-box > div {
            width: 100% !important;
            overflow-wrap: break-word !important;
            word-break: break-all !important;
          }
          .docs-base-url-box button {
            width: 100% !important;
            justify-content: center !important;
          }
          pre {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            font-size: 0.78rem !important;
          }
          table {
            display: block !important;
            width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }
        }
      `}} />
    </div>
  );
}
