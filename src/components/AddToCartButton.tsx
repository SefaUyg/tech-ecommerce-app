"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AddToCartButton({ productId, title }: { productId: string; title?: string }) {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={added}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-95 disabled:cursor-default disabled:bg-green-600 sm:w-auto"
      onClick={() => {
        const raw = localStorage.getItem("cart");
        const items: Array<{ productId: string; qty: number }> = raw ? JSON.parse(raw) : [];
        const idx = items.findIndex((i) => i.productId === productId);
        if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + 1 };
        else items.push({ productId, qty: 1 });
        localStorage.setItem("cart", JSON.stringify(items));
        window.dispatchEvent(new Event("storage"));

        toast.success("Sepete eklendi!", {
          description: title ? `"${title}" sepetinize eklendi.` : undefined,
          icon: "🛒",
          duration: 2500,
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }}
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          Eklendi!
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          Sepete Ekle
        </>
      )}
    </button>
  );
}
