"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createSession, getSessionStatus } from "@/lib/whatsapp";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

import { getPlanDetail } from "@/lib/plans";

export async function addDevice(deviceName: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  // Create a unique session ID for Baileys
  const waSessionId = uuidv4();

  await prisma.device.create({
    data: {
      name: deviceName,
      sessionId: waSessionId,
      userId: session.id,
    }
  });

  // Init Baileys session in background
  createSession(waSessionId, session.id).catch(console.error);

  revalidatePath("/dashboard/devices");
  return { success: true, sessionId: waSessionId };
}

export async function checkDeviceStatus(sessionId: string) {
  const status = getSessionStatus(sessionId);
  return status;
}

export async function deleteDevice(sessionId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };
  
  await prisma.device.delete({
    where: { sessionId, userId: session.id }
  });

  // Disconnect socket if running
  const waSessionId = sessionId;
  const globalForWA = global as any;
  if (globalForWA.waSessions && globalForWA.waSessions.has(waSessionId)) {
    const sock = globalForWA.waSessions.get(waSessionId);
    try {
      sock.logout();
    } catch (e) {}
    globalForWA.waSessions.delete(waSessionId);
  }
  
  if (globalForWA.qrCodes) {
    globalForWA.qrCodes.delete(waSessionId);
  }

  // Delete auth folder
  const fs = require("fs");
  const path = require("path");
  const authFolder = path.join(process.cwd(), ".wa_auth", waSessionId);
  try {
    if (fs.existsSync(authFolder)) {
      fs.rmSync(authFolder, { recursive: true, force: true });
    }
  } catch (e) {}
  
  revalidatePath("/dashboard/devices");
  return { success: true };
}
