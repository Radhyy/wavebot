import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardOverview() {
  const session = await getSession();
  if (!session) redirect('/login');

  const userId = session.id;

  let user = null;
  try {
    user = await prisma.user.findUnique({ where: { id: userId } });
  } catch (e) {}

  // Jika akun adalah ADMIN, arahkan otomatis langsung ke Dashboard Admin
  if (user?.role === "ADMIN" || user?.email === "raaakb87@gmail.com" || session.role === "ADMIN" || session.email === "raaakb87@gmail.com") {
    redirect("/dashboard/admin");
  }

  let devicesCount = 0;
  let messagesCount = 0;
  let autoRepliesCount = 0;
  let menusCount = 0;

  try {
    const results = await Promise.all([
      prisma.device.count({ where: { userId } }),
      prisma.messageHistory.count({ where: { userId } }),
      prisma.autoReply.count({ where: { userId } }),
      prisma.interactiveMenu.count({ where: { userId } }),
    ]);
    devicesCount = results[0];
    messagesCount = results[1];
    autoRepliesCount = results[2];
    menusCount = results[3];
  } catch (error) {
    console.error("Dashboard DB fetch error (possible cold start):", error);
    try {
      await new Promise(r => setTimeout(r, 1500));
      const results = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.device.count({ where: { userId } }),
        prisma.messageHistory.count({ where: { userId } }),
        prisma.autoReply.count({ where: { userId } }),
        prisma.interactiveMenu.count({ where: { userId } }),
      ]);
      user = results[0];
      devicesCount = results[1];
      messagesCount = results[2];
      autoRepliesCount = results[3];
      menusCount = results[4];
    } catch (e2) {
      console.error("Second attempt failed:", e2);
    }
  }

  // Fetch real 24-hour message volume & recent activities
  let hourlyData: { time: string; volume: number }[] = [];
  let recentActivities: any[] = [];

  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [messages24h, latestMessages] = await Promise.all([
      prisma.messageHistory.findMany({
        where: {
          userId,
          createdAt: { gte: since24h }
        },
        select: {
          createdAt: true
        }
      }),
      prisma.messageHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          device: {
            select: { name: true }
          }
        }
      })
    ]);

    // Initialize 24 hour buckets from 00 to 23
    const volumeByHour: Record<string, number> = {};
    for (let i = 0; i < 24; i++) {
      const hStr = String(i).padStart(2, "0");
      volumeByHour[hStr] = 0;
    }

    messages24h.forEach((msg) => {
      const h = String(new Date(msg.createdAt).getHours()).padStart(2, "0");
      if (volumeByHour[h] !== undefined) {
        volumeByHour[h]++;
      }
    });

    hourlyData = Object.keys(volumeByHour)
      .sort()
      .map((time) => ({
        time,
        volume: volumeByHour[time]
      }));

    recentActivities = latestMessages.map((m) => ({
      id: m.id,
      target: m.target,
      message: m.message,
      status: m.status,
      deviceName: m.device?.name || "WhatsApp",
      createdAt: m.createdAt.toISOString()
    }));
  } catch (err) {
    console.error("Error fetching message analytics:", err);
    // Fallback buckets if query fails
    for (let i = 0; i < 24; i++) {
      hourlyData.push({ time: String(i).padStart(2, "0"), volume: 0 });
    }
  }

  const stats = {
    devices: devicesCount,
    messages: messagesCount,
    autoReplies: autoRepliesCount,
    menus: menusCount
  };

  return (
    <DashboardClient 
      userName={user?.name || 'User'} 
      userPlan={(user as any)?.plan || 'FREE'}
      stats={stats} 
      hourlyData={hourlyData} 
      recentActivities={recentActivities} 
    />
  );
}
