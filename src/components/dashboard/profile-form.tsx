"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateProfile, type ProfileActionState } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: ProfileActionState = {};

export function ProfileForm({
  defaultValues,
  username,
}: {
  defaultValues: { name: string; bio: string; image: string };
  username?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" defaultValue={defaultValues.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={4} defaultValue={defaultValues.bio} placeholder="Quelques mots sur toi…" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Photo de profil (URL)</Label>
        <Input id="image" name="image" defaultValue={defaultValues.image} placeholder="https://…" />
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-500">Profil mis à jour.</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
        {username && (
          <Link href={`/profile/${username}`} className="text-sm text-violet-600 hover:underline dark:text-violet-400">
            Voir mon profil public
          </Link>
        )}
      </div>
    </form>
  );
}
