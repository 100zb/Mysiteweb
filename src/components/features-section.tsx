import { PenLine, MessageSquare, Heart, Users, Search, Moon } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

const features = [
  {
    icon: PenLine,
    title: "Éditeur Markdown",
    description: "Rédige avec du Markdown enrichi : code, citations, listes, images.",
  },
  {
    icon: MessageSquare,
    title: "Discussions threadées",
    description: "Des commentaires et réponses imbriquées pour de vrais échanges.",
  },
  {
    icon: Heart,
    title: "Réactions en temps réel",
    description: "Aime les articles qui te marquent, en un clic.",
  },
  {
    icon: Users,
    title: "Profils & auteurs",
    description: "Chaque membre a son profil public avec ses publications.",
  },
  {
    icon: Search,
    title: "Recherche instantanée",
    description: "Filtre par catégorie, tag ou mot-clé en un instant.",
  },
  {
    icon: Moon,
    title: "Thème clair / sombre",
    description: "Une interface soignée, de jour comme de nuit.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Tout ce qu&apos;il faut pour publier
        </h2>
        <p className="mt-4 text-black/60 dark:text-white/60">
          Une plateforme pensée pour les créateurs de contenu et leur communauté.
        </p>
      </FadeIn>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <FadeIn key={feature.title} delay={i * 0.06}>
            <div className="group h-full rounded-2xl border border-black/5 bg-white/60 p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">{feature.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
