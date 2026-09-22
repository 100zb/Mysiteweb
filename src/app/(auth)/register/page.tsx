import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Rejoins la communauté et commence à publier.",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <FadeIn>
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Nova<span className="text-violet-500">.</span>
          </Link>
          <h1 className="mt-4 text-xl font-semibold">Rejoins la communauté</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Crée ton compte pour publier et échanger.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            {settings.registrationOpen ? (
              <RegisterForm />
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-sm text-black/70 dark:text-white/70">
                  Les inscriptions sont fermées pour le moment.
                </p>
                <Link href="/login" className="text-sm text-violet-600 hover:underline dark:text-violet-400">
                  Tu as déjà un compte ? Connecte-toi
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
