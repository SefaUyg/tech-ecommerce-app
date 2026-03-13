import Link from "next/link";
import { LayoutDashboard, Package, Users, ShoppingBag } from "lucide-react";
import { requireAdmin } from "@/lib/requireAdmin";

const navItems = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/products", label: "Ürünler", icon: Package },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
  { href: "/admin/orders", label: "Siparişler", icon: ShoppingBag },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Admin Paneli</h1>
          <p className="text-xs text-slate-500">Mağazanızı yönetin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <aside className="lg:col-span-1">
          <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="lg:col-span-4">{children}</section>
      </div>
    </div>
  );
}
