import type { Metadata } from "next";
import { getCategories } from "@/lib/posts";
import { createPost } from "@/lib/actions/posts";
import { PostForm } from "@/components/dashboard/post-form";

export const metadata: Metadata = { title: "Nouvel article" };

export default async function NewPostPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Nouvel article</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Rédige en Markdown, ajoute une catégorie et des tags.
      </p>

      <div className="mt-8 max-w-3xl">
        <PostForm action={createPost} categories={categories} submitLabel="Enregistrer" />
      </div>
    </div>
  );
}
