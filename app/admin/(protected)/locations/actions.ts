"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createCity, updateCity, deleteCity, createDistrict, updateDistrict, deleteDistrict } from "@/lib/data/admin/reference";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function back(error?: string): never {
  redirect(error ? `/admin/locations?error=${encodeURIComponent(error)}` : "/admin/locations");
}

export async function createCityAction(formData: FormData) {
  await requireAdmin();
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  if (!name_ar || !name_en) back("اسم المدينة بالعربي والإنجليزي مطلوبان");

  const result = await createCity({ name_ar, name_en, slug: slugify(name_en) });
  revalidatePath("/admin/locations");
  revalidatePath("/");
  revalidatePath("/properties");
  back(result.ok ? undefined : result.error);
}

export async function updateCityAction(id: string, formData: FormData) {
  await requireAdmin();
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  const result = await updateCity(id, { name_ar, name_en });
  revalidatePath("/admin/locations");
  revalidatePath("/");
  back(result.ok ? undefined : result.error);
}

export async function deleteCityAction(id: string) {
  await requireAdmin();
  const result = await deleteCity(id);
  revalidatePath("/admin/locations");
  back(result.ok ? undefined : result.error);
}

export async function createDistrictAction(formData: FormData) {
  await requireAdmin();
  const city_id = String(formData.get("city_id") ?? "");
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  if (!city_id || !name_ar || !name_en) back("المدينة واسم الحي بالعربي والإنجليزي مطلوبة");

  const result = await createDistrict({ city_id, name_ar, name_en, slug: slugify(name_en) });
  revalidatePath("/admin/locations");
  revalidatePath("/");
  revalidatePath("/properties");
  back(result.ok ? undefined : result.error);
}

export async function updateDistrictAction(id: string, formData: FormData) {
  await requireAdmin();
  const name_ar = String(formData.get("name_ar") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  const result = await updateDistrict(id, { name_ar, name_en });
  revalidatePath("/admin/locations");
  back(result.ok ? undefined : result.error);
}

export async function deleteDistrictAction(id: string) {
  await requireAdmin();
  const result = await deleteDistrict(id);
  revalidatePath("/admin/locations");
  back(result.ok ? undefined : result.error);
}
