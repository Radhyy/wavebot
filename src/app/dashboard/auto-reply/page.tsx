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

  // Ambil data user untuk cek plan
  const user = await (prisma as any).user.findUnique({
    where: { id: session.id },
  });

  return (
    <div className="dashboard-container">
      <AutoReplyClient initialData={autoReplies} devices={devices} userPlan={user?.plan || "FREE"} />
    </div>
  );
}
