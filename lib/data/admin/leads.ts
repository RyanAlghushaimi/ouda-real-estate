import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

async function db() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase غير مُهيأ");
  return supabase;
}

export type LeadStatus = "new" | "contacted" | "closed";

export type AdminLead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: string;
  status: LeadStatus;
  createdAt: string;
  propertyId: string | null;
  propertyTitle: string | null;
  propertySlug: string | null;
};

export type LeadFilters = { status?: LeadStatus; propertyId?: string };

export async function listLeads(filters: LeadFilters = {}): Promise<AdminLead[]> {
  const supabase = await db();

  let query = supabase
    .from("leads")
    .select("id, name, phone, email, message, source, status, created_at, property_id, properties(title_ar, slug)")
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.propertyId) query = query.eq("property_id", filters.propertyId);

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row) => {
    type Row = typeof row;
    const r = row as Row & { properties: { title_ar: string; slug: string } | null };
    return {
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      message: r.message,
      source: r.source,
      status: r.status as LeadStatus,
      createdAt: r.created_at,
      propertyId: r.property_id,
      propertyTitle: r.properties?.title_ar ?? null,
      propertySlug: r.properties?.slug ?? null,
    };
  });
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const supabase = await db();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
