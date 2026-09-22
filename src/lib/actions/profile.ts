"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { profileSchema, accountSchema, changePasswordSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

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

  if (parsed.data.image && parsed.data.image.length > 2_000_000) {
    return { error: "L'image est trop lourde." };
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

export async function updateAccount(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const user = await requireUser();

  const parsed = accountSchema.safeParse({
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const username = slugify(parsed.data.username);
  const email = parsed.data.email;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }], NOT: { id: user.id } },
  });
  if (existing) {
    return { error: "Cet email ou pseudo est déjà utilisé par un autre compte." };
  }

  await prisma.user.update({ where: { id: user.id }, data: { username, email } });

  revalidatePath(`/profile/${username}`);
  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function changePassword(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const user = await requireUser();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.password) {
    return { error: "Ce compte n'a pas de mot de passe local." };
  }

  const isValid = await bcrypt.compare(parsed.data.currentPassword, dbUser.password);
  if (!isValid) {
    return { error: "Mot de passe actuel incorrect." };
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  return { success: true };
}
