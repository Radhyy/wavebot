"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { addContact } from "@/app/actions/contacts";

export default function AddContactModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await addContact({ name, number, label });
    
    setIsSubmitting(false);
    onClose();
    setName("");
    setNumber("");
    setLabel("");
  };

  const modal = (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 99999
    }}>
      <div style={{
        background: "var(--card)", padding: "2rem", borderRadius: "1rem",
        width: "90%", maxWidth: "450px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Tambah Kontak</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input 
              required
              type="text" 
              className="form-input" 
              style={{ paddingLeft: "1rem" }}
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Nomor WhatsApp</label>
            <input 
              required
              type="text" 
              className="form-input" 
              style={{ paddingLeft: "1rem" }}
              placeholder="Contoh: 08123456789 (akan otomatis diubah ke 62...)"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Label / Kategori (Opsional)</label>
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: "1rem" }}
              placeholder="Contoh: VIP, Karyawan, Pembeli"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "1px solid var(--border)", borderRadius: "0.5rem", cursor: "pointer" }}>
              Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
              {isSubmitting ? "Menyimpan..." : "Simpan Kontak"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
