import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { PROPERTY_SELECT, mapPropertyRow, type PropertyRow } from "@/lib/supabase/mappers";
import {
  areaHighlights as mockAreaHighlights,
  cities as mockCities,
  propertyTypes as mockPropertyTypes,
  filterProperties as mockFilterProperties,
  getPropertyById as mockGetPropertyById,
  getRelatedProperties as mockGetRelatedProperties,
  properties,
  formatPrice,
  type Property,
  type AreaHighlight,
  type PropertyFilters,
} from "@/lib/properties";


// =============================================================================
// طبقة البيانات الموحّدة (Data Access Layer)
// =============================================================================
// كل صفحات ومكوّنات الواجهة يجب أن تستورد بيانات العقارات من هذا الملف فقط،
// وليس مباشرة من lib/properties.ts أو من عميل Supabase. هذا يحافظ على استقلال
// الواجهات عن مصدر البيانات: نفس الدوال، نفس الأنواع (Property/AreaHighlight)،
// بغض النظر عن كون المصدر Mock Data أو قاعدة بيانات حقيقية.
//
// آلية الانتقال التدريجي:
// - إذا لم تُضبط متغيرات NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
//   في .env.local → تُستخدم البيانات التجريبية من lib/properties.ts كما هي
//   (نفس سلوك المرحلة السابقة تمامًا، دون أي كسر).
// - بمجرد ضبط المتغيرين وتشغيل supabase/schema.sql وsupabase/seed.sql على
//   مشروع Supabase حقيقي → تبدأ نفس الدوال تلقائيًا بجلب البيانات من هناك.
//
// بذلك يمكن ربط كل صفحة على حدة (كما طُلب: العقارات ← التفاصيل ← البحث/الفلاتر
// ← الاستفسارات) واختبارها دون حذف أو كسر البيانات التجريبية الحالية.

export type { Property, AreaHighlight, PropertyFilters };
export { formatPrice };

export async function getCities(): Promise<string[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return mockCities;

  const { data, error } = await supabase.from("cities").select("name_ar").order("name_ar");
  if (error || !data) return mockCities;

  return data.map((c) => c.name_ar);
}

export async function getPropertyTypes(): Promise<string[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return mockPropertyTypes;

  const { data, error } = await supabase
    .from("property_types")
    .select("name_ar")
    .order("sort_order");
  if (error || !data) return mockPropertyTypes;

  return data.map((t) => t.name_ar);
}

export async function getAreaHighlights(): Promise<AreaHighlight[]> {
  const supabase = getSupabaseClient();

  const cities = [
    {
      name: "الرياض",
      city: "الرياض",
      cityEn: "Riyadh",
      image:
        "https://assets.aqar.fm/blog/2020/10/%D8%A8%D8%B1%D8%AC-%D8%A7%D9%84%D9%85%D9%85%D9%84%D9%83%D8%A9.jpg",
    },
    {
      name: "جدة",
      city: "جدة",
      cityEn: "Jeddah",
      image:
        "https://cdn.sa.emaar.com/wp-content/uploads/2020/12/JE-0614-camera-03-706x385.jpg",
    },
    {
      name: "بريدة",
      city: "بريدة",
      cityEn: "Buraydah",
      image:
        "https://dealapp.sa/blog/wp-content/uploads/2020/04/%D8%A8%D8%B1%D9%8A%D8%AF%D8%A9.jpg",
    },
  ];

  if (!supabase) {
    return cities.map((city) => ({
      ...city,
      listingsCount: properties.filter((p) => p.city === city.city).length,
    }));
  }

  const result = await Promise.all(
    cities.map(async (city) => {
      const { count } = await supabase
        .from("properties")
        .select("id, cities!inner(name_ar)", {
          count: "exact",
          head: true,
        })
        .eq("published", true)
        .eq("cities.name_ar", city.city);

      return {
        ...city,
        listingsCount: count ?? 0,
      };
    })
  );

  return result;
}

export async function filterProperties(filters: PropertyFilters): Promise<Property[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return mockFilterProperties(filters);

  let query = supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("published", true);

  if (filters.city) {
    query = query.eq("cities.name_ar", filters.city);
  }
  if (filters.type) {
    query = query.eq("property_types.name_ar", filters.type);
  }
  if (filters.purpose) {
    query = query.eq("purposes.code", filters.purpose);
  }
  if (filters.minPrice) {
    query = query.gte("price", Number(filters.minPrice));
  }
  if (filters.maxPrice) {
    query = query.lte("price", Number(filters.maxPrice));
  }
  if (filters.bedrooms) {
    query = query.gte("bedrooms", Number(filters.bedrooms));
  }

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "area-desc":
      query = query.order("area", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    // في حال حدوث خطأ في الاستعلام (مثل عدم تشغيل schema.sql بعد)، نرجع
    // للبيانات التجريبية بدل كسر الصفحة بالكامل — مع تسجيل الخطأ للمطوّر.
    console.error("filterProperties (Supabase) error:", error.message);
    return mockFilterProperties(filters);
  }

  return (data as unknown as PropertyRow[]).map(mapPropertyRow);
}

