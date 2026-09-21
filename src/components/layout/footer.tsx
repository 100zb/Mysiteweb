import Link from "next/link";
import { Code2, Rss, AtSign } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
          <span className="font-semibold text-black dark:text-white">Nova.</span>
          <span>© {new Date().getFullYear()} — construit avec Next.js</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/blog" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white">
            Articles
          </Link>
          <Link href="/feed.xml" aria-label="Flux RSS" className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white">
            <Rss className="h-4 w-4" />
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white">
            <Code2 className="h-4 w-4" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white">
            <AtSign className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
