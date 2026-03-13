"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTransition } from "react";
import { setLocaleAction } from "@/app/actions/locale";
import type { Locale } from "@/lib/i18n";

export function LocaleThemeSwitcher({
  currentLocale,
  trLabel,
  enLabel,
}: {
  currentLocale: Locale;
  trLabel: string;
  enLabel: string;
}) {
  const [pending, startTransition] = useTransition();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="rounded-md p-1.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
        title={resolvedTheme === "dark" ? "Açık mod" : "Koyu mod"}
      >
        <Sun className="h-4 w-4 dark:hidden" />
        <Moon className="hidden h-4 w-4 dark:block" />
      </button>
      <span className="h-4 w-px bg-slate-200 dark:bg-slate-600" />
      <div className="flex">
        <button
          type="button"
          disabled={pending || currentLocale === "tr"}
          onClick={() => startTransition(() => setLocaleAction("tr"))}
          className={`rounded-md px-2 py-1 text-xs font-medium transition disabled:opacity-50 ${
            currentLocale === "tr"
              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          }`}
        >
          {trLabel}
        </button>
        <button
          type="button"
          disabled={pending || currentLocale === "en"}
          onClick={() => startTransition(() => setLocaleAction("en"))}
          className={`rounded-md px-2 py-1 text-xs font-medium transition disabled:opacity-50 ${
            currentLocale === "en"
              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          }`}
        >
          {enLabel}
        </button>
      </div>
    </div>
  );
}
