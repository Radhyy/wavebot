"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAiConfig() {
  const session = await getSession();
  if (!session) return null;

  let config = await prisma.aiConfig.findUnique({
    where: { userId: session.id }
  });

  if (!config) {
    config = await prisma.aiConfig.create({
      data: {
        userId: session.id,
        apiKeys: [],
        model: "llama-3.1-8b-instant",
        prompt: "Kamu adalah asisten virtual yang ramah dan membantu.",
        isActive: false
      }
    });
  }

  return config;
}

export async function updateAiConfig(data: { apiKeys: string[], model: string, prompt: string, isActive: boolean, activeDeviceIds?: string[] }) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.aiConfig.update({
      where: { userId: session.id },
      data: {
        apiKeys: data.apiKeys,
        model: data.model,
        prompt: data.prompt,
        isActive: data.isActive,
        activeDeviceIds: data.activeDeviceIds || []
      }
    });

    revalidatePath("/dashboard/ai-chatbot");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update AI config:", err);
    return { success: false, error: err.message };
  }
}
