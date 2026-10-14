"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { logout } from "@/app/actions/auth";

interface NavbarProps {
  activePage?: "home" | "docs" | "pricing" | "features";
}

interface UserSession {
  id: string;
  name: string;
  email: string;
}

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch active session from API
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="navbar-fixed-container" style={{
      position: "fixed",
      top: "1.25rem",
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      zIndex: 100,
      pointerEvents: "none",
      padding: "0 1rem"
    }}>
      <nav className="navbar-capsule" style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        padding: "0.6rem 1.25rem",
        width: "100%",
        maxWidth: "1100px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: "9999px", // capsule shape
        border: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        pointerEvents: "auto",
        transition: "all 0.3s ease"
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "#0f172a", flexShrink: 0 }}>
          <Image 
            src="/LogoNewNoBg.png" 
            alt="WaveBot Logo" 
            width={32} 
            height={32} 
            style={{ objectFit: "contain" }}
            priority
          />
          <span style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.025em" }}>WaveBot</span>
        </Link>
      
        {/* Navigation Links (Desktop) */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="nav-links-hidden-mobile">
          <Link 
            href="/#features" 
            style={{ 
              textDecoration: "none", 
              color: activePage === "features" ? "#2563eb" : "#475569", 
              fontWeight: 500, 
              fontSize: "0.95rem" 
            }}
          >
            Features
          </Link>
          <Link 
            href="/docs" 
            style={{ 
              textDecoration: "none", 
              color: activePage === "docs" ? "#2563eb" : "#475569", 
              fontWeight: activePage === "docs" ? 600 : 500, 
              fontSize: "0.95rem" 
            }}
          >
            API Docs
          </Link>
          <Link 
            href="/pricing" 
            style={{ 
              textDecoration: "none", 
              color: activePage === "pricing" ? "#2563eb" : "#475569", 
              fontWeight: activePage === "pricing" ? 600 : 500, 
              fontSize: "0.95rem" 
            }}
          >
            Pricing
          </Link>
        </div>

        {/* Right Section: User Profile or Sign in / Get started */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {loading ? (
            <div style={{ width: "80px", height: "34px" }} />
          ) : user ? (
            /* Logged In User Profile & Dropdown */
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="nav-user-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  padding: "0.3rem 0.75rem 0.3rem 0.35rem",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#cbd5e1"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                {/* Avatar Initial */}
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  flexShrink: 0
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                
                {/* User Name */}
                <span className="nav-user-name" style={{ 
                  fontSize: "0.88rem", 
                  fontWeight: 600, 
                  color: "#0f172a",
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  {user.name || "User"}
                </span>

                <ChevronDown 
                  size={14} 
                  color="#64748b" 
                  style={{
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease"
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 0.6rem)",
                  right: 0,
                  width: "210px",
                  backgroundColor: "#ffffff",
                  borderRadius: "0.875rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                  padding: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  zIndex: 110,
                  animation: "fadeIn 0.15s ease"
                }}>
                  {/* User info banner inside dropdown */}
                  <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid #f1f5f9", marginBottom: "0.25rem" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {user.email}
                    </div>
                  </div>

                  {/* Dashboard Link */}
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "0.5rem",
                      textDecoration: "none",
                      color: "#334155",
                      fontSize: "0.88rem",
                      fontWeight: 500,
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#eff6ff";
                      e.currentTarget.style.color = "#2563eb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#334155";
                    }}
                  >
                    <LayoutDashboard size={16} color="#2563eb" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Logout Action */}
                  <form action={logout}>
                    <button
                      type="submit"
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "#ef4444",
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <LogOut size={16} color="#ef4444" />
                      <span>Logout</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out: Sign in & Get started */
            <>
              <Link href="/login" className="nav-signin-link" style={{ textDecoration: "none", color: "#0f172a", fontWeight: 600, fontSize: "0.9rem" }}>
                Sign in
              </Link>
              <Link href="/login" style={{ 
                textDecoration: "none", 
                backgroundColor: "#2563eb", 
                color: "white", 
                padding: "0.5rem 1.1rem", 
                borderRadius: "9999px", 
                fontWeight: 600, 
                fontSize: "0.88rem",
                whiteSpace: "nowrap"
              }}>
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Global Navbar Mobile Styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .nav-links-hidden-mobile {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .navbar-fixed-container {
            top: 0.75rem !important;
            padding: 0 0.75rem !important;
          }
          .navbar-capsule {
            padding: 0.5rem 0.85rem !important;
            width: 100% !important;
          }
          .nav-user-btn {
            padding: 0.25rem 0.55rem 0.25rem 0.25rem !important;
          }
          .nav-user-name {
            max-width: 80px !important;
            font-size: 0.82rem !important;
          }
          .nav-signin-link {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
