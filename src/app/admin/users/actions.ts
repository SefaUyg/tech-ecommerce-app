"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { z } from "zod";

const resetSchema = z.object({
  userId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  newPassword: z.string().min(8).max(200),
});

export async function resetUserPasswordAction(
  _prevState: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
) {
  await requireAdmin();
  const parsed = resetSchema.safeParse({
    userId: formData.get("userId"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) return { error: "Geçersiz veri." };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { passwordHash },
  });
  revalidatePath("/admin/users");
  return { ok: true };
}
