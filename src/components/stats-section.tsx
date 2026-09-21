import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";

export async function StatsSection() {
  const [users, posts, comments] = await Promise.all([
    prisma.user.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.comment.count(),
  ]);

  const stats = [
    { value: users, label: "Membres" },
    { value: posts, label: "Articles publiés" },
    { value: comments, label: "Commentaires" },
  ];

  return (
    <section className="border-y border-black/5 bg-black/[0.015] dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 px-4 py-16 sm:px-6">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.1} className="text-center">
            <p className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">{stat.label}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