export type PaginatedProperties = {
  items: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const DEFAULT_PAGE_SIZE = 12;

/** نسخة مصفّحة من filterProperties — تُستخدم في صفحة قائمة العقارات لتفادي
 * جلب كل الصفوف دفعة واحدة (Supabase .range()) عند نمو عدد العقارات. عرض
 * الخريطة يستمر باستخدام filterProperties العادية لأنه يحتاج كل النتائج
 * المطابقة للفلاتر ليعرضها كـMarkers دفعة واحدة. */
export async function filterPropertiesPaginated(
  filters: PropertyFilters,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PaginatedProperties> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const all = mockFilterProperties(filters);
    const start = (page - 1) * pageSize;
    return {
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
    };
  }

  const select = `
  id, ref_no, slug, title_ar, title_en, description_ar, description_en,
  price, currency, area, bedrooms, bathrooms, parking, furnished,
  status, featured, published, lat, lng, created_at, meta_title, meta_description,
  property_types${filters.type ? "!inner" : ""} ( name_ar, name_en, slug ),
  purposes${filters.purpose ? "!inner" : ""} ( code, name_ar, name_en ),
  cities${filters.city ? "!inner" : ""} ( name_ar, name_en, slug ),
  districts ( name_ar, name_en, slug ),
  property_images ( url, is_primary, sort_order ),
  property_amenities ( amenities ( name_ar, name_en ) )
`;

let query = supabase
  .from("properties")
  .select(select, { count: "exact" })
  .eq("published", true);

if (filters.city) {
  query = query.eq("cities.name_ar", filters.city);
}

if (filters.type) {
  query = query.eq("property_types.name_ar", filters.type);
}

if (filters.purpose) {
  query = query.eq("purposes.code", filters.purpose);
}

  if (filters.minPrice) query = query.gte("price", Number(filters.minPrice));
  if (filters.maxPrice) query = query.lte("price", Number(filters.maxPrice));
  if (filters.bedrooms) query = query.gte("bedrooms", Number(filters.bedrooms));

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "area-desc":
      query = query.order("area", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const start = (page - 1) * pageSize;
  const { data, error, count } = await query.range(start, start + pageSize - 1);

console.log("PROPERTY DATA:", JSON.stringify(data, null, 2));
console.log("PROPERTY ERROR:", error);


  if (error) {
    console.error("filterPropertiesPaginated (Supabase) error:", error.message);
    const all = mockFilterProperties(filters);
    return {
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
    };
  }

  const total = count ?? 0;
  return {
    items: (data as unknown as PropertyRow[]).map(mapPropertyRow),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  const supabase = getSupabaseClient();
  if (!supabase) return mockGetPropertyById(id);

  // أولًا: الروابط الجديدة تستخدم slug.
  const { data: bySlug, error: slugError } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("published", true)
    .eq("slug", id)
    .maybeSingle();

  if (!slugError && bySlug) {
    return mapPropertyRow(bySlug as unknown as PropertyRow);
  }

  // توافق مع روابط الـMock القديمة مثل /properties/2.
  // الـSeed الحالي يستخدم UUIDs ثابتة للعقارات الثمانية.
  const legacyIdMatch = id.match(/^\d+$/);

  if (legacyIdMatch) {
    const legacyNumber = Number(id);

    if (legacyNumber >= 1 && legacyNumber <= 8) {
      const uuid = `60000000-0000-0000-0000-${String(legacyNumber).padStart(12, "0")}`;

      const { data: byId, error: idError } = await supabase
        .from("properties")
        .select(PROPERTY_SELECT)
        .eq("published", true)
        .eq("id", uuid)
        .maybeSingle();

      if (!idError && byId) {
        return mapPropertyRow(byId as unknown as PropertyRow);
      }
    }
  }

  return undefined;
}

export async function getRelatedProperties(property: Property, limit = 3): Promise<Property[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return mockGetRelatedProperties(property, limit);

  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("published", true)
    .neq("slug", property.id)
    .or(`cities.name_ar.eq.${property.city},property_types.name_ar.eq.${property.type}`)
    .limit(limit);

  if (error || !data) return mockGetRelatedProperties(property, limit);

  return (data as unknown as PropertyRow[]).map(mapPropertyRow);
}

// -----------------------------------------------------------------------------
// الاستفسارات (Leads)
// -----------------------------------------------------------------------------
export type CreateLeadInput = {
  propertyId?: string; // slug العقار — نبحث عن الـ uuid المطابق قبل الإدخال
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: "website" | "whatsapp" | "phone";
};

export type CreateLeadResult = { ok: true } | { ok: false; error: string };

export async function createLead(input: CreateLeadInput): Promise<CreateLeadResult> {
  // Server-side validation أساسي — لا نثق بأي بيانات قادمة من الواجهة مباشرة.
  const name = input.name?.trim();
  const phone = input.phone?.trim();

  if (!name || name.length < 2) {
    return { ok: false, error: "الاسم مطلوب" };
  }
  if (!phone || !/^[0-9+\s-]{6,20}$/.test(phone)) {
    return { ok: false, error: "رقم الجوال غير صحيح" };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    // بدون قاعدة بيانات مضبوطة بعد، لا يوجد مكان فعلي لحفظ الاستفسار —
    // نسجّله في السجلات فقط حتى لا تُفقد المحاولة أثناء مرحلة النموذج الأولي.
    console.warn("createLead: Supabase غير مُهيأ — لم يُحفظ الاستفسار فعليًا.", input);
    return { ok: true };
  }

  let propertyUuid: string | null = null;
  if (input.propertyId) {
    const { data: propRow } = await supabase
      .from("properties")
      .select("id")
      .eq("slug", input.propertyId)
      .maybeSingle();
    propertyUuid = propRow?.id ?? null;
  }

  const { error } = await supabase.from("leads").insert({
    property_id: propertyUuid,
    name,
    phone,
    email: input.email?.trim() || null,
    message: input.message?.trim() || null,
    source: input.source ?? "website",
  });

  if (error) {
    console.error("createLead (Supabase) error:", error.message);
    return { ok: false, error: "تعذّر إرسال الطلب، حاول مرة أخرى" };
  }

  return { ok: true };
}

export function isDbConnected(): boolean {
  return isSupabaseConfigured();
}
