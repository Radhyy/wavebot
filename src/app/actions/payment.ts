"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlanType } from "@/lib/plans";
import { getDynamicPricing } from "@/lib/pricingService";
import { snap } from "@/lib/midtrans";

export async function createSubscriptionOrder(planKey: string) {
  const session = await getSession();
  if (!session || !session.id) {
    return { error: "Silakan login terlebih dahulu untuk berlangganan." };
  }

  if (planKey === "FREE") {
    // Set user back to FREE or initialize
    await (prisma as any).user.update({
      where: { id: session.id },
      data: {
        plan: "FREE",
        planExpiresAt: null,
      },
    });
    return { success: true, message: "Paket Free berhasil diaktifkan" };
  }

  const dynamicPlans = await getDynamicPricing();
  const plan = dynamicPlans[planKey as PlanType];
  if (!plan) {
    return { error: "Paket langganan tidak valid" };
  }

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    return { error: "Pengguna tidak ditemukan" };
  }

  const orderId = `WB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: plan.price,
      },
      item_details: [
        {
          id: plan.id,
          price: plan.price,
          quantity: 1,
          name: `${plan.name} (1 Bulan)`,
        },
      ],
      customer_details: {
        first_name: user.name || "Customer",
        email: user.email,
      },
      expiry: {
        unit: "hours",
        duration: 24,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // Save record to database
    try {
      if ((prisma as any).subscriptionTransaction) {
        await (prisma as any).subscriptionTransaction.create({
          data: {
            orderId,
            userId: user.id,
            plan: plan.id,
            amount: plan.price,
            status: "PENDING",
            snapToken: transaction.token,
          },
        });
      } else {
        // Fallback using raw query if PrismaClient instance in memory was cached before model added
        await prisma.$executeRawUnsafe(
          `INSERT INTO "SubscriptionTransaction" ("id", "orderId", "userId", "plan", "amount", "status", "snapToken", "createdAt", "updatedAt") 
           VALUES (gen_random_uuid(), $1, $2, $3, $4, 'PENDING', $5, NOW(), NOW())`,
          orderId,
          user.id,
          plan.id,
          plan.price,
          transaction.token
        );
      }
    } catch (dbErr) {
      console.error("Warning saving transaction record:", dbErr);
    }

    return {
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId,
    };
  } catch (err: any) {
    console.error("Midtrans createTransaction error:", err);
    return { error: err.message || "Gagal membuat transaksi pembayaran" };
  }
}

export async function simulateSuccessPayment(orderId: string) {
  try {
    let tx: any = null;

    if ((prisma as any).subscriptionTransaction) {
      tx = await (prisma as any).subscriptionTransaction.findUnique({
        where: { orderId },
      });
    } else {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT "id", "userId", "plan" FROM "SubscriptionTransaction" WHERE "orderId" = $1 LIMIT 1`,
        orderId
      );
      if (rows && rows.length > 0) {
        tx = rows[0];
      }
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 hari

    if (tx) {
      // Update transaction status
      await prisma.$executeRawUnsafe(
        `UPDATE "SubscriptionTransaction" SET "status" = 'SUCCESS', "paymentType" = 'sandbox_simulator', "transactionTime" = NOW(), "updatedAt" = NOW() WHERE "orderId" = $1`,
        orderId
      );

      // Update user plan
      await prisma.$executeRawUnsafe(
        `UPDATE "User" SET "plan" = $1, "planExpiresAt" = $2, "updatedAt" = NOW() WHERE "id" = $3`,
        tx.plan,
        expires,
        tx.userId
      );
    } else {
      // Jika orderId belum tercatat tapi session user aktif
      const session = await getSession();
      if (session && session.id) {
        // Ekstrak plan dari orderId atau ambil paket default
        await prisma.$executeRawUnsafe(
          `UPDATE "User" SET "plan" = 'PAKET_1', "planExpiresAt" = $1, "updatedAt" = NOW() WHERE "id" = $2`,
          expires,
          session.id
        );
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("simulateSuccessPayment error:", err);
    return { error: err.message || "Gagal memproses update plan" };
  }
}
