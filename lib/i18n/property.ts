import type { Property } from "@/lib/properties";
import type { Locale } from "./locale";

export function localizedTitle(p: Property, locale: Locale): string {
  return locale === "en" && p.titleEn ? p.titleEn : p.title;
}

export function localizedDescription(p: Property, locale: Locale): string {
  return locale === "en" && p.descriptionEn ? p.descriptionEn : p.description;
}

export function localizedCity(p: Property, locale: Locale): string {
  return locale === "en" && p.cityEn ? p.cityEn : p.city;
}

export function localizedDistrict(p: Property, locale: Locale): string {
  return locale === "en" && p.districtEn ? p.districtEn : p.district;
}

export function localizedType(p: Property, locale: Locale): string {
  return locale === "en" && p.typeEn ? p.typeEn : p.type;
}
