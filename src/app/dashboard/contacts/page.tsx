import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ContactsClient from "./ContactsClient";

export default async function ContactsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const contacts = await prisma.contact.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="dashboard-container">
      <ContactsClient initialData={contacts} />
    </div>
  );
}
