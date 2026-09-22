import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(60),
  username: z
    .string()
    .min(3, "3 caractères minimum")
    .max(30)
    .regex(/^[a-z0-9_-]+$/i, "Lettres, chiffres, - et _ uniquement"),
  email: z.email("Adresse email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export const loginSchema = z.object({
  email: z.email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const postSchema = z.object({
  title: z.string().min(3, "3 caractères minimum").max(120),
  excerpt: z.string().max(280).optional().or(z.literal("")),
  content: z.string().min(50, "50 caractères minimum"),
  coverImage: z.url("URL invalide").optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  published: z.boolean(),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Le commentaire ne peut pas être vide").max(2000),
  postId: z.string(),
  parentId: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(60),
  bio: z.string().max(280).optional().or(z.literal("")),
  image: z.url("URL invalide").optional().or(z.literal("")),
});

export const adminCreateUserSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(60),
  username: z
    .string()
    .min(3, "3 caractères minimum")
    .max(30)
    .regex(/^[a-z0-9_-]+$/i, "Lettres, chiffres, - et _ uniquement"),
  email: z.email("Adresse email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  role: z.enum(["USER", "AUTHOR", "ADMIN"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
