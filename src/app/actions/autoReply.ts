"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAutoReplies() {
  const session = await getSession();
  if (!session) return [];

  return prisma.autoReply.findMany({
    where: { userId: session.id },
    include: { device: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function addAutoReply(data: { keyword: string | null, reply: string, type: string, deviceId: string | null, startTime: string | null, endTime: string | null }) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.autoReply.create({
      data: {
        userId: session.id,
        keyword: data.keyword,
        reply: data.reply,
        type: data.type,
        deviceId: data.deviceId || null,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
      }
    });
    
    revalidatePath("/dashboard/auto-reply");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function toggleAutoReply(id: string, isActive: boolean) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.autoReply.update({
      where: { id, userId: session.id },
      data: { isActive }
    });
    
    revalidatePath("/dashboard/auto-reply");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteAutoReply(id: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.autoReply.delete({
      where: { id, userId: session.id }
    });
    
    revalidatePath("/dashboard/auto-reply");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
