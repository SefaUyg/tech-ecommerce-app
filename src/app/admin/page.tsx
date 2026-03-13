import Link from "next/link";
import { Package, Users, ShoppingBag, TrendingUp, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await requireAdmin();

  const [productsCount, usersCount, ordersCount, pendingOrdersCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    {
      label: "Toplam Ürün",
      value: productsCount,
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      label: "Kullanıcılar",
      value: usersCount,
      icon: Users,
      href: "/admin/users",
      color: "bg-violet-50 text-violet-600",
      border: "border-violet-100",
    },
    {
      label: "Toplam Sipariş",
      value: ordersCount,
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "bg-indigo-50 text-indigo-600",
      border: "border-indigo-100",
    },
    {
      label: "Bekleyen Sipariş",
      value: pendingOrdersCount,
      icon: TrendingUp,
      href: "/admin/orders",
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Genel Bakış</h2>
        <p className="text-sm text-slate-500">Mağaza istatistikleriniz</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color, border }) => (
          <Link
            key={label}
            href={href}
            className={`group rounded-2xl border ${border} bg-white p-5 shadow-sm transition hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:text-slate-500" />
            </div>
            <div className="mt-4 text-3xl font-extrabold text-slate-800">{value}</div>
            <div className="mt-1 text-sm text-slate-500">{label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-600">Hızlı İşlemler</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
          >
            <Package className="h-4 w-4" />
            Yeni Ürün Ekle
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Mağazayı Görüntüle
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
