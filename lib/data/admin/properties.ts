import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PROPERTY_SELECT, mapPropertyRow, type PropertyRow } from "@/lib/supabase/mappers";
import type { Property } from "@/lib/properties";
import type { PropertyFormInput } from "@/lib/validation/property";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

async function db() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase غير مُهيأ");
  return supabase;
}

/** صف عقار خفيف لجدول لوحة التحكم (بدون كل العلاقات المتداخلة). */
export type AdminPropertyListItem = {
  id: string;
  refNo: string;
  slug: string;
  title: string;
  city: string;
  district: string;
  price: number;
  purpose: string;
  type: string;
  published: boolean;
  featured: boolean;
  status: string;
  primaryImage: string | null;
  createdAt: string;
};

export async function listAdminProperties(): Promise<AdminPropertyListItem[]> {
  const supabase = await db();

  const { data, error } = await supabase
    .from("properties")
    .select(
      `id, ref_no, slug, title_ar, price, published, featured, status, created_at,
       cities(name_ar), districts(name_ar), purposes(name_ar), property_types(name_ar),
       property_images(url, is_primary)`
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    type Row = typeof row;
    const r = row as Row & {
      cities: { name_ar: string } | null;
      districts: { name_ar: string } | null;
      purposes: { name_ar: string } | null;
      property_types: { name_ar: string } | null;
      property_images: { url: string; is_primary: boolean }[];
    };
    const primary = r.property_images.find((img) => img.is_primary) ?? r.property_images[0];

    return {
      id: r.id,
      refNo: r.ref_no,
      slug: r.slug,
      title: r.title_ar,
      city: r.cities?.name_ar ?? "",
      district: r.districts?.name_ar ?? "",
      price: Number(r.price),
      purpose: r.purposes?.name_ar ?? "",
      type: r.property_types?.name_ar ?? "",
      published: r.published,
      featured: r.featured,
      status: r.status,
      primaryImage: primary?.url ?? null,
      createdAt: r.created_at,
    };
  });
}

/** يُعيد شكل Property الموحّد (نفس نوع الواجهة العامة) لكن عبر uuid وبدون
 * قيد published=true — يُستخدم في صفحة تعديل العقار بلوحة التحكم. */
export async function getAdminPropertyByUuid(id: string): Promise<Property | undefined> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapPropertyRow(data as unknown as PropertyRow);
}

/** المعرّف الحقيقي (uuid) للعقار — منفصل عن id/slug المستخدم في الواجهة
 * العامة، لأن لوحة التحكم تحتاج معرّفًا ثابتًا لا يتغيّر مع تعديل الـslug. */
/** بيانات خام (بمعرّفات FK) لتعبئة نموذج التعديل — على عكس getAdminPropertyByUuid
 * الذي يُعيد الشكل العام (Property) بأسماء نصية للعرض فقط. */
export type PropertyEditData = {
  id: string;
  refNo: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  typeId: string;
  purposeId: string;
  cityId: string;
  districtId: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  furnished: boolean;
  featured: boolean;
  published: boolean;
  status: "ready" | "under_construction";
  lat: number | null;
  lng: number | null;
  metaTitle: string;
  metaDescription: string;
  amenityIds: string[];
};

export async function getAdminPropertyEditData(id: string): Promise<PropertyEditData | null> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("properties")
    .select(
      `id, ref_no, slug, title_ar, title_en, description_ar, description_en,
       type_id, purpose_id, city_id, district_id, price, area, bedrooms, bathrooms, parking,
       furnished, featured, published, status, lat, lng, meta_title, meta_description,
       property_amenities(amenity_id)`
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  type Row = typeof data;
  const r = data as Row & { property_amenities: { amenity_id: string }[] };

  return {
    id: r.id,
    refNo: r.ref_no,
    slug: r.slug,
    titleAr: r.title_ar,
    titleEn: r.title_en ?? "",
    descriptionAr: r.description_ar,
    descriptionEn: r.description_en ?? "",
    typeId: r.type_id,
    purposeId: r.purpose_id,
    cityId: r.city_id,
    districtId: r.district_id,
    price: Number(r.price),
    area: Number(r.area),
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    parking: r.parking,
    furnished: r.furnished,
    featured: r.featured,
    published: r.published,
    status: r.status as "ready" | "under_construction",
    lat: r.lat,
    lng: r.lng,
    metaTitle: r.meta_title ?? "",
    metaDescription: r.meta_description ?? "",
    amenityIds: r.property_amenities.map((pa) => pa.amenity_id),
  };
}

