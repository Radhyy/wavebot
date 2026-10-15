import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getDynamicPricing } from "@/lib/pricingService";
import AdminPricingClient from "./AdminPricingClient";

export default async function AdminPricingPage() {
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

  const plans = await getDynamicPricing();

  return (
    <AdminPricingClient 
      initialPrices={{
        PAKET_1: plans.PAKET_1.price,
        PAKET_2: plans.PAKET_2.price,
        PAKET_3: plans.PAKET_3.price,
      }} 
    />
  );
}
