import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Rejoins la communauté et commence à publier.",
};

export default function RegisterPage() {
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
            <RegisterForm />
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
