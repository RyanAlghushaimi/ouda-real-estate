import { cookies } from "next/headers";

export type Locale = "ar" | "en";
export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "ar";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : DEFAULT_LOCALE;
}
