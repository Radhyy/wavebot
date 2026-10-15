import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  // Ambil origin dari NEXT_PUBLIC_APP_URL jika ada, atau headers reverse-proxy
  let origin = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  if (!origin) {
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    origin = `${forwardedProto}://${host}`;
  }
  // Hilangkan trailing slash jika ada
  origin = origin.replace(/\/$/, "");
  const redirectUri = `${origin}/api/auth/callback/google`;

  if (!clientId) {
    return NextResponse.json({ error: "GOOGLE_CLIENT_ID is not configured" }, { status: 500 });
  }

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return NextResponse.redirect(`${rootUrl}?${qs.toString()}`);
}
