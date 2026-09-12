"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAmenity, updateAmenity, deleteAmenity } from "@/lib/data/admin/reference";

function slugify(input: string) {
  return input.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

function back(error?: string): never {
  redirect(error ? `/admin/amenities?error=${encodeURIComponent(error)}` : "/admin/amenities");
}

export async function createAmenityAction(formData: FormData) {
  await requireAdmin();
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  if (!name_ar || !name_en) back("الاسم بالعربي والإنجليزي مطلوبان");

  const result = await createAmenity({ name_ar, name_en, slug: slugify(name_en) });
  revalidatePath("/admin/amenities");
  revalidatePath("/properties");
  back(result.ok ? undefined : result.error);
}

export async function updateAmenityAction(id: string, formData: FormData) {
  await requireAdmin();
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  const result = await updateAmenity(id, { name_ar, name_en });
  revalidatePath("/admin/amenities");
  back(result.ok ? undefined : result.error);
}

export async function deleteAmenityAction(id: string) {
  await requireAdmin();
  const result = await deleteAmenity(id);
  revalidatePath("/admin/amenities");
  back(result.ok ? undefined : result.error);
}
