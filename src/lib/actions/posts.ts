"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { postSchema } from "@/lib/validations";
import { slugify, estimateReadingTime } from "@/lib/utils";
import { notifyNewPost } from "@/lib/notifications";

export type PostActionState = {
  error?: string;
};

async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title) || "article";
  let slug = base;
  let suffix = 1;

  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

async function syncTags(postId: string, tagsInput: string) {
  const names = Array.from(
    new Set(
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    )
  );

  await prisma.postTag.deleteMany({ where: { postId } });

  for (const name of names) {
    const slug = slugify(name);
    if (!slug) continue;
    const tag = await prisma.tag.upsert({
      where: { slug },
      create: { name, slug },
      update: {},
    });
    await prisma.postTag.create({ data: { postId, tagId: tag.id } });
  }
}

function parsePostForm(formData: FormData) {
  return postSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    published: formData.get("published") === "on",
  });
}

export async function createPost(
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const user = await requireUser();
  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const { title, excerpt, content, coverImage, categoryId, tags, published } = parsed.data;
  const slug = await uniqueSlug(title);

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      categoryId: categoryId || null,
      published,
      publishedAt: published ? new Date() : null,
      readingTime: estimateReadingTime(content),
      authorId: user.id,
    },
  });

  if (tags) await syncTags(post.id, tags);
  if (published) await notifyNewPost(user.id, post.id);

  revalidatePath("/dashboard");
  revalidatePath("/blog");
  redirect("/dashboard");
}

export async function updatePost(
  postId: string,
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const user = await requireUser();
  const existing = await prisma.post.findUnique({ where: { id: postId } });
  if (!existing || (existing.authorId !== user.id && user.role !== "ADMIN")) {
    return { error: "Non autorisé" };
  }

  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const { title, excerpt, content, coverImage, categoryId, tags, published } = parsed.data;
  const slug = title !== existing.title ? await uniqueSlug(title, postId) : existing.slug;
  const isNewlyPublished = published && !existing.publishedAt;

  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      categoryId: categoryId || null,
      published,
      publishedAt: isNewlyPublished ? new Date() : existing.publishedAt,
      readingTime: estimateReadingTime(content),
    },
  });

  await syncTags(postId, tags ?? "");
  if (isNewlyPublished) await notifyNewPost(user.id, postId);

  revalidatePath("/dashboard");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/dashboard");
}

export async function deletePost(postId: string) {
  const user = await requireUser();
  const existing = await prisma.post.findUnique({ where: { id: postId } });
  if (!existing || (existing.authorId !== user.id && user.role !== "ADMIN")) {
    return { error: "Non autorisé" };
  }

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/dashboard");
  revalidatePath("/blog");
  return { success: true };
}

export async function togglePublish(postId: string) {
  const user = await requireUser();
  const existing = await prisma.post.findUnique({ where: { id: postId } });
  if (!existing || (existing.authorId !== user.id && user.role !== "ADMIN")) {
    return { error: "Non autorisé" };
  }

  const isNewlyPublished = !existing.published && !existing.publishedAt;

  await prisma.post.update({
    where: { id: postId },
    data: {
      published: !existing.published,
      publishedAt: isNewlyPublished ? new Date() : existing.publishedAt,
    },
  });

  if (isNewlyPublished) await notifyNewPost(user.id, postId);

  revalidatePath("/dashboard");
  revalidatePath("/blog");
  return { success: true };
}
