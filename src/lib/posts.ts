import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export const PAGE_SIZE = 9;

const postCardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
  readingTime: true,
  viewCount: true,
  author: {
    select: { id: true, name: true, username: true, image: true },
  },
  category: { select: { name: true, slug: true } },
  tags: { select: { tag: { select: { name: true, slug: true } } } },
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.PostSelect;

export type PostCard = Prisma.PostGetPayload<{ select: typeof postCardSelect }>;

export async function getPublishedPosts({
  q,
  category,
  tag,
  page = 1,
}: {
  q?: string;
  category?: string;
  tag?: string;
  page?: number;
}) {
  const where: Prisma.PostWhereInput = {
    published: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: postCardSelect,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getFeaturedPosts(take = 3) {
  return prisma.post.findMany({
    where: { published: true },
    select: postCardSelect,
    orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
    take,
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, username: true, image: true, bio: true } },
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

export async function incrementPostViews(id: string) {
  await prisma.post.update({ where: { id }, data: { viewCount: { increment: 1 } } });
}

export async function getRelatedPosts(postId: string, categoryId: string | null, take = 3) {
  if (!categoryId) return [];
  return prisma.post.findMany({
    where: { published: true, categoryId, NOT: { id: postId } },
    select: postCardSelect,
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function getUserPosts(authorId: string) {
  return prisma.post.findMany({
    where: { authorId },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      publishedAt: true,
      viewCount: true,
      updatedAt: true,
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });
}

const commentAuthorSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
} satisfies Prisma.UserSelect;

export async function getPostComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId, parentId: null, status: "VISIBLE" },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: commentAuthorSelect },
      replies: {
        where: { status: "VISIBLE" },
        orderBy: { createdAt: "asc" },
        include: { author: { select: commentAuthorSelect } },
      },
    },
  });
}

export type PostComment = Awaited<ReturnType<typeof getPostComments>>[number];

export async function getPostForEdit(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });
}

export async function getUserPublishedPosts(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId, published: true },
    select: postCardSelect,
    orderBy: { publishedAt: "desc" },
  });
}

export async function getLikedPostsForUser(userId: string) {
  const likes = await prisma.like.findMany({
    where: { userId, post: { published: true } },
    orderBy: { createdAt: "desc" },
    select: { post: { select: postCardSelect } },
  });
  return likes.map((like) => like.post);
}
