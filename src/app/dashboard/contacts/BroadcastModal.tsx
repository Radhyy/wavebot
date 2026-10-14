"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Send } from "lucide-react";

export default function BroadcastModal({ isOpen, onClose, selectedCount }: { isOpen: boolean, onClose: () => void, selectedCount: number }) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Todo: Implement broadcast action calling whatsapp.ts logic
    alert(`Mensimulasikan pengiriman pesan ke ${selectedCount} kontak...\n\nPesan: ${message}\n\nFitur asli akan diaktifkan segera!`);
    
    setIsSubmitting(false);
    onClose();
    setMessage("");
  };

  const modal = (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 99999
    }}>
      <div style={{
        background: "var(--card)", padding: "2rem", borderRadius: "1rem",
        width: "90%", maxWidth: "500px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Kirim Broadcast</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Membroadcast ke {selectedCount} kontak terpilih.</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group">
            <label>Isi Pesan Promosi / Pengumuman</label>
            <textarea 
              required
              className="form-input" 
              style={{ paddingLeft: "1rem", minHeight: "150px", resize: "vertical" }}
              placeholder="Ketik pesan Anda di sini... (Gunakan [nama] untuk memanggil nama kontak secara otomatis)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "1px solid var(--border)", borderRadius: "0.5rem", cursor: "pointer" }}>
              Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: "0.75rem 1.5rem", backgroundColor: "#10b981", border: "none" }}>
              <Send size={18} style={{ marginRight: "0.5rem" }} />
              {isSubmitting ? "Mengirim..." : "Kirim Sekarang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
