"use client";

import { useActionState } from "react";
import { createUserAction, type AdminCreateUserState } from "@/lib/actions/admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: AdminCreateUserState = {};

export function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(createUserAction, initialState);

  return (
    <form
      action={formAction}
      key={state.success ? "reset" : "form"}
      className="grid gap-4 rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:grid-cols-2"
    >
      <div className="space-y-2">
        <Label htmlFor="new-name">Nom</Label>
        <Input id="new-name" name="name" placeholder="Ada Lovelace" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-username">Pseudo</Label>
        <Input id="new-username" name="username" placeholder="ada" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-email">Email</Label>
        <Input id="new-email" name="email" type="email" placeholder="ada@exemple.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">Mot de passe</Label>
        <Input id="new-password" name="password" type="password" placeholder="8 caractères minimum" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-role">Rôle</Label>
        <select
          id="new-role"
          name="role"
          defaultValue="USER"
          className="flex h-11 w-full rounded-xl border border-black/10 bg-white/60 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/15 dark:bg-white/5"
        >
          <option value="USER">USER</option>
          <option value="AUTHOR">AUTHOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Création…" : "Créer le compte"}
        </Button>
      </div>

      {state.error && <p className="text-sm text-red-500 sm:col-span-2">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-emerald-500 sm:col-span-2">Compte créé avec succès.</p>
      )}
    </form>
  );
}
