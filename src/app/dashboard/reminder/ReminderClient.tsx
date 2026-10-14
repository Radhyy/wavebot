"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CalendarDays, Power } from "lucide-react";
import { createReminder, deleteReminder } from "@/app/actions/reminder";
import { fetchDeviceGroups } from "@/app/actions/groups";

export default function ReminderClient({ reminders, devices, contacts }: { reminders: any[], devices: any[], contacts: any[] }) {
  const [isComposing, setIsComposing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [deviceId, setDeviceId] = useState(devices[0]?.id || "");
  const [targetType, setTargetType] = useState("manual"); // manual, contact, group
  const [targetNumber, setTargetNumber] = useState("");
  const [schedule, setSchedule] = useState("");
  const [repeat, setRepeat] = useState("none");
  const [message, setMessage] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceId) {
      alert("Pilih device pengirim terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReminder({ title, deviceId, targetNumber, schedule, repeat, message });
      setIsComposing(false);
      setTitle("");
      setTargetNumber("");
      setSchedule("");
      setMessage("");
      setRepeat("none");
    } catch (error) {
      alert("Gagal membuat reminder");
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (confirmDeleteId) {
      setLoadingId(confirmDeleteId);
      await deleteReminder(confirmDeleteId);
      setLoadingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (isComposing) {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>Buat Reminder Baru</h2>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
              Atur pesan yang akan dikirim secara otomatis pada waktu tertentu.
            </p>
          </div>
        </div>

        <div style={{ background: "var(--card)", padding: "2.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", maxWidth: "800px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Judul Reminder</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="form-input" placeholder="Contoh: Tagihan Bulanan Pelanggan" style={{ padding: "0.875rem 1rem", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Device Pengirim</label>
                <select value={deviceId} onChange={e => setDeviceId(e.target.value)} required className="form-input" style={{ padding: "0.875rem 1rem", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                  <option value="" disabled>Pilih Device...</option>
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.number})</option>
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
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", padding: "1.5rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px dashed #cbd5e1" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Tanggal & Waktu Eksekusi</label>
                <input type="datetime-local" value={schedule} onChange={e => setSchedule(e.target.value)} required className="form-input" style={{ padding: "0.875rem 1rem", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }} />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Kirim Berulang?</label>
                <select value={repeat} onChange={e => setRepeat(e.target.value)} className="form-input" style={{ padding: "0.875rem 1rem", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
                  <option value="none">Tidak (Hanya 1x Kirim)</option>
                  <option value="daily">Setiap Hari</option>
                  <option value="weekly">Setiap Minggu</option>
                  <option value="monthly">Setiap Bulan</option>
                </select>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 600, color: "var(--foreground)" }}>Pesan Reminder</label>
              <textarea 
                value={message} onChange={e => setMessage(e.target.value)} required
                className="form-input" 
                rows={5}
                placeholder="Ketikkan pesan pengingat di sini..." 
                style={{ padding: "1rem", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", resize: "vertical", fontSize: "1rem" }} 
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "0.5rem" }}>
              <button 
                type="button"
                onClick={() => setIsComposing(false)} 
                style={{ 
                  padding: "0.875rem 2rem", fontSize: "1.05rem", borderRadius: "0.75rem",
                  background: "transparent", border: "1px solid var(--border)", cursor: "pointer",
                  color: "var(--foreground)", fontWeight: 600
                }}
              >Batal</button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ padding: "0.875rem 2.5rem", fontSize: "1.05rem", borderRadius: "0.75rem", opacity: isSubmitting ? 0.7 : 1 }}
              >
                <CalendarDays size={18} style={{ marginRight: "0.5rem" }}/>
                {isSubmitting ? "Menyimpan..." : "Simpan Jadwal"}
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
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>Reminder Message</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Atur pengingat pesan otomatis yang akan dikirim secara berkala.
          </p>
        </div>
        <button onClick={() => setIsComposing(true)} className="btn-primary" style={{ borderRadius: "0.5rem" }}>
          <Plus size={18} />
          Buat Reminder
        </button>
      </div>

      <div style={{ background: "var(--card)", borderRadius: "1rem", border: "1px solid var(--border)", overflow: "hidden" }}>
        {reminders.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <CalendarDays size={48} style={{ margin: "0 auto 1rem", color: "var(--muted-foreground)", opacity: 0.5 }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Belum ada Reminder</h3>
            <p style={{ color: "var(--muted-foreground)" }}>Anda belum memiliki jadwal reminder. Klik "Buat Reminder" untuk mulai.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Judul</th>
                <th style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Target</th>
                <th style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Jadwal</th>
                <th style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map(r => {
                const scheduleDate = new Date(r.schedule);
                const isPast = r.status !== "WAITING" || scheduleDate < new Date();
                
                return (
                  <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{r.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                        {r.repeat !== "none" ? `Berulang: ${r.repeat}` : "Sekali Kirim"}
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.95rem" }}>
                      +{r.target}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontSize: "0.95rem" }}>{scheduleDate.toLocaleDateString("id-ID")} {scheduleDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</div>
                      <div style={{ fontSize: "0.8rem", color: isPast ? "var(--muted-foreground)" : "#2563eb", fontWeight: 600 }}>
                        {r.status}
                      </div>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <button 
                        onClick={() => setConfirmDeleteId(r.id)}
                        disabled={loadingId === r.id}
                        style={{ padding: "0.5rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {confirmDeleteId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "var(--card)", padding: "2rem", borderRadius: "1rem", width: "90%", maxWidth: "400px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Hapus Jadwal?</h3>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>Jadwal reminder ini akan dihapus permanen dan tidak akan dikirim lagi. Apakah Anda yakin?</p>
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
