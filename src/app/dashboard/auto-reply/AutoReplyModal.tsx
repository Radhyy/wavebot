"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { addAutoReply } from "@/app/actions/autoReply";

export default function AutoReplyModal({ 
  isOpen, 
  onClose, 
  devices 
}: { 
  isOpen: boolean, 
  onClose: () => void,
  devices: any[]
}) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("EXACT");
  const [reply, setReply] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await addAutoReply({
      keyword: type === "ALL_MESSAGES" ? null : keyword,
      type,
      reply,
      deviceId: deviceId === "ALL" || !deviceId ? null : deviceId,
      startTime: startTime || null,
      endTime: endTime || null,
    });
    
    setIsSubmitting(false);
    onClose();
    // reset form
    setKeyword("");
    setType("EXACT");
    setReply("");
    setDeviceId("");
    setStartTime("");
    setEndTime("");
  };

  const modal = (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 99999
    }}>
      <div style={{
        background: "var(--card)", padding: "2rem", borderRadius: "1rem",
        width: "90%", maxWidth: "500px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        maxHeight: "90vh", overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Tambah Auto Reply</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group">
            <label>Berlaku Untuk Perangkat (Nomor)</label>
            <select 
              value={deviceId} 
              onChange={(e) => setDeviceId(e.target.value)}
              className="form-input" 
              style={{ paddingLeft: "1rem" }}
            >
              <option value="ALL">Semua Nomor (Global)</option>
              {devices.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.number || "Belum Scan"})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipe Kecocokan</label>
            <select 
              value={type} 
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value === "ALL_MESSAGES") setKeyword("");
              }}
              className="form-input" 
              style={{ paddingLeft: "1rem" }}
            >
              <option value="EXACT">Sama Persis (EXACT)</option>
              <option value="CONTAINS">Mengandung Kata (CONTAINS)</option>
              <option value="ALL_MESSAGES">Balas Semua Pesan Masuk (ALL)</option>
            </select>
          </div>

          {type !== "ALL_MESSAGES" && (
            <div className="form-group">
              <label>Kata Kunci (Keyword)</label>
              <input 
                required
                type="text" 
                className="form-input" 
                style={{ paddingLeft: "1rem" }}
                placeholder="Contoh: INFO"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Jam Mulai (Opsional)</label>
              <input 
                type="time" 
                className="form-input" 
                style={{ paddingLeft: "1rem" }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Jam Selesai (Opsional)</label>
              <input 
                type="time" 
                className="form-input" 
                style={{ paddingLeft: "1rem" }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Balasan Otomatis</label>
            <textarea 
              required
              className="form-input" 
              style={{ paddingLeft: "1rem", minHeight: "100px", resize: "vertical" }}
              placeholder="Ketik balasan Anda di sini..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "1px solid var(--border)", borderRadius: "0.5rem", cursor: "pointer" }}>
              Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
