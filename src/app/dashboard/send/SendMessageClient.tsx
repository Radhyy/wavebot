"use client";

import { useState, useEffect } from "react";
import { Send, Plus, Trash2, RefreshCw, MessageSquare } from "lucide-react";
import { submitMessage, deleteMessageHistory } from "@/app/actions/sendMessageAction";
import { fetchDeviceGroups } from "@/app/actions/groups";

export default function SendMessageClient({ devices, contacts, history }: { devices: any[], contacts: any[], history: any[] }) {
  const [isComposing, setIsComposing] = useState(false);
  const [deviceId, setDeviceId] = useState(devices[0]?.id || "");
  const [targetType, setTargetType] = useState("manual"); // manual, contact, group
  const [targetNumber, setTargetNumber] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("text");
  const [pollName, setPollName] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmResendMsg, setConfirmResendMsg] = useState<any | null>(null);
  
  const [groups, setGroups] = useState<{id: string, name: string}[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  useEffect(() => {
    if (targetType === "group" && deviceId) {
      setIsLoadingGroups(true);
      fetchDeviceGroups(deviceId)
        .then(data => setGroups(data))
        .catch(() => setGroups([]))
        .finally(() => setIsLoadingGroups(false));
    }
  }, [targetType, deviceId]);

  const handleOptionChange = (index: number, val: string) => {
    const newOpts = [...pollOptions];
    newOpts[index] = val;
    setPollOptions(newOpts);
  };
  
  const addOption = () => setPollOptions([...pollOptions, ""]);
  const removeOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let finalMessage = message;
    if (msgType === "poll") {
      finalMessage = JSON.stringify({
        type: "poll",
        name: pollName,
        options: pollOptions.filter(o => o.trim() !== "")
      });
    }
    
    try {
      const res = await submitMessage({ deviceId, targetNumber, message: finalMessage });
      if (!res?.success) {
        alert("Gagal mengirim: " + (res?.error || "Unknown Error"));
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem saat mengirim pesan.");
    }
    
    setIsSubmitting(false);
    setIsComposing(false);
    setTargetNumber("");
    setMessage("");
    setPollName("");
    setPollOptions(["", ""]);
  };

  const executeDelete = async () => {
    if (confirmDeleteId) {
      await deleteMessageHistory(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const executeResend = async () => {
    if (confirmResendMsg) {
      const msg = confirmResendMsg;
      setConfirmResendMsg(null);
      setIsSubmitting(true);
      try {
        const res = await submitMessage({ 
          deviceId: msg.deviceId || deviceId, 
          targetNumber: msg.target, 
          message: msg.message 
        });
        if (!res?.success) alert("Gagal mengirim: " + (res?.error || "Unknown Error"));
      } catch (err) {
        alert("Terjadi kesalahan sistem saat mengirim pesan.");
      }
      setIsSubmitting(false);
    }
  };

  if (isComposing) {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>Buat Pesan Baru</h2>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
              Kirim pesan ke nomor manual, kontak tersimpan, atau grup.
            </p>
          </div>
        </div>

        <div style={{ background: "var(--card)", padding: "2.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", maxWidth: "800px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Device Pengirim</label>
                <select 
                  className="form-input" 
                  value={deviceId} 
                  onChange={(e) => setDeviceId(e.target.value)}
                  required
                  style={{ padding: "0.875rem 1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <option value="" disabled>Pilih Device...</option>
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.number || "Belum Scan"})</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Pilih Target</label>
                <select 
                  className="form-input" 
                  value={targetType} 
                  onChange={(e) => {
                    setTargetType(e.target.value);
                    setTargetNumber(""); // Reset input target saat pindah tipe
                  }}
                  style={{ padding: "0.875rem 1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <option value="manual">Nomor Manual</option>
                  <option value="contact">Kontak Tersimpan</option>
                  <option value="group">Grup WhatsApp (Group ID)</option>
                </select>
              </div>
            </div>

            <div style={{ padding: "1.5rem", backgroundColor: "#f8fafc", borderRadius: "0.75rem", border: "1px dashed #cbd5e1" }}>
              {targetType === "manual" && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Nomor Tujuan (Gunakan awalan 62)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Contoh: 628123456789"
                    value={targetNumber}
                    onChange={(e) => setTargetNumber(e.target.value)}
                    required
                    style={{ padding: "0.875rem 1rem", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}
                  />
                </div>
              )}

              {targetType === "contact" && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Pilih Kontak</label>
                  <select 
                    className="form-input" 
                    value={targetNumber}
                    onChange={(e) => setTargetNumber(e.target.value)}
                    required
                    style={{ padding: "0.875rem 1rem", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}
                  >
                    <option value="" disabled>Pilih Kontak...</option>
                    {contacts.map(c => (
                      <option key={c.id} value={c.number}>{c.name} (+{c.number})</option>
                    ))}
                  </select>
                </div>
              )}

              {targetType === "group" && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Pilih Grup WhatsApp</label>
                  {isLoadingGroups ? (
                    <div style={{ padding: "0.875rem 1rem", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", borderRadius: "0.5rem", color: "var(--muted-foreground)" }}>
                      Sedang memuat list grup...
                    </div>
                  ) : (
                    <select 
                      className="form-input" 
                      value={targetNumber}
                      onChange={(e) => setTargetNumber(e.target.value)}
                      required
                      style={{ padding: "0.875rem 1rem", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}
                    >
                      <option value="" disabled>Pilih Grup...</option>
                      {groups.length === 0 ? (
                        <option value="" disabled>Tidak ada grup / WhatsApp belum sync</option>
                      ) : (
                        groups.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))
                      )}
                    </select>
                  )}
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.5rem" }}>
                    *Sistem otomatis mengambil daftar grup di mana nomor WhatsApp ini bergabung.
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", padding: "0.35rem", background: "#f1f5f9", borderRadius: "0.75rem", width: "fit-content" }}>
              <button type="button" onClick={() => setMsgType("text")} style={{ padding: "0.6rem 1.25rem", borderRadius: "0.5rem", fontWeight: 600, border: "none", cursor: "pointer", background: msgType === "text" ? "#ffffff" : "transparent", color: msgType === "text" ? "#0f172a" : "#64748b", boxShadow: msgType === "text" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>
                Pesan Teks
              </button>
              <button type="button" onClick={() => setMsgType("poll")} style={{ padding: "0.6rem 1.25rem", borderRadius: "0.5rem", fontWeight: 600, border: "none", cursor: "pointer", background: msgType === "poll" ? "#ffffff" : "transparent", color: msgType === "poll" ? "#0f172a" : "#64748b", boxShadow: msgType === "poll" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>
                Polling (Jajak Pendapat)
              </button>
            </div>

            {msgType === "text" ? (
              <div className="form-group">
                <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Pesan Anda</label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: "180px", resize: "vertical", padding: "1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", fontSize: "1rem" }}
                  placeholder="Tulis sesuatu yang menarik untuk dikirim..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required={msgType === "text"}
                />
              </div>
            ) : (
              <div style={{ padding: "1.5rem", backgroundColor: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ fontWeight: 600, color: "var(--foreground)", display: "block", marginBottom: "0.5rem" }}>Judul Polling (Pertanyaan)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ padding: "1rem", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", fontSize: "1rem", fontWeight: 500 }} 
                    placeholder="Contoh: Hari ini mau makan siang di mana?" 
                    value={pollName} 
                    onChange={(e) => setPollName(e.target.value)} 
                    required={msgType === "poll"} 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontWeight: 600, color: "var(--foreground)", display: "block", marginBottom: "0.5rem" }}>Pilihan Jawaban (Choices)</label>
                  {pollOptions.map((opt, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ flex: 1, padding: "0.875rem", backgroundColor: "#ffffff", border: "1px solid #cbd5e1" }} 
                        placeholder={`Pilihan ${i + 1}`} 
                        value={opt} 
                        onChange={(e) => handleOptionChange(i, e.target.value)} 
                        required={msgType === "poll"} 
                      />
                      {pollOptions.length > 2 && (
                        <button 
                          type="button" 
                          onClick={() => removeOption(i)} 
                          style={{ padding: "0 1rem", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "0.5rem", cursor: "pointer", transition: "all 0.2s" }}
                          onMouseOver={(e) => e.currentTarget.style.background = "#fecaca"}
                          onMouseOut={(e) => e.currentTarget.style.background = "#fee2e2"}
                        >
                          <Trash2 size={18}/>
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    onClick={addOption} 
                    style={{ marginTop: "0.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", border: "none", padding: "0.6rem 1rem", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(37, 99, 235, 0.15)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(37, 99, 235, 0.1)"}
                  >
                    <Plus size={16}/> Tambah Pilihan
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "0.5rem" }}>
              <button 
                type="button"
                onClick={() => setIsComposing(false)}
                style={{ 
                  padding: "0.875rem 2rem", fontSize: "1.05rem", borderRadius: "0.75rem",
                  background: "transparent", border: "1px solid var(--border)", cursor: "pointer",
                  color: "var(--foreground)", fontWeight: 600
                }}
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || !deviceId} 
                className="btn-primary"
                style={{ 
                  padding: "0.875rem 2.5rem", fontSize: "1.05rem", borderRadius: "0.75rem",
                  opacity: (isSubmitting || !deviceId) ? 0.7 : 1,
                  cursor: (isSubmitting || !deviceId) ? "not-allowed" : "pointer"
                }}
              >
                <Send size={20} />
                {isSubmitting ? "Memproses..." : "Kirim Sekarang"}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>Pesan Terkirim</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Riwayat dan status pesan keluar Anda.
          </p>
        </div>
        
        <button className="btn-primary" onClick={() => setIsComposing(true)} style={{ borderRadius: "0.5rem" }}>
          <Plus size={18} />
          Buat Pesan Baru
        </button>
      </div>

      <div style={{ background: "var(--card)", borderRadius: "1rem", border: "1px solid var(--border)", overflow: "hidden" }}>
        {history.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <MessageSquare size={48} style={{ margin: "0 auto 1rem", color: "var(--muted-foreground)", opacity: 0.5 }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Belum ada pesan</h3>
            <p style={{ color: "var(--muted-foreground)" }}>Anda belum pernah mengirim pesan apapun. Klik "Buat Pesan Baru" untuk mulai.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Waktu</th>
                <th style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Tujuan</th>
                <th style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Pesan</th>
                <th style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Status</th>
                <th style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {history.map((msg) => {
                const date = new Date(msg.createdAt);
                const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
                const timeStr = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                
                return (
                <tr key={msg.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem", whiteSpace: "nowrap" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>{dateStr}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{timeStr}</div>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.95rem" }}>
                    +{msg.target}
                    <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>via {msg.device?.name}</div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.95rem" }}>
                      {msg.message}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 600,
                      backgroundColor: msg.status === "SENT" ? "rgba(16, 185, 129, 0.1)" : msg.status === "FAILED" ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)",
                      color: msg.status === "SENT" ? "#10b981" : msg.status === "FAILED" ? "#ef4444" : "#f59e0b"
                    }}>
                      {msg.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <button 
                        onClick={() => setConfirmResendMsg(msg)}
                        style={{ padding: "0.5rem", background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}
                        title="Kirim Ulang"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(msg.id)}
                        style={{ padding: "0.5rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "var(--card)", padding: "2rem", borderRadius: "1rem", width: "90%", maxWidth: "400px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Hapus Pesan?</h3>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>Pesan ini akan dihapus permanen dari riwayat Anda. Apakah Anda yakin?</p>
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

      {/* Resend Confirmation Modal */}
      {confirmResendMsg && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "var(--card)", padding: "2rem", borderRadius: "1rem", width: "90%", maxWidth: "400px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Kirim Ulang Pesan?</h3>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>Anda akan mengirim ulang pesan ini ke <strong>+{confirmResendMsg.target}</strong>. Lanjutkan?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button 
                onClick={() => setConfirmResendMsg(null)} 
                className="btn-secondary"
                style={{ padding: "0.6rem 1.25rem", borderRadius: "0.5rem", background: "transparent", border: "1px solid var(--border)", cursor: "pointer" }}
              >Batal</button>
              <button 
                onClick={executeResend} 
                style={{ padding: "0.6rem 1.25rem", borderRadius: "0.5rem", background: "#2563eb", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
              >Ya, Kirim</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
