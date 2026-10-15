import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
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

  // Ambil seluruh daftar pengguna beserta agregasi perangkat dan pesan
  let users: any[] = [];
  try {
    users = await (prisma as any).user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        plan: true,
        planExpiresAt: true,
        createdAt: true,
        _count: {
          select: {
            devices: true,
            messages: true,
            subscriptions: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching users list for admin:", err);
  }

  return (
    <AdminUsersClient 
      initialUsers={users} 
      currentAdminEmail={currentUser?.email || ""} 
    />
  );
}