export async function getPropertyUuidBySlug(slug: string): Promise<string | null> {
  const supabase = await db();
  const { data } = await supabase.from("properties").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
}

async function syncAmenities(propertyId: string, amenityIds: string[]) {
  const supabase = await db();
  await supabase.from("property_amenities").delete().eq("property_id", propertyId);
  if (amenityIds.length > 0) {
    await supabase
      .from("property_amenities")
      .insert(amenityIds.map((amenityId) => ({ property_id: propertyId, amenity_id: amenityId })));
  }
}

function generatePropertySlug(title: string, refNo: string) {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const refNumber = refNo.replace(/^AWD-/i, "");

  return `${cleanTitle || "property"}-${refNumber}`;
}


function toRow(input: PropertyFormInput) {
  return {
    title_ar: input.titleAr,
    title_en: input.titleEn || null,
    description_ar: input.descriptionAr,
    description_en: input.descriptionEn || null,
    type_id: input.typeId,
    purpose_id: input.purposeId,
    city_id: input.cityId,
    district_id: input.districtId,
    price: input.price,
    area: input.area,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    parking: input.parking,
    furnished: input.furnished,
    featured: input.featured,
    published: input.published,
    status: input.status,
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    meta_title: input.metaTitle || null,
    meta_description: input.metaDescription || null,
  };
}

async function generateRefNo(): Promise<string> {
  const supabase = await db();

  const { data, error } = await supabase
    .from("properties")
    .select("ref_no")
    .like("ref_no", "AWD-%");

  if (error) {
    throw new Error(error.message);
  }

  let maxNumber = 1049;

  for (const row of data ?? []) {
    const match = /^AWD-(\d+)$/.exec(row.ref_no);

    if (!match) continue;

    const number = Number(match[1]);

    if (Number.isSafeInteger(number)) {
      maxNumber = Math.max(maxNumber, number);
    }
  }

  return `AWD-${maxNumber + 1}`;
}


export async function createProperty(input: PropertyFormInput): Promise<ActionResult> {
  const supabase = await db();

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const refNo = await generateRefNo();
      const slug = generatePropertySlug(input.titleEn || "", refNo);

      const row = {
        ...toRow(input),
        ref_no: refNo,
        slug,
      };

      const { data, error } = await supabase
        .from("properties")
        .insert(row)
        .select("id")
        .single();

      if (!error && data) {
        await syncAmenities(data.id, input.amenityIds);
        return { ok: true, id: data.id };
      }

      if (
        error?.message?.includes("duplicate key") &&
        error.message.includes("ref_no")
      ) {
        continue;
      }

      return {
        ok: false,
        error: mapDbError(error?.message),
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      };
    }
  }

  return {
    ok: false,
    error: "تعذر إنشاء رقم عقار فريد، حاول مرة أخرى",
  };
}


export async function updateProperty(id: string, input: PropertyFormInput): Promise<ActionResult> {
  const supabase = await db();

  const { error } = await supabase.from("properties").update(toRow(input)).eq("id", id);
  if (error) return { ok: false, error: mapDbError(error.message) };

  await syncAmenities(id, input.amenityIds);
  return { ok: true, id };
}

export async function deleteProperty(id: string): Promise<ActionResult> {
  const supabase = await db();
  // صور العقار وربط المميزات تُحذف تلقائيًا عبر on delete cascade في الـSchema.
  // ملفات Storage الفعلية تبقى (تنظيفها من Storage عملية منفصلة اختيارية).
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function setPropertyPublished(id: string, published: boolean): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("properties").update({ published }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function setPropertyFeatured(id: string, featured: boolean): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("properties").update({ featured }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

function mapDbError(message?: string): string {
  if (!message) return "حدث خطأ غير متوقع";
  if (message.includes("duplicate key") && message.includes("ref_no")) return "رقم العقار مستخدم مسبقًا";
  if (message.includes("duplicate key") && message.includes("slug")) return "الرابط (Slug) مستخدم مسبقًا";
  return message;
}
