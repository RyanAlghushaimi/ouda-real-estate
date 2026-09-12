"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { upsertSetting, type ContactSettings, type SeoSettings } from "@/lib/data/admin/settings";

export async function updateContactSettingsAction(formData: FormData) {
  await requireAdmin();

  const contact: ContactSettings = {
    companyNameAr: String(formData.get("companyNameAr") ?? "").trim(),
    companyNameEn: String(formData.get("companyNameEn") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    addressAr: String(formData.get("addressAr") ?? "").trim(),
    social: {
      instagram: String(formData.get("instagram") ?? "").trim() || undefined,
      twitter: String(formData.get("twitter") ?? "").trim() || undefined,
      snapchat: String(formData.get("snapchat") ?? "").trim() || undefined,
    },
  };

  await upsertSetting("contact", contact);
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/properties");
}

export async function updateSeoSettingsAction(formData: FormData) {
  await requireAdmin();

  const seo: SeoSettings = {
    defaultTitleAr: String(formData.get("defaultTitleAr") ?? "").trim(),
    defaultDescriptionAr: String(formData.get("defaultDescriptionAr") ?? "").trim(),
    ogImage: String(formData.get("ogImage") ?? "").trim() || undefined,
  };

  await upsertSetting("seo", seo);
  revalidatePath("/admin/settings");
  revalidatePath("/");
}
