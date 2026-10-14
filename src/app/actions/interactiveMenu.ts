"use server";

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function getInteractiveMenus() {
  const session = await getSession();
  if (!session) return [];
  return await prisma.interactiveMenu.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createInteractiveMenu(data: any) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };
  try {
    const menu = await prisma.interactiveMenu.create({
      data: {
        ...data,
        userId: session.id,
      }
    });
    return { success: true, data: menu };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteInteractiveMenu(id: string) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };
  try {
    await prisma.interactiveMenu.delete({
      where: { id, userId: session.id }
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
