import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  ids: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/)).min(1).max(50),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: parsed.data.ids }, active: true },
    select: { id: true, title: true, priceCents: true, imageUrl: true },
  });

  return NextResponse.json({ products });
}

