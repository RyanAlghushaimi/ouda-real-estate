import Link from "next/link";
import type { Metadata } from "next";
import { listLeads, type LeadStatus } from "@/lib/data/admin/leads";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { updateLeadStatusAction, deleteLeadAction } from "./actions";

export const metadata: Metadata = {
  title: "الاستفسارات | لوحة تحكم عودة العقارية",
  robots: { index: false, follow: false },
};

const statusLabel: Record<LeadStatus, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  closed: "مغلق",
};

const statusTone: Record<LeadStatus, string> = {
  new: "bg-brass text-white",
  contacted: "bg-pine text-white",
  closed: "bg-card text-ink-soft",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: LeadStatus }>;
}) {
  const { status } = await searchParams;
  const leads = await listLeads({ status });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-ink">الاستفسارات</h1>
        <div className="flex items-center gap-1 rounded-full border border-line p-1 text-xs">
          <Link href="/admin/leads" className={`rounded-full px-3 py-1.5 ${!status ? "bg-ink text-white" : "text-ink-soft"}`}>
            الكل
          </Link>
          {(["new", "contacted", "closed"] as LeadStatus[]).map((s) => (
            <Link
              key={s}
              href={`/admin/leads?status=${s}`}
              className={`rounded-full px-3 py-1.5 ${status === s ? "bg-ink text-white" : "text-ink-soft"}`}
            >
              {statusLabel[s]}
            </Link>
          ))}
        </div>
      </div>

      {leads.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">لا توجد استفسارات مطابقة.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-ink">{lead.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] ${statusTone[lead.status]}`}>
                      {statusLabel[lead.status]}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                    <a href={`tel:${lead.phone}`} dir="ltr" className="hover:text-ink">{lead.phone}</a>
                    {lead.email && <span>{lead.email}</span>}
                    <span>{new Date(lead.createdAt).toLocaleDateString("ar-SA")}</span>
                  </div>
                  {lead.propertyTitle && lead.propertySlug && (
                    <Link
                      href={`/properties/${lead.propertySlug}`}
                      target="_blank"
                      className="mt-1 inline-block text-xs text-brass-deep hover:underline"
                    >
                      العقار: {lead.propertyTitle} ←
                    </Link>
                  )}
                  {lead.message && <p className="mt-2 text-sm text-ink-soft">{lead.message}</p>}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <form action={updateLeadStatusAction.bind(null, lead.id, "contacted")}>
                    <button type="submit" className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-ink">
                      تم التواصل
                    </button>
                  </form>
                  <form action={updateLeadStatusAction.bind(null, lead.id, "closed")}>
                    <button type="submit" className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-ink">
                      إغلاق
                    </button>
                  </form>
                  <form action={deleteLeadAction.bind(null, lead.id)}>
                    <ConfirmSubmitButton
                      confirmMessage="حذف هذا الاستفسار نهائيًا؟"
                      className="rounded-full border border-danger/30 px-3 py-1.5 text-xs text-danger"
                    >
                      حذف
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
