"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSupportTicketAction(formData: {
  subject: string;
  category: string;
  message: string;
  priority?: string;
}) {
  const session = await getSession();
  if (!session || !session.id) {
    return { error: "Silakan login terlebih dahulu untuk mengirimkan laporan." };
  }

  if (!formData.subject || formData.subject.trim().length === 0) {
    return { error: "Judul laporan wajib diisi." };
  }

  if (!formData.message || formData.message.trim().length === 0) {
    return { error: "Isi detail pesan laporan wajib diisi." };
  }

  const ticketId = `TKT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  try {
    if ((prisma as any).supportTicket) {
      await (prisma as any).supportTicket.create({
        data: {
          ticketId,
          userId: session.id,
          subject: formData.subject.trim(),
          category: formData.category || "GENERAL",
          message: formData.message.trim(),
          priority: formData.priority || "NORMAL",
          status: "OPEN",
        },
      });
    } else {
      // Fallback raw query
      await prisma.$executeRawUnsafe(
        `INSERT INTO "SupportTicket" ("id", "ticketId", "userId", "subject", "category", "message", "status", "priority", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'OPEN', $6, NOW(), NOW())`,
        ticketId,
        session.id,
        formData.subject.trim(),
        formData.category || "GENERAL",
        formData.message.trim(),
        formData.priority || "NORMAL"
      );
    }

    revalidatePath("/dashboard/customer-service");
    return { 
      success: true, 
      ticketId, 
      message: `Laporan Anda dengan nomor tiket #${ticketId} berhasil dikirim! Tim support kami akan segera meninjaunya.` 
    };
  } catch (err: any) {
    console.error("Error creating support ticket:", err);
    return { error: err.message || "Gagal mengirimkan tiket laporan." };
  }
}
