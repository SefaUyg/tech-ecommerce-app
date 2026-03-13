import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";

type Product = { id: string; title: string; priceCents: number; imageUrl: string | null };
type T = (k: TranslationKey) => string;

export function ProductsGrid({
  products,
  t,
  priceLocale,
  currency,
}: {
  products: Product[];
  t: T;
  priceLocale: string;
  currency: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-800">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
          <Package className="h-8 w-8 text-slate-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-200">{t("noProducts")}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("noProductsDesc")}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="mt-2 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
        >
          {t("addProduct")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          t={t}
          priceLocale={priceLocale}
          currency={currency}
        />
      ))}
    </div>
  );
}

function ProductCard({
  product: p,
  t,
  priceLocale,
  currency,
}: {
  product: Product;
  t: T;
  priceLocale: string;
  currency: string;
}) {
  return (
    <Link
      href={`/product/${p.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
            <Package className="h-10 w-10" />
            <span className="text-xs">{t("noImage")}</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-800 backdrop-blur">
            <ShoppingCart className="h-3.5 w-3.5" />
            {t("viewDetails")}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 flex-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
          {p.title}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
            {(p.priceCents / 100).toLocaleString(priceLocale, {
              style: "currency",
              currency,
            })}
          </span>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
            {t("inStock")}
          </span>
        </div>
      </div>
    </Link>
  );
}
