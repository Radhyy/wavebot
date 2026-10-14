"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, MessageCircle, Lock, Shield, Check, MoreHorizontal, Zap, 
  AppWindow, Home, Settings, Sun, Wind, Battery, Plug, Clock, RefreshCcw,
  QrCode, Radio, Bot, Sparkles, Code2, Users, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const gridFeatures = [
  {
    icon: QrCode,
    title: "Multi-Device & QR Scan",
    description: "Hubungkan banyak nomor WhatsApp bisnis secara instan melalui scan QR code berbasis engine Baileys yang stabil."
  },
  {
    icon: Radio,
    title: "Broadcast & Blast Massal",
    description: "Kirim pesan promosi, pengumuman, dan notifikasi ke ribuan kontak pelanggan sekaligus tanpa hambatan antrean."
  },
  {
    icon: Bot,
    title: "Auto-Reply 24/7 Cerdas",
    description: "Respon pesan masuk otomatis sepanjang waktu dengan pemicu kata kunci yang dapat dikustomisasi secara fleksibel."
  },
  {
    icon: Sparkles,
    title: "Integrasi AI Chatbot",
    description: "Ditenagai oleh LLM AI (Groq SDK) untuk membalas pertanyaan pelanggan secara natural, kontekstual, dan solutif."
  },
  {
    icon: Code2,
    title: "REST API Super Cepat",
    description: "Dokumentasi API lengkap dan mudah diintegrasikan ke website, aplikasi, sistem OTP, CRM, atau sistem backend Anda."
  },
  {
    icon: Users,
    title: "Manajemen Kontak & Grup",
    description: "Kelola daftar kontak pelanggan, import kontak, dan lakukan segmentasi target penerima pesan dengan rapi dan mudah."
  },
  {
    icon: Clock,
    title: "Pengingat & Jadwal Pesan",
    description: "Otomatisasi pengiriman pesan pengingat tagihan, janji temu, dan notifikasi terjadwal tepat waktu tanpa terlewat."
  },
  {
    icon: ShieldCheck,
    title: "Keamanan & Webhook Status",
    description: "Pantau status pesan terkirim, dibaca, dan gagal secara real-time via Webhook dengan standar keamanan data terjamin."
  }
];

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

