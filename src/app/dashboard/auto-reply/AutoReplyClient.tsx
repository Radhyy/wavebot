"use client";

import { useState } from "react";
import { Plus, Trash2, Power, PowerOff } from "lucide-react";
import AutoReplyModal from "./AutoReplyModal";
import { toggleAutoReply, deleteAutoReply } from "@/app/actions/autoReply";

export default function AutoReplyClient({ initialData, devices }: { initialData: any[], devices: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleToggle = async (id: string, currentState: boolean) => {
    setLoadingId(id);
    await toggleAutoReply(id, !currentState);
    setLoadingId(null);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    setLoadingId(confirmDeleteId);
    await deleteAutoReply(confirmDeleteId);
    setLoadingId(null);
    setConfirmDeleteId(null);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>Auto Reply</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Atur balasan otomatis untuk pesan masuk.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={18} />
          Tambah Auto Reply
        </button>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", overflow: "hidden" }}>
        {initialData.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>
            Belum ada auto reply yang dibuat.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1px", background: "var(--border)" }}>
            {initialData.map((item) => (
              <div key={item.id} style={{ background: "var(--card)", padding: "1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)" }}>
                      {item.keyword}
                    </span>
                    <span style={{ fontSize: "0.75rem", padding: "0.1rem 0.5rem", background: "var(--secondary)", borderRadius: "1rem", color: "var(--muted-foreground)", fontWeight: 600 }}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: "0.75rem", padding: "0.1rem 0.5rem", background: "rgba(37, 99, 235, 0.1)", borderRadius: "1rem", color: "var(--primary)", fontWeight: 600 }}>
                      {item.device?.name || "Global (Semua Nomor)"}
                    </span>
                  </div>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>
                    {item.reply}
                  </p>
                </div>
                
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button 
                    onClick={() => handleToggle(item.id, item.isActive)}
                    disabled={loadingId === item.id}
                    title={item.isActive ? "Matikan sementara" : "Nyalakan"}
                    style={{ 
                      padding: "0.5rem", 
                      background: item.isActive ? "rgba(16, 185, 129, 0.1)" : "var(--secondary)", 
                      color: item.isActive ? "#10b981" : "var(--muted-foreground)", 
                      border: "none", 
                      borderRadius: "0.5rem",
                      cursor: loadingId === item.id ? "not-allowed" : "pointer" 
                    }}
                  >
                    {item.isActive ? <Power size={18} /> : <PowerOff size={18} />}
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(item.id)}
                    disabled={loadingId === item.id}
                    title="Hapus"
                    style={{ 
                      padding: "0.5rem", 
                      background: "rgba(239, 68, 68, 0.1)", 
                      color: "#ef4444", 
                      border: "none", 
                      borderRadius: "0.5rem",
                      cursor: loadingId === item.id ? "not-allowed" : "pointer" 
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AutoReplyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        devices={devices}
      />

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "var(--card)", padding: "2rem", borderRadius: "1rem", width: "90%", maxWidth: "400px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Hapus Auto Reply?</h3>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>Aturan auto reply ini akan dihapus secara permanen dan tidak akan membalas pesan lagi. Lanjutkan?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button 
                onClick={() => setConfirmDeleteId(null)} 
                className="btn-secondary"
                style={{ padding: "0.6rem 1.25rem", borderRadius: "0.5rem", background: "transparent", border: "1px solid var(--border)", cursor: "pointer" }}
              >Batal</button>
              <button 
                onClick={executeDelete} 
                style={{ padding: "0.6rem 1.25rem", borderRadius: "0.5rem", background: "#ef4444", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
              >Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
