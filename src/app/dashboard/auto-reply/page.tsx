import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import AutoReplyClient from "./AutoReplyClient";

export const instant = false;

export default async function AutoReplyPage() {
  const session = await getSession();
  
  if (!session) {
    return <div>Unauthorized</div>;
  }

  // Ambil daftar device milik user
  const devices = await prisma.device.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" }
  });

  // Ambil daftar auto reply
  const autoReplies = await prisma.autoReply.findMany({
    where: { userId: session.id },
    include: { device: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="dashboard-container">
      <AutoReplyClient initialData={autoReplies} devices={devices} />
    </div>
  );
}
