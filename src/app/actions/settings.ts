"use server";

import { prisma } from "@/lib/prisma";
import { getSession, encrypt } from "@/lib/auth";
import { uploadProfileImage } from "@/lib/s3";
import { sendOtpEmail } from "@/lib/mailer";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// 1. UPDATE PROFILE NAME
export async function updateProfileName(newName: string) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, error: "Unauthorized" };
  }

  if (!newName || newName.trim().length === 0) {
    return { success: false, error: "Nama tidak boleh kosong" };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: { name: newName.trim() },
    });

    // Update JWT session
    const newSession = await encrypt({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    });

    const cookieStore = await cookies();
    cookieStore.set("session", newSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return { success: true, name: updatedUser.name };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 2. UPLOAD PROFILE AVATAR TO S3
export async function updateProfileAvatar(formData: FormData) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "Pilih file gambar terlebih dahulu" };
  }

  if (!file.type.startsWith("image/")) {
    return { success: false, error: "File harus berupa format gambar (JPG/PNG/WEBP)" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "Ukuran gambar maksimal 5MB" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const avatarUrl = await uploadProfileImage(buffer, file.name, file.type);

    // Save avatar URL in DB
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: { avatar: avatarUrl },
    });

    // Update session
    const newSession = await encrypt({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    });

    const cookieStore = await cookies();
    cookieStore.set("session", newSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return { success: true, avatarUrl };
  } catch (error: any) {
    console.error("Avatar upload error:", error);
    return { success: false, error: "Gagal mengunggah foto ke storage: " + error.message };
  }
}

// 3. SEND OTP CODE TO EMAIL
export async function requestPasswordOtp() {
  const session = await getSession();
  if (!session?.id || !session?.email) {
    return { success: false, error: "Unauthorized" };
  }

  // Generate 6-digit random code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    // Delete previous OTP codes for this email
    await prisma.otpCode.deleteMany({
      where: { email: session.email, type: "RESET_PASSWORD" },
    });

    // Save new OTP
    await prisma.otpCode.create({
      data: {
        email: session.email,
        code: otpCode,
        type: "RESET_PASSWORD",
        expiresAt,
      },
    });

    // Send via Gmail
    const mailResult = await sendOtpEmail(session.email, otpCode);
    if (!mailResult.success) {
      return { success: false, error: mailResult.error || "Gagal mengirim email OTP." };
    }

    return { success: true, message: `Kode OTP 6-digit telah dikirim ke ${session.email}` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 4. VERIFY OTP CODE ONLY
export async function verifyOtpOnly(otp: string) {
  const session = await getSession();
  if (!session?.id || !session?.email) {
    return { success: false, error: "Unauthorized" };
  }

  if (!otp || otp.trim().length !== 6) {
    return { success: false, error: "Kode OTP harus 6 digit angka" };
  }

  try {
    const validOtp = await prisma.otpCode.findFirst({
      where: {
        email: session.email,
        code: otp.trim(),
        type: "RESET_PASSWORD",
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!validOtp) {
      return { success: false, error: "Kode OTP salah atau sudah kedaluwarsa" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 5. UPDATE PASSWORD AFTER OTP VERIFIED
export async function updatePasswordAfterOtp(otp: string, newPassword: string) {
  const session = await getSession();
  if (!session?.id || !session?.email) {
    return { success: false, error: "Unauthorized" };
  }

  if (!otp || otp.trim().length !== 6) {
    return { success: false, error: "Kode OTP tidak valid" };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Password baru minimal 6 karakter" };
  }

  try {
    const validOtp = await prisma.otpCode.findFirst({
      where: {
        email: session.email,
        code: otp.trim(),
        type: "RESET_PASSWORD",
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!validOtp) {
      return { success: false, error: "Sesi verifikasi OTP telah habis, silakan kirim ulang OTP" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.id },
      data: { password: hashedPassword },
    });

    // Delete used OTP
    await prisma.otpCode.deleteMany({
      where: { email: session.email },
    });

    return { success: true, message: "Password berhasil diperbarui!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

