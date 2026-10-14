import makeWASocket, { DisconnectReason, useMultiFileAuthState, Browsers, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { prisma } from "./prisma";
import Groq from "groq-sdk";

// Use a global variable to keep sessions alive across hot-reloads in Next.js development
const globalForWA = global as unknown as {
  waSessions: Map<string, ReturnType<typeof makeWASocket>>;
  qrCodes: Map<string, string>;
  isInit: boolean;
};

if (!globalForWA.waSessions) {
  globalForWA.waSessions = new Map();
}
if (!globalForWA.qrCodes) {
  globalForWA.qrCodes = new Map();
}

const sessions = globalForWA.waSessions;
const qrCodes = globalForWA.qrCodes;

const logger = pino({ level: "info" });

// Auto-restore connected sessions on startup
if (!globalForWA.isInit) {
  globalForWA.isInit = true;
  
  // Gunakan fungsi async agar bisa di-catch dengan baik dan tidak membuat Next.js crash
  const initSessions = async () => {
    try {
      console.log("Membangunkan database dan mesin WA...");
      const devices = await prisma.device.findMany({ where: { status: "CONNECTED" } });
      for (const d of devices) {
        createSession(d.sessionId, d.userId);
      }
      
      // Jalankan cron job untuk reminder
      startCronJob();
    } catch (err) {
      console.error("Gagal auto-restore (Database mungkin sedang tidur):", err);
      // Coba lagi setelah 10 detik jika database Neon sedang bangun dari tidur
      setTimeout(initSessions, 10000);
    }
  };
  
  initSessions();
}

function startCronJob() {
  console.log("Menjalankan CRON Scheduler untuk Reminder...");
  
  setInterval(async () => {
    try {
      const now = new Date();
      // Cari reminder yang waktunya sudah lewat dan masih WAITING
      const dueReminders = await prisma.reminder.findMany({
        where: {
          status: "WAITING",
          schedule: {
            lte: now
          }
        },
        include: { device: true }
      });

      for (const r of dueReminders) {
        try {
          if (r.device.status === "CONNECTED") {
            console.log(`Mengirim Reminder: ${r.title} ke ${r.target}`);
            await sendMessage(r.device.sessionId, r.target, { text: r.message });
            
            // Perbarui stats
            await prisma.device.update({
              where: { id: r.deviceId },
              data: { messageCount: { increment: 1 } }
            }).catch(() => {});
          } else {
            console.log(`Gagal kirim reminder ${r.title}, device ${r.device.name} tidak konek.`);
          }
          
          // Update status atau jadwal ulang
          if (r.repeat === "none") {
            await prisma.reminder.update({
              where: { id: r.id },
              data: { status: "SENT" }
            });
          } else {
            // Hitung jadwal berikutnya
            const nextDate = new Date(r.schedule);
            if (r.repeat === "daily") nextDate.setDate(nextDate.getDate() + 1);
            else if (r.repeat === "weekly") nextDate.setDate(nextDate.getDate() + 7);
            else if (r.repeat === "monthly") nextDate.setMonth(nextDate.getMonth() + 1);
            
            // Pastikan nextDate tidak di masa lalu (misal telat nyala)
            while (nextDate <= new Date()) {
               if (r.repeat === "daily") nextDate.setDate(nextDate.getDate() + 1);
               else if (r.repeat === "weekly") nextDate.setDate(nextDate.getDate() + 7);
               else if (r.repeat === "monthly") nextDate.setMonth(nextDate.getMonth() + 1);
            }

            await prisma.reminder.update({
              where: { id: r.id },
              data: { schedule: nextDate }
            });
          }
        } catch (sendErr) {
          console.error(`Gagal kirim reminder ${r.id}:`, sendErr);
          // Set failed if not repeating? Or leave WAITING to retry?
          // We'll leave it WAITING so it retries next minute, unless it's a fatal error.
        }
      }
    } catch (err) {
      console.error("Error pada CRON Reminder:", err);
    }
  }, 60000); // Cek setiap 1 menit
}

export async function createSession(sessionId: string, userId: string) {
  if (sessions.has(sessionId)) {
    return { success: true, message: "Session already running", qr: qrCodes.get(sessionId) || null };
  }
  
  // Set placeholder immediately to prevent concurrent calls from spawning two sockets
  sessions.set(sessionId, { isInit: true } as any);

  // Create auth folder if it doesn't exist
  const authFolder = path.join(process.cwd(), ".wa_auth", sessionId);
  if (!fs.existsSync(authFolder)) {
    fs.mkdirSync(authFolder, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  
  // Ambil versi WA terbaru agar tidak ditolak
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger,
    browser: Browsers.macOS("Desktop"),
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: false
  });

  sessions.set(sessionId, sock);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      try {
        const qrBase64 = await QRCode.toDataURL(qr);
        qrCodes.set(sessionId, qrBase64);
        
        await prisma.device.update({
          where: { sessionId },
          data: { status: "WAITING_FOR_QR" }
        }).catch(() => {});
      } catch (err) {
        console.error("Failed to generate QR base64", err);
      }
    }

    if (connection === "close") {
      qrCodes.delete(sessionId);
      
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const isConflict = statusCode === DisconnectReason.connectionReplaced || 
                         lastDisconnect?.error?.message?.includes("conflict") ||
                         lastDisconnect?.error?.message?.includes("replaced");
      
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut && !isConflict;
      
      console.log(`Connection closed for ${sessionId}. Reconnecting: ${shouldReconnect} (Conflict: ${isConflict})`);
      
      // Hapus session lama dari memory
      sessions.delete(sessionId);
      
      if (shouldReconnect) {
        setTimeout(() => createSession(sessionId, userId), 5000);
      } else if (statusCode === DisconnectReason.loggedOut) {
        // Clean up auth folder ONLY if logged out
        try {
          fs.rmSync(authFolder, { recursive: true, force: true });
        } catch (e) {}
        
        await prisma.device.update({
          where: { sessionId },
          data: { status: "DISCONNECTED", number: null }
        }).catch(() => {});
      }
    } else if (connection === "open") {
      console.log(`Connection opened for ${sessionId}`);
      qrCodes.delete(sessionId);
      
      // Update DB to Connected
      const waNumber = sock.user?.id.split(":")[0];
      await prisma.device.update({
        where: { sessionId },
        data: { 
          status: "CONNECTED",
          number: waNumber
        }
      }).catch(() => {});
    }
  });

  sock.ev.on("creds.update", saveCreds);

  // Auto Reply Engine
  sock.ev.on("messages.upsert", async (m) => {
    console.log("INCOMING MESSAGE EVENT:", JSON.stringify(m, null, 2));
    if (m.type !== "notify") return;
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    // Ambil isi teks pesan (mendukung pesan teks biasa atau pesan extended/balasan)
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    console.log("TEXT EXTRACTED:", text);
    if (!text) return;

    try {
      const device = await prisma.device.findUnique({
        where: { sessionId }
      });
      if (!device) return;

      const incomingText = text.toLowerCase().trim();

      // 2. Cek ChatSession (Sedang di dalam Interactive Menu)
      if (msg.key.remoteJid) {
        const chatSessionId = `${device.id}_${msg.key.remoteJid}`;
        const currentSession = await prisma.chatSession.findUnique({
          where: { sessionId: chatSessionId }
        });

        if (currentSession && currentSession.state.startsWith("MENU:")) {
          const menuId = currentSession.state.split(":")[1];
          const menu = await prisma.interactiveMenu.findUnique({ where: { id: menuId } });
          
          if (menu && menu.isActive) {
            const options = menu.options as any[];
            const selectedOption = options.find(opt => opt.key.toLowerCase() === incomingText);
            
            if (selectedOption) {
              await sock.sendMessage(msg.key.remoteJid, { text: selectedOption.reply });
              await prisma.chatSession.delete({ where: { sessionId: chatSessionId } });
              await prisma.device.update({
                where: { id: device.id },
                data: { messageCount: { increment: 1 } }
              }).catch(() => {});
              return;
            } else if (incomingText === "batal" || incomingText === "cancel") {
              await prisma.chatSession.delete({ where: { sessionId: chatSessionId } });
              await sock.sendMessage(msg.key.remoteJid, { text: "Menu dibatalkan." });
              return;
            } else {
              let menuText = "Pilihan tidak valid.\n\n" + menu.message + "\n\n";
              options.forEach(opt => {
                menuText += `*${opt.key}*. ${opt.title}\n`;
              });
              menuText += "\nSilakan balas dengan angka/kode di atas. Ketik 'batal' untuk keluar.";
              await sock.sendMessage(msg.key.remoteJid, { text: menuText });
              return;
            }
          } else {
            await prisma.chatSession.delete({ where: { sessionId: chatSessionId } });
          }
        }

        // 2.5 Cek Trigger Interactive Menu Baru
        const activeMenus = await prisma.interactiveMenu.findMany({
          where: {
            userId: device.userId,
            isActive: true,
            OR: [
              { deviceId: null },
              { deviceId: device.id }
            ]
          }
        });
        
        const triggeredMenu = activeMenus.find(m => m.keyword.toLowerCase() === incomingText);
        if (triggeredMenu) {
          let menuText = triggeredMenu.message + "\n\n";
          const options = triggeredMenu.options as any[];
          options.forEach(opt => {
            menuText += `*${opt.key}*. ${opt.title}\n`;
          });
          menuText += "\nSilakan balas dengan angka/kode di atas.";
          
          await sock.sendMessage(msg.key.remoteJid, { text: menuText });
          
          await prisma.chatSession.upsert({
            where: { sessionId: chatSessionId },
            update: { state: `MENU:${triggeredMenu.id}` },
            create: { sessionId: chatSessionId, state: `MENU:${triggeredMenu.id}` }
          });
          
          await prisma.device.update({
            where: { id: device.id },
            data: { messageCount: { increment: 1 } }
          }).catch(() => {});
          return;
        }
      }

      // 3. Cari aturan Auto Reply biasa yang aktif untuk user ini
      const autoReplies = await prisma.autoReply.findMany({
        where: {
          userId: device.userId,
          isActive: true,
          OR: [
            { deviceId: null },
            { deviceId: device.id }
          ]
        }
      });

      if (autoReplies.length === 0) return;

      // 4. Cek kecocokan AutoReply
      let matchedReply = null;
      
      // Dapatkan waktu saat ini di WIB (GMT+7)
      const now = new Date();
      const wibTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
      const currentHour = wibTime.getHours();
      const currentMinute = wibTime.getMinutes();
      const currentMinutesTotal = currentHour * 60 + currentMinute;

      for (const rule of autoReplies) {
        // Cek kondisi jam jika ada
        if (rule.startTime && rule.endTime) {
          const [startH, startM] = rule.startTime.split(':').map(Number);
          const [endH, endM] = rule.endTime.split(':').map(Number);
          
          const startMinutes = startH * 60 + startM;
          const endMinutes = endH * 60 + endM;
          
          let isWithinTime = false;
          if (startMinutes <= endMinutes) {
            // Waktu normal (misal 08:00 - 17:00)
            isWithinTime = currentMinutesTotal >= startMinutes && currentMinutesTotal <= endMinutes;
          } else {
            // Waktu lintas hari (misal 22:00 - 08:00 besoknya)
            isWithinTime = currentMinutesTotal >= startMinutes || currentMinutesTotal <= endMinutes;
          }
          
          if (!isWithinTime) continue; // Lewati aturan ini jika di luar jam
        }

        if (rule.type === "ALL_MESSAGES") {
          matchedReply = rule.reply;
          break; // Prioritaskan kecocokan semua
        }

        const keyword = rule.keyword?.toLowerCase() || "";
        
        if (rule.type === "EXACT" && incomingText === keyword) {
          matchedReply = rule.reply;
          break; // Prioritaskan kecocokan persis
        } else if (rule.type === "CONTAINS" && incomingText.includes(keyword)) {
          matchedReply = rule.reply;
          // Jangan break dulu, siapa tau ada EXACT yang lebih cocok
        }
      }

      // 4. Kirim balasan jika ada yang cocok
      if (matchedReply && msg.key.remoteJid) {
        await sock.sendMessage(msg.key.remoteJid, { text: matchedReply });
        
        // Tambah messageCount
        await prisma.device.update({
          where: { id: device.id },
          data: { messageCount: { increment: 1 } }
        }).catch(() => {});
        return; // SELESAI, hentikan eksekusi di sini jika sudah dibalas AutoReply biasa
      }

      // 5. Jika tidak ada AutoReply biasa yang cocok, coba panggil AI Chatbot
      if (msg.key.remoteJid) {
        // Jangan melayani grup untuk AI (hanya chat pribadi)
        if (msg.key.remoteJid.includes("@g.us")) return;

        const aiConfig = await prisma.aiConfig.findUnique({
          where: { userId: device.userId }
        });

        if (aiConfig && aiConfig.isActive && aiConfig.apiKeys.length > 0) {
          // Check if this device is allowed (empty array means ALL devices allowed)
          if (aiConfig.activeDeviceIds.length > 0 && !aiConfig.activeDeviceIds.includes(device.id)) {
             return;
          }

          console.log(`[AI Chatbot] Menerima pesan dari ${msg.key.remoteJid}, menyiapkan konteks...`);
          
          // Ambil riwayat chat (10 pesan terakhir agar ingat konteks)
          const history = await prisma.aiContext.findMany({
            where: { userId: device.userId, target: msg.key.remoteJid },
            orderBy: { createdAt: "asc" },
            take: 10
          });

          const messages = [
            { role: "system", content: aiConfig.prompt },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: "user", content: text }
          ];

          let aiResponse = null;
          let lastError = null;

          // Sistem Load Balancing (Mencoba kunci satu per satu jika limit)
          for (const key of aiConfig.apiKeys) {
            try {
              const groq = new Groq({ apiKey: key });
              const completion = await groq.chat.completions.create({
                messages: messages as any,
                model: aiConfig.model,
                temperature: 0.7,
                max_tokens: 500
              });
              aiResponse = completion.choices[0]?.message?.content;
              if (aiResponse) {
                console.log(`[AI Chatbot] Sukses membalas menggunakan API Key: ${key.substring(0, 10)}...`);
                break; // Keluar dari loop jika sukses
              }
            } catch (e: any) {
              lastError = e;
              console.warn(`[AI Chatbot] Gagal menggunakan kunci ${key.substring(0, 10)}... (Pindah ke kunci berikutnya) - ${e.message}`);
            }
          }

          if (aiResponse) {
            // Kirim balasan WhatsApp
            await sock.sendMessage(msg.key.remoteJid, { text: aiResponse });
            
            // Simpan percakapan ini ke Database (Memori)
            await prisma.aiContext.create({
              data: { userId: device.userId, target: msg.key.remoteJid, role: "user", content: text }
            });
            await prisma.aiContext.create({
              data: { userId: device.userId, target: msg.key.remoteJid, role: "assistant", content: aiResponse }
            });

            // Update stats
            await prisma.device.update({
              where: { id: device.id },
              data: { messageCount: { increment: 1 } }
            }).catch(() => {});
          } else {
            console.error("[AI Chatbot] Semua API Key Groq GAGAL digunakan atau habis limit. Error Terakhir:", lastError?.message);
          }
        }
      }
    } catch (err) {
      console.error("Auto Reply Error:", err);
    }
  });

  return { success: true, message: "Session initiated" };
}

