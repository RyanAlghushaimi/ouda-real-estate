import { createSupabaseServerClient } from "@/lib/supabase/server";

// طبقة بيانات إدارية للجداول المرجعية. كل دالة هنا تفترض أن الاستدعاء يأتي
// من كود خادم تم التحقق من صلاحيته مسبقًا عبر requireAdmin() (في الصفحة أو
// في Server Action المستدعية) — وسياسات RLS في قاعدة البيانات (migrations/002)
// تمنع الكتابة الفعلية حتى لو استُدعيت هذه الدوال بالخطأ من مستخدم غير admin.

export type City = { id: string; name_ar: string; name_en: string; slug: string };
export type District = {
  id: string;
  city_id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string | null;
};
export type PropertyTypeRow = { id: string; name_ar: string; name_en: string; slug: string; sort_order: number };
export type Purpose = { id: string; code: string; name_ar: string; name_en: string };
export type AmenityRow = { id: string; name_ar: string; name_en: string; slug: string };

type ActionResult = { ok: true } | { ok: false; error: string };

async function db() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase غير مُهيأ");
  return supabase;
}

// -------------------------------------------------------------------------
// قراءة (تُستخدم في نماذج العقارات وصفحات الإدارة)
// -------------------------------------------------------------------------
export async function listCities(): Promise<City[]> {
  const supabase = await db();
  const { data } = await supabase.from("cities").select("*").order("name_ar");
  return data ?? [];
}

export async function listDistricts(cityId?: string): Promise<District[]> {
  const supabase = await db();
  let query = supabase.from("districts").select("*").order("name_ar");
  if (cityId) query = query.eq("city_id", cityId);
  const { data } = await query;
  return data ?? [];
}

export async function listPropertyTypes(): Promise<PropertyTypeRow[]> {
  const supabase = await db();
  const { data } = await supabase.from("property_types").select("*").order("sort_order");
  return data ?? [];
}

export async function listPurposes(): Promise<Purpose[]> {
  const supabase = await db();
  const { data } = await supabase.from("purposes").select("*").order("name_ar");
  return data ?? [];
}

export async function listAmenities(): Promise<AmenityRow[]> {
  const supabase = await db();
  const { data } = await supabase.from("amenities").select("*").order("name_ar");
  return data ?? [];
}

// -------------------------------------------------------------------------
// كتابة — نمط موحّد: منع الحذف عند وجود ربط بعقارات (FK Constraint نفسه
// يرفض الحذف تلقائيًا؛ هنا فقط نُترجم الخطأ إلى رسالة عربية مفهومة)
// -------------------------------------------------------------------------
function friendlyDeleteError(): ActionResult {
  return {
    ok: false,
    error: "لا يمكن الحذف لوجود عقارات أو بيانات مرتبطة بهذا العنصر — عدّل تلك العقارات أولًا.",
  };
}

export async function createCity(input: { name_ar: string; name_en: string; slug: string }): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("cities").insert(input);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateCity(id: string, input: Partial<Omit<City, "id">>): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("cities").update(input).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteCity(id: string): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("cities").delete().eq("id", id);
  if (error) return friendlyDeleteError();
  return { ok: true };
}

export async function createDistrict(input: {
  city_id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url?: string | null;
}): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("districts").insert(input);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateDistrict(id: string, input: Partial<Omit<District, "id">>): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("districts").update(input).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteDistrict(id: string): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("districts").delete().eq("id", id);
  if (error) return friendlyDeleteError();
  return { ok: true };
}

export async function createPropertyType(input: {
  name_ar: string;
  name_en: string;
  slug: string;
  sort_order?: number;
}): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("property_types").insert(input);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updatePropertyType(
  id: string,
  input: Partial<Omit<PropertyTypeRow, "id">>
): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("property_types").update(input).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deletePropertyType(id: string): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("property_types").delete().eq("id", id);
  if (error) return friendlyDeleteError();
  return { ok: true };
}

export async function createAmenity(input: { name_ar: string; name_en: string; slug: string }): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("amenities").insert(input);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateAmenity(id: string, input: Partial<Omit<AmenityRow, "id">>): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("amenities").update(input).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteAmenity(id: string): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("amenities").delete().eq("id", id);
  if (error) return friendlyDeleteError();
  return { ok: true };
}
