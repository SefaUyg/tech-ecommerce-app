import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Package, LogIn, UserPlus } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getLocale } from "@/app/actions/locale";
import { getTranslations } from "@/lib/i18n";
import { LogoutButton } from "./LogoutButton";
import { CartLink } from "./CartLink";
import { LocaleThemeSwitcher } from "./LocaleThemeSwitcher";

export async function SiteHeader() {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  const t = getTranslations(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-80 dark:text-slate-100"
        >
          <Image src="/logo.png" alt="TechShop" width={36} height={36} className="h-9 w-9 object-contain" unoptimized />
          <span className="text-lg">TechShop</span>
        </Link>

        <nav className="flex items-center gap-2">
          <LocaleThemeSwitcher currentLocale={locale} trLabel="TR" enLabel="EN" />
          <CartLink label={t("cart")} />

          {session?.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              {t("admin")}
            </Link>
          ) : null}

          {session ? (
            <>
              <Link
                href="/account/orders"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Package className="h-3.5 w-3.5" />
                {t("orders")}
              </Link>
              <LogoutButton label={t("logout")} />
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <UserPlus className="h-3.5 w-3.5" />
                {t("register")}
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
              >
                <LogIn className="h-3.5 w-3.5" />
                {t("login")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
