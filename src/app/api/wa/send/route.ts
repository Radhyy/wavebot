import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, number, message } = body;

    if (!sessionId || !number || !message) {
      return NextResponse.json({ error: "Missing required fields: sessionId, number, message" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");
    const { getPlanDetail } = await import("@/lib/plans");

    // Periksa batas kuota pesan user pemilik device
    const device = await prisma.device.findUnique({
      where: { sessionId },
      include: { user: true }
    });

    if (device && device.user) {
      const planInfo = getPlanDetail((device.user as any).plan);
      const userDevices = await prisma.device.findMany({
        where: { userId: device.user.id },
        select: { messageCount: true }
      });
      const totalSent = userDevices.reduce((acc, d) => acc + (d.messageCount || 0), 0);

      if (totalSent >= planInfo.messagesLimit) {
        return NextResponse.json({
          error: `Kuota pesan paket ${planInfo.name} Anda (${planInfo.messagesLimit.toLocaleString()} pesan) telah mencapai batas maksimal. Silakan upgrade paket Anda.`
        }, { status: 403 });
      }
    }

    const result = await sendMessage(sessionId, number, message);
    
    // Tambah jumlah pesan di database
    await prisma.device.update({
      where: { sessionId },
      data: { messageCount: { increment: 1 } }
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}
