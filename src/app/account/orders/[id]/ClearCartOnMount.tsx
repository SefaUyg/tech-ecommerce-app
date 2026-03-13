"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ClearCartOnMount() {
  useEffect(() => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("storage"));
    toast.success("Siparişiniz alındı! 🎉", {
      description: "Ödeme tamamlandı, siparişiniz sisteme kaydedildi.",
      duration: 5000,
    });
  }, []);
  return null;
}
