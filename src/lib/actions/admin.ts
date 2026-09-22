"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { adminCreateUserSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function getUsersForAdmin() {
  await requireAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      suspended: true,
      image: true,
      createdAt: true,
      _count: { select: { posts: true, comments: true } },
    },
  });
}

export type AdminCreateUserState = {
  error?: string;
  success?: boolean;
};

export async function createUserAction(
  _prevState: AdminCreateUserState,
  formData: FormData
): Promise<AdminCreateUserState> {
  await requireAdmin();

  const parsed = adminCreateUserSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "USER"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const { name, email, password, role } = parsed.data;
  const username = slugify(parsed.data.username);

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email ou pseudo" };
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, username, password: hashed, role } });

  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  const admin = await requireAdmin();
  if (userId === admin.id) {
    return { error: "Tu ne peux pas supprimer ton propre compte." };
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function setUserRoleAction(userId: string, role: "USER" | "AUTHOR" | "ADMIN") {
  const admin = await requireAdmin();
  if (userId === admin.id && role !== "ADMIN") {
    return { error: "Tu ne peux pas retirer ton propre rôle admin." };
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function setUserSuspendedAction(userId: string, suspended: boolean) {
  const admin = await requireAdmin();
  if (userId === admin.id) {
    return { error: "Tu ne peux pas suspendre ton propre compte." };
  }

  await prisma.user.update({ where: { id: userId }, data: { suspended } });
  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function setRegistrationOpenAction(open: boolean) {
  await requireAdmin();
  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: { registrationOpen: open },
    create: { id: "global", registrationOpen: open },
  });
  revalidatePath("/dashboard/admin");
  revalidatePath("/register");
  return { success: true };
}

export async function getAllPostsForAdmin() {
  await requireAdmin();
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      createdAt: true,
      author: { select: { name: true, username: true } },
    },
  });
}

export async function deletePostAsAdminAction(postId: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/dashboard/admin");
  revalidatePath("/blog");
  return { success: true };
}
