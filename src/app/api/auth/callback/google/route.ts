import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.nextUrl.protocol || "http:";
  const origin = `${protocol}//${host}`;

  if (error || !code) {
    console.error("Google Auth error or cancelled:", error);
    return NextResponse.redirect(`${origin}/login?error=Google auth failed`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${origin}/api/auth/callback/google`;

  try {
    // 1. Tukar authorization code dengan access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      console.error("Failed to exchange token:", errBody);
      return NextResponse.redirect(`${origin}/login?error=Failed to retrieve token`);
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // 2. Ambil data profil user dari Google API
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(`${origin}/login?error=Failed to fetch user profile`);
    }

    const googleUser: GoogleUserInfo = await userResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${origin}/login?error=No email provided by Google`);
    }

    // 3. Cari user di database berdasarkan email atau googleId
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: googleUser.email },
          { googleId: googleUser.id },
        ],
      },
    });

    if (!user) {
      // Buat akun baru jika belum terdaftar
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || "WaveBot User",
          googleId: googleUser.id,
          avatar: googleUser.picture,
        },
      });
    } else {
      // Update googleId atau avatar jika belum ada
      if (!user.googleId || !user.avatar) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: user.googleId || googleUser.id,
            avatar: user.avatar || googleUser.picture,
            name: user.name || googleUser.name,
          },
        });
      }
    }

    // 4. Buat session token
    const session = await encrypt({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    });

    const response = NextResponse.redirect(`${origin}/dashboard`);
    response.cookies.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err: any) {
    console.error("OAuth callback exception:", err);
    const msg = encodeURIComponent(err?.message || "Unknown error");
    return NextResponse.redirect(`${origin}/login?error=${msg}`);
  }
}
