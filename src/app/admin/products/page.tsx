import Link from "next/link";
import { Plus, Package, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ToastOnMount } from "@/components/ToastOnMount";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  await requireAdmin();
  const { success } = await searchParams;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, title: true, priceCents: true, active: true, imageUrl: true, createdAt: true },
  });

  return (
    <div>
      {success === "deleted" ? <ToastOnMount type="deleted" variant="success" /> : null}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Ürünler</h2>
          <p className="text-sm text-slate-500">{products.length} ürün</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Ürün Ekle
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Package className="h-10 w-10 text-slate-300" />
            <p className="text-sm text-slate-500">Henüz ürün yok.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-indigo-50/40"
              >
                <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <Package className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-slate-800">{p.title}</p>
                  <p className="text-sm text-slate-500">
                    {(p.priceCents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {p.active ? "Aktif" : "Pasif"}
                </span>
                <span className="hidden text-xs text-slate-400 sm:block">
                  {new Date(p.createdAt).toLocaleDateString("tr-TR")}
                </span>
                <Pencil className="h-4 w-4 text-slate-300" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
