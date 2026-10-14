import { NextRequest, NextResponse } from "next/server";
import { getSessionStatus } from "@/lib/whatsapp";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Query parameter 'sessionId' is required" }, { status: 400 });
    }

    const status = getSessionStatus(sessionId);
    return NextResponse.json({ success: true, sessionId, ...status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to check status" }, { status: 500 });
  }
}
