import { NextResponse } from "next/server";
import { syncExpiredOrders } from "@/lib/orderExpiry";

export async function GET() {
  const expiredCount = await syncExpiredOrders(24);
  return NextResponse.json({
    success: true,
    message: "Expired orders synchronized successfully",
    expiredCount,
    timestamp: new Date().toISOString(),
  });
}
