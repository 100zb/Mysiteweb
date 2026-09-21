"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { commentSchema } from "@/lib/validations";

export type CommentActionState = {
  error?: string;
  success?: boolean;
};

export async function addComment(
  pathname: string,
  _prevState: CommentActionState,
  formData: FormData
): Promise<CommentActionState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Connecte-toi pour commenter." };
  }

  const parsed = commentSchema.safeParse({
    content: String(formData.get("content") ?? ""),
    postId: String(formData.get("postId") ?? ""),
    parentId: formData.get("parentId") ? String(formData.get("parentId")) : undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Commentaire invalide" };
  }

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      postId: parsed.data.postId,
      parentId: parsed.data.parentId,
      authorId: session.user.id,
    },
  });

  revalidatePath(pathname);
  return { success: true };
}

export async function deleteComment(commentId: string, pathname: string) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé" };

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return { error: "Commentaire introuvable" };
  if (comment.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "Non autorisé" };
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(pathname);
  return { success: true };
}
