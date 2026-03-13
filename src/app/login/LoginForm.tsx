"use client";

import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { loginAction } from "./actions";
import type { TranslationKey } from "@/lib/i18n";

type T = (k: TranslationKey) => string;

export function LoginForm({ next, t }: { next?: string; t: T }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t("email")}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="email@example.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:focus:border-indigo-500 dark:focus:bg-slate-600"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t("password")}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:focus:border-indigo-500 dark:focus:bg-slate-600"
          />
        </div>
      </div>

      {state?.error ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <span className="mt-0.5">⚠️</span>
          {state.error}
        </div>
      ) : null}

      <button
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        {pending ? t("loggingIn") : t("loginBtn")}
      </button>
    </form>
  );
}
