"use client";

import * as React from "react";
import { useTransition } from "react";
import { Trash2, Ban, RotateCcw } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { deleteUserAction, setUserRoleAction, setUserSuspendedAction } from "@/lib/actions/admin";
import { formatDate, cn } from "@/lib/utils";

type AdminUser = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: string;
  suspended: boolean;
  image: string | null;
  createdAt: Date;
  _count: { posts: number; comments: number };
};

const roles = ["USER", "AUTHOR", "ADMIN"] as const;

export function UserTable({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-black/[0.03] text-left text-xs uppercase tracking-wide text-black/50 dark:bg-white/[0.03] dark:text-white/50">
          <tr>
            <th className="px-4 py-3">Utilisateur</th>
            <th className="px-4 py-3">Rôle</th>
            <th className="px-4 py-3">Contenu</th>
            <th className="px-4 py-3">Inscrit le</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 dark:divide-white/10">
          {users.map((user) => (
            <tr key={user.id} className={cn(user.suspended && "bg-red-500/5")}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} src={user.image} size={32} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name ?? "—"}</p>
                      {user.suspended && <Badge variant="outline" className="border-red-500/40 text-red-500">Suspendu</Badge>}
                    </div>
                    <p className="text-xs text-black/50 dark:text-white/50">
                      @{user.username ?? "?"} · {user.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <select
                  defaultValue={user.role}
                  disabled={isPending}
                  onChange={(e) => {
                    setError(null);
                    const role = e.target.value as (typeof roles)[number];
                    startTransition(async () => {
                      const result = await setUserRoleAction(user.id, role);
                      if (result?.error) setError(result.error);
                    });
                  }}
                  className="rounded-lg border border-black/10 bg-transparent px-2 py-1 text-sm dark:border-white/15"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-black/60 dark:text-white/60">
                {user._count.posts} article{user._count.posts !== 1 ? "s" : ""} ·{" "}
                {user._count.comments} commentaire{user._count.comments !== 1 ? "s" : ""}
              </td>
              <td className="px-4 py-3 text-black/60 dark:text-white/60">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    disabled={isPending || user.id === currentUserId}
                    onClick={() => {
                      setError(null);
                      startTransition(async () => {
                        const result = await setUserSuspendedAction(user.id, !user.suspended);
                        if (result?.error) setError(result.error);
                      });
                    }}
                    className={cn(
                      "rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5",
                      user.suspended ? "text-emerald-500" : "text-amber-500",
                      user.id === currentUserId && "cursor-not-allowed opacity-30"
                    )}
                    aria-label={user.suspended ? "Réactiver" : "Suspendre"}
                    title={
                      user.id === currentUserId
                        ? "Tu ne peux pas te suspendre toi-même"
                        : user.suspended
                          ? "Réactiver"
                          : "Suspendre"
                    }
                  >
                    {user.suspended ? <RotateCcw className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    disabled={isPending || user.id === currentUserId}
                    onClick={() => {
                      setError(null);
                      if (!confirm(`Supprimer le compte de ${user.name ?? user.username} ? Cette action est irréversible.`)) {
                        return;
                      }
                      startTransition(async () => {
                        const result = await deleteUserAction(user.id);
                        if (result?.error) setError(result.error);
                      });
                    }}
                    className={cn(
                      "rounded-full p-2 text-red-500 hover:bg-red-500/10",
                      user.id === currentUserId && "cursor-not-allowed opacity-30"
                    )}
                    aria-label="Supprimer"
                    title={user.id === currentUserId ? "Tu ne peux pas te supprimer toi-même" : "Supprimer"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="px-4 py-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
