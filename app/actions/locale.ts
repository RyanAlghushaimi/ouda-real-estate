"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

export async function setLocaleAction(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });

  // نعيد المستخدم لنفس الصفحة التي كان فيها بدل القفز للرئيسية دائمًا —
  // "تغيير اللغة بدون فقدان الصفحة الحالية".
  const headersList = await headers();
  const referer = headersList.get("referer");
  redirect(referer || "/");
}
