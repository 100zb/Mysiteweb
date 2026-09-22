import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getUsersForAdmin } from "@/lib/actions/admin";
import { getSiteSettings } from "@/lib/settings";
import { UserTable } from "@/components/admin/user-table";
import { RegistrationToggle } from "@/components/admin/registration-toggle";

export const metadata: Metadata = { title: "Administration" };

export default async function AdminPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") notFound();

  const [users, settings] = await Promise.all([getUsersForAdmin(), getSiteSettings()]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Gère les comptes et les réglages du site. Réservé aux admins.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Inscriptions</h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Contrôle si de nouveaux visiteurs peuvent créer un compte.
        </p>
        <div className="mt-4">
          <RegistrationToggle initialOpen={settings.registrationOpen} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">
          Utilisateurs <span className="text-black/40 dark:text-white/40">({users.length})</span>
        </h2>
        <div className="mt-4">
          <UserTable users={users} currentUserId={session.user.id} />
        </div>
      </section>
    </div>
  );
}
