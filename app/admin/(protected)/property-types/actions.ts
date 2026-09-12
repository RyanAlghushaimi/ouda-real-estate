"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createPropertyType, updatePropertyType, deletePropertyType } from "@/lib/data/admin/reference";

function slugify(input: string) {
  return input.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

function back(error?: string): never {
  redirect(error ? `/admin/property-types?error=${encodeURIComponent(error)}` : "/admin/property-types");
}

export async function createPropertyTypeAction(formData: FormData) {
  await requireAdmin();
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  if (!name_ar || !name_en) back("الاسم بالعربي والإنجليزي مطلوبان");

  const result = await createPropertyType({ name_ar, name_en, slug: slugify(name_en) });
  revalidatePath("/admin/property-types");
  revalidatePath("/properties");
  back(result.ok ? undefined : result.error);
}

export async function updatePropertyTypeAction(id: string, formData: FormData) {
  await requireAdmin();
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  const result = await updatePropertyType(id, { name_ar, name_en });
  revalidatePath("/admin/property-types");
  back(result.ok ? undefined : result.error);
}

export async function deletePropertyTypeAction(id: string) {
  await requireAdmin();
  const result = await deletePropertyType(id);
  revalidatePath("/admin/property-types");
  back(result.ok ? undefined : result.error);
}
