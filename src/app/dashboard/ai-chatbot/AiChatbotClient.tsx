"use client";

import { useState } from "react";
import { Bot, Save, Plus, Trash2, Power, Lock } from "lucide-react";
import { updateAiConfig } from "@/app/actions/aiConfig";
import UpgradeModal from "@/components/UpgradeModal";
import { getPlanDetail } from "@/lib/plans";

export default function AiChatbotClient({ 
  initialConfig, 
  devices,
  userPlan = "FREE"
}: { 
  initialConfig: any, 
  devices: any[],
  userPlan?: string 
}) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const planInfo = getPlanDetail(userPlan);
  const isAiAllowed = planInfo.features.aiChatbot;

  const [prompt, setPrompt] = useState(initialConfig?.prompt || "");
  const [isActive, setIsActive] = useState(isAiAllowed ? (initialConfig?.isActive || false) : false);
  const [activeDeviceIds, setActiveDeviceIds] = useState<string[]>(initialConfig?.activeDeviceIds || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDevice = (deviceId: string) => {
    if (activeDeviceIds.includes(deviceId)) {
      setActiveDeviceIds(activeDeviceIds.filter(id => id !== deviceId));
    } else {
      setActiveDeviceIds([...activeDeviceIds, deviceId]);
    }
  };



  const [notification, setNotification] = useState<{message: string, type: "success" | "error"} | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const res = await updateAiConfig({
      apiKeys: initialConfig?.apiKeys || [],
      model: initialConfig?.model || "llama-3.1-8b-instant",
      prompt,
      isActive,
      activeDeviceIds
    });

    if (res.success) {
      showNotification("Pengaturan AI berhasil disimpan!", "success");
    } else {
      showNotification("Gagal menyimpan: " + res.error, "error");
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: "fixed",
          top: "2rem",
          right: "2rem",
          background: notification.type === "success" ? "#10b981" : "#ef4444",
          color: "white",
          padding: "1rem 1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontWeight: 500,
          animation: "slideIn 0.3s ease-out forwards"
        }}>
          {notification.type === "success" ? <Bot size={20} /> : <Trash2 size={20} />}
          {notification.message}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Bot size={28} color="#2563eb" />
            AI Chatbot Settings
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Atur asisten virtual pintar Anda (Powered by Groq).
          </p>
        </div>
      </div>

      <div style={{ background: "var(--card)", padding: "2.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", maxWidth: "800px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div style={{ padding: "1.5rem", background: isActive ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)", border: `1px solid ${isActive ? "#10b981" : "#ef4444"}`, borderRadius: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: isActive ? "#059669" : "#dc2626", marginBottom: "0.25rem" }}>Status AI Chatbot</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", margin: 0 }}>
                {isActive ? "AI Chatbot aktif membalas otomatis untuk pesan yang tidak sesuai keyword Auto Reply." : "AI Chatbot saat ini dimatikan."}
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => {
                if (!isAiAllowed) {
                  setShowUpgradeModal(true);
                  return;
                }
                setIsActive(!isActive);
              }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "2rem", fontWeight: 600, border: "none", cursor: "pointer", background: isActive ? "#10b981" : "#ef4444", color: "white", transition: "all 0.2s" }}
            >
              <Power size={18} />
              {isActive ? "ON" : "OFF"}
            </button>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem", display: "block" }}>Pilih Device untuk AI Chatbot</label>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", marginBottom: "1rem" }}>
              Pilih satu atau lebih device WhatsApp yang akan dihubungkan ke AI Chatbot. Jika tidak ada yang dicentang, AI Chatbot akan aktif di <strong>SEMUA DEVICE</strong>.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              {devices?.map(device => (
                <div 
                  key={device.id}
                  onClick={() => toggleDevice(device.id)}
                  style={{ 
                    border: `1px solid ${activeDeviceIds.includes(device.id) ? "#2563eb" : "#e2e8f0"}`, 
                    padding: "1rem", 
                    borderRadius: "0.5rem", 
                    cursor: "pointer",
                    background: activeDeviceIds.includes(device.id) ? "rgba(37, 99, 235, 0.05)" : "transparent",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <input 
                      type="checkbox" 
                      checked={activeDeviceIds.includes(device.id)}
                      onChange={() => {}} // handled by parent onClick
                      style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{device.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{device.number || "Belum Konek"}</div>
                    </div>
                  </div>
                </div>
              ))}
              {(!devices || devices.length === 0) && (
                <div style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>Belum ada device yang ditambahkan.</div>
              )}
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontWeight: 600, color: "var(--foreground)" }}>System Prompt (Instruksi/Karakter Bot)</label>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", marginBottom: "1rem" }}>
              Tuliskan instruksi sedetail mungkin agar bot Anda bisa melayani pelanggan dengan sempurna.
            </p>
            
            <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", marginBottom: "1.25rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem", color: "#334155" }}>💡 Panduan Menulis Prompt yang Baik:</h4>
              <ul style={{ fontSize: "0.85rem", color: "#475569", paddingLeft: "1.5rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <li><b>Beri Identitas:</b> <i>"Kamu adalah CS Toko Sepatu Jaya. Namamu Bella."</i></li>
                <li><b>Beri Pengetahuan:</b> <i>"Toko buka jam 08.00-17.00. Sepatu model A harganya 200rb, model B harganya 250rb."</i></li>
                <li><b>Atur Gaya Bahasa:</b> <i>"Selalu gunakan bahasa yang sopan, gunakan emoji, dan jangan pernah menjawab pertanyaan di luar topik toko sepatu."</i></li>
                <li><b>Instruksi Penutup:</b> <i>"Jika pembeli ingin komplain, arahkan mereka untuk menghubungi nomor 081234xxx."</i></li>
              </ul>
            </div>

            <textarea 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)} 
              required
              className="form-input" 
              rows={12}
              placeholder="Contoh: Nama kamu adalah Budi, Customer Service dari Toko Baju XYZ. Selalu balas dengan ramah, gunakan emoji, dan panggil pelanggan dengan sebutan 'Kakak'..." 
              style={{ padding: "1rem", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", resize: "vertical", fontSize: "1rem" }} 
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ padding: "0.875rem 2.5rem", fontSize: "1.05rem", borderRadius: "0.75rem", opacity: isSubmitting ? 0.7 : 1 }}
            >
              <Save size={18} style={{ marginRight: "0.5rem" }}/>
              {isSubmitting ? "Menyimpan..." : "Simpan Konfigurasi"}
            </button>
          </div>
        </form>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade untuk Fitur AI Chatbot"
        featureName="AI Chatbot Pintar (Groq LLM Llama 3.1)"
        minPlanName="Paket 3"
        minPlanPrice="Rp 50.000/bln"
        currentPlan={planInfo.tagline}
        description={`Kecerdasan buatan AI Chatbot eksklusif tersedia bagi pelanggan Paket 3. AI dapat menjawab pertanyaan pelanggan secara cerdas dan kontekstual 24 jam nonstop.`}
      />
    </>
  );
}
