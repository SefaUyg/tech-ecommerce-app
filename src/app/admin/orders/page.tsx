import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Beklemede",   color: "bg-amber-100 text-amber-700" },
  PAID:      { label: "Ödendi",      color: "bg-blue-100 text-blue-700" },
  SHIPPED:   { label: "Kargoda",     color: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "İptal",       color: "bg-red-100 text-red-700" },
};

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { email: true } } },
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Siparişler</h2>
        <p className="text-sm text-slate-500">{orders.length} sipariş</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <ShoppingBag className="h-10 w-10 text-slate-300" />
            <p className="text-sm text-slate-500">Henüz sipariş yok.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((o) => {
              const status = statusLabels[o.status] ?? { label: o.status, color: "bg-slate-100 text-slate-600" };
              return (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition hover:bg-indigo-50/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                      <ShoppingBag className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">#{o.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-slate-500">{o.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="font-bold text-indigo-600">
                      {(o.totalCents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </span>
                    <span className="hidden text-xs text-slate-400 sm:block">
                      {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
