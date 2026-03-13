"use client";

import { createContext, useContext } from "react";
import { getTranslations } from "@/lib/i18n";
import type { Locale, TranslationKey } from "@/lib/i18n";

type T = (k: TranslationKey) => string;

const LocaleContext = createContext<{ locale: Locale; t: T } | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = getTranslations(locale);
  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  return ctx ?? { locale: "tr" as Locale, t: getTranslations("tr") };
}
