"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { updateLeadStatus, deleteLead, type LeadStatus } from "@/lib/data/admin/leads";

export async function updateLeadStatusAction(id: string, status: LeadStatus) {
  await requireAdmin();
  await updateLeadStatus(id, status);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLeadAction(id: string) {
  await requireAdmin();
  await deleteLead(id);
  revalidatePath("/admin/leads");
}
