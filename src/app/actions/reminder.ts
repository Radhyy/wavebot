"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReminder(data: {
  title: string;
  deviceId: string;
  targetNumber: string;
  schedule: string;
  repeat: string;
  message: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const { title, deviceId, targetNumber, schedule, repeat, message } = data;

  // Clean the number
  let cleanNumber = targetNumber.replace(/\D/g, "");
  if (targetNumber.includes("@g.us")) {
    cleanNumber = targetNumber.trim();
  } else if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.substring(1);
  }

  await prisma.reminder.create({
    data: {
      userId: session.id,
      deviceId,
      title,
      target: cleanNumber,
      message,
      schedule: new Date(schedule),
      repeat,
      status: "WAITING"
    }
  });

  revalidatePath("/dashboard/reminder");
  return { success: true };
}

export async function deleteReminder(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.reminder.delete({
    where: { id, userId: session.id }
  });

  revalidatePath("/dashboard/reminder");
}
