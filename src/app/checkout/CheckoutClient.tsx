"use client";

import Link from "next/link";
import { ShoppingBag, CreditCard, Package, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createOrderAction } from "./actions";

type CartItem = { productId: string; qty: number };
type Product = { id: string; title: string; priceCents: number };

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

export function CheckoutClient() {
  const [items, setItems] = useState<CartItem[]>(() =>
    typeof window === "undefined" ? [] : readCart(),
  );
  const [products, setProducts] = useState<Record<string, Product>>({});

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
        for (const p of (data?.products ?? [])) map[p.id] = p;
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

  if (items.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
        <ShoppingBag className="h-12 w-12 text-slate-300" />
        <div>
          <p className="font-semibold text-slate-700">Sepetiniz boş</p>
          <p className="text-sm text-slate-500">Ödeme yapabilmek için önce ürün ekleyin.</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
        >
          Ürünlere Göz At
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <form
      action={createOrderAction}
      className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <div className="lg:col-span-2 space-y-3">
        {items.map((it) => {
          const p = products[it.productId];
          return (
            <div
              key={it.productId}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 flex-shrink-0">
                <Package className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-slate-800">{p?.title ?? it.productId}</p>
                <p className="text-sm text-slate-500">Adet: {it.qty}</p>
              </div>
              <span className="font-bold text-indigo-600">
                {p ? ((p.priceCents * it.qty) / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" }) : ""}
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm h-fit dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 font-bold text-slate-800">Ödeme Özeti</h2>
        <div className="space-y-2 border-b border-slate-100 pb-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Ara toplam</span>
            <span>{(totalCents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Kargo</span>
            <span className="text-green-600 font-medium">Ücretsiz</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <span className="font-semibold">Toplam</span>
          <span className="text-xl font-extrabold text-indigo-600">
            {(totalCents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
          </span>
        </div>
        <button
          type="submit"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
        >
          <CreditCard className="h-4 w-4" />
          Siparişi Onayla
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Bu örnek projede gerçek ödeme alınmaz.
        </p>
      </div>
    </form>
  );
}
