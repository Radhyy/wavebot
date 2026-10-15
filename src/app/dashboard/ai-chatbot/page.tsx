import { getSession } from "@/lib/auth";
import { getAiConfig } from "@/app/actions/aiConfig";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AiChatbotClient from "./AiChatbotClient";

export const metadata = {
  title: "AI Chatbot | WaveBot",
};

export default async function AiChatbotPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [aiConfig, devices, user] = await Promise.all([
    getAiConfig(),
    prisma.device.findMany({
      where: { userId: session.id },
      select: { id: true, name: true, number: true, status: true }
    }),
    (prisma as any).user.findUnique({
      where: { id: session.id }
    })
  ]);

  return (
    <div className="dashboard-container">
      <AiChatbotClient 
        initialConfig={aiConfig} 
        devices={devices} 
        userPlan={user?.plan || "FREE"}
      />
    </div>
  );
}
