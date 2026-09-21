import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function readingTime(content: string): number {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

async function main() {
  console.log("Nettoyage de la base…");
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 12);

  console.log("Création des utilisateurs…");
  const [ada, linus, grace] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Ada Lovelace",
        username: "ada",
        email: "ada@nova.app",
        password,
        role: "ADMIN",
        bio: "Autrice, développeuse et exploratrice d'idées. Je documente ce que j'apprends.",
        image: "https://i.pravatar.cc/200?img=47",
      },
    }),
    prisma.user.create({
      data: {
        name: "Linus Berg",
        username: "linus",
        email: "linus@nova.app",
        password,
        role: "AUTHOR",
        bio: "Passionné de systèmes et d'open source. J'écris sur l'architecture logicielle.",
        image: "https://i.pravatar.cc/200?img=12",
      },
    }),
    prisma.user.create({
      data: {
        name: "Grace Moreau",
        username: "grace",
        email: "grace@nova.app",
        password,
        role: "AUTHOR",
        bio: "Designer produit. J'explore l'intersection entre design et code.",
        image: "https://i.pravatar.cc/200?img=32",
      },
    }),
  ]);

  console.log("Création des catégories et tags…");
  const categoryNames = ["Technologie", "Design", "Productivité", "Carrière"];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.create({
        data: {
          name,
          slug: slugify(name),
          description: `Tout sur ${name.toLowerCase()}.`,
        },
      })
    )
  );

  const tagNames = ["nextjs", "react", "typescript", "ux", "carriere", "outils", "ia", "architecture"];
  const tags = await Promise.all(
    tagNames.map((name) => prisma.tag.create({ data: { name, slug: slugify(name) } }))
  );

  const tagBySlug = (slug: string) => tags.find((t) => t.slug === slug)!;

  console.log("Création des articles…");
  const postsData = [
    {
      title: "Pourquoi j'ai migré mon stack vers Next.js 16",
      excerpt: "Retour d'expérience sur la migration d'une app React classique vers Next.js App Router.",
      author: linus,
      category: categories[0],
      tags: ["nextjs", "react", "architecture"],
      content: `# Une migration en douceur

Après deux ans sur une stack React + Express classique, j'ai finalement sauté le pas vers **Next.js**. Voici ce que j'ai appris.

## Pourquoi migrer

- Le rendu serveur simplifie énormément la gestion du SEO
- Les Server Actions remplacent élégamment nos routes API "maison"
- Le App Router encourage une meilleure organisation du code

## Les points de friction

La migration n'a pas été sans douleur. Voici un exemple de code qu'il a fallu adapter :

\`\`\`ts
export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return <Article post={post} />
}
\`\`\`

## Ce que je retiens

> "La meilleure architecture est celle qui disparaît derrière le produit."

Au final, cette migration nous a fait gagner en vélocité de développement, et nos métriques Core Web Vitals ont significativement progressé.`,
    },
    {
      title: "Les fondamentaux d'un bon design system",
      excerpt: "Tokens, composants, documentation : comment construire un design system qui tient dans le temps.",
      author: grace,
      category: categories[1],
      tags: ["ux", "outils"],
      content: `# Construire un design system durable

Un bon design system repose sur trois piliers : **cohérence**, **documentation** et **gouvernance**.

## 1. Les tokens

Les tokens de design (couleurs, espacements, typographies) doivent être la source de vérité unique.

## 2. Les composants

Chaque composant doit être testé isolément, avec des variantes claires et documentées.

## 3. La gouvernance

Sans processus de contribution clair, un design system se dégrade rapidement. Définissez qui peut proposer des changements et comment ils sont validés.

Un design system n'est jamais "terminé" — c'est un produit vivant qui évolue avec votre organisation.`,
    },
    {
      title: "5 habitudes pour rester productif en tant que développeur",
      excerpt: "Des techniques simples et concrètes pour mieux gérer son temps et son énergie.",
      author: ada,
      category: categories[2],
      tags: ["carriere", "outils"],
      content: `# Productivité et développement

Après dix ans dans le métier, voici les habitudes qui ont le plus changé ma façon de travailler.

## 1. Le time-boxing

Allouer un temps fixe à chaque tâche évite la procrastination et le perfectionnisme excessif.

## 2. La règle des deux minutes

Si une tâche prend moins de deux minutes, faites-la immédiatement plutôt que de la planifier.

## 3. Les revues de code asynchrones

Cela évite les interruptions constantes et laisse le temps à une réflexion plus posée.

## 4. Le "deep work"

Bloquez des créneaux sans notifications pour le travail qui demande une concentration totale.

## 5. Documenter au fur et à mesure

Écrire la documentation en même temps que le code économise un temps précieux plus tard.`,
    },
    {
      title: "Comment j'ai décroché mon premier poste de développeuse",
      excerpt: "Le parcours, les erreurs, et ce que je referais différemment.",
      author: grace,
      category: categories[3],
      tags: ["carriere"],
      content: `# Mon parcours vers le développement

Je n'ai pas suivi un parcours classique. Voici mon histoire, en toute transparence.

## Les débuts

J'ai commencé par des tutoriels en ligne, sans savoir vraiment où cela allait me mener.

## La difficulté du syndrome de l'imposteur

Le plus dur n'a pas été d'apprendre à coder, mais de croire que j'en étais capable.

## Ce qui a fait la différence

- Construire un portfolio de projets personnels
- Contribuer à des projets open source
- Ne jamais arrêter de poser des questions

Aujourd'hui, je conçois des interfaces pour des milliers d'utilisateurs. Le chemin est long, mais il en vaut la peine.`,
    },
    {
      title: "L'IA générative va-t-elle remplacer les développeurs ?",
      excerpt: "Un regard nuancé sur l'impact des outils d'IA dans notre métier.",
      author: linus,
      category: categories[0],
      tags: ["ia", "carriere"],
      content: `# IA et développement : mythes et réalités

L'IA générative a transformé notre façon d'écrire du code. Mais remplace-t-elle vraiment les développeurs ?

## Ce que l'IA fait bien

- Générer du code répétitif ou boilerplate
- Suggérer des solutions à des problèmes courants
- Accélérer la phase d'exploration

## Ce que l'IA ne remplace pas

- La compréhension du contexte métier
- Les décisions d'architecture à long terme
- Le jugement sur les compromis techniques

## Ma conclusion

L'IA est un formidable multiplicateur de productivité, pas un remplaçant. Les développeurs qui l'intègrent intelligemment à leur flux de travail auront un avantage certain.`,
    },
    {
      title: "TypeScript : au-delà des bases",
      excerpt: "Types conditionnels, mapped types, et autres techniques avancées.",
      author: ada,
      category: categories[0],
      tags: ["typescript", "react"],
      content: `# TypeScript avancé

Une fois les bases maîtrisées, TypeScript révèle un système de types incroyablement puissant.

## Les types conditionnels

\`\`\`ts
type IsString<T> = T extends string ? true : false
\`\`\`

## Les mapped types

\`\`\`ts
type Partial<T> = {
  [P in keyof T]?: T[P]
}
\`\`\`

## Pourquoi s'en soucier

Un typage précis attrape des bugs avant même l'exécution, et sert de documentation vivante pour toute l'équipe.`,
    },
  ];

  for (const p of postsData) {
    const slug = slugify(p.title);
    const post = await prisma.post.create({
      data: {
        title: p.title,
        slug,
        excerpt: p.excerpt,
        content: p.content,
        published: true,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        readingTime: readingTime(p.content),
        viewCount: Math.floor(Math.random() * 500),
        authorId: p.author.id,
        categoryId: p.category.id,
      },
    });

    for (const tagSlug of p.tags) {
      await prisma.postTag.create({ data: { postId: post.id, tagId: tagBySlug(tagSlug).id } });
    }

    const commenters = [ada, linus, grace].filter((u) => u.id !== p.author.id);
    const comment = await prisma.comment.create({
      data: {
        content: "Super article, merci pour le partage ! Ça répond à plusieurs questions que je me posais.",
        postId: post.id,
        authorId: commenters[0].id,
      },
    });
    await prisma.comment.create({
      data: {
        content: "Complètement d'accord, très clair.",
        postId: post.id,
        authorId: commenters[1].id,
        parentId: comment.id,
      },
    });

    for (const user of [ada, linus, grace]) {
      if (Math.random() > 0.4) {
        await prisma.like.create({ data: { postId: post.id, userId: user.id } }).catch(() => {});
      }
    }
  }

  await prisma.follow.create({ data: { followerId: grace.id, followingId: ada.id } });
  await prisma.follow.create({ data: { followerId: linus.id, followingId: ada.id } });

  console.log("\nSeed terminé.");
  console.log("Comptes de démo (mot de passe: password123) :");
  console.log("  ada@nova.app (admin)");
  console.log("  linus@nova.app");
  console.log("  grace@nova.app");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
