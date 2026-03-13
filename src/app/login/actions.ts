"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

const attempts = new Map<string, { count: number; resetAt: number }>();

async function getClientKey() {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  const ip = xff?.split(",")[0]?.trim() || "unknown";
  return ip;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 10;

  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const key = await getClientKey();
  if (!checkRateLimit(key)) return { error: "Çok fazla deneme. 1 dakika bekleyin." };

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Email veya şifre hatalı." };

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true, role: true },
  });

  if (!user) return { error: "Email veya şifre hatalı." };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Email veya şifre hatalı." };

  await setSessionCookie({ userId: user.id, email: user.email, role: user.role });
  const next = (formData.get("next") as string)?.trim();
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  if (safeNext) redirect(safeNext);
  redirect(user.role === "ADMIN" ? "/admin" : "/");
}

