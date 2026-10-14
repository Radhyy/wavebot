import { NextRequest, NextResponse } from "next/server";
import { getGroups } from "@/lib/whatsapp";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Query parameter 'sessionId' is required" }, { status: 400 });
    }

    const groups = await getGroups(sessionId);
    return NextResponse.json({ success: true, count: groups.length, groups });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch groups" }, { status: 500 });
  }
}
