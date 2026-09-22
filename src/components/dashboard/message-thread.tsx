"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { sendMessage, type MessageActionState } from "@/lib/actions/messages";
import { formatRelativeTime, cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  createdAt: string | Date;
  senderId: string;
};

const initialState: MessageActionState = {};

export function MessageThread({
  currentUserId,
  otherUserId,
  otherUsername,
  messages,
}: {
  currentUserId: string;
  otherUserId: string;
  otherUsername: string;
  messages: Message[];
}) {
  const boundAction = sendMessage.bind(null, otherUserId, otherUsername);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    if (!state.error) formRef.current?.reset();
  }, [state]);

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-black/10 dark:border-white/10">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-black/50 dark:text-white/50">
            Aucun message pour l&apos;instant. Dis bonjour !
          </p>
        ) : (
          messages.map((m) => {
            const isOwn = m.senderId === currentUserId;
            return (
              <div key={m.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                    isOwn
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white"
                      : "bg-black/5 dark:bg-white/10"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  <p className={cn("mt-1 text-[10px]", isOwn ? "text-white/70" : "text-black/40 dark:text-white/40")}>
                    {formatRelativeTime(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form ref={formRef} action={formAction} className="flex items-center gap-2 border-t border-black/10 p-3 dark:border-white/10">
        <input
          name="content"
          placeholder="Écris un message…"
          required
          autoComplete="off"
          className="flex-1 rounded-full border border-black/10 bg-transparent px-4 py-2 text-sm outline-none focus:border-violet-500 dark:border-white/15"
        />
        <button
          type="submit"
          disabled={isPending}
          aria-label="Envoyer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      {state.error && <p className="px-4 pb-3 text-sm text-red-500">{state.error}</p>}
    </div>
  );
}
