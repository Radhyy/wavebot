import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminTicketsClient from "./AdminTicketsClient";

export default async function AdminTicketsPage() {
  const session = await getSession();
  if (!session || !session.id) {
    redirect("/login");
  }

  // Cek otorisasi ADMIN
  const currentUser = await (prisma as any).user.findUnique({
    where: { id: session.id },
    select: { role: true, email: true },
  });

  if (currentUser?.role !== "ADMIN" && currentUser?.email !== "raaakb87@gmail.com") {
    redirect("/dashboard");
  }

  // Ambil semua tiket laporan beserta data user pembuatnya
  let tickets: any[] = [];
  try {
    if ((prisma as any).supportTicket) {
      tickets = await (prisma as any).supportTicket.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true, plan: true }
          }
        }
      });
    } else {
      const rawTickets: any = await prisma.$queryRawUnsafe(`
        SELECT st.*, u.name as "userName", u.email as "userEmail", u.plan as "userPlan", u.avatar as "userAvatar"
        FROM "SupportTicket" st
        LEFT JOIN "User" u ON st."userId" = u.id
        ORDER BY st."createdAt" DESC
      `);
      tickets = rawTickets.map((r: any) => ({
        ...r,
        user: { name: r.userName, email: r.userEmail, plan: r.userPlan, avatar: r.userAvatar }
      }));
    }
  } catch (err) {
    console.error("Error fetching tickets for admin:", err);
  }

  return <AdminTicketsClient initialTickets={tickets} />;
}
