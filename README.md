# Nova

Une plateforme communautaire de blogging — écris des articles en Markdown, échange en commentaires threadés, réagis avec des likes, et construis ton profil d'auteur.

Construite comme une base **ultra complète** pour démarrer n'importe quel projet de site communautaire : auth, base de données, éditeur, SEO, animations — tout est déjà branché et fonctionnel.

## Stack technique

| Domaine | Choix |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, React 19.2) |
| Langage | TypeScript |
| Styles | Tailwind CSS v4 + [`class-variance-authority`](https://cva.style) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Base de données | PostgreSQL + [Prisma 7](https://www.prisma.io) (driver adapter `pg`) |
| Authentification | [Auth.js v5](https://authjs.dev) (Credentials + GitHub OAuth optionnel) |
| Formulaires | React Server Actions + [Zod](https://zod.dev) |
| Contenu | Markdown (`react-markdown`, `remark-gfm`, `rehype-highlight`) |
| Thème | `next-themes` (clair / sombre) |

## Fonctionnalités

- 📝 Éditeur Markdown avec aperçu live (write/preview)
- 💬 Commentaires threadés (réponses imbriquées)
- ❤️ Réactions (likes) optimistes
- 🔍 Recherche + filtres par catégorie / tag + pagination
- 👤 Profils publics d'auteurs avec liste d'articles
- 🔐 Authentification email/mot de passe (+ GitHub optionnel)
- 📊 Tableau de bord auteur : créer / éditer / publier / dépublier / supprimer
- 🌗 Thème clair / sombre
- 🗺️ SEO : sitemap dynamique, `robots.txt`, flux RSS, Open Graph
- ✨ Animations soignées (hero, cartes, transitions de menu)

## Démarrage rapide

### 1. Prérequis

- Node.js 20.9+
- Une base PostgreSQL (locale, Docker, ou un service comme [Neon](https://neon.tech) / [Supabase](https://supabase.com))

### 2. Installation

```bash
npm install
cp .env.example .env
```

Renseigne `.env` :

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/mysiteweb?schema=public"
AUTH_SECRET="…"          # génère-en un avec: npx auth secret
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Envie d'une base locale en une commande, sans installer Postgres toi-même ?

```bash
npx prisma dev
```

### 3. Base de données

```bash
npm run db:migrate   # applique le schéma (prisma/schema.prisma)
npm run db:seed      # données de démo (3 utilisateurs, 6 articles, commentaires…)
```

Comptes de démo créés par le seed (mot de passe `password123`) :

- `ada@nova.app` (admin)
- `linus@nova.app`
- `grace@nova.app`

### 4. Lancer le serveur de dev

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Démarre le build de production |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Crée/applique une migration Prisma |
| `npm run db:push` | Pousse le schéma sans migration (prototypage rapide) |
| `npm run db:seed` | Remplit la base avec des données de démo |
| `npm run db:studio` | Ouvre Prisma Studio |

## Structure du projet

```
src/
  app/                 # Routes (App Router)
    (auth)/            # Connexion / inscription + server actions
    blog/               # Liste + détail des articles
    dashboard/          # Espace auteur (protégé)
    profile/[username]/ # Profils publics
    sitemap.ts, robots.ts, feed.xml/route.ts
  components/          # Composants UI et fonctionnels
    ui/                # Primitives (Button, Input, Card…)
    dashboard/         # Formulaires et listes du tableau de bord
    motion/            # Wrappers d'animation
  lib/
    actions/           # Server Actions (posts, commentaires, likes, profil)
    prisma.ts          # Client Prisma (singleton, driver adapter pg)
    posts.ts           # Accès aux données (requêtes Prisma)
    validations.ts     # Schémas Zod
  auth.ts              # Configuration Auth.js
  proxy.ts             # Protection des routes /dashboard (anciennement middleware.ts)
prisma/
  schema.prisma
  seed.ts
```

## Aller plus loin

- **Renommer le site** : le nom "Nova" apparaît dans `src/app/layout.tsx`, `src/components/layout/navbar.tsx`, `src/app/feed.xml/route.ts` et le README.
- **Ajouter un provider OAuth** : décommente les variables `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` dans `.env` — le bouton GitHub apparaît automatiquement.
- **Déploiement** : cette app est un serveur Node.js standard (Proxy = Node.js runtime dans Next 16). Déployable sur Vercel, un conteneur Docker, ou tout hébergeur Node.js. Pense à définir `DATABASE_URL`, `AUTH_SECRET` et `NEXT_PUBLIC_SITE_URL` en production.
- **Restreindre les images distantes** : `next.config.ts` autorise actuellement toutes les images `https://` pour la démo — restreins `images.remotePatterns` aux domaines de confiance en production.

## Notes techniques

Ce projet utilise **Next.js 16** et **Prisma 7**, deux versions majeures introduisant des changements importants par rapport aux versions plus anciennes :

- `params` / `searchParams` sont désormais des `Promise` dans les pages
- `middleware.ts` est remplacé par `proxy.ts` (fichier `src/proxy.ts`)
- Prisma Client est généré dans `src/generated/prisma` (non versionné) et nécessite un driver adapter (`@prisma/adapter-pg`) — voir `src/lib/prisma.ts`
