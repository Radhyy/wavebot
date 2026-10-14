"use server";

import { prisma } from "@/lib/prisma";
import { encrypt, clearSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sendOtpEmail } from "@/lib/mailer";

// 1. REQUEST OTP UNTUK REGISTRASI
export async function sendRegisterOtp(email: string, name: string) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Alamat email tidak valid" };
  }

  // Cek apakah email sudah terdaftar sebelumnya
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "Email ini sudah terdaftar. Silakan login." };
  }

  // Buat 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

  try {
    // Hapus OTP pendaftaran lama untuk email ini
    await prisma.otpCode.deleteMany({
      where: { email, type: "REGISTER" },
    });

    // Simpan OTP baru
    await prisma.otpCode.create({
      data: {
        email,
        code: otpCode,
        type: "REGISTER",
        expiresAt,
      },
    });

    // Kirim email via Gmail
    const mailRes = await sendOtpEmail(email, otpCode, "REGISTER");
    if (!mailRes.success) {
      return { success: false, error: mailRes.error || "Gagal mengirim kode verifikasi ke email" };
    }

    return { success: true, message: `Kode OTP 6-digit telah dikirim ke ${email}` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 2. VERIFIKASI OTP & SELESAIKAN PENDAFTARAN
export async function completeRegistration(formData: FormData, otp: string) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Semua kolom wajib diisi" };
  }

  if (!otp || otp.trim().length !== 6) {
    return { error: "Kode OTP harus 6 digit angka" };
  }

  // Verifikasi OTP di database
  const validOtp = await prisma.otpCode.findFirst({
    where: {
      email,
      code: otp.trim(),
      type: "REGISTER",
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!validOtp) {
    return { error: "Kode OTP salah atau sudah kedaluwarsa" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Email sudah terdaftar" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Hapus OTP yang telah dipakai
  await prisma.otpCode.deleteMany({
    where: { email, type: "REGISTER" },
  });

  const session = await encrypt({ id: user.id, email: user.email, name: user.name });
  
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const session = await encrypt({ id: user.id, email: user.email, name: user.name });
  
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid credentials" };
  }

  const session = await encrypt({ id: user.id, email: user.email, name: user.name, role: user.role });
  
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
