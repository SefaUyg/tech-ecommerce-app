"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function createOrderAction(formData: FormData) {
  const itemsJson = formData.get("items");
  if (typeof itemsJson !== "string") redirect("/cart");
  const session = await getSession();
  if (!session) redirect("/login?next=/checkout");

  const items = JSON.parse(itemsJson) as Array<{ productId: string; qty: number }>;
  if (!Array.isArray(items) || items.length === 0) redirect("/cart");

  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
    select: { id: true, title: true, priceCents: true },
  });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  let totalCents = 0;
  const orderItems: Array<{ productId: string; productTitle: string; priceCents: number; qty: number }> = [];

  for (const it of items) {
    const p = productMap[it.productId];
    if (!p || it.qty < 1) continue;
    const qty = Math.min(it.qty, 99);
    orderItems.push({ productId: p.id, productTitle: p.title, priceCents: p.priceCents, qty });
    totalCents += p.priceCents * qty;
  }

  if (orderItems.length === 0) redirect("/cart");

  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      totalCents,
      status: "PENDING",
      items: {
        create: orderItems.map((i) => ({
          productId: i.productId,
          productTitle: i.productTitle,
          priceCents: i.priceCents,
          qty: i.qty,
        })),
      },
    },
    select: { id: true },
  });

  redirect(`/account/orders/${order.id}?created=1`);
}
