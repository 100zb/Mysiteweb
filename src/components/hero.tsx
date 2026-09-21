"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-violet-500/25 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-1/4 top-40 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-medium text-black/70 backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            Une nouvelle façon d&apos;écrire, ensemble
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl"
        >
          Écris. Partage.{" "}
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
            Connecte.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-lg text-black/60 dark:text-white/60"
        >
          Nova est l&apos;endroit où les idées prennent vie. Publie tes articles, échange
          avec une communauté de passionnés et fais grandir ton audience.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
            Commencer à écrire <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/blog" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Explorer les articles
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
