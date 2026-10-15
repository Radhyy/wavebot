import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { syncExpiredOrders } from "@/lib/orderExpiry";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || !session.id) {
    redirect("/login");
  }

  // Cek apakah user benar-benar ADMIN di database
  const currentUser = await (prisma as any).user.findUnique({
    where: { id: session.id },
    select: { role: true, email: true }
  });

  if (currentUser?.role !== "ADMIN" && currentUser?.email !== "raaakb87@gmail.com") {
    // Tolak akses jika bukan admin, kembalikan ke dashboard user biasa
    redirect("/dashboard");
  }

  // Sinkronisasi otomatis: ubah pending yang lewat batas waktu (>24 jam) menjadi EXPIRED
  await syncExpiredOrders(24);

  // 1. Ambil seluruh transaksi pesanan (SubscriptionTransaction)
  let transactions: any[] = [];
  try {
    if ((prisma as any).subscriptionTransaction) {
      transactions = await (prisma as any).subscriptionTransaction.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true, avatar: true }
          }
        }
      });
    } else {
      const rawTxs: any = await prisma.$queryRawUnsafe(`
        SELECT st.*, u.name as "userName", u.email as "userEmail"
        FROM "SubscriptionTransaction" st
        LEFT JOIN "User" u ON st."userId" = u.id
        ORDER BY st."createdAt" DESC
      `);
      transactions = rawTxs.map((r: any) => ({
        ...r,
        user: { name: r.userName, email: r.userEmail }
      }));
    }
  } catch (err) {
    console.error("Error fetching transactions for admin:", err);
  }

  // 2. Ambil total user
  let totalUsers = 0;
  try {
    totalUsers = await prisma.user.count();
  } catch (e) {}

  // 3. Kalkulasi metrik saldo dan order
  const totalOrders = transactions.length;
  const successTxs = transactions.filter((t) => t.status === "SUCCESS");
  const successOrders = successTxs.length;
  const totalRevenue = successTxs.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  // 4. Kalkulasi pendapatan per bulan (Chart Order & Saldo)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const monthlyMap: { [key: string]: { amount: number; count: number } } = {};

  // Inisialisasi 6-12 bulan terakhir atau bulan berjalan
  const currentMonthIdx = new Date().getMonth();
  for (let i = 0; i <= currentMonthIdx; i++) {
    monthlyMap[monthNames[i]] = { amount: 0, count: 0 };
  }

  successTxs.forEach((t) => {
    const d = new Date(t.createdAt);
    const mName = monthNames[d.getMonth()];
    if (!monthlyMap[mName]) {
      monthlyMap[mName] = { amount: 0, count: 0 };
    }
    monthlyMap[mName].amount += Number(t.amount) || 0;
    monthlyMap[mName].count += 1;
  });

  const monthlyRevenue = Object.keys(monthlyMap).map((month) => ({
    month,
    amount: monthlyMap[month].amount,
    count: monthlyMap[month].count,
  }));

  const stats = {
    totalRevenue,
    totalOrders,
    successOrders,
    totalUsers
  };

  return (
    <AdminDashboardClient
      stats={stats}
      monthlyRevenue={monthlyRevenue}
      recentTransactions={transactions.slice(0, 15)}
    />
  );
}
