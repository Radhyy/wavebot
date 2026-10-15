import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CustomerServiceClient from "./CustomerServiceClient";

export default async function CustomerServicePage() {
  const session = await getSession();
  if (!session || !session.id) {
    redirect("/login");
  }

  const user = await (prisma as any).user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, plan: true }
  });

  // Ambil tiket yang pernah dikirim oleh user ini
  let myTickets: any[] = [];
  try {
    if ((prisma as any).supportTicket) {
      myTickets = await (prisma as any).supportTicket.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
      });
    } else {
      myTickets = await prisma.$queryRawUnsafe(
        `SELECT * FROM "SupportTicket" WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
        session.id
      );
    }
  } catch (err) {
    console.error("Error loading user tickets:", err);
  }

  return (
    <CustomerServiceClient 
      user={user} 
      initialTickets={myTickets} 
    />
  );
}
