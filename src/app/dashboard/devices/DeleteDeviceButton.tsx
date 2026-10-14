"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import { deleteDevice } from "@/app/actions/devices";

export default function DeleteDeviceButton({ sessionId }: { sessionId: string }) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteDevice(sessionId);
    setIsDeleting(false);
    setShowModal(false);
  };

  const modal = (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999,
    }}>
      <div style={{
        background: "var(--card)",
        padding: "2rem",
        borderRadius: "1rem",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        border: "1px solid var(--border)"
      }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
          Hapus Perangkat?
        </h3>
        <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem", fontSize: "0.95rem", lineHeight: 1.5 }}>
          Apakah Anda yakin ingin menghapus perangkat ini? Semua sesi akan diputus (logout) secara permanen. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button 
            onClick={() => setShowModal(false)}
            disabled={isDeleting}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              color: "var(--foreground)",
              cursor: isDeleting ? "not-allowed" : "pointer",
              fontWeight: 500
            }}
          >
            Batal
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              padding: "0.5rem 1rem",
              background: "#ef4444",
              border: "none",
              borderRadius: "0.5rem",
              color: "white",
              cursor: isDeleting ? "not-allowed" : "pointer",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "0.25rem" }} 
        title="Delete Device"
      >
        <Trash2 size={20} />
      </button>

      {showModal && mounted && createPortal(modal, document.body)}
    </>
  );
}
