"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { profileSchema } from "@/lib/validations";

export type ProfileActionState = {
  error?: string;
  success?: boolean;
};

export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    image: String(formData.get("image") ?? ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      image: parsed.data.image || null,
    },
  });

  if (user.username) revalidatePath(`/profile/${user.username}`);
  revalidatePath("/dashboard/profile");
  return { success: true };
}
