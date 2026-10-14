"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { createInteractiveMenu } from "@/app/actions/interactiveMenu";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateMenuClient({ devices }: { devices: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    keyword: "",
    deviceId: "",
    message: "Silakan pilih layanan kami:",
    options: [{ key: "1", title: "", reply: "" }]
  });

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { key: (prev.options.length + 1).toString(), title: "", reply: "" }]
    }));
  };

  const updateOption = (index: number, field: string, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 1) return;
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const dataToSubmit = {
      ...formData,
      deviceId: formData.deviceId || null
    };

    const res = await createInteractiveMenu(dataToSubmit);
    if (res.success) {
      router.push('/dashboard/interactive-menu');
      router.refresh();
    } else {
      alert("Gagal: " + res.error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/dashboard/interactive-menu" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--muted-foreground)", textDecoration: "none", marginBottom: "1rem", fontSize: "0.9rem" }}>
          <ArrowLeft size={16} /> Kembali ke Menu Flow
        </Link>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>
          Buat Menu Interaktif Baru
        </h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
          Rancang struktur balasan otomatis berbasis menu angka/opsi.
        </p>
      </div>

      <div style={{ background: "var(--card)", borderRadius: "1.25rem", padding: "2rem", border: "1px solid var(--border)", maxWidth: "800px" }}>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Nama Menu</label>
              <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Contoh: Menu Utama" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Keyword Trigger</label>
              <input type="text" className="form-input" value={formData.keyword} onChange={e => setFormData({...formData, keyword: e.target.value})} required placeholder="Contoh: BANTUAN" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Pilih Device</label>
            <select className="form-input" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})}>
              <option value="">Semua Device (Berlaku Global)</option>
              {devices.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.number})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Pesan Pembuka (Header)</label>
            <textarea className="form-input" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required rows={3} placeholder="Silakan pilih layanan kami:" />
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <label style={{ fontWeight: 600, fontSize: "1.1rem" }}>Daftar Pilihan (Menu Items)</label>
              <button type="button" onClick={addOption} style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "#eff6ff", color: "#2563eb", border: "none", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.9rem", cursor: "pointer", fontWeight: 500 }}>
                <Plus size={16} /> Tambah Opsi
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {formData.options.map((opt, i) => (
                <div key={i} style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", display: "grid", gap: "1rem", position: "relative" }}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: "0 0 100px" }}>
                      <label style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>Angka/Kode</label>
                      <input type="text" className="form-input" value={opt.key} onChange={e => updateOption(i, 'key', e.target.value)} required />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>Judul Pilihan (Misal: Harga Produk)</label>
                      <input type="text" className="form-input" value={opt.title} onChange={e => updateOption(i, 'title', e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>Balasan (Pesan yang dikirim jika dipilih)</label>
                    <textarea className="form-input" value={opt.reply} onChange={e => updateOption(i, 'reply', e.target.value)} required rows={3} />
                  </div>
                  {formData.options.length > 1 && (
                    <button type="button" onClick={() => removeOption(i)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "#fee2e2", color: "#ef4444", border: "none", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Hapus Opsi">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
            <Link href="/dashboard/interactive-menu" className="btn-secondary" style={{ textDecoration: "none" }}>Batal</Link>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ minWidth: "150px" }}>
              {isSubmitting ? "Menyimpan..." : "Simpan Menu"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
