import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: { select: { email: true } }, items: true },
  });

  if (!order) notFound();

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Sipariş #{order.id.slice(-8)}</h2>
          <p className="text-sm text-zinc-600">{order.user.email}</p>
        </div>
        <Link className="text-sm underline underline-offset-4" href="/admin/orders">
          Geri
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between rounded-xl border border-zinc-100 px-4 py-3"
          >
            <span className="font-medium">{item.productTitle}</span>
            <span className="text-sm text-zinc-600">
              {item.qty} × {(item.priceCents / 100).toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-zinc-200 pt-4 text-right text-xl font-semibold">
        {(order.totalCents / 100).toLocaleString("tr-TR", {
          style: "currency",
          currency: "TRY",
        })}
      </div>

      <p className="mt-2 text-sm text-zinc-500">
        {new Date(order.createdAt).toLocaleString("tr-TR")} · {order.status}
      </p>
    </div>
  );
}
