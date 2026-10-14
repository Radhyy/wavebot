import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, number, message } = body;

    if (!sessionId || !number || !message) {
      return NextResponse.json({ error: "Missing required fields: sessionId, number, message" }, { status: 400 });
    }

    const result = await sendMessage(sessionId, number, message);
    
    // Tambah jumlah pesan di database
    const { prisma } = await import("@/lib/prisma");
    await prisma.device.update({
      where: { sessionId },
      data: { messageCount: { increment: 1 } }
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}
