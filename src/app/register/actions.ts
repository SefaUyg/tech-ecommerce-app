"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

export async function registerAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Geçersiz email veya şifre." };

  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Bu email zaten kayıtlı." };

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, role: "USER" },
    select: { id: true, email: true, role: true },
  });

  await setSessionCookie({ userId: user.id, email: user.email, role: user.role });
  redirect("/");
}
