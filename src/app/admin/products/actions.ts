"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { productUpsertSchema } from "@/lib/validation";

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const parsed = productUpsertSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priceCents: formData.get("priceCents"),
    imageUrl: formData.get("imageUrl"),
    active: formData.get("active"),
  });
  if (!parsed.success) throw new Error("Invalid product data");

  const p = await prisma.product.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      priceCents: parsed.data.priceCents,
      imageUrl: parsed.data.imageUrl || null,
      active: parsed.data.active,
    },
    select: { id: true },
  });

  redirect(`/admin/products/${p.id}?success=created`);
}

export async function updateProductAction(productId: string, formData: FormData) {
  await requireAdmin();
  const parsed = productUpsertSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priceCents: formData.get("priceCents"),
    imageUrl: formData.get("imageUrl"),
    active: formData.get("active"),
  });
  if (!parsed.success) throw new Error("Invalid product data");

  await prisma.product.update({
    where: { id: productId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      priceCents: parsed.data.priceCents,
      imageUrl: parsed.data.imageUrl || null,
      active: parsed.data.active,
    },
  });

  redirect(`/admin/products/${productId}?success=updated`);
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  redirect("/admin/products?success=deleted");
}
