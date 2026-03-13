"use client";

import { LogOut } from "lucide-react";

export function LogoutButton({ label = "Çıkış" }: { label?: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-400"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
      }}
    >
      <LogOut className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
