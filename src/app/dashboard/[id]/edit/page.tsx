import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getCategories, getPostForEdit } from "@/lib/posts";
import { updatePost } from "@/lib/actions/posts";
import { PostForm } from "@/components/dashboard/post-form";

export const metadata: Metadata = { title: "Modifier l'article" };

export default async function EditPostPage({ params }: PageProps<"/dashboard/[id]/edit">) {
  const { id } = await params;
  const session = await auth();
  const [post, categories] = await Promise.all([getPostForEdit(id), getCategories()]);

  if (!post) notFound();
  if (post.authorId !== session?.user.id && session?.user.role !== "ADMIN") notFound();

  const boundAction = updatePost.bind(null, post.id);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Modifier l&apos;article</h1>

      <div className="mt-8 max-w-3xl">
        <PostForm
          action={boundAction}
          categories={categories}
          submitLabel="Enregistrer les modifications"
          defaultValues={{
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            categoryId: post.categoryId,
            tags: post.tags.map((t) => t.tag.name).join(", "),
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
