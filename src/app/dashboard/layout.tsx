import { Bell, User } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "./DashboardSidebar";

// Pastikan mesin WA menyala setiap kali dashboard dibuka
import "@/lib/whatsapp";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  let userPlan = "FREE";
  let userRole = "USER";
  if (session?.id) {
    const user = await (prisma as any).user.findUnique({
      where: { id: session.id },
      select: { plan: true, role: true }
    });
    userPlan = (user as any)?.plan || "FREE";
    userRole = (user as any)?.role || "USER";
  }

  return (
    <div className="dashboard-layout">
      {/* Minimalist Collapsible Sidebar */}
      <DashboardSidebar 
        userName={session?.name || "User"} 
        userEmail={session?.email || "user@wavebot.id"} 
        userAvatar={session?.avatar || null}
        userPlan={userPlan}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <h1 className="topbar-title">
            Dashboard
          </h1>
          <div className="topbar-actions">
            <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--muted-foreground)", marginRight: "0.5rem" }}>
              Welcome, {session?.name || "User"}
            </span>
            <button className="profile-btn" style={{ border: "none", background: "transparent" }}>
              <Bell size={20} className="text-muted-foreground" />
            </button>
            <a 
              href="/dashboard/settings" 
              className="profile-btn" 
              title="Pengaturan Profil"
              style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
            >
              {session?.avatar ? (
                <img 
                  src={session.avatar} 
                  alt={session.name || "User"} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              ) : (
                <User size={20} />
              )}
            </a>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
