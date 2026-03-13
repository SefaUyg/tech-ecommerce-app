import Link from "next/link";
import Image from "next/image";
import { getLocale } from "@/app/actions/locale";
import { getTranslations } from "@/lib/i18n";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const locale = await getLocale();
  const t = getTranslations(locale);

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-50 px-4 py-12 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <Image src="/logo.png" alt="TechShop" width={56} height={56} className="h-14 w-14 object-contain" />
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {t("createAccount")}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("registerDesc")}</p>
            </div>
          </div>

          <RegisterForm t={t} />
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          <Link className="hover:underline" href="/">← {t("backToStore")}</Link>
        </p>
      </div>
    </div>
  );
}