export function getSessionStatus(sessionId: string) {
  const sock = sessions.get(sessionId);
  if (!sock) {
    return { status: "DISCONNECTED" };
  }
  
  // Jika masih placeholder (sedang proses createSession)
  if ('isInit' in sock) {
    return { status: "CONNECTING" };
  }
  
  if (qrCodes.has(sessionId)) {
    return { status: "WAITING_FOR_QR", qr: qrCodes.get(sessionId) };
  }
  
  if (sock.user) {
    return { status: "CONNECTED", user: sock.user };
  }

  return { status: "CONNECTING" };
}

export async function sendMessage(sessionId: string, jid: string, content: { text?: string; poll?: { name: string, values: string[] } }) {
  let sock = sessions.get(sessionId);
  
  if (!sock) {
    // Coba restore dari DB jika belum ada di memory
    const device = await prisma.device.findUnique({ where: { sessionId } });
    if (device && device.status === "CONNECTED") {
      await createSession(sessionId, device.userId);
      // Beri sedikit waktu untuk proses koneksi WhatsApp
      await new Promise(resolve => setTimeout(resolve, 3000));
      sock = sessions.get(sessionId);
    }
  }

  if (!sock) throw new Error("Session not found or disconnected");
  
  const id = jid.includes("@") ? jid : `${jid}@s.whatsapp.net`;
  
  try {
    const sendContent = content.poll 
      ? { poll: { name: content.poll.name, values: content.poll.values, selectableCount: 1 } }
      : { text: content.text || "" };
      
    return await sock.sendMessage(id, sendContent);
  } catch (error: any) {
    if (error.message?.toLowerCase().includes("closed")) {
      // Hapus sesi mati dari memori agar auto-reconnect di percobaan berikutnya
      sessions.delete(sessionId);
      throw new Error("Koneksi terputus (sleep). Silakan coba klik Kirim lagi dalam 3 detik.");
    }
    throw error;
  }
}

export async function getGroups(sessionId: string) {
  const sock = sessions.get(sessionId);
  if (!sock || 'isInit' in sock) return [];
  
  try {
    const groups = await sock.groupFetchAllParticipating();
    return Object.values(groups).map((g: any) => ({
      id: g.id,
      name: g.subject
    }));
  } catch (err) {
    console.error("Failed to fetch groups", err);
    return [];
  }
}
