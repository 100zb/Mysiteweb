"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { updateProfile, type ProfileActionState } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/avatar";

const initialState: ProfileActionState = {};

const MAX_SOURCE_SIZE = 8 * 1024 * 1024; // 8MB raw file before resizing
const AVATAR_SIZE = 320; // px, square

function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image invalide"));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;

        const canvas = document.createElement("canvas");
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Recadrage impossible"));
          return;
        }
        ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ProfileForm({
  defaultValues,
  username,
}: {
  defaultValues: { name: string; bio: string; image: string };
  username?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);
  const [image, setImage] = useState(defaultValues.image);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImageError(null);

    if (!file.type.startsWith("image/")) {
      setImageError("Le fichier doit être une image.");
      return;
    }
    if (file.size > MAX_SOURCE_SIZE) {
      setImageError("L'image est trop lourde (8 Mo maximum).");
      return;
    }

    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setImage(dataUrl);
    } catch {
      setImageError("Impossible de traiter cette image, réessaie avec un autre fichier.");
    }
  }

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
        <Label>Photo de profil</Label>
        <div className="flex items-center gap-4">
          <Avatar name={defaultValues.name} src={image} size={64} />
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Importer une photo
              </Button>
              {image && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setImage("")}>
                  Retirer
                </Button>
              )}
            </div>
            <p className="text-xs text-black/50 dark:text-white/50">JPG, PNG ou GIF. Recadrée automatiquement.</p>
          </div>
        </div>
        {imageError && <p className="text-sm text-red-500">{imageError}</p>}
        <input type="hidden" name="image" value={image} />
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
