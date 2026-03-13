import Link from "next/link";
import { ShoppingCart, Sparkles, ArrowRight, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/app/actions/locale";
import { getTranslations } from "@/lib/i18n";
import { ProductsGrid } from "./ProductsGrid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, locale] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 24,
      select: { id: true, title: true, priceCents: true, imageUrl: true },
    }),
    getLocale(),
  ]);
  const t = getTranslations(locale);
  const currency = locale === "en" ? "USD" : "TRY";
  const priceLocale = locale === "en" ? "en-US" : "tr-TR";

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span>{t("newSeason")}</span>
          </div>
          <h1 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight">
            {t("heroTitle")}
          </h1>
          <p className="max-w-md text-lg text-indigo-100">{t("heroDesc")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#products"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
            >
              <ShoppingCart className="h-4 w-4" />
              {t("discoverProducts")}
            </a>
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/20"
            >
              {t("freeRegister")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t("allProducts")}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {products.length} {t("productsListed")}
            </p>
          </div>
        </div>

        <ProductsGrid
          products={products}
          t={t}
          priceLocale={priceLocale}
          currency={currency}
        />
      </section>
    </main>
  );
}
