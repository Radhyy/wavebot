"use client";

import { ArrowLeft, Loader2, Tag, QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDevice, checkDeviceStatus } from "@/app/actions/devices";

export default function AddDevicePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [deviceName, setDeviceName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    
    try {
      const res = await addDevice(deviceName);
      if (res.error) throw new Error(res.error);
      
      if (res.sessionId) {
        setSessionId(res.sessionId);
      }
    } catch (err) {
      alert("Failed to create device");
      setStep(1);
    }
  };

  useEffect(() => {
    if (step < 2 || !sessionId) return;

    const interval = setInterval(async () => {
      const status = await checkDeviceStatus(sessionId);
      
      if (status.status === "WAITING_FOR_QR" && status.qr) {
        setQrCodeData(status.qr);
        if (step !== 3) setStep(3);
      } else if (status.status === "CONNECTED") {
        clearInterval(interval);
        router.push("/dashboard/devices");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [step, sessionId, router]);

  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>Add New Device</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>Connect a new WhatsApp number to WaveBot.</p>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", width: "100%" }}>
        <div className="stat-card" style={{ padding: "2.5rem", borderRadius: "1.25rem" }}>
          {step === 1 && (
            <form onSubmit={handleNextStep} style={{ maxWidth: "560px" }}>
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="deviceName" style={{ fontSize: "0.95rem", fontWeight: 600 }}>Device Name</label>
                <div className="input-wrapper">
                  <Tag className="input-icon" />
                  <input
                    type="text"
                    id="deviceName"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Sales Division"
                    required
                    autoFocus
                  />
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginTop: "0.5rem" }}>
                  Give your device a name to easily identify it later in your dashboard.
                </p>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: "0.75rem 1.5rem", fontWeight: 600, fontSize: "1rem", display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
                <QrCode size={18} />
                Generate QR Code
              </button>
            </form>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0", gap: "1.5rem" }}>
              <Loader2 size={48} className="text-primary" style={{ animation: "spin 2s linear infinite", color: "var(--primary)" }} />
              <div style={{ textAlign: "center" }}>
                <h4 style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem", fontSize: "1.2rem" }}>Generating Session...</h4>
                <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)" }}>Please wait while we prepare your connection.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Responsive 2-column layout for QR and Steps */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "auto 1fr", 
                gap: "3rem", 
                alignItems: "center" 
              }}>
                {/* Left: QR Code Box */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ 
                    padding: "1.75rem", 
                    background: "#ffffff", 
                    border: "1px solid var(--border)", 
                    borderRadius: "1.5rem", 
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)" 
                  }}>
                    {qrCodeData ? (
                      <img src={qrCodeData} alt="QR Code" style={{ width: "260px", height: "260px", display: "block" }} />
                    ) : (
                      <div style={{ width: "260px", height: "260px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
                        Loading QR...
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right: Step-by-step instructions */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h4 style={{ fontWeight: 700, color: "var(--foreground)", marginBottom: "1.25rem", fontSize: "1.35rem", letterSpacing: "-0.015em" }}>
                    Scan QR Code via WhatsApp
                  </h4>
                  <ol style={{ 
                    fontSize: "0.95rem", 
                    color: "var(--muted-foreground)", 
                    textAlign: "left", 
                    paddingLeft: "1.25rem", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "0.85rem",
                    lineHeight: 1.5
                  }}>
                    <li>Buka aplikasi <b>WhatsApp</b> di ponsel Anda</li>
                    <li>Ketuk ikon <b>Menu (⋮)</b> di Android atau <b>Settings (⚙️)</b> di iPhone</li>
                    <li>Pilih menu <b>Perangkat Tertaut (Linked Devices)</b></li>
                    <li>Ketuk tombol <b>Tautkan Perangkat (Link a Device)</b></li>
                    <li>Arahkan kamera ponsel Anda ke kode QR di samping</li>
                  </ol>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", alignItems: "center" }}>
                    <Link href="/dashboard/devices" className="btn-primary" style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)", boxShadow: "none", textDecoration: "none", padding: "0.65rem 1.25rem", borderRadius: "0.5rem", fontWeight: 500 }}>
                      Batalkan
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#2563eb", fontSize: "0.9rem", fontWeight: 500 }}>
                      <Loader2 size={16} style={{ animation: "spin 2s linear infinite" }} />
                      Menunggu tautan perangkat...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
