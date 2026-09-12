import type { Property } from "@/lib/properties";

// الشكل الخام لصف property كما يعيده Supabase مع الجداول المرتبطة (Nested Select).
// راجع lib/data/properties.ts لمعرفة الاستعلام الفعلي الذي ينتج هذا الشكل.
export type PropertyRow = {
  id: string;
  ref_no: string;
  slug: string;
  title_ar: string;
  title_en: string | null;
  description_ar: string;
  description_en: string | null;
  price: number;
  currency: "SAR";
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  furnished: boolean;
  status: "ready" | "under_construction";
  featured: boolean;
  published: boolean;
  lat: number | null;
  lng: number | null;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
  property_types: { name_ar: string; name_en: string; slug: string } | null;
  purposes: { code: "sale" | "rent"; name_ar: string; name_en: string } | null;
  cities: { name_ar: string; name_en: string; slug: string } | null;
  districts: { name_ar: string; name_en: string; slug: string } | null;
  property_images: { url: string; is_primary: boolean; sort_order: number }[];
  property_amenities: { amenities: { name_ar: string; name_en: string } | null }[];
};

/** يحوّل صف قاعدة البيانات (بأعمدة ar/en وجداول مرتبطة) إلى نفس شكل
 * Property المستخدم في كل مكونات الواجهة، بحيث لا تحتاج المكونات لأي تعديل. */
export function mapPropertyRow(row: PropertyRow): Property {
  const sortedImages = [...row.property_images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });

  const images = sortedImages.map((img) => img.url);
  const primaryImage = images[0] ?? "";

  const features = row.property_amenities
    .map((pa) => pa.amenities?.name_ar)
    .filter((v): v is string => Boolean(v));

  return {
    id: row.slug, // روابط SEO-friendly — راجع supabase/schema.sql (عمود slug)
    refNo: row.ref_no,
    title: row.title_ar,
    titleEn: row.title_en ?? row.title_ar,
    purpose: (row.purposes?.code ?? "sale") as Property["purpose"],
    type: row.property_types?.name_ar ?? "",
    typeEn: row.property_types?.name_en ?? undefined,
    price: Number(row.price),
    currency: row.currency,
    city: row.cities?.name_ar ?? "",
    cityEn: row.cities?.name_en ?? undefined,
    district: row.districts?.name_ar ?? "",
    districtEn: row.districts?.name_en ?? undefined,
    area: Number(row.area),
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    parking: row.parking,
    furnished: row.furnished,
    featured: row.featured,
    status: row.status === "ready" ? "جاهز" : "تحت الإنشاء",
    lat: row.lat ?? 24.7136,
    lng: row.lng ?? 46.6753,
    features,
    image: primaryImage,
    images: images.length > 0 ? images : [primaryImage],
    description: row.description_ar,
    descriptionEn: row.description_en ?? undefined,
    createdAt: row.created_at,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
  };
}

/** استعلام Select الموحّد — يُستخدم في كل دوال lib/data/properties.ts
 * لضمان جلب نفس الأعمدة والعلاقات في كل مرة. */
export const PROPERTY_SELECT = `
  id, ref_no, slug, title_ar, title_en, description_ar, description_en,
  price, currency, area, bedrooms, bathrooms, parking, furnished,
  status, featured, published, lat, lng, created_at, meta_title, meta_description,
  property_types ( name_ar, name_en, slug ),
  purposes ( code, name_ar, name_en ),
  cities ( name_ar, name_en, slug ),
  districts ( name_ar, name_en, slug ),
  property_images ( url, is_primary, sort_order ),
  property_amenities ( amenities ( name_ar, name_en ) )
`;
