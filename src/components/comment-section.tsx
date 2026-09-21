"use client";

import * as React from "react";
import { useActionState, useTransition } from "react";
import Link from "next/link";
import { Trash2, Reply } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment, deleteComment, type CommentActionState } from "@/lib/actions/comments";
import { formatDate } from "@/lib/utils";
import type { PostComment } from "@/lib/posts";

const initialState: CommentActionState = {};

function CommentForm({
  postId,
  pathname,
  parentId,
  onDone,
}: {
  postId: string;
  pathname: string;
  parentId?: string;
  onDone?: () => void;
}) {
  const boundAction = addComment.bind(null, pathname);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="postId" value={postId} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <Textarea
        name="content"
        rows={parentId ? 2 : 3}
        placeholder={parentId ? "Écris une réponse…" : "Partage ton avis…"}
        required
      />
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Envoi…" : parentId ? "Répondre" : "Commenter"}
      </Button>
    </form>
  );
}

function CommentItem({
  comment,
  pathname,
  currentUserId,
}: {
  comment: PostComment | PostComment["replies"][number];
  pathname: string;
  currentUserId?: string;
}) {
  const [replying, setReplying] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const canDelete = currentUserId === comment.authorId;
  const replies = "replies" in comment ? comment.replies : [];

  return (
    <div className="flex gap-3">
      <Avatar name={comment.author.name} src={comment.author.image} size={36} />
      <div className="flex-1">
        <div className="rounded-2xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${comment.author.username}`} className="text-sm font-semibold hover:underline">
              {comment.author.name ?? comment.author.username}
            </Link>
            <span className="text-xs text-black/40 dark:text-white/40">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-sm text-black/80 dark:text-white/80">
            {comment.content}
          </p>
        </div>

        <div className="mt-1 flex items-center gap-3 px-1 text-xs text-black/50 dark:text-white/50">
          {"replies" in comment && (
            <button onClick={() => setReplying((v) => !v)} className="flex items-center gap-1 hover:text-black dark:hover:text-white">
              <Reply className="h-3.5 w-3.5" /> Répondre
            </button>
          )}
          {canDelete && (
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await deleteComment(comment.id, pathname);
                })
              }
              className="flex items-center gap-1 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" /> Supprimer
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-3">
            <CommentForm
              postId={comment.postId}
              pathname={pathname}
              parentId={comment.id}
              onDone={() => setReplying(false)}
            />
          </div>
        )}

        {replies.length > 0 && (
          <div className="mt-4 space-y-4 border-l border-black/5 pl-4 dark:border-white/10">
            {replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} pathname={pathname} currentUserId={currentUserId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentSection({
  postId,
  pathname,
  comments,
  isAuthenticated,
  currentUserId,
}: {
  postId: string;
  pathname: string;
  comments: PostComment[];
  isAuthenticated: boolean;
  currentUserId?: string;
}) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">
        {comments.length} commentaire{comments.length !== 1 ? "s" : ""}
      </h2>

      {isAuthenticated ? (
        <CommentForm postId={postId} pathname={pathname} />
      ) : (
        <p className="text-sm text-black/60 dark:text-white/60">
          <Link href="/login" className="text-violet-600 hover:underline dark:text-violet-400">
            Connecte-toi
          </Link>{" "}
          pour rejoindre la discussion.
        </p>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} pathname={pathname} currentUserId={currentUserId} />
        ))}
      </div>
    </div>
  );
}
