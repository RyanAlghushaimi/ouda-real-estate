import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export type DashboardStats = {
  totalProperties: number;
  publishedProperties: number;
  featuredProperties: number;
  forSaleProperties: number;
  forRentProperties: number;
  newLeads: number;
  recentProperties: { id: string; title: string; city: string; createdAt: string }[];
  recentLeads: { id: string; name: string; phone: string; propertyTitle: string | null; createdAt: string }[];
};

const EMPTY_STATS: DashboardStats = {
  totalProperties: 0,
  publishedProperties: 0,
  featuredProperties: 0,
  forSaleProperties: 0,
  forRentProperties: 0,
  newLeads: 0,
  recentProperties: [],
  recentLeads: [],
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured()) return EMPTY_STATS;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return EMPTY_STATS;

  const [
    totalRes,
    publishedRes,
    featuredRes,
    saleRes,
    rentRes,
    newLeadsRes,
    recentPropertiesRes,
    recentLeadsRes,
  ] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("featured", true),
    supabase
      .from("properties")
      .select("id, purposes!inner(code)", { count: "exact", head: true })
      .eq("purposes.code", "sale"),
    supabase
      .from("properties")
      .select("id, purposes!inner(code)", { count: "exact", head: true })
      .eq("purposes.code", "rent"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("properties")
      .select("id, title_ar, created_at, cities(name_ar)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("leads")
      .select("id, name, phone, created_at, properties(title_ar)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    totalProperties: totalRes.count ?? 0,
    publishedProperties: publishedRes.count ?? 0,
    featuredProperties: featuredRes.count ?? 0,
    forSaleProperties: saleRes.count ?? 0,
    forRentProperties: rentRes.count ?? 0,
    newLeads: newLeadsRes.count ?? 0,
    recentProperties: (recentPropertiesRes.data ?? []).map((row) => {
      type Row = typeof row;
      const r = row as Row & { cities: { name_ar: string } | null };
      return { id: r.id, title: r.title_ar, city: r.cities?.name_ar ?? "", createdAt: r.created_at };
    }),
    recentLeads: (recentLeadsRes.data ?? []).map((row) => {
      type Row = typeof row;
      const r = row as Row & { properties: { title_ar: string } | null };
      return {
        id: r.id,
        name: r.name,
        phone: r.phone,
        propertyTitle: r.properties?.title_ar ?? null,
        createdAt: r.created_at,
      };
    }),
  };
}
