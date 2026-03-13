"use client";

import Link from "next/link";
import { ShoppingCart, Trash2, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocale } from "@/components/LocaleProvider";

type CartItem = { productId: string; qty: number };
type Product = { id: string; title: string; priceCents: number; imageUrl: string | null };

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return [];
    const items = JSON.parse(raw) as CartItem[];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export default function CartPage() {
  const { locale, t } = useLocale();
  const [items, setItems] = useState<CartItem[]>(() =>
    typeof window === "undefined" ? [] : readCart(),
  );
  const [products, setProducts] = useState<Record<string, Product>>({});
  const priceLocale = locale === "en" ? "en-US" : "tr-TR";
  const currency = locale === "en" ? "USD" : "TRY";

  const ids = useMemo(
    () => Array.from(new Set(items.map((i) => i.productId))).slice(0, 50),
    [items],
  );

  useEffect(() => {
    const onStorage = () => setItems(readCart());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (ids.length === 0) return;
    let cancelled = false;
    fetch("/api/products/lookup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const map: Record<string, Product> = {};
        for (const p of (data?.products ?? []) as Product[]) map[p.id] = p;
        setProducts(map);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [ids]);

  const totalCents = items.reduce((acc, it) => {
    const p = products[it.productId];
    if (!p) return acc;
    return acc + p.priceCents * it.qty;
  }, 0);

  function removeItem(productId: string, title?: string) {
    const next = readCart().filter((x) => x.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
    toast.info(`"${title ?? "..."}" ${t("removedFromCart")}`, { icon: "🗑️", duration: 2000 });
  }

  function changeQty(productId: string, delta: number) {
    const cart = readCart();
    const idx = cart.findIndex((x) => x.productId === productId);
    if (idx < 0) return;
    const newQty = cart[idx].qty + delta;
    if (newQty <= 0) {
      removeItem(productId, products[productId]?.title);
      return;
    }
    cart[idx] = { ...cart[idx], qty: Math.min(newQty, 99) };
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
          <ShoppingCart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("cart")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{items.length} {t("products")}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-800">
          <ShoppingBag className="h-14 w-14 text-slate-300" />
          <div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{t("emptyCart")}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("emptyCartDesc")}</p>
          </div>
          <Link
            href="/"
            className="mt-2 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
          >
            {t("discoverProductsBtn")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {items.map((it) => {
              const p = products[it.productId];
              return (
                <div
                  key={it.productId}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">
                    {p?.imageUrl ? (
                      <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-6 w-6 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                      {p?.title ?? "..."}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {p
                        ? (p.priceCents / 100).toLocaleString(priceLocale, {
                            style: "currency",
                            currency,
                          })
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-1 dark:border-slate-600 dark:bg-slate-700">
                    <button
                      onClick={() => changeQty(it.productId, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-lg font-bold text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{it.qty}</span>
                    <button
                      onClick={() => changeQty(it.productId, +1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-lg font-bold text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(it.productId, p?.title)}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 font-bold text-slate-800 dark:text-slate-200">{t("orderSummary")}</h2>
            <div className="space-y-2 border-b border-slate-100 pb-4 text-sm dark:border-slate-700">
              {items.map((it) => {
                const p = products[it.productId];
                return (
                  <div key={it.productId} className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span className="truncate">{p?.title ?? "..."} ×{it.qty}</span>
                    <span className="ml-2 font-medium text-slate-700 dark:text-slate-200">
                      {p
                        ? (p.priceCents * it.qty / 100).toLocaleString(priceLocale, {
                            style: "currency",
                            currency,
                          })
                        : ""}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{t("total")}</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {(totalCents / 100).toLocaleString(priceLocale, {
                  style: "currency",
                  currency,
                })}
              </span>
            </div>
            <Link
              href="/checkout"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
            >
              {t("checkout")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
