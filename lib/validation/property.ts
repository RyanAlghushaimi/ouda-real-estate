import { z } from "zod";

/**
 * التحقق من UUID مع رسالة عربية واضحة.
 * نتحقق من الفراغ أولاً حتى لا تظهر رسالة "Invalid UUID"
 * للمستخدم عندما لا يختار قيمة من القائمة.
 */
const uuidPattern =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function requiredUuid(message: string) {
  return z
    .string()
    .trim()
    .min(1, message)
    .regex(uuidPattern, "القيمة المحددة غير صحيحة");
}


export const propertySchema = z.object({
  // ---------------------------------------------------------
  // البيانات الأساسية
  // ---------------------------------------------------------

  refNo: z
    .string()
    .trim()
    .min(2, "رقم العقار مطلوب"),

  slug: z
    .string()
    .trim()
    .min(2, "الرابط (Slug) مطلوب")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "الرابط يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط"
    ),

  // ---------------------------------------------------------
  // العنوان والوصف
  // ---------------------------------------------------------

  titleAr: z
    .string()
    .trim()
    .min(2, "العنوان بالعربي مطلوب"),

  titleEn: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  descriptionAr: z
    .string()
    .trim()
    .min(10, "الوصف بالعربي يجب ألا يقل عن 10 أحرف"),

  descriptionEn: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  // ---------------------------------------------------------
  // التصنيف والموقع
  // ---------------------------------------------------------

  typeId: requiredUuid("اختر نوع العقار"),

  purposeId: requiredUuid("اختر الغرض (بيع/إيجار)"),

  cityId: requiredUuid("اختر المدينة"),

  districtId: requiredUuid("اختر الحي"),

  // ---------------------------------------------------------
  // الأرقام
  // ---------------------------------------------------------

  price: z.coerce
    .number()
    .positive("السعر يجب أن يكون أكبر من صفر"),

  area: z.coerce
    .number()
    .nonnegative("المساحة يجب أن تكون رقمًا صحيحًا"),

  bedrooms: z.coerce
    .number()
    .int()
    .nonnegative("عدد غرف النوم غير صحيح")
    .default(0),

  bathrooms: z.coerce
    .number()
    .int()
    .nonnegative("عدد الحمامات غير صحيح")
    .default(0),

  parking: z.coerce
    .number()
    .int()
    .nonnegative("عدد المواقف غير صحيح")
    .default(0),

  // ---------------------------------------------------------
  // الخيارات
  // ---------------------------------------------------------

  furnished: z.coerce
    .boolean()
    .default(false),

  featured: z.coerce
    .boolean()
    .default(false),

  published: z.coerce
    .boolean()
    .default(true),

  status: z
    .enum(["ready", "under_construction"])
    .default("ready"),

  // ---------------------------------------------------------
  // الموقع الجغرافي
  // ---------------------------------------------------------

  lat: z.coerce
    .number()
    .min(-90, "خط العرض غير صحيح")
    .max(90, "خط العرض غير صحيح")
    .optional(),

  lng: z.coerce
    .number()
    .min(-180, "خط الطول غير صحيح")
    .max(180, "خط الطول غير صحيح")
    .optional(),

  // ---------------------------------------------------------
  // SEO
  // ---------------------------------------------------------

  metaTitle: z
    .string()
    .trim()
    .max(160, "Meta Title يجب ألا يتجاوز 160 حرفًا")
    .optional()
    .or(z.literal("")),

  metaDescription: z
    .string()
    .trim()
    .max(300, "Meta Description يجب ألا يتجاوز 300 حرف")
    .optional()
    .or(z.literal("")),

  // ---------------------------------------------------------
  // المميزات
  // ---------------------------------------------------------

  amenityIds: z
  .array(
    z
      .string()
      .trim()
      .regex(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
        "معرّف الميزة غير صحيح"
      )
  )
  .default([]),

});

export type PropertyFormInput = z.infer<typeof propertySchema>;

/**
 * تحويل FormData القادمة من نموذج العقار
 * إلى الشكل الذي يتوقعه propertySchema.
 */
export function parsePropertyFormData(formData: FormData) {
  const raw = {
    // -------------------------------------------------------
    // البيانات الأساسية
    // -------------------------------------------------------

    refNo: String(formData.get("refNo") ?? ""),

    slug: String(formData.get("slug") ?? ""),

    // -------------------------------------------------------
    // العنوان والوصف
    // -------------------------------------------------------

    titleAr: String(formData.get("titleAr") ?? ""),

    titleEn: String(formData.get("titleEn") ?? ""),

    descriptionAr: String(formData.get("descriptionAr") ?? ""),

    descriptionEn: String(formData.get("descriptionEn") ?? ""),

    // -------------------------------------------------------
    // التصنيف والموقع
    // -------------------------------------------------------

    typeId: String(formData.get("typeId") ?? ""),

    purposeId: String(formData.get("purposeId") ?? ""),

    cityId: String(formData.get("cityId") ?? ""),

    districtId: String(formData.get("districtId") ?? ""),

    // -------------------------------------------------------
    // الأرقام
    // -------------------------------------------------------

    price: formData.get("price"),

    area: formData.get("area"),

    bedrooms: formData.get("bedrooms"),

    bathrooms: formData.get("bathrooms"),

    parking: formData.get("parking"),

    // -------------------------------------------------------
    // الخيارات
    // -------------------------------------------------------

    furnished: formData.get("furnished") === "on",

    featured: formData.get("featured") === "on",

    published: formData.get("published") === "on",

    status: String(formData.get("status") ?? "ready"),

    // -------------------------------------------------------
    // الموقع الجغرافي
    // -------------------------------------------------------

    lat:
      formData.get("lat") !== null &&
      String(formData.get("lat")).trim() !== ""
        ? String(formData.get("lat"))
        : undefined,

    lng:
      formData.get("lng") !== null &&
      String(formData.get("lng")).trim() !== ""
        ? String(formData.get("lng"))
        : undefined,

    // -------------------------------------------------------
    // SEO
    // -------------------------------------------------------

    metaTitle: String(formData.get("metaTitle") ?? ""),

    metaDescription: String(formData.get("metaDescription") ?? ""),

    // -------------------------------------------------------
    // المميزات
    //
    // مهم:
    // getAll() ضروري لأن checkbox باسم amenityIds
    // يمكن أن يرسل أكثر من قيمة.
    // -------------------------------------------------------

    amenityIds: formData
      .getAll("amenityIds")
      .map((value) => String(value).trim())
      .filter(Boolean),
  };

  return propertySchema.safeParse(raw);
}
