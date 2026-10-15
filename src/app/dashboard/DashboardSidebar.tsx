"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Smartphone, 
  Send, 
  MessageSquare, 
  ListTree, 
  BellRing, 
  Bot, 
  Users, 
  Code, 
  Settings, 
  Globe, 
  LogOut, 
  PanelLeftClose, 
  PanelLeft, 
  Search,
  ChevronsUpDown,
  BookOpen,
  ShieldCheck,
  ReceiptText,
  Tag,
  Headphones
} from "lucide-react";
import { logout } from "@/app/actions/auth";

interface DashboardSidebarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string | null;
  userPlan?: string;
  userRole?: string;
}

export default function DashboardSidebar({ 
  userName = "User", 
  userEmail = "user@wavebot.id",
  userAvatar = null,
  userPlan = "FREE",
  userRole = "USER"
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const adminNav = [
    { name: "Admin Panel", href: "/dashboard/admin", icon: ShieldCheck },
    { name: "Monitoring Order", href: "/dashboard/admin/orders", icon: ReceiptText },
    { name: "Manajemen Pengguna", href: "/dashboard/admin/users", icon: Users },
    { name: "Tiket Laporan", href: "/dashboard/admin/tickets", icon: Headphones },
    { name: "Edit Harga", href: "/dashboard/admin/pricing", icon: Tag },
  ];

  const mainNav = [
    ...(userRole !== "ADMIN" ? [{ name: "Overview", href: "/dashboard", icon: LayoutDashboard }] : []),
    { name: "Devices", href: "/dashboard/devices", icon: Smartphone },
    { name: "Send Message", href: "/dashboard/send", icon: Send },
    { name: "Auto Reply", href: "/dashboard/auto-reply", icon: MessageSquare },
    { name: "Menu Flow", href: "/dashboard/interactive-menu", icon: ListTree },
    { name: "Reminder", href: "/dashboard/reminder", icon: BellRing },
    { name: "AI Chatbot", href: "/dashboard/ai-chatbot", icon: Bot },
  ];

  const toolsNav = [
    { name: "Contacts", href: "/dashboard/contacts", icon: Users },
    { name: "Customer Service", href: "/dashboard/customer-service", icon: Headphones },
    { name: "API Docs", href: "/dashboard/api-docs", icon: Code },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const externalNav = [
    { name: "Landing Page", href: "/", icon: Globe },
    { name: "Dokumentasi Web", href: "/docs", icon: BookOpen },
  ];

  const filterItem = (item: { name: string; href: string }) => {
    if (!searchQuery.trim()) return true;
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const renderNavItem = (item: { name: string; href: string; icon: any }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.name : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: collapsed ? "0.6rem" : "0.5rem 0.75rem",
          borderRadius: "0.5rem",
          textDecoration: "none",
          fontSize: "0.86rem",
          fontWeight: isActive ? 600 : 500,
          color: isActive ? "#0f172a" : "#64748b",
          backgroundColor: isActive ? "#ffffff" : "transparent",
          boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" : "none",
          transition: "all 0.15s ease",
          justifyContent: collapsed ? "center" : "flex-start",
          whiteSpace: "nowrap"
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)";
            e.currentTarget.style.color = "#0f172a";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#64748b";
          }
        }}
      >
        <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} style={{ flexShrink: 0, color: isActive ? "#2563eb" : "#64748b" }} />
        {!collapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <aside style={{
      width: collapsed ? "64px" : "250px",
      transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      backgroundColor: "#f9fafb", // Very clean subtle light gray matching Obscura design
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      flexShrink: 0,
      position: "relative",
      userSelect: "none"
    }}>
      
      {/* Top Header: Logo + Brand + Collapse Button */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        height: "64px",
        padding: collapsed ? "0" : "0 1.1rem",
        borderBottom: "1px solid #e5e7eb",
        position: "relative"
      }}>
        <Link 
          href="/" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: "0.6rem", 
            textDecoration: "none", 
            overflow: "hidden" 
          }}
        >
          {/* Logo with compact 28px size */}
          <div style={{
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <Image
              src="/LogoNewNoBg.png"
              alt="WaveBot Logo"
              width={28}
              height={28}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          {!collapsed && (
            <span style={{ 
              fontSize: "1.1rem", 
              fontWeight: 700, 
              color: "#0f172a", 
              letterSpacing: "-0.025em" 
            }}>
              WaveBot
            </span>
          )}
        </Link>

        {/* Toggle Collapse Button:
            When collapsed: positioned right on the boundary line (border) between sidebar and navbar/main content.
            When expanded: neatly placed at the top-right of the sidebar.
        */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          style={{
            position: collapsed ? "absolute" : "static",
            right: collapsed ? "-13px" : "auto",
            top: collapsed ? "50%" : "auto",
            transform: collapsed ? "translateY(-50%)" : "none",
            backgroundColor: collapsed ? "#ffffff" : "transparent",
            border: collapsed ? "1px solid #e2e8f0" : "none",
            boxShadow: collapsed ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            color: "#64748b",
            cursor: "pointer",
            width: collapsed ? "26px" : "28px",
            height: collapsed ? "26px" : "28px",
            borderRadius: collapsed ? "50%" : "0.375rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 30,
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = collapsed ? "#f8fafc" : "rgba(0,0,0,0.05)";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = collapsed ? "#ffffff" : "transparent";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Search Input Box (Hidden when collapsed) */}
      {!collapsed && (
        <div style={{ padding: "0.85rem 1rem 0.35rem 1rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
            padding: "0.45rem 0.65rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
          }}>
            <Search size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                width: "100%",
                fontSize: "0.82rem",
                color: "#0f172a",
                fontFamily: "inherit"
              }}
            />
            <div style={{ display: "flex", gap: "0.15rem" }}>
              <kbd style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "0.2rem", padding: "0.05rem 0.25rem", fontSize: "0.65rem", color: "#64748b", fontWeight: 600 }}>⌘</kbd>
              <kbd style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "0.2rem", padding: "0.05rem 0.25rem", fontSize: "0.65rem", color: "#64748b", fontWeight: 600 }}>K</kbd>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div 
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          padding: collapsed ? "0.75rem 0.5rem" : "0.75rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem"
        }}
      >
        
        {/* Admin Section (Di paling atas khusus Admin) */}
        {userRole === "ADMIN" && (
          <div>
            {!collapsed && (
              <div style={{ 
                fontSize: "0.7rem", 
                fontWeight: 600, 
                color: "#94a3b8", 
                textTransform: "capitalize", 
                letterSpacing: "0.02em", 
                padding: "0 0.5rem 0.35rem 0.5rem" 
              }}>
                Administrator
              </div>
            )}
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {adminNav.filter(filterItem).map(renderNavItem)}
            </nav>
          </div>
        )}

        {/* Main Section */}
        <div>
          {!collapsed && (
            <div style={{ 
              fontSize: "0.7rem", 
              fontWeight: 600, 
              color: "#94a3b8", 
              textTransform: "capitalize", 
              letterSpacing: "0.02em", 
              padding: "0 0.5rem 0.35rem 0.5rem" 
            }}>
              Main
            </div>
          )}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {mainNav.filter(filterItem).map(renderNavItem)}
          </nav>
        </div>

        {/* Tools Section */}
        <div>
          {!collapsed && (
            <div style={{ 
              fontSize: "0.7rem", 
              fontWeight: 600, 
              color: "#94a3b8", 
              textTransform: "capitalize", 
              letterSpacing: "0.02em", 
              padding: "0 0.5rem 0.35rem 0.5rem" 
            }}>
              Tools
            </div>
          )}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {toolsNav.filter(filterItem).map(renderNavItem)}
          </nav>
        </div>

        {/* External / Navigation Section */}
        <div>
          {!collapsed && (
            <div style={{ 
              fontSize: "0.7rem", 
              fontWeight: 600, 
              color: "#94a3b8", 
              textTransform: "capitalize", 
              letterSpacing: "0.02em", 
              padding: "0 0.5rem 0.35rem 0.5rem" 
            }}>
              Navigasi
            </div>
          )}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {externalNav.filter(filterItem).map(renderNavItem)}
          </nav>
        </div>

      </div>

      {/* Bottom User Profile Card (Matching Obscura pill card style) */}
      <div style={{
        padding: collapsed ? "0.75rem 0.5rem" : "0.75rem",
        borderTop: "1px solid rgba(229, 231, 235, 0.7)"
      }}>
        {collapsed ? (
          <form action={logout}>
            <button
              type="submit"
              title="Keluar / Logout"
              style={{
                width: "100%",
                padding: "0.6rem 0",
                background: "transparent",
                border: "none",
                borderRadius: "0.5rem",
                color: "#ef4444",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <LogOut size={18} />
            </button>
          </form>
        ) : (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            padding: "0.6rem 0.75rem",
            borderRadius: "0.75rem",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
          }}>
            <Link 
              href="/dashboard/settings" 
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", overflow: "hidden", textDecoration: "none", flex: 1 }}
              title="Buka Pengaturan Profil"
            >
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.8rem",
                flexShrink: 0,
                overflow: "hidden",
                position: "relative"
              }}>
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt={userName}
                    fill
                    sizes="32px"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.35rem" }}>
                  <span style={{ 
                    fontSize: "0.82rem", 
                    fontWeight: 600, 
                    color: "#0f172a", 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis",
                    maxWidth: "105px"
                  }}>
                    {userName}
                  </span>
                  <span style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "4px",
                    backgroundColor: userRole === "ADMIN" ? "rgba(139, 92, 246, 0.15)" : userPlan === "FREE" ? "#f1f5f9" : "rgba(37, 99, 235, 0.12)",
                    color: userRole === "ADMIN" ? "#7c3aed" : userPlan === "FREE" ? "#64748b" : "#2563eb",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    letterSpacing: "0.02em"
                  }}>
                    {userRole === "ADMIN" ? "ADMIN" : userPlan === "FREE" ? "Free" : userPlan.replace("_", " ")}
                  </span>
                </div>
                <span style={{ 
                  fontSize: "0.7rem", 
                  color: "#94a3b8", 
                  whiteSpace: "nowrap", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis",
                  marginTop: "1px" 
                }}>
                  {userEmail}
                </span>
              </div>
            </Link>
            
            <form action={logout}>
              <button
                type="submit"
                title="Keluar"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "0.25rem",
                  borderRadius: "0.25rem",
                  display: "flex",
                  alignItems: "center"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
              >
                <LogOut size={15} />
              </button>
            </form>
          </div>
        )}
      </div>

    </aside>
  );
}
