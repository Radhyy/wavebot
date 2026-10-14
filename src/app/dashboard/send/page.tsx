import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SendMessageClient from "./SendMessageClient";

export default async function SendMessagePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const devices = await prisma.device.findMany({
    where: { userId: session.id }
  });

  const contacts = await prisma.contact.findMany({
    where: { userId: session.id },
    orderBy: { name: "asc" }
  });

  const history = await prisma.messageHistory.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: { device: true }
  });

  return (
    <div className="dashboard-container">
      <SendMessageClient devices={devices} contacts={contacts} history={history} />
    </div>
  );
}