export default function LandingPage() {

  return (
    <div style={{ minHeight: "100vh", fontFamily: "var(--font-inter)", backgroundColor: "#ffffff", overflowX: "clip" }}>
      
      {/* Reusable Floating Capsule Navbar */}
      <Navbar activePage="home" />

      {/* Hero Section */}
      <section className="hero-section" style={{ 
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#ffffff"
      }}>
        
        {/* Background Texture with White Base and Lower Opacity */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "url('/Hero/Baground.jpg') center top / cover no-repeat",
          opacity: 0.12,
          zIndex: 1
        }}></div>

        {/* Content Wrapper */}
        <div className="hero-content-wrapper" style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "12rem",
          width: "100%"
        }}>
          {/* Floating WhatsApp Icon */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: -15 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="hero-wa-icon" 
            style={{ 
              position: "absolute", 
              left: "10%", 
              top: "25%", 
              width: "110px", 
              height: "110px", 
              zIndex: 10 
            }}
          >
            <Image 
              src="/Hero/WaLogo2.png" 
              alt="WhatsApp Icon" 
              fill 
              style={{ objectFit: "contain" }} 
              priority
            />
          </motion.div>

          <div style={{ maxWidth: "900px", padding: "0 1.5rem", position: "relative", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <motion.h1 
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 1.02, 0.47, 0.98] }}
              className="hero-headline" 
              style={{ 
                fontSize: "clamp(2.15rem, 5vw, 4.5rem)", 
                fontWeight: 700, 
                color: "#0f172a", 
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                marginBottom: "1.25rem"
              }}
            >
              Infrastruktur WhatsApp <br/>
              <span style={{ 
                position: "relative", 
                display: "inline-block",
                color: "white",
                padding: "0 0.5rem",
                margin: "0 0.25rem",
                zIndex: 1
              }}>
                {/* Stabilo Background */}
                <motion.span 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    bottom: "-5px",
                    left: 0,
                    right: 0,
                    backgroundColor: "#2563eb", // blue from dashboard
                    transformOrigin: "left center",
                    transform: "rotate(-1deg)",
                    zIndex: -1,
                    borderRadius: "4px"
                  }}
                ></motion.span>
                API Gateway
              </span> Modern
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="hero-subtitle" 
              style={{ 
                fontSize: "1.15rem", 
                color: "#475569", 
                lineHeight: 1.6, 
                marginBottom: "2rem",
                maxWidth: "600px",
                fontWeight: 400
              }}
            >
              Kirim pesan otomatis, buat Auto-Reply cerdas, rancang Menu Interaktif, hingga integrasikan Chatbot AI ke sistem bisnis Anda dengan sangat mudah dan cepat.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
              className="hero-btn-container" 
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", width: "100%" }}
            >
              <Link href="/login" className="hero-cta-btn" style={{ 
                textDecoration: "none", 
                backgroundColor: "#2563eb", 
                color: "white", 
                padding: "0.85rem 1.75rem", 
                borderRadius: "0.5rem", 
                fontWeight: 600, 
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease"
              }}>
                Get started <ArrowRight size={18} />
              </Link>
              <Link href="/docs" className="hero-cta-btn" style={{ 
                textDecoration: "none", 
                backgroundColor: "rgba(255, 255, 255, 0.8)", 
                backdropFilter: "blur(4px)",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                padding: "0.85rem 1.75rem", 
                borderRadius: "0.5rem", 
                fontWeight: 600, 
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}>
                Baca Dokumentasi
              </Link>
            </motion.div>
          </div>

          {/* Dashboard Mockup (Cropped at bottom) */}
          <div className="hero-mockup-wrapper" style={{ 
            marginTop: "2rem", 
            width: "90%", 
            maxWidth: "1200px",
            position: "relative",
            zIndex: 10
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              display: "flex", // Ensure image flows normally
              background: "transparent"
            }}>
              <div className="hero-mockup-card" style={{
                width: "100%",
                borderRadius: "1.25rem",
                overflow: "hidden",
                boxShadow: "none",
                border: "none",
                outline: "none"
              }}>
                <Image 
                  src="/Hero/DashboardPanelImageNew.png" 
                  alt="Dashboard Preview" 
                  width={1920}
                  height={1080}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section id="features" style={{ 
        paddingTop: "8rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h2 className="feature-section-title" style={{ 
          fontSize: "clamp(2rem, 4vw, 3rem)", 
          fontWeight: 500, 
          color: "#0f172a", 
          marginBottom: "4rem",
          letterSpacing: "-0.025em",
          textAlign: "center",
          position: "sticky",
          top: "40px",
          zIndex: 1,
          padding: "1rem 0",
          width: "100%"
        }}>
          Infrastruktur Kelas Enterprise
        </h2>

        {/* Stack Container */}
        <div style={{
          width: "100%",
          maxWidth: "1300px",
          display: "flex",
          flexDirection: "column",
          gap: "4rem"
        }}>
          
          {/* Card 1: Security */}
          <div style={{
            width: "100%",
            backgroundColor: "#f8fafc", 
            borderRadius: "1.5rem",
            border: "1px solid #e2e8f0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            overflow: "hidden",
            gap: "2rem",
            alignItems: "center",
            padding: "3rem",
            position: "sticky",
            top: "180px",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)",
            zIndex: 2
          }} className="feature-card">
            
            {/* Left Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="feature-card-text"
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingRight: "2rem" }}>
              <div className="feature-card-icon" style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "50%", 
                backgroundColor: "white", 
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), inset 0 0 0 1px #e2e8f0",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                marginBottom: "2rem"
              }}>
                <Lock size={20} color="#334155" />
              </div>

              <h3 className="feature-card-title" style={{ fontSize: "2rem", fontWeight: 600, color: "#0f172a", marginBottom: "1rem" }}>
                Keamanan & Privasi Terjamin
              </h3>
              
              <p className="feature-card-desc" style={{ fontSize: "1.15rem", color: "#475569", lineHeight: 1.6 }}>
                Kami memprioritaskan privasi data Anda di atas segalanya. Setiap transmisi pesan melalui API kami diproses dengan standar keamanan tingkat tinggi dan diawasi dengan ketat, memastikan perlindungan penuh terhadap akun bisnis Anda.
              </p>
            </motion.div>

            {/* Right Custom UI Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="feature-card-visual"
              style={{ position: "relative", width: "100%", minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              
              {/* Arches / Rings */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -40%)", width: "650px", height: "650px", borderTop: "1px solid #cbd5e1", borderRadius: "50%", opacity: 0.5 }}></div>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -35%)", width: "450px", height: "450px", borderTop: "2px solid #94a3b8", borderRadius: "50%", opacity: 0.5 }}></div>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -30%)", width: "300px", height: "300px", borderTop: "1px solid #cbd5e1", borderRadius: "50%", opacity: 0.5 }}></div>

              {/* Floating Nodes */}
              <div style={{ position: "absolute", top: "35%", left: "15%", width: "45px", height: "45px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <MoreHorizontal size={18} color="#64748b" />
              </div>
              <div style={{ position: "absolute", top: "15%", right: "25%", width: "35px", height: "35px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <Check size={16} color="#64748b" />
              </div>
              <div style={{ position: "absolute", top: "60%", right: "10%", width: "30px", height: "30px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <Zap size={14} color="#64748b" />
              </div>

              {/* Main Shield Layout */}
              <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "center", alignItems: "center", filter: "drop-shadow(0 25px 35px rgba(30, 58, 138, 0.4))" }}>
                <Shield size={180} fill="#1e3a8a" color="#1e40af" strokeWidth={1} />
                
                {/* Lock inside Shield */}
                <div style={{ position: "absolute", zIndex: 20 }}>
                  <Lock size={50} color="white" />
                </div>
              </div>

            </motion.div>
          </div>

          {/* Card 2: Accessibility */}
          <div style={{
            width: "100%",
            backgroundColor: "#f8fafc", 
            borderRadius: "1.5rem",
            border: "1px solid #e2e8f0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            overflow: "hidden",
            gap: "2rem",
            alignItems: "center",
            padding: "3rem",
            position: "sticky",
            top: "240px",
            boxShadow: "0 -20px 40px -15px rgba(0,0,0,0.05)",
            zIndex: 3
          }} className="feature-card">
            
            {/* Left Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="feature-card-text"
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingRight: "2rem" }}>
              <div className="feature-card-icon" style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "50%", 
                backgroundColor: "white", 
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), inset 0 0 0 1px #e2e8f0",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                marginBottom: "2rem"
              }}>
                <MessageCircle size={20} color="#334155" />
              </div>

              <h3 className="feature-card-title" style={{ fontSize: "2rem", fontWeight: 600, color: "#0f172a", marginBottom: "1rem" }}>
                Integrasi WhatsApp API Mudah
              </h3>
              
              <p className="feature-card-desc" style={{ fontSize: "1.15rem", color: "#475569", lineHeight: 1.6 }}>
                Hubungkan sistem bisnis Anda langsung ke WhatsApp melalui satu REST API sederhana. Kirim notifikasi, broadcast kampanye, hingga integrasi dengan CRM / ERP dengan sangat mudah. Komunikasi dengan pelanggan menjadi instan, andal, dan profesional.
              </p>
            </motion.div>

            {/* Right Custom UI Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="feature-card-visual"
              style={{ position: "relative", width: "100%", minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              
              {/* Orbital Rings / Flower Shape */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", height: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {/* Horizontal arc */}
                <div style={{ position: "absolute", width: "100%", height: "40%", borderTop: "1px solid #cbd5e1", borderBottom: "1px solid #cbd5e1", borderRadius: "50%", opacity: 0.5 }}></div>
                {/* Vertical arc */}
                <div style={{ position: "absolute", width: "40%", height: "100%", borderLeft: "1px solid #cbd5e1", borderRight: "1px solid #cbd5e1", borderRadius: "50%", opacity: 0.5 }}></div>
              </div>

              {/* Floating Nodes */}
              <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "45px", height: "45px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <Sun size={20} color="#64748b" strokeWidth={1.5} />
              </div>
              <div style={{ position: "absolute", top: "25%", left: "25%", width: "55px", height: "55px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <Home size={24} color="#64748b" strokeWidth={1.5} />
              </div>
              <div style={{ position: "absolute", top: "25%", right: "25%", width: "55px", height: "55px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <Zap size={24} color="#64748b" strokeWidth={1.5} />
              </div>
              <div style={{ position: "absolute", top: "50%", left: "15%", transform: "translateY(-50%)", width: "45px", height: "45px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <Settings size={20} color="#64748b" strokeWidth={1.5} />
              </div>
              <div style={{ position: "absolute", top: "50%", right: "15%", transform: "translateY(-50%)", width: "45px", height: "45px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <Wind size={20} color="#64748b" strokeWidth={1.5} />
              </div>
              <div style={{ position: "absolute", bottom: "25%", left: "30%", width: "45px", height: "45px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <MessageCircle size={20} color="#64748b" strokeWidth={1.5} />
              </div>
              <div style={{ position: "absolute", bottom: "10%", right: "35%", width: "45px", height: "45px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <Plug size={20} color="#64748b" strokeWidth={1.5} />
              </div>
              <div style={{ position: "absolute", bottom: "20%", right: "20%", width: "45px", height: "45px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <Battery size={20} color="#64748b" strokeWidth={1.5} />
              </div>

              {/* Central Core Button */}
              <div style={{ 
                position: "relative", 
                zIndex: 10, 
                width: "90px",
                height: "90px",
                background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
                borderRadius: "50%",
                boxShadow: "0 20px 30px -5px rgba(30, 58, 138, 0.5), inset 0 2px 10px rgba(255,255,255,0.4)",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "4px",
                padding: "24px",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {/* 9 dots pattern inside */}
                {[...Array(9)].map((_, i) => (
                  <div key={i} style={{ width: "8px", height: "8px", backgroundColor: "white", borderRadius: "50%", opacity: i === 4 ? 1 : 0.8 }}></div>
                ))}
              </div>

            </motion.div>
          </div>

          {/* Card 3: Workflow Automation */}
          <div style={{
            width: "100%",
            backgroundColor: "#f8fafc", 
            borderRadius: "1.5rem",
            border: "1px solid #e2e8f0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            overflow: "hidden",
            gap: "2rem",
            alignItems: "center",
            padding: "3rem",
            position: "sticky",
            top: "300px",
            boxShadow: "0 -20px 40px -15px rgba(0,0,0,0.05)",
            zIndex: 4
          }} className="feature-card">
            
            {/* Left Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="feature-card-text"
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingRight: "2rem" }}>
              <div className="feature-card-icon" style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "50%", 
                backgroundColor: "white", 
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), inset 0 0 0 1px #e2e8f0",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                marginBottom: "2rem"
              }}>
                <RefreshCcw size={20} color="#334155" />
              </div>

              <h3 className="feature-card-title" style={{ fontSize: "2rem", fontWeight: 600, color: "#0f172a", marginBottom: "1rem" }}>
                Automasi Workflow Cerdas
              </h3>
              
              <p className="feature-card-desc" style={{ fontSize: "1.15rem", color: "#475569", lineHeight: 1.6 }}>
                Atur alur komunikasi Anda dengan mudah. Kami menangani pengiriman pesan, logika antrean, dan pelaporan status secara real-time, sehingga Anda bisa fokus pada bisnis utama tanpa khawatir soal infrastruktur.
              </p>
            </motion.div>

            {/* Right Custom UI Content - Flowchart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="feature-card-visual"
              style={{ position: "relative", width: "100%", minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#fafaf9", borderRadius: "1rem", overflow: "hidden", border: "1px solid #e2e8f0" }}>
              
              {/* Grid Background */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.5 }}></div>

              {/* Centered Flowchart Canvas */}
              <div className="flowchart-canvas" style={{ position: "relative", width: "480px", height: "280px", flexShrink: 0 }}>
                {/* Workflow Lines (SVG) */}
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 5 }}>
                   {/* Line from 1 to 2 */}
                   <path d="M 210 55 L 180 55 Q 160 55 160 75 L 160 115 Q 160 135 180 135 L 290 135" fill="none" stroke="#1e3a8a" strokeWidth="1.5" />
                   
                   {/* Line from 1 to 3 */}
                   <path d="M 160 115 L 160 195 Q 160 215 180 215 L 200 215" fill="none" stroke="#1e3a8a" strokeWidth="1.5" />
                   
                   {/* Line from 2 to 4 */}
                   <path d="M 350 155 L 350 195 Q 350 215 330 215 L 310 215" fill="none" stroke="#1e3a8a" strokeWidth="1.5" />
                </svg>

                {/* Node 1 */}
                <div style={{ position: "absolute", top: "35px", left: "190px", backgroundColor: "white", padding: "0.45rem 0.85rem", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "0.6rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 10, border: "1px solid #e2e8f0" }}>
                   <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#1e3a8a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={12} color="white" />
                   </div>
                   <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>Terima Request API</span>
                      <span style={{ fontSize: "0.68rem", color: "#64748b", whiteSpace: "nowrap" }}>Instan</span>
                   </div>
                </div>

                {/* Node 2 */}
                <div style={{ position: "absolute", top: "115px", left: "270px", backgroundColor: "white", padding: "0.45rem 0.85rem", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "0.6rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 10, border: "1px solid #e2e8f0" }}>
                   <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#1e3a8a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={12} color="white" />
                   </div>
                   <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>Validasi Nomor WA</span>
                      <span style={{ fontSize: "0.68rem", color: "#64748b", whiteSpace: "nowrap" }}>~100ms</span>
                   </div>
                </div>

                {/* Node 3 */}
                <div style={{ position: "absolute", top: "195px", left: "40px", backgroundColor: "white", padding: "0.45rem 0.85rem", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "0.6rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 10, border: "1px solid #e2e8f0" }}>
                   <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={12} color="white" />
                   </div>
                   <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>Pesan Terkirim</span>
                      <span style={{ fontSize: "0.68rem", color: "#64748b", whiteSpace: "nowrap" }}>Real-time</span>
                   </div>
                </div>

                {/* Node 4 */}
                <div style={{ position: "absolute", top: "195px", left: "260px", backgroundColor: "white", padding: "0.45rem 0.85rem", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "0.6rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 10, border: "1px solid #e2e8f0" }}>
                   <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={12} color="#64748b" />
                   </div>
                   <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>Update Status</span>
                      <span style={{ fontSize: "0.68rem", color: "#64748b", whiteSpace: "nowrap" }}>Webhook</span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Grid Features Section */}
      <section style={{
        position: "relative",
        zIndex: 20,
        backgroundColor: "#ffffff",
        paddingTop: "6rem",
        paddingBottom: "8rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        borderTop: "1px solid #f1f5f9"
      }}>
        <div style={{
          maxWidth: "1300px",
          margin: "0 auto",
          width: "100%"
        }}>
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ textAlign: "center", marginBottom: "4.5rem" }}
          >
            <h2 style={{ 
              fontSize: "clamp(2rem, 4vw, 3rem)", 
              fontWeight: 500, 
              color: "#0f172a", 
              letterSpacing: "-0.025em" 
            }}>
              Dirancang untuk Kemudahan & Skalabilitas Bisnis
            </h2>
            <p style={{ 
              fontSize: "1.1rem", 
              color: "#64748b", 
              maxWidth: "640px", 
              margin: "1rem auto 0", 
              lineHeight: 1.6 
            }}>
              Semua solusi komunikasi WhatsApp modern terintegrasi dalam satu sistem yang andal, aman, dan siap pakai.
            </p>
          </motion.div>

          {/* 4x2 Feature Grid */}
          <div className="features-grid-container" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "3.5rem 2.5rem"
          }}>
            {gridFeatures.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: (idx % 4) * 0.1 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{ color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconComponent size={22} strokeWidth={2} />
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.015em" }}>
                      {feature.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{
        position: "relative",
        zIndex: 20,
        backgroundColor: "#f8fafc",
        paddingTop: "7rem",
        paddingBottom: "8rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        borderTop: "1px solid #e2e8f0",
        borderTopLeftRadius: "2.5rem",
        borderTopRightRadius: "2.5rem",
        boxShadow: "0 -10px 30px rgba(0,0,0,0.02)"
      }}>
        <div style={{
          maxWidth: "1300px",
          margin: "0 auto",
          width: "100%"
        }}>
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ textAlign: "center", marginBottom: "4.5rem" }}
          >
            <h2 style={{ 
              fontSize: "clamp(2rem, 4vw, 3rem)", 
              fontWeight: 500, 
              color: "#0f172a", 
              letterSpacing: "-0.025em" 
            }}>
              Harga Terjangkau untuk Segala Skala Bisnis
            </h2>
            <p style={{ 
              fontSize: "1.1rem", 
              color: "#64748b", 
              maxWidth: "600px", 
              margin: "1rem auto 0", 
              lineHeight: 1.6 
            }}>
              Mulai secara gratis dan tingkatkan paket kapan saja sesuai pertumbuhan volume pengiriman pesan bisnis Anda.
            </p>
          </motion.div>

          {/* Pricing Grid */}
          <div className="pricing-grid-container" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
            alignItems: "stretch"
          }}>
            {pricingPlans.map((plan, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                style={{
                  backgroundColor: "white",
                  borderRadius: "1.5rem",
                  padding: "2.5rem 2rem",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: plan.isPopular ? "2px solid #2563eb" : "1px solid #e2e8f0",
                  boxShadow: plan.isPopular 
                    ? "0 20px 40px -15px rgba(37, 99, 235, 0.2)" 
                    : "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
                  transition: "box-shadow 0.2s ease"
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Showcase Section (Inspired by user reference screenshot) */}
      <section style={{
        position: "relative",
        zIndex: 20,
        backgroundColor: "#ffffff",
        paddingTop: "6rem",
        paddingBottom: "8rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem"
      }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="integration-header" 
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "2.5rem",
              alignItems: "flex-end",
              marginBottom: "3.5rem"
            }}
          >
            <div>
              <div style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#2563eb",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <span style={{ width: "24px", height: "2px", backgroundColor: "#2563eb", display: "inline-block" }}></span>
                SATU INTEGRASI, SELURUH ALUR
              </div>
              <h2 className="integration-title" style={{
                fontSize: "clamp(2rem, 4vw, 3.1rem)",
                fontWeight: 500,
                color: "#0f172a",
                lineHeight: 1.25,
                letterSpacing: "-0.025em",
                margin: 0
              }}>
                Kompleksitas WhatsApp Gateway, <br />
                <span style={{ color: "#2563eb" }}>dipindahkan dari server Anda.</span>
              </h2>
            </div>
            <div>
              <p className="integration-desc" style={{
                fontSize: "1.05rem",
                color: "#64748b",
                lineHeight: 1.7,
                margin: 0
              }}>
                WaveBot menyatukan scan QR koneksi, pemantauan status perangkat, webhook pesan masuk, dan automasi broadcast dalam satu alur yang mudah dipahami tim produk maupun engineering.
              </p>
            </div>
          </motion.div>

          {/* Cards Bento Grid (Left: Large Tilted QR Card, Right: 2 Stacked Cards) */}
          <div className="integration-grid" style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "2rem",
            alignItems: "stretch"
          }}>
            {/* Left Big Card: Scan QR Feature with Tilted Screenshot */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="integration-card-qr" 
              style={{
                background: "linear-gradient(145deg, #f8fafc 0%, #eff6ff 100%)",
                border: "1px solid #e2e8f0",
                borderRadius: "1.75rem",
                padding: "2.5rem 2.5rem 0",
                display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 10px 30px -10px rgba(37, 99, 235, 0.08)"
            }}>
              <div>
                <div style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem"
                }}>
                  01 / CONNECT
                </div>
                <h3 style={{
                  fontSize: "1.65rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 0.75rem 0",
                  letterSpacing: "-0.02em"
                }}>
                  Satu QR. Langsung terhubung WhatsApp.
                </h3>
                <p style={{
                  fontSize: "0.98rem",
                  color: "#64748b",
                  lineHeight: 1.6,
                  maxWidth: "520px",
                  margin: 0
                }}>
                  Tampilkan QRIS / QR WhatsApp dinamis langsung di produk Anda. Pengguna dapat menautkan nomor dalam hitungan detik tanpa ribet setup server.
                </p>
              </div>

              {/* Tilted Screenshot Image Mockup Container */}
              <div className="integration-mockup-wrapper" style={{
                marginTop: "2.25rem",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end"
              }}>
                <div style={{
                  transform: "perspective(1200px) rotateX(8deg) rotateY(-6deg) rotateZ(2deg) translateY(-1rem)",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(0,0,0,0.06)",
                  width: "100%",
                  maxWidth: "600px",
                  marginBottom: "0.5rem",
                  backgroundColor: "white",
                  transition: "transform 0.4s ease"
                }}>
                  <Image
                    src="/PageAddDeviceWithQrCodeForConnectWa.png"
                    alt="WaveBot Connect Device with QR Code"
                    width={1200}
                    height={800}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block"
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column: 2 Stacked Cards */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem"
            }}>
              {/* Card 1: Clean Light Event Card (Webhook real-time) */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "1.75rem",
                  padding: "2.25rem",
                  color: "var(--foreground)",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)"
                }}
              >
                <div>
                  <div style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem"
                  }}>
                    02 / EVENTS
                  </div>
                  <h3 style={{
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 0.75rem 0",
                    letterSpacing: "-0.015em"
                  }}>
                    Event real-time kembali ke backend Anda.
                  </h3>
                  <p style={{
                    fontSize: "0.92rem",
                    color: "#64748b",
                    lineHeight: 1.6,
                    margin: "0 0 1.5rem 0"
                  }}>
                    WaveBot mengirim webhook instan yang dapat ditangani backend saat pesan masuk, pesan terkirim, atau sesi QR berhasil dipindai.
                  </p>
                </div>

                {/* Event Logs Mockup */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  fontSize: "0.82rem",
                  fontFamily: "monospace"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.6rem",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    color: "#64748b"
                  }}>
                    <span>• message.received</span>
                    <span style={{ color: "#94a3b8" }}>10:14:02</span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.6rem",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    color: "#64748b"
                  }}>
                    <span>• device.connected</span>
                    <span style={{ color: "#94a3b8" }}>10:14:05</span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.6rem",
                    backgroundColor: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    color: "#2563eb",
                    fontWeight: 600
                  }}>
                    <span>• webhook.sent</span>
                    <span>10:14:18</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Multi-Device / Multi-Session Card (Real Feature) */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "1.75rem",
                  padding: "2.25rem",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)"
                }}
              >
                <div>
                  <div style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem"
                  }}>
                    03 / MULTI-DEVICE
                  </div>
                  <h3 style={{
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 0.75rem 0",
                    letterSpacing: "-0.015em"
                  }}>
                    Kelola banyak nomor dalam satu dashboard.
                  </h3>
                  <p style={{
                    fontSize: "0.92rem",
                    color: "#64748b",
                    lineHeight: 1.6,
                    margin: "0 0 1.75rem 0"
                  }}>
                    Pisahkan nomor operasional untuk tim Customer Support, Billing, maupun Marketing tanpa perlu gonta-ganti browser atau server.
                  </p>
                </div>

                {/* Pill Device Multi-Session Mockup */}
                <div style={{
                  display: "flex",
                  backgroundColor: "#ffffff",
                  padding: "0.35rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                  gap: "0.35rem"
                }}>
                  <div style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0.6rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem"
                  }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e" }}></span>
                    CS Utama (Online)
                  </div>
                  <div style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0.6rem",
                    color: "#64748b",
                    fontWeight: 500,
                    fontSize: "0.82rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem"
                  }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6" }}></span>
                    Marketing (Online)
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Modern Light Multi-Column Footer */}
      <footer style={{
        position: "relative",
        zIndex: 20,
        backgroundColor: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        paddingTop: "5rem",
        paddingBottom: "3rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        color: "#64748b"
      }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
          {/* Main Footer Columns */}
          <div className="footer-columns-grid" style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "4rem"
          }}>
            {/* Column 1: Brand & About */}
            <div className="footer-brand-col" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
                <Image 
                  src="/LogoNewNoBg.png" 
                  alt="WaveBot Logo" 
                  width={34} 
                  height={34} 
                  style={{ objectFit: "contain" }}
                />
                <span style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>
                  WaveBot
                </span>
              </div>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "#64748b", margin: "0 0 1.5rem 0", maxWidth: "300px" }}>
                Platform infrastruktur WhatsApp Gateway modern yang andal, aman, dan mudah diintegrasikan untuk kebutuhan notifikasi, blast, dan automasi chatbot bisnis Anda.
              </p>
              
              {/* System Operational Indicator */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 0.85rem",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#16a34a"
              }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block", boxShadow: "0 0 0 2px rgba(34, 197, 94, 0.2)" }}></span>
                Semua Sistem Beroperasi Normal
              </div>
            </div>

            {/* Column 2: Produk & Fitur */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem 0", letterSpacing: "-0.01em" }}>
                Produk
              </h4>
              <Link href="#features" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Multi-Device Gateway
              </Link>
              <Link href="#features" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Broadcast & Blast Massal
              </Link>
              <Link href="#features" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Auto-Reply & Menu Flow
              </Link>
              <Link href="#features" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                AI Chatbot (Groq LLM)
              </Link>
              <Link href="/pricing" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Paket & Harga
              </Link>
            </div>

            {/* Column 3: Developer & API */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem 0", letterSpacing: "-0.01em" }}>
                Developer
              </h4>
              <Link href="/docs" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                REST API Reference
              </Link>
              <Link href="/docs" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Webhook Events Guide
              </Link>
              <Link href="/docs" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                SDK & Code Samples
              </Link>
              <Link href="/dashboard/api-docs" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                API Keys Management
              </Link>
            </div>

            {/* Column 4: Navigasi Cepat */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem 0", letterSpacing: "-0.01em" }}>
                Navigasi
              </h4>
              <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Landing Page
              </Link>
              <Link href="/dashboard" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Dashboard
              </Link>
              <Link href="/login" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Masuk Akun
              </Link>
              <Link href="/register" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Daftar Gratis
              </Link>
            </div>

            {/* Column 5: Hubungi Kami & Keamanan */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem 0", letterSpacing: "-0.01em" }}>
                Dukungan & Legal
              </h4>
              <a href="https://wa.me/" target="_blank" rel="noreferrer" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                WhatsApp Support 24/7
              </a>
              <Link href="/privacy" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Kebijakan Privasi
              </Link>
              <Link href="/terms" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Ketentuan Layanan
              </Link>
              <Link href="/security" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.15s ease" }} onMouseOver={(e) => e.currentTarget.style.color = "#0f172a"} onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}>
                Standar Keamanan
              </Link>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Security Note */}
          <div className="footer-bottom-bar" style={{
            borderTop: "1px solid #e2e8f0",
            paddingTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.85rem",
            color: "#94a3b8"
          }}>
            <p style={{ margin: 0 }}>
              © 2026 WaveBot. Seluruh hak cipta dilindungi. Solusi WhatsApp Bot & API Gateway Indonesia.
            </p>
            <div className="footer-bottom-badges" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <span>Enkripsi End-to-End</span>
              <span>•</span>
              <span>Baileys Engine Powered</span>
              <span>•</span>
              <span>SLA 99.9% Uptime</span>
            </div>
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
        @media (max-width: 1024px) {
          .features-grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2.5rem 2rem !important;
          }
        }
        @media (max-width: 640px) {
          .features-grid-container {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 768px) {
          .nav-links-hidden-mobile {
            display: none !important;
          }
          .feature-section-title {
            position: relative !important;
            top: auto !important;
            font-size: 1.85rem !important;
            margin-bottom: 2rem !important;
            padding: 0 1rem !important;
            background: transparent !important;
          }
          .feature-card {
            position: relative !important;
            top: auto !important;
            grid-template-columns: 1fr !important;
            padding: 1.75rem 1.25rem !important;
            text-align: center;
            gap: 1.5rem !important;
            border-radius: 1.25rem !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.04) !important;
          }
          .feature-card-text {
            padding-right: 0 !important;
            align-items: center !important;
            width: 100% !important;
          }
          .feature-card-icon {
            margin-bottom: 1rem !important;
            width: 44px !important;
            height: 44px !important;
          }
          .feature-card-title {
            font-size: 1.35rem !important;
            line-height: 1.3 !important;
            margin-bottom: 0.75rem !important;
          }
          .feature-card-desc {
            font-size: 0.92rem !important;
            line-height: 1.55 !important;
            max-width: 100% !important;
          }
          .feature-card-visual {
            min-height: 200px !important;
            height: 220px !important;
            max-height: 240px !important;
            width: 100% !important;
            overflow: hidden !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            position: relative !important;
          }
          .feature-card-visual > div:not(.flowchart-canvas),
          .feature-card-visual > svg {
            transform: scale(0.68) !important;
            transform-origin: center center !important;
          }
          .flowchart-canvas {
            transform: scale(0.65) !important;
            transform-origin: center center !important;
          }
          /* Hero Section Mobile Polish */
          .hero-section {
            min-height: auto !important;
            height: auto !important;
            max-height: none !important;
            padding-bottom: 3rem !important;
          }
          .hero-content-wrapper {
            padding-top: 7rem !important;
          }
          .hero-wa-icon {
            display: none !important; /* Hide floating icon on small screens so it does not collide with text */
          }
          .hero-headline {
            font-size: 2.15rem !important;
            line-height: 1.25 !important;
            margin-bottom: 1rem !important;
          }
          .hero-subtitle {
            font-size: 0.98rem !important;
            line-height: 1.55 !important;
            margin-bottom: 1.75rem !important;
            padding: 0 0.5rem !important;
          }
          .hero-btn-container {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.75rem !important;
            padding: 0 1rem !important;
          }
          .hero-cta-btn {
            width: 100% !important;
            padding: 0.85rem 1.25rem !important;
            font-size: 0.95rem !important;
          }
          .hero-mockup-wrapper {
            width: calc(100% - 2rem) !important;
            max-width: 92% !important;
            margin-top: 2rem !important;
            padding: 0 !important;
          }
          .hero-mockup-card {
            border-radius: 0.75rem !important;
            box-shadow: none !important;
            border: none !important;
            outline: none !important;
            overflow: hidden !important;
          }
          /* Integration Showcase Mobile Polish */
          .integration-header {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
            margin-bottom: 2rem !important;
          }
          .integration-title {
            font-size: 1.85rem !important;
            line-height: 1.25 !important;
          }
          .integration-desc {
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
          }
          .integration-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .integration-card-qr {
            padding: 1.75rem 1.25rem 0 !important;
          }
          .integration-mockup-wrapper {
            margin-top: 2rem !important;
          }
          /* Footer Mobile Polish */
          .footer-columns-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.25rem 1.5rem !important;
            margin-bottom: 2.5rem !important;
          }
          .footer-brand-col {
            grid-column: 1 / -1 !important;
            margin-bottom: 0.5rem !important;
          }
          .footer-brand-col p {
            max-width: 100% !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.25rem !important;
            padding-top: 1.5rem !important;
          }
          .footer-bottom-badges {
            flex-wrap: wrap !important;
            gap: 0.75rem !important;
            font-size: 0.78rem !important;
          }
        }
      `}} />
    </div>
  );
}
