"use client";

import * as React from "react";
import { useTransition } from "react";
import { setRegistrationOpenAction } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

export function RegistrationToggle({ initialOpen }: { initialOpen: boolean }) {
  const [open, setOpen] = React.useState(initialOpen);
  const [isPending, startTransition] = useTransition();

  const onToggle = () => {
    const next = !open;
    setOpen(next);
    startTransition(async () => {
      await setRegistrationOpenAction(next).catch(() => setOpen(!next));
    });
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <button
        type="button"
        onClick={onToggle}
        disabled={isPending}
        role="switch"
        aria-checked={open}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          open ? "bg-gradient-to-r from-violet-600 to-fuchsia-500" : "bg-black/15 dark:bg-white/15"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform",
            open ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      <div>
        <p className="text-sm font-medium">
          Inscriptions {open ? "ouvertes" : "fermées"}
        </p>
        <p className="text-xs text-black/50 dark:text-white/50">
          {open
            ? "N'importe qui peut créer un compte depuis /register."
            : "La page d'inscription affiche un message et bloque la création de compte."}
        </p>
      </div>
    </div>
  );
}
