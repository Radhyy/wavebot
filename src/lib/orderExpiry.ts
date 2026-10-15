import { prisma } from "@/lib/prisma";

// Default batas waktu kedaluwarsa pembayaran: 24 jam (dalam milidetik)
export const ORDER_EXPIRY_HOURS = 24;

/**
 * Memeriksa transaksi berstatus PENDING yang sudah melewati batas waktu (misal > 24 jam)
 * dan mengubah statusnya menjadi 'EXPIRED' (Gagal/Kedaluwarsa) secara otomatis.
 */
export async function syncExpiredOrders(expiryHours: number = ORDER_EXPIRY_HOURS) {
  try {
    const cutoffDate = new Date(Date.now() - expiryHours * 60 * 60 * 1000);

    if ((prisma as any).subscriptionTransaction) {
      const result = await (prisma as any).subscriptionTransaction.updateMany({
        where: {
          status: "PENDING",
          createdAt: {
            lt: cutoffDate,
          },
        },
        data: {
          status: "EXPIRED",
        },
      });
      return result.count;
    } else {
      // Fallback via raw query
      const result: any = await prisma.$executeRawUnsafe(
        `UPDATE "SubscriptionTransaction" 
         SET "status" = 'EXPIRED', "updatedAt" = NOW() 
         WHERE "status" = 'PENDING' AND "createdAt" < $1`,
        cutoffDate
      );
      return result;
    }
  } catch (error) {
    console.error("Error auto-expiring pending orders:", error);
    return 0;
  }
}
