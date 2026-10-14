import { Plus, Smartphone, SignalHigh, SignalLow, MoreVertical, QrCode, Trash2 } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { deleteDevice } from "@/app/actions/devices";
import DeleteDeviceButton from "./DeleteDeviceButton";

export const instant = false;

export default async function DevicesPage() {
  const session = await getSession();
  let devices: any[] = [];
  
  if (session) {
    devices = await prisma.device.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" }
    });
  }

  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>Connected Devices</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>Manage your WhatsApp numbers and API connections here.</p>
        </div>
        <Link href="/dashboard/devices/add" className="btn-primary" style={{ textDecoration: "none" }}>
          <Plus size={18} />
          Add Device
        </Link>
      </div>

      <div className="stats-grid">
        {devices.map((device) => (
          <div key={device.id} className="stat-card" style={{ gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ 
                  background: device.status === "CONNECTED" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
                  padding: "0.75rem", 
                  borderRadius: "0.5rem" 
                }}>
                  <Smartphone size={24} style={{ color: device.status === "CONNECTED" ? "#10b981" : "#ef4444" }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "1.1rem" }}>{device.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>
                    {device.number ? `+${device.number}` : "Not linked yet"}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", opacity: 0.8 }}>
                    <strong>Session ID:</strong> {device.sessionId}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: 500, marginTop: "0.25rem" }}>
                    Terikirim: {device.messageCount} Pesan
                  </p>
                </div>
              </div>
              <DeleteDeviceButton sessionId={device.sessionId} />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: device.status === "CONNECTED" ? "#10b981" : (device.status === "WAITING_FOR_QR" ? "#f59e0b" : "#ef4444") }}></div>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)" }}>{device.status.replace(/_/g, " ")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.85rem", fontWeight: 500 }}>
                {device.status === "CONNECTED" ? <SignalHigh size={16} /> : <SignalLow size={16} />}
                <span>{device.status === "CONNECTED" ? "Good Signal" : "No Signal"}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Device Card - Scan QR */}
        <Link 
          href="/dashboard/devices/add"
          className="stat-card" 
          style={{ gap: "1.5rem", borderStyle: "dashed", borderColor: "var(--border)", borderWidth: "2px", background: "transparent", cursor: "pointer", boxShadow: "none", textDecoration: "none" }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem", padding: "1rem" }}>
            <div style={{ background: "var(--secondary)", padding: "1rem", borderRadius: "50%", transition: "all 0.2s ease" }}>
              <QrCode size={32} style={{ color: "var(--muted-foreground)" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: "0.25rem", fontSize: "1.1rem" }}>Connect New Device</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Scan QR code to link your WhatsApp</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
