import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, Package, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ClearCartOnMount } from "./ClearCartOnMount";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Beklemede",   color: "bg-amber-100 text-amber-700" },
  PAID:      { label: "Ödendi",      color: "bg-blue-100 text-blue-700" },
  SHIPPED:   { label: "Kargoda",     color: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "İptal",       color: "bg-red-100 text-red-700" },
};

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const session = await getSession();
  if (!session) notFound();

  const { id } = await params;
  const { created } = await searchParams;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.userId },
    include: { items: true },
  });

  if (!order) notFound();

  const status = statusLabels[order.status] ?? { label: order.status, color: "bg-slate-100 text-slate-600" };

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      {created === "1" ? <ClearCartOnMount /> : null}

      {created === "1" ? (
        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white shadow-lg">
          <CheckCircle className="h-8 w-8 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold">Siparişiniz alındı!</p>
            <p className="text-sm text-green-100">Siparişiniz sisteme kaydedildi. Teşekkür ederiz 🎉</p>
          </div>
        </div>
      ) : null}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Sipariş #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            {new Date(order.createdAt).toLocaleString("tr-TR")}
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status.color}`}>
              {status.label}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                <Package className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{item.productTitle}</p>
                <p className="text-sm text-slate-500">Adet: {item.qty}</p>
              </div>
            </div>
            <span className="font-semibold text-indigo-600">
              {(item.priceCents * item.qty / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-right">
          <p className="text-sm text-slate-500">Toplam Tutar</p>
          <p className="text-2xl font-extrabold text-indigo-600">
            {(order.totalCents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
          </p>
        </div>
      </div>

      <Link
        href="/account/orders"
        className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm siparişlerim
      </Link>
    </main>
  );
}
