import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
});

export const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
});

export const productUpsertSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  priceCents: z.coerce.number().int().min(0).max(100_000_000),
  imageUrl: z
    .union([z.string().trim().url().max(2000), z.literal("")])
    .optional()
    .default(""),
  active: z.coerce.boolean().default(true),
});

