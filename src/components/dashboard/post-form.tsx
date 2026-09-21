"use client";

import * as React from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/markdown-content";
import { cn } from "@/lib/utils";
import type { PostActionState } from "@/lib/actions/posts";

type Category = { id: string; name: string };

type ActionFn = (state: PostActionState, formData: FormData) => Promise<PostActionState>;

export function PostForm({
  action,
  categories,
  defaultValues,
  submitLabel = "Publier",
}: {
  action: ActionFn;
  categories: Category[];
  defaultValues?: {
    title?: string;
    excerpt?: string | null;
    content?: string;
    coverImage?: string | null;
    categoryId?: string | null;
    tags?: string;
    published?: boolean;
  };
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [content, setContent] = React.useState(defaultValues?.content ?? "");
  const [tab, setTab] = React.useState<"write" | "preview">("write");

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          placeholder="Un titre percutant"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Résumé</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={defaultValues?.excerpt ?? ""}
          placeholder="Une ou deux phrases qui donnent envie de lire"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">Contenu (Markdown)</Label>
          <div className="flex overflow-hidden rounded-full border border-black/10 text-xs dark:border-white/15">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={cn("px-3 py-1", tab === "write" && "bg-violet-500 text-white")}
            >
              Écrire
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={cn("px-3 py-1", tab === "preview" && "bg-violet-500 text-white")}
            >
              Aperçu
            </button>
          </div>
        </div>

        {tab === "write" ? (
          <Textarea
            id="content"
            name="content"
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Bonjour le monde&#10;&#10;Écris ton article en Markdown…"
            className="font-mono text-sm"
            required
          />
        ) : (
          <div className="min-h-[300px] rounded-xl border border-black/10 p-4 dark:border-white/15">
            {content ? (
              <MarkdownContent content={content} />
            ) : (
              <p className="text-sm text-black/40 dark:text-white/40">Rien à prévisualiser.</p>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="coverImage">Image de couverture (URL)</Label>
          <Input
            id="coverImage"
            name="coverImage"
            defaultValue={defaultValues?.coverImage ?? ""}
            placeholder="https://…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Catégorie</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={defaultValues?.categoryId ?? ""}
            className="flex h-11 w-full rounded-xl border border-black/10 bg-white/60 px-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/15 dark:bg-white/5"
          >
            <option value="">Aucune</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
        <Input id="tags" name="tags" defaultValue={defaultValues?.tags ?? ""} placeholder="react, design, tutoriel" />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={defaultValues?.published ?? false}
          className="h-4 w-4 rounded border-black/20 accent-violet-600"
        />
        <Label htmlFor="published" className="cursor-pointer">
          Publier immédiatement
        </Label>
      </div>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement…" : submitLabel}
      </Button>
    </form>
  );
}
