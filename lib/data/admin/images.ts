import { createSupabaseServerClient } from "@/lib/supabase/server";

const BUCKET = "property-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ActionResult = { ok: true } | { ok: false; error: string };

async function db() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase غير مُهيأ");
  return supabase;
}

export type PropertyImageRow = {
  id: string;
  property_id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
};

export async function listPropertyImages(propertyId: string): Promise<PropertyImageRow[]> {
  const supabase = await db();
  const { data } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", propertyId)
    .order("sort_order");
  return data ?? [];
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "نوع الملف غير مدعوم — يُسمح فقط بـ JPEG وPNG وWEBP";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "حجم الملف يتجاوز 5 ميجابايت";
  }
  return null;
}

/** يرفع صورة إلى Storage تحت مسار منظم حسب العقار (بدل أسماء ملفات عشوائية
 * بلا سياق)، ثم يُنشئ صف property_images يشير إليها. */
export async function uploadPropertyImage(propertyId: string, file: File): Promise<ActionResult> {
  const validationError = validateFile(file);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await db();

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${propertyId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return { ok: false, error: `فشل رفع الصورة: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  // أول صورة تُرفع لعقار جديد تصبح تلقائيًا الصورة الرئيسية
  const { data: existing } = await supabase
    .from("property_images")
    .select("id")
    .eq("property_id", propertyId)
    .limit(1);

  const { count } = await supabase
    .from("property_images")
    .select("id", { count: "exact", head: true })
    .eq("property_id", propertyId);

  const { error: insertError } = await supabase.from("property_images").insert({
    property_id: propertyId,
    url: publicUrlData.publicUrl,
    is_primary: !existing || existing.length === 0,
    sort_order: count ?? 0,
  });

  if (insertError) {
    // تنظيف الملف المرفوع إذا فشل حفظ السجل، لتجنّب ملفات يتيمة في Storage
    await supabase.storage.from(BUCKET).remove([path]);
    return { ok: false, error: `فشل حفظ بيانات الصورة: ${insertError.message}` };
  }

  return { ok: true };
}

export async function setPrimaryImage(propertyId: string, imageId: string): Promise<ActionResult> {
  const supabase = await db();

  const { error: clearError } = await supabase
    .from("property_images")
    .update({ is_primary: false })
    .eq("property_id", propertyId);
  if (clearError) return { ok: false, error: clearError.message };

  const { error } = await supabase.from("property_images").update({ is_primary: true }).eq("id", imageId);
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

export async function deletePropertyImage(imageId: string): Promise<ActionResult> {
  const supabase = await db();

  const { data: image } = await supabase
    .from("property_images")
    .select("url, property_id, is_primary")
    .eq("id", imageId)
    .maybeSingle();

  const { error } = await supabase.from("property_images").delete().eq("id", imageId);
  if (error) return { ok: false, error: error.message };

  if (image?.url) {
    const path = extractStoragePath(image.url);
    if (path) await supabase.storage.from(BUCKET).remove([path]);
  }

  // إذا كانت المحذوفة هي الرئيسية، اجعل أول صورة متبقية (إن وجدت) رئيسية
  if (image?.is_primary) {
    const { data: remaining } = await supabase
      .from("property_images")
      .select("id")
      .eq("property_id", image.property_id)
      .order("sort_order")
      .limit(1);
    if (remaining && remaining.length > 0) {
      await supabase.from("property_images").update({ is_primary: true }).eq("id", remaining[0].id);
    }
  }

  return { ok: true };
}

/** استبدال صورة موجودة بملف جديد — يرفع الملف الجديد بنفس صف property_images
 * (نفس الترتيب وحالة "رئيسية")، ويحذف الملف القديم من Storage. */
export async function replacePropertyImage(imageId: string, file: File): Promise<ActionResult> {
  const validationError = validateFile(file);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await db();
  const { data: image } = await supabase
    .from("property_images")
    .select("url, property_id")
    .eq("id", imageId)
    .maybeSingle();
  if (!image) return { ok: false, error: "الصورة غير موجودة" };

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${image.property_id}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { ok: false, error: `فشل رفع الصورة: ${uploadError.message}` };

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("property_images")
    .update({ url: publicUrlData.publicUrl })
    .eq("id", imageId);

  if (updateError) {
    await supabase.storage.from(BUCKET).remove([path]);
    return { ok: false, error: updateError.message };
  }

  const oldPath = extractStoragePath(image.url);
  if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);

  return { ok: true };
}

export async function moveImage(propertyId: string, imageId: string, direction: "up" | "down"): Promise<ActionResult> {
  const supabase = await db();
  const images = await listPropertyImages(propertyId);
  const index = images.findIndex((img) => img.id === imageId);
  if (index === -1) return { ok: false, error: "الصورة غير موجودة" };

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= images.length) return { ok: true }; // بالفعل في أول/آخر الترتيب

  const a = images[index];
  const b = images[swapWith];

  const { error: e1 } = await supabase.from("property_images").update({ sort_order: b.sort_order }).eq("id", a.id);
  const { error: e2 } = await supabase.from("property_images").update({ sort_order: a.sort_order }).eq("id", b.id);

  if (e1 || e2) return { ok: false, error: "تعذّر تحديث الترتيب" };
  return { ok: true };
}

/** يحفظ ترتيبًا كاملًا جديدًا دفعة واحدة — يُستخدم من واجهة السحب والإفلات
 * (Drag & Drop) في ImagesManager، بدل التبديل الثنائي في moveImage. */
export async function reorderImages(propertyId: string, orderedImageIds: string[]): Promise<ActionResult> {
  const supabase = await db();

  const updates = orderedImageIds.map((imageId, index) =>
    supabase.from("property_images").update({ sort_order: index }).eq("id", imageId).eq("property_id", propertyId)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: "تعذّر حفظ الترتيب" };

  return { ok: true };
}

function extractStoragePath(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
}
