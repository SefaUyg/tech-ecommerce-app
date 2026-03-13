"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type Variant = "success" | "error" | "info" | "warning";

const icons: Record<string, string> = {
  created: "✅",
  updated: "✏️",
  deleted: "🗑️",
  order: "🎉",
  password: "🔑",
};

const messages: Record<string, { title: string; description?: string }> = {
  created: { title: "Ürün oluşturuldu!", description: "Yeni ürün başarıyla eklendi." },
  updated: { title: "Ürün güncellendi!", description: "Değişiklikler kaydedildi." },
  deleted: { title: "Ürün silindi.", description: "Ürün başarıyla kaldırıldı." },
  order: { title: "Siparişiniz alındı! 🎉", description: "Siparişiniz sisteme başarıyla kaydedildi." },
  password: { title: "Şifre güncellendi!", description: "Kullanıcı şifresi başarıyla değiştirildi." },
};

export function ToastOnMount({
  type,
  variant = "success",
}: {
  type: string;
  variant?: Variant;
}) {
  useEffect(() => {
    const msg = messages[type];
    if (!msg) return;
    const icon = icons[type];
    const fn = toast[variant] ?? toast.success;
    fn(msg.title, { description: msg.description, icon, duration: 4000 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
