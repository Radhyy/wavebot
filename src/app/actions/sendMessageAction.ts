"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/lib/whatsapp";
import { revalidatePath } from "next/cache";

export async function submitMessage(data: {
  deviceId: string;
  targetNumber: string;
  message: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const { deviceId, targetNumber, message } = data;

  // Clean the number (remove spaces, +, etc)
  let cleanNumber = targetNumber.replace(/\D/g, "");
  
  // If it's a group ID (contains @g.us), keep the original targetNumber
  if (targetNumber.includes("@g.us")) {
    cleanNumber = targetNumber.trim();
  } else if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.substring(1);
  }

  // Enforce monthly message quota based on user plan
  const [user, totalSent] = await Promise.all([
    (prisma as any).user.findUnique({ where: { id: session.id } }),
    prisma.messageHistory.count({ 
      where: { 
        userId: session.id,
        status: "SENT"
      } 
    })
  ]);

  const { getPlanDetail } = await import("@/lib/plans");
  const planInfo = getPlanDetail(user?.plan);

  if (totalSent >= planInfo.messagesLimit) {
    return {
      success: false,
      error: `Kuota pesan paket ${planInfo.name} Anda (${planInfo.messagesLimit.toLocaleString()} pesan) telah habis. Silakan upgrade paket Anda di menu Pricing.`
    };
  }

  // Create message history entry as PENDING
  const history = await prisma.messageHistory.create({
    data: {
      userId: session.id,
      deviceId,
      target: cleanNumber,
      message,
      status: "PENDING"
    }
  });

  try {
    // Get device session id
    const device = await prisma.device.findUnique({
      where: { id: deviceId, userId: session.id }
    });

    if (!device) throw new Error("Device not found");

    // Send via WhatsApp
    let isPoll = false;
    let pollData = null;
    let textMessage = message;
    
    try {
      const parsed = JSON.parse(message);
      if (parsed.type === "poll" && parsed.name && Array.isArray(parsed.options)) {
        isPoll = true;
        pollData = { name: parsed.name, values: parsed.options };
        textMessage = `[Polling] ${parsed.name}`; // Save a readable string in history
      }
    } catch(e) {}

    // Update history message with human readable text if it was a JSON poll
    if (isPoll) {
      await prisma.messageHistory.update({
        where: { id: history.id },
        data: { message: textMessage }
      });
    }

    if (isPoll && pollData) {
      await sendMessage(device.sessionId, cleanNumber, { poll: pollData });
    } else {
      await sendMessage(device.sessionId, cleanNumber, { text: message });
    }

    // Update status to SENT
    await prisma.messageHistory.update({
      where: { id: history.id },
      data: { status: "SENT" }
    });
    
    // Increment device message count
    await prisma.device.update({
      where: { id: deviceId },
      data: { messageCount: { increment: 1 } }
    });

    revalidatePath("/dashboard/send");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to send message:", error);
    
    // Update status to FAILED
    await prisma.messageHistory.update({
      where: { id: history.id },
      data: { status: "FAILED" }
    });

    revalidatePath("/dashboard/send");
    return { success: false, error: error.message || "Failed to send message" };
  }
}

export async function deleteMessageHistory(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.messageHistory.delete({
    where: { id, userId: session.id }
  });

  revalidatePath("/dashboard/send");
}
