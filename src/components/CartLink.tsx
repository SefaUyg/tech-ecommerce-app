"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

function readCount() {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return 0;
    const items = JSON.parse(raw) as Array<{ productId: string; qty: number }>;
    return items.reduce((acc, it) => acc + (Number.isFinite(it.qty) ? it.qty : 0), 0);
  } catch {
    return 0;
  }
}

export function CartLink({ label = "Sepet" }: { label?: string }) {
  const [count, setCount] = useState(() =>
    typeof window === "undefined" ? 0 : readCount(),
  );

  useEffect(() => {
    const onStorage = () => setCount(readCount());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      <ShoppingCart className="h-4 w-4" />
      <span>{label}</span>
      {count > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
