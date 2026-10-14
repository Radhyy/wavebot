import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session?.id) {
    redirect("/login");
  }

  // Ambil profil user terkini dari database
  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        googleId: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Settings DB fetch error:", error);
  }

  return (
    <SettingsClient
      initialName={user?.name || session.name || "User"}
      initialEmail={user?.email || session.email || ""}
      initialAvatar={user?.avatar || session.avatar || null}
      isGoogleUser={!!user?.googleId}
      createdAt={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
    />
  );
}
