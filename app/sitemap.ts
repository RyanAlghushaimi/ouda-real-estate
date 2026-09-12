import type { MetadataRoute } from "next";
import { filterProperties } from "@/lib/data/properties";
import { SITE_URL } from "@/lib/site";

// filterProperties({}) في وضع Supabase يستعلم فقط عن published = true (راجع
// RLS في supabase/schema.sql)، وفي وضع البيانات التجريبية كل العناصر
// "منشورة" ضمنيًا — لذلك لا حاجة لفلترة إضافية هنا لاستبعاد المسودات.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await filterProperties({});

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/properties`, changeFrequency: "hourly", priority: 0.9 },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${SITE_URL}/properties/${p.id}`,
    lastModified: p.createdAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
