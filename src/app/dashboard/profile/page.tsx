import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { AccountForm } from "@/components/dashboard/account-form";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Gère ton profil, ton compte et ta sécurité.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Profil public</h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Visible par tout le monde sur ta page de profil.
        </p>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <ProfileForm
              defaultValues={{
                name: user?.name ?? "",
                bio: user?.bio ?? "",
                image: user?.image ?? "",
              }}
              username={user?.username}
            />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Compte</h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Ton pseudo (utilisé dans ton URL de profil) et ton email de connexion.
        </p>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <AccountForm
              defaultValues={{
                username: user?.username ?? "",
                email: user?.email ?? "",
              }}
            />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Mot de passe</h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Change ton mot de passe de connexion.
        </p>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
