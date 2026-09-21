import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { FeaturesSection } from "@/components/features-section";
import { StatsSection } from "@/components/stats-section";
import { PostCard } from "@/components/post-card";
import { FadeIn } from "@/components/motion/fade-in";
import { getFeaturedPosts } from "@/lib/posts";

export default async function Home() {
  const featuredPosts = await getFeaturedPosts(3);

  return (
    <>
      <Hero />
      <StatsSection />

      {featuredPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <FadeIn className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">À la une</h2>
              <p className="mt-2 text-black/60 dark:text-white/60">
                Les articles les plus lus du moment.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400 sm:flex"
            >
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post, i) => (
              <FadeIn key={post.id} delay={i * 0.08}>
                <PostCard post={post} />
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      <FeaturesSection />

      <section className="mx-auto max-w-4xl px-4 pb-28 sm:px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 px-8 py-16 text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Prêt à partager ton histoire ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Rejoins Nova aujourd&apos;hui et commence à publier en quelques minutes.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-violet-700 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Créer mon compte <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
