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
    throw new Error("Akses ditolak: Hanya Administrator yang berhak mengelola pengguna.");
  }

  return currentUser;
}

/**
 * Update role pengguna (USER <-> ADMIN)
 */
export async function updateUserRoleAction(targetUserId: string, newRole: "USER" | "ADMIN") {
  try {
    const admin = await verifyAdmin();

    // Lindungi agar super admin utama tidak bisa diturunkan menjadi USER oleh siapapun
    const targetUser = await (prisma as any).user.findUnique({
      where: { id: targetUserId },
      select: { email: true },
    });

    if (targetUser?.email === "raaakb87@gmail.com" && newRole !== "ADMIN") {
      return { error: "Akun Super Admin utama tidak dapat diubah menjadi USER biasa." };
    }

    await (prisma as any).user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin");
    return { success: true, message: `Role berhasil diubah menjadi ${newRole}` };
  } catch (err: any) {
    return { error: err.message || "Gagal mengubah role pengguna" };
  }
}

/**
 * Update paket pengguna secara manual (FREE, PAKET_1, PAKET_2, PAKET_3)
 * serta masa aktif paket (hari)
 */
export async function updateUserPlanAction(
  targetUserId: string,
  newPlan: "FREE" | "PAKET_1" | "PAKET_2" | "PAKET_3",
  durationDays: number = 30
) {
  try {
    await verifyAdmin();

    let planExpiresAt: Date | null = null;
    if (newPlan !== "FREE") {
      planExpiresAt = new Date();
      planExpiresAt.setDate(planExpiresAt.getDate() + durationDays);
    }

    await (prisma as any).user.update({
      where: { id: targetUserId },
      data: {
        plan: newPlan,
        planExpiresAt,
      },
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin");
    return { success: true, message: `Paket pengguna berhasil diubah ke ${newPlan}` };
  } catch (err: any) {
    return { error: err.message || "Gagal mengubah paket pengguna" };
  }
}

/**
 * Hapus pengguna dari sistem
 */
export async function deleteUserAction(targetUserId: string) {
  try {
    const admin = await verifyAdmin();

    const targetUser = await (prisma as any).user.findUnique({
      where: { id: targetUserId },
      select: { email: true, id: true },
    });

    if (!targetUser) {
      return { error: "Pengguna tidak ditemukan." };
    }

    if (targetUser.email === "raaakb87@gmail.com" || targetUser.id === admin.id) {
      return { error: "Anda tidak dapat menghapus akun Anda sendiri atau Super Admin." };
    }

    await (prisma as any).user.delete({
      where: { id: targetUserId },
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin");
    return { success: true, message: "Pengguna berhasil dihapus secara permanen." };
  } catch (err: any) {
    return { error: err.message || "Gagal menghapus pengguna" };
  }
}
