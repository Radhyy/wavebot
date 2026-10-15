"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateDynamicPricing } from "@/lib/pricingService";
import { revalidatePath } from "next/cache";

export async function updatePlanPricesAction(prices: {
  PAKET_1: number;
  PAKET_2: number;
  PAKET_3: number;
}) {
  const session = await getSession();
  if (!session || !session.id) {
    return { error: "Silakan login terlebih dahulu." };
  }

  // Validasi role admin
  const user = await (prisma as any).user.findUnique({
    where: { id: session.id },
    select: { role: true, email: true },
  });

  if (user?.role !== "ADMIN" && user?.email !== "raaakb87@gmail.com") {
    return { error: "Akses ditolak: Hanya Administrator yang berhak mengubah harga paket." };
  }

  // Validasi nilai harga
  if (prices.PAKET_1 < 0 || prices.PAKET_2 < 0 || prices.PAKET_3 < 0) {
    return { error: "Nominal harga tidak boleh bernilai negatif." };
  }

  const success = await updateDynamicPricing({
    PAKET_1: prices.PAKET_1,
    PAKET_2: prices.PAKET_2,
    PAKET_3: prices.PAKET_3,
  });

  if (!success) {
    return { error: "Gagal menyimpan harga ke database. Coba lagi." };
  }

  // Revalidate landing page, pricing page, admin pricing, dan dashboard
  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/dashboard/admin/pricing");
  revalidatePath("/dashboard/admin");

  return { success: true, message: "Harga paket berhasil diperbarui!" };
}
