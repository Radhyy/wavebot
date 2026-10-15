import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    
    // Verify Midtrans signature: SHA512(order_id + status_code + gross_amount + ServerKey)
    const hash = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (hash !== signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const tx = await (prisma as any).subscriptionTransaction.findUnique({
      where: { orderId: order_id },
    });

    if (!tx) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let isSuccess = false;

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        isSuccess = true;
      }
    } else if (transaction_status === "settlement") {
      isSuccess = true;
    }

    if (isSuccess) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 hari aktif

      await (prisma as any).$transaction([
        (prisma as any).subscriptionTransaction.update({
          where: { orderId: order_id },
          data: {
            status: "SUCCESS",
            paymentType: payment_type,
            transactionTime: new Date(),
          },
        }),
        (prisma as any).user.update({
          where: { id: tx.userId },
          data: {
            plan: tx.plan,
            planExpiresAt: expiresAt,
          },
        }),
      ]);
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      await (prisma as any).subscriptionTransaction.update({
        where: { orderId: order_id },
        data: {
          status: transaction_status.toUpperCase(),
          paymentType: payment_type,
        },
      });
    }

    return NextResponse.json({ status: "OK" });
  } catch (error: any) {
    console.error("Midtrans Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
