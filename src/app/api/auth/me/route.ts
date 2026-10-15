import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const { prisma } = await import("@/lib/prisma");
    const dbUser = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, email: true, role: true, plan: true, avatar: true }
    });

    const role = dbUser?.role || session.role || (session.email === "raaakb87@gmail.com" ? "ADMIN" : "USER");
    const plan = role === "ADMIN" ? "ADMIN" : (dbUser?.plan || session.plan || "FREE");

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: dbUser?.name || session.name,
        email: dbUser?.email || session.email,
        role,
        plan,
        avatar: dbUser?.avatar || session.avatar || null
      }
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      }
    });
  }
}
