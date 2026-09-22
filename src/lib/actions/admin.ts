"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

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
      image: true,
      createdAt: true,
      _count: { select: { posts: true, comments: true } },
    },
  });
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
