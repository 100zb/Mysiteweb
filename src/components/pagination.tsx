import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pageCount,
  buildHref,
}: {
  page: number;
  pageCount: number;
  buildHref: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/15",
          page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-black/5 dark:hover:bg-white/5"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
            p === page
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white"
              : "border border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
          )}
        >
          {p}
        </Link>
      ))}

      <Link
        href={buildHref(Math.min(pageCount, page + 1))}
        aria-disabled={page >= pageCount}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/15",
          page >= pageCount ? "pointer-events-none opacity-40" : "hover:bg-black/5 dark:hover:bg-white/5"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
