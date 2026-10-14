"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGroups } from "@/lib/whatsapp";

export async function fetchDeviceGroups(deviceId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const device = await prisma.device.findUnique({
    where: { id: deviceId, userId: session.id }
  });

  if (!device) return [];

  return await getGroups(device.sessionId);
}
