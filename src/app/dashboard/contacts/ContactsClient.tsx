"use client";

import { useState } from "react";
import { Search, Plus, Trash2, Upload, MessageSquare } from "lucide-react";
import { deleteContact } from "@/app/actions/contacts";
import AddContactModal from "./AddContactModal";
import BroadcastModal from "./BroadcastModal";

export default function ContactsClient({ initialData }: { initialData: any[] }) {
  const [contacts, setContacts] = useState(initialData);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.number.includes(search) ||
    (c.label && c.label.toLowerCase().includes(search.toLowerCase()))
  );

  const executeDelete = async () => {
    if (confirmDeleteId) {
      const res = await deleteContact(confirmDeleteId);
      if (res.success) {
        setContacts(contacts.filter(c => c.id !== confirmDeleteId));
        setConfirmDeleteId(null);
      }
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(c => c !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const selectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>Contacts</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Kelola buku telepon pelanggan Anda.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button 
            onClick={() => alert("Fitur Import (hanya mendukung file .csv dan .xlsx spreadsheet) akan segera hadir!")}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1rem", background: "#ffffff", 
              border: "1px solid var(--border)", borderRadius: "0.5rem", 
              color: "var(--foreground)", fontWeight: 600, 
              cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#f1f5f9"}
            onMouseOut={(e) => e.currentTarget.style.background = "#ffffff"}
          >
            <Upload size={18} />
            Import CSV / Excel
          </button>
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            Tambah Kontak
          </button>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#ffffff", border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "0.5rem 1rem", width: "300px" }}>
            <Search size={18} style={{ color: "var(--muted-foreground)", marginRight: "0.5rem" }} />
            <input 
              type="text" 
              placeholder="Cari nama, nomor, atau label..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: "0.9rem" }}
            />
          </div>

          {selectedContacts.length > 0 && (
            <button 
              className="btn-primary" 
              style={{ backgroundColor: "#10b981" }} // warna hijau
              onClick={() => setIsBroadcastModalOpen(true)}
            >
              <MessageSquare size={18} />
              Broadcast ({selectedContacts.length})
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--muted-foreground)", fontSize: "0.85rem", width: "40px" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedContacts.length > 0 && selectedContacts.length === filteredContacts.length}
                    onChange={selectAll}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--muted-foreground)", fontSize: "0.85rem" }}>NAMA</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--muted-foreground)", fontSize: "0.85rem" }}>NOMOR WA</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--muted-foreground)", fontSize: "0.85rem" }}>KATEGORI</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--muted-foreground)", fontSize: "0.85rem", textAlign: "right" }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                    {search ? "Kontak tidak ditemukan." : "Belum ada kontak yang ditambahkan."}
                  </td>
                </tr>
              ) : (
                filteredContacts.map(contact => (
                  <tr key={contact.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="hover:bg-gray-50">
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <input 
                        type="checkbox" 
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: 500, color: "var(--foreground)" }}>
                      {contact.name}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
                      +{contact.number}
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      {contact.label ? (
                        <span style={{ 
                          background: "#e0e7ff", color: "#4f46e5", 
                          padding: "0.25rem 0.75rem", borderRadius: "1rem", 
                          fontSize: "0.8rem", fontWeight: 600 
                        }}>
                          {contact.label}
                        </span>
                      ) : (
                        <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                      <button 
                        onClick={() => setConfirmDeleteId(contact.id)}
                        style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "0.5rem", borderRadius: "0.5rem", cursor: "pointer" }}
                        title="Hapus Kontak"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddContactModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          // Simple reload to get new data (bisa dioptimasi pakai server actions state)
          window.location.reload();
        }} 
      />
      
      <BroadcastModal 
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        selectedCount={selectedContacts.length}
        // Nanti kita tambahkan aksi broadcast di sini
      />

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "var(--card)", padding: "2rem", borderRadius: "1rem", width: "90%", maxWidth: "400px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Hapus Kontak?</h3>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>Kontak ini akan dihapus secara permanen dari buku telepon Anda. Lanjutkan?</p>
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
