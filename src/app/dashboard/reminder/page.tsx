import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ReminderClient from "./ReminderClient";

export const metadata = {
  title: "Reminder | WaveBot",
};

export default async function ReminderPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const reminders = await prisma.reminder.findMany({
    where: { userId: session.id },
    orderBy: { schedule: "asc" }
  });

  const devices = await prisma.device.findMany({
    where: { userId: session.id },
    select: { id: true, name: true, number: true, status: true }
  });

  const contacts = await prisma.contact.findMany({
    where: { userId: session.id },
    orderBy: { name: "asc" }
  });

  return (
    <div className="dashboard-container">
      <ReminderClient reminders={reminders} devices={devices} contacts={contacts} />
    </div>
  );
}
