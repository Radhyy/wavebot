import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import DevicesClient from "./DevicesClient";

export const instant = false;

export default async function DevicesPage() {
  const session = await getSession();
  let devices: any[] = [];
  let userPlan = "FREE";
  
  if (session) {
    const [fetchedDevices, user] = await Promise.all([
      prisma.device.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" }
      }),
      (prisma as any).user.findUnique({
        where: { id: session.id },
      })
    ]);
    devices = fetchedDevices;
    userPlan = user?.plan || "FREE";
  }

  return (
    <div className="dashboard-container">
      <DevicesClient devices={devices} userPlan={userPlan} />
    </div>
  );
}
