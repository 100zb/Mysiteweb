"use client";

import { useActionState } from "react";
import { updateAccount, type ProfileActionState } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: ProfileActionState = {};

export function AccountForm({
  defaultValues,
}: {
  defaultValues: { username: string; email: string };
}) {
  const [state, formAction, isPending] = useActionState(updateAccount, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username">Pseudo</Label>
        <Input id="username" name="username" defaultValue={defaultValues.username} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={defaultValues.email} required />
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-500">Compte mis à jour.</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
