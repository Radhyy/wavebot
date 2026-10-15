"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await getSession();
  if (!session || !session.id) {
    throw new Error("Sesi tidak valid, silakan login kembali.");
  }

  const currentUser = await (prisma as any).user.findUnique({
    where: { id: session.id },
    select: { id: true, role: true, email: true },
  });

  if (currentUser?.role !== "ADMIN" && currentUser?.email !== "raaakb87@gmail.com") {
    throw new Error("Akses ditolak: Hanya Administrator yang berhak mengelola dan menjawab tiket.");
  }

  return currentUser;
}

/**
 * Admin menjawab tiket laporan dan memperbarui status tiket
 */
export async function replySupportTicketAction(
  ticketId: string,
  replyText: string,
  newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" = "RESOLVED"
) {
  try {
    await verifyAdmin();

    if (!replyText || replyText.trim().length === 0) {
      return { error: "Pesan balasan tidak boleh kosong." };
    }

    if ((prisma as any).supportTicket) {
      await (prisma as any).supportTicket.update({
        where: { ticketId },
        data: {
          adminReply: replyText.trim(),
          status: newStatus,
          repliedAt: new Date(),
        },
      });
    } else {
      await prisma.$executeRawUnsafe(
        `UPDATE "SupportTicket" 
         SET "adminReply" = $1, "status" = $2, "repliedAt" = NOW(), "updatedAt" = NOW() 
         WHERE "ticketId" = $3`,
        replyText.trim(),
        newStatus,
        ticketId
      );
    }

    revalidatePath("/dashboard/admin/tickets");
    revalidatePath("/dashboard/customer-service");
    return { success: true, message: "Balasan berhasil dikirimkan ke pengguna." };
  } catch (err: any) {
    console.error("Error replying support ticket:", err);
    return { error: err.message || "Gagal mengirimkan balasan tiket." };
  }
}

/**
 * Admin memperbarui status tiket secara langsung
 */
export async function updateTicketStatusAction(
  ticketId: string,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
) {
  try {
    await verifyAdmin();

    if ((prisma as any).supportTicket) {
      await (prisma as any).supportTicket.update({
        where: { ticketId },
        data: { status },
      });
    } else {
      await prisma.$executeRawUnsafe(
        `UPDATE "SupportTicket" SET "status" = $1, "updatedAt" = NOW() WHERE "ticketId" = $2`,
        status,
        ticketId
      );
    }

    revalidatePath("/dashboard/admin/tickets");
    revalidatePath("/dashboard/customer-service");
    return { success: true, message: `Status tiket diubah menjadi ${status}` };
  } catch (err: any) {
    return { error: err.message || "Gagal mengubah status tiket." };
  }
}

/**
 * Admin menghapus tiket
 */
export async function deleteTicketAction(ticketId: string) {
  try {
    await verifyAdmin();

    if ((prisma as any).supportTicket) {
      await (prisma as any).supportTicket.delete({
        where: { ticketId },
      });
    } else {
      await prisma.$executeRawUnsafe(
        `DELETE FROM "SupportTicket" WHERE "ticketId" = $1`,
        ticketId
      );
    }

    revalidatePath("/dashboard/admin/tickets");
    revalidatePath("/dashboard/customer-service");
    return { success: true, message: "Tiket laporan berhasil dihapus." };
  } catch (err: any) {
    return { error: err.message || "Gagal menghapus tiket." };
  }
}
