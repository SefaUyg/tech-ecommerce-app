"use server";

import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";

const LOCALE_COOKIE = "locale";

export async function setLocaleAction(locale: Locale) {
  if (locale !== "tr" && locale !== "en") return;
  const c = await cookies();
  c.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });
}

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get(LOCALE_COOKIE)?.value;
  return v === "en" ? "en" : "tr";
}
