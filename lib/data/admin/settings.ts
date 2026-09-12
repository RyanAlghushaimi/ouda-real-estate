import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseClient } from "@/lib/supabase/client";

type ActionResult = { ok: true } | { ok: false; error: string };

async function db() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase غير مُهيأ");
  return supabase;
}

export type ContactSettings = {
  companyNameAr: string;
  companyNameEn: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressAr: string;
  social?: { instagram?: string; twitter?: string; snapchat?: string };
};

export type SeoSettings = {
  defaultTitleAr: string;
  defaultDescriptionAr: string;
  ogImage?: string;
};

const DEFAULT_CONTACT: ContactSettings = {
  companyNameAr: "عودة العقارية",
  companyNameEn: "Awda Real Estate",
  phone: "+966507397717",
  whatsapp: "+966507397717",
  email: "alouda1company@gmail.com",
  addressAr: "الرياض، المملكة العربية السعودية",
};

const DEFAULT_SEO: SeoSettings = {
  defaultTitleAr: "عودة العقارية | منصة العقارات للبيع والإيجار",
  defaultDescriptionAr: "تصفح أفضل العقارات للبيع والإيجار في الرياض وجدة والدمام مع عودة العقارية.",
};

export async function getContactSettings(): Promise<ContactSettings> {
  const supabase = getSupabaseClient(); // قراءة عامة — لا تحتاج جلسة/كوكيز
  if (!supabase) return DEFAULT_CONTACT;
  const { data } = await supabase.from("site_settings").select("value").eq("key", "contact").maybeSingle();
  if (!data) return DEFAULT_CONTACT;
  return { ...DEFAULT_CONTACT, ...(data.value as Partial<ContactSettings>) };
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const supabase = getSupabaseClient();
  if (!supabase) return DEFAULT_SEO;
  const { data } = await supabase.from("site_settings").select("value").eq("key", "seo").maybeSingle();
  if (!data) return DEFAULT_SEO;
  return { ...DEFAULT_SEO, ...(data.value as Partial<SeoSettings>) };
}

export async function upsertSetting(key: string, value: unknown): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
