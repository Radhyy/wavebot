"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Smartphone, 
  MessageSquare, 
  Users, 
  Settings,
  Send,
  BellRing,
  ChevronDown,
  Mail,
  Bot,
  ListTree,
  Code
} from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();
  
  // Auto open message menu if we are in one of its subpages
  const isMessageActive = pathname.startsWith("/dashboard/send") || 
                          pathname.startsWith("/dashboard/auto-reply") || 
                          pathname.startsWith("/dashboard/interactive-menu") ||
                          pathname.startsWith("/dashboard/reminder") ||
                          pathname.startsWith("/dashboard/ai-chatbot");
                          
  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(isMessageActive);

  useEffect(() => {
    if (isMessageActive) {
      setIsMessageMenuOpen(true);
    }
  }, [isMessageActive]);

  const mainItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Devices", href: "/dashboard/devices", icon: Smartphone },
  ];

  const messageItems = [
    { name: "Send Message", href: "/dashboard/send", icon: Send },
    { name: "Auto Reply", href: "/dashboard/auto-reply", icon: MessageSquare },
    { name: "Menu Flow", href: "/dashboard/interactive-menu", icon: ListTree },
    { name: "Reminder", href: "/dashboard/reminder", icon: BellRing },
    { name: "AI Chatbot", href: "/dashboard/ai-chatbot", icon: Bot },
  ];

  const bottomItems = [
    { name: "Contacts", href: "/dashboard/contacts", icon: Users },
    { name: "API Docs", href: "/dashboard/api-docs", icon: Code },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const renderLink = (item: any, isSubItem = false) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.name}
        href={item.href}
        className={`nav-item ${isActive ? "active" : ""}`}
        style={isSubItem ? { paddingLeft: "2.5rem", fontSize: "0.95rem" } : {}}
      >
        <Icon size={isSubItem ? 18 : 20} />
        {item.name}
      </Link>
    );
  };

  return (
    <nav className="sidebar-nav" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      {mainItems.map(item => renderLink(item))}

      {/* Dropdown Menu for Message */}
      <div>
        <button 
          onClick={() => setIsMessageMenuOpen(!isMessageMenuOpen)}
          className={`nav-item ${isMessageActive && !isMessageMenuOpen ? "active" : ""}`}
          style={{ width: "100%", display: "flex", justifyContent: "space-between", background: isMessageActive && isMessageMenuOpen ? "rgba(37, 99, 235, 0.05)" : "transparent", border: "none", cursor: "pointer", color: isMessageActive ? "var(--primary)" : "var(--foreground)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Mail size={20} />
            <span style={{ fontWeight: 600 }}>Message</span>
          </div>
          <ChevronDown 
            size={16} 
            style={{ 
              transform: isMessageMenuOpen ? "rotate(180deg)" : "rotate(0deg)", 
              transition: "transform 0.2s" 
            }} 
          />
        </button>
        
        {isMessageMenuOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", marginTop: "0.25rem" }}>
            {messageItems.map(item => renderLink(item, true))}
          </div>
        )}
      </div>

      {bottomItems.map(item => renderLink(item))}
    </nav>
  );
}
