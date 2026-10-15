"use client";

import { useState } from "react";
import { Plus, Trash2, ListTree } from "lucide-react";
import { createInteractiveMenu, deleteInteractiveMenu } from "@/app/actions/interactiveMenu";
import { useRouter } from "next/navigation";
import UpgradeModal from "@/components/UpgradeModal";
import { getPlanDetail } from "@/lib/plans";

export default function InteractiveMenuClient({ 
  menus, 
  devices,
  userPlan = "FREE"
}: { 
  menus: any[], 
  devices: any[],
  userPlan?: string
}) {
  const router = useRouter();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const planInfo = getPlanDetail(userPlan);

  const handleCreateMenuClick = () => {
    if (!planInfo.features.interactiveMenu) {
      setShowUpgradeModal(true);
      return;
    }
    router.push('/dashboard/interactive-menu/create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus menu ini?")) return;
    const res = await deleteInteractiveMenu(id);
    if (res.success) {
      router.refresh();
    } else {
      alert("Gagal menghapus: " + res.error);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ListTree size={28} color="#2563eb" />
            Interactive Menu Flow
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Buat bot menu interaktif (Ketik angka untuk membalas).
          </p>
        </div>
        <button className="btn-primary" onClick={handleCreateMenuClick}>
          <Plus size={18} />
          Buat Menu Baru
        </button>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}>
        {menus.map(menu => (
          <div key={menu.id} style={{ background: "var(--card)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontWeight: 600, fontSize: "1.1rem" }}>{menu.name}</h3>
                <span style={{ background: "#eff6ff", color: "#2563eb", padding: "0.2rem 0.6rem", borderRadius: "1rem", fontSize: "0.8rem", fontWeight: 500 }}>
                  Keyword: {menu.keyword}
                </span>
              </div>
              <button 
                onClick={() => handleDelete(menu.id)}
                style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "0.5rem", borderRadius: "0.5rem", cursor: "pointer" }}
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
              <strong>Device:</strong> {menu.device ? menu.device.name : "Semua Device"}
            </div>

            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "0.5rem", fontSize: "0.85rem", border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Preview:</div>
              <div>{menu.message}</div>
              <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {(menu.options as any[]).map((opt, i) => (
                  <div key={i}>*{opt.key}*. {opt.title}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {menus.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", background: "var(--card)", borderRadius: "1rem", border: "1px dashed var(--border)" }}>
            <ListTree size={40} color="#cbd5e1" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ color: "var(--foreground)", fontWeight: 600 }}>Belum ada Menu</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>Klik tombol "Buat Menu Baru" untuk memulai.</p>
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade untuk Fitur Interactive Menu"
        featureName="Menu Flow Interaktif (Pilihan Angka)"
        minPlanName="Paket 2"
        minPlanPrice="Rp 30.000/bln"
        currentPlan={planInfo.tagline}
        description={`Fitur Interactive Menu Flow hanya tersedia untuk pengguna Paket 2 dan Paket 3. Upgrade paket Anda sekarang untuk membuat percakapan interaktif otomatis dengan pelanggan.`}
      />
    </>
  );
}
