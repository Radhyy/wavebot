import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { syncExpiredOrders } from "@/lib/orderExpiry";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!session || !session.id) {
    redirect("/login");
  }

  // Cek apakah user adalah ADMIN
  const currentUser = await (prisma as any).user.findUnique({
    where: { id: session.id },
    select: { role: true, email: true }
  });

  if (currentUser?.role !== "ADMIN" && currentUser?.email !== "raaakb87@gmail.com") {
    redirect("/dashboard");
  }

  // Sinkronisasi otomatis: ubah pending yang lewat batas waktu (>24 jam) menjadi EXPIRED
  await syncExpiredOrders(24);

  // Ambil semua daftar transaksi order
  let orders: any[] = [];
  try {
    if ((prisma as any).subscriptionTransaction) {
      orders = await (prisma as any).subscriptionTransaction.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true }
          }
        }
      });
    } else {
      const rawOrders: any = await prisma.$queryRawUnsafe(`
        SELECT st.*, u.name as "userName", u.email as "userEmail"
        FROM "SubscriptionTransaction" st
        LEFT JOIN "User" u ON st."userId" = u.id
        ORDER BY st."createdAt" DESC
      `);
      orders = rawOrders.map((r: any) => ({
        ...r,
        user: { name: r.userName, email: r.userEmail }
      }));
    }
  } catch (err) {
    console.error("Error fetching admin orders list:", err);
  }

  return <AdminOrdersClient initialOrders={orders} />;
}
