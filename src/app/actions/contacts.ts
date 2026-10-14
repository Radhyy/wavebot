"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addContact(data: { name: string, number: string, label?: string }) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    // Format nomor telepon (hapus karakter selain angka)
    let formattedNumber = data.number.replace(/\D/g, '');
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '62' + formattedNumber.substring(1);
    } else if (!formattedNumber.startsWith('62')) {
      // Asumsi nomor Indonesia jika tidak ada kode negara
      formattedNumber = '62' + formattedNumber;
    }

    await prisma.contact.create({
      data: {
        userId: session.id,
        name: data.name,
        number: formattedNumber,
        label: data.label || null,
      }
    });
    
    revalidatePath("/dashboard/contacts");
    return { success: true };
  } catch (error) {
    console.error("Failed to add contact:", error);
    return { error: "Gagal menyimpan kontak" };
  }
}

export async function deleteContact(id: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.contact.delete({
      where: {
        id,
        userId: session.id
      }
    });
    
    revalidatePath("/dashboard/contacts");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus kontak" };
  }
}
