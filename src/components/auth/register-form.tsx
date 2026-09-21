"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" placeholder="Ada Lovelace" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Pseudo</Label>
        <Input id="username" name="username" placeholder="ada" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="toi@exemple.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" placeholder="8 caractères minimum" required />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Création…" : "Créer mon compte"}
      </Button>

      <p className="text-center text-sm text-black/60 dark:text-white/60">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-violet-600 dark:text-violet-400 hover:underline">
          Connecte-toi
        </Link>
      </p>
    </form>
  );
}
