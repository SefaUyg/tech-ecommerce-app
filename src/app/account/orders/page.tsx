import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, ShoppingBag, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Beklemede",   color: "bg-amber-100 text-amber-700" },
  PAID:      { label: "Ödendi",      color: "bg-blue-100 text-blue-700" },
  SHIPPED:   { label: "Kargoda",     color: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "İptal",       color: "bg-red-100 text-red-700" },
};

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, totalCents: true, status: true, createdAt: true },
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
          <Package className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Siparişlerim</h1>
          <p className="text-sm text-slate-500">{orders.length} sipariş</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
          <ShoppingBag className="h-12 w-12 text-slate-300" />
          <div>
            <p className="font-semibold text-slate-700">Henüz siparişiniz yok</p>
            <p className="mt-1 text-sm text-slate-500">Alışveriş yapıp buraya dönebilirsiniz.</p>
          </div>
          <Link
            href="/"
            className="mt-2 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
          >
            <ShoppingBag className="h-4 w-4" />
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const status = statusLabels[o.status] ?? { label: o.status, color: "bg-slate-100 text-slate-600" };
            return (
              <Link
                key={o.id}
                href={`/account/orders/${o.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                    <Package className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">#{o.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="font-bold text-indigo-600">
                    {(o.totalCents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
