"use client";

import { Code, Terminal, CheckCircle2, Copy } from "lucide-react";
import { useState, useEffect } from "react";

export default function ApiDocsPage() {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    // Only access window.location on the client side
    setBaseUrl(window.location.origin);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlCode = `curl -X POST ${baseUrl || 'http://yourdomain.com'}/api/wa/send \\
-H "Content-Type: application/json" \\
-d '{
  "sessionId": "ID_DEVICE_ANDA",
  "number": "6281234567890",
  "message": "Halo dari API!"
}'`;

  const nodeCode = `const axios = require('axios');

async function sendMessage() {
  try {
    const response = await axios.post('${baseUrl || 'http://yourdomain.com'}/api/wa/send', {
      sessionId: 'ID_DEVICE_ANDA',
      number: '6281234567890',
      message: 'Halo dari API!'
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

sendMessage();`;

  const phpCode = `<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => '${baseUrl || 'http://yourdomain.com'}/api/wa/send',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'{
  "sessionId": "ID_DEVICE_ANDA",
  "number": "6281234567890",
  "message": "Halo dari API!"
}',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);
curl_close($curl);
echo $response;`;

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Code size={28} color="#2563eb" />
          API Documentation
        </h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
          Integrasikan sistem pengiriman WhatsApp ke website atau aplikasi Anda yang lain dengan mudah.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "2rem" }}>
        
        {/* Send Message API */}
        <div style={{ background: "var(--card)", borderRadius: "1.25rem", border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ background: "#22c55e", color: "white", padding: "0.25rem 0.75rem", borderRadius: "0.5rem", fontWeight: 700, fontSize: "0.85rem" }}>POST</span>
            <code style={{ fontSize: "1.1rem", color: "var(--foreground)", fontWeight: 600 }}>/api/wa/send</code>
          </div>
          
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>Kirim Pesan WhatsApp</h3>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>Endpoint ini digunakan untuk mengirim pesan teks secara langsung melalui sesi WhatsApp yang sudah terhubung (berstatus CONNECTED) di halaman Devices.</p>
            
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.75rem" }}>Request Body (JSON)</h4>
            <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "#64748b" }}>Parameter</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "#64748b" }}>Tipe Data</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "#64748b" }}>Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>sessionId</td>
                    <td style={{ padding: "0.75rem", color: "#2563eb" }}>string</td>
                    <td style={{ padding: "0.75rem", color: "var(--muted-foreground)" }}>ID unik Device pengirim. Bisa dicopy dari halaman Devices.</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>number</td>
                    <td style={{ padding: "0.75rem", color: "#2563eb" }}>string</td>
                    <td style={{ padding: "0.75rem", color: "var(--muted-foreground)" }}>Nomor HP tujuan (dimulai dengan kode negara, misal: 6281...).</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>message</td>
                    <td style={{ padding: "0.75rem", color: "#2563eb" }}>string</td>
                    <td style={{ padding: "0.75rem", color: "var(--muted-foreground)" }}>Isi pesan teks yang ingin dikirimkan.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.75rem" }}>Contoh Kode Integrasi</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              {/* cURL */}
              <div style={{ background: "#0f172a", borderRadius: "0.75rem", overflow: "hidden" }}>
                <div style={{ padding: "0.75rem 1rem", background: "#1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600 }}>cURL</span>
                  <button onClick={() => copyCode(curlCode)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {copied ? <CheckCircle2 size={16} color="#22c55e" /> : <Copy size={16} />}
                  </button>
                </div>
                <pre style={{ padding: "1rem", color: "#e2e8f0", fontSize: "0.85rem", overflowX: "auto", margin: 0 }}>
                  <code>{curlCode}</code>
                </pre>
              </div>

              {/* Node.js */}
              <div style={{ background: "#0f172a", borderRadius: "0.75rem", overflow: "hidden" }}>
                <div style={{ padding: "0.75rem 1rem", background: "#1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600 }}>Node.js (Axios)</span>
                  <button onClick={() => copyCode(nodeCode)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {copied ? <CheckCircle2 size={16} color="#22c55e" /> : <Copy size={16} />}
                  </button>
                </div>
                <pre style={{ padding: "1rem", color: "#e2e8f0", fontSize: "0.85rem", overflowX: "auto", margin: 0 }}>
                  <code>{nodeCode}</code>
                </pre>
              </div>

              {/* PHP */}
              <div style={{ background: "#0f172a", borderRadius: "0.75rem", overflow: "hidden" }}>
                <div style={{ padding: "0.75rem 1rem", background: "#1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600 }}>PHP (cURL)</span>
                  <button onClick={() => copyCode(phpCode)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {copied ? <CheckCircle2 size={16} color="#22c55e" /> : <Copy size={16} />}
                  </button>
                </div>
                <pre style={{ padding: "1rem", color: "#e2e8f0", fontSize: "0.85rem", overflowX: "auto", margin: 0 }}>
                  <code>{phpCode}</code>
                </pre>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
