import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats } from "@/lib/data/admin/stats";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "نظرة عامة | لوحة تحكم عودة العقارية",
  robots: { index: false, follow: false },
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="font-display text-3xl text-ink">{value}</div>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-card p-8 text-center text-sm text-ink-soft">
        لم يتم إعداد قاعدة البيانات بعد — راجع <code>supabase/README.md</code>.
      </div>
    );
  }

  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">نظرة عامة</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="إجمالي العقارات" value={stats.totalProperties} />
        <StatCard label="منشورة" value={stats.publishedProperties} />
        <StatCard label="مميزة" value={stats.featuredProperties} />
        <StatCard label="للبيع" value={stats.forSaleProperties} />
        <StatCard label="للإيجار" value={stats.forRentProperties} />
        <StatCard label="استفسارات جديدة" value={stats.newLeads} />
	<StatCard label="زوار اليوم" value={stats.visitorsToday} />
	<StatCard label="زوار آخر 7 أيام" value={stats.visitorsLast7Days} />
	<StatCard label="زوار آخر 30 يومًا" value={stats.visitorsLast30Days} />
	<StatCard label="إجمالي الزيارات" value={stats.totalPageViews} />

      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">آخر العقارات المضافة</h2>
            <Link href="/admin/properties" className="text-xs text-ink-soft hover:text-ink">عرض الكل ←</Link>
          </div>
          {stats.recentProperties.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">لا توجد عقارات بعد.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.recentProperties.map((p) => (
                <li key={p.id} className="flex items-center justify-between border-b border-line pb-3 text-sm last:border-0 last:pb-0">
                  <span className="text-ink">{p.title}</span>
                  <span className="text-xs text-ink-faint">{p.city}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">آخر الاستفسارات</h2>
            <Link href="/admin/leads" className="text-xs text-ink-soft hover:text-ink">عرض الكل ←</Link>
          </div>
          {stats.recentLeads.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">لا توجد استفسارات بعد.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.recentLeads.map((l) => (
                <li key={l.id} className="border-b border-line pb-3 text-sm last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-ink">{l.name}</span>
                    <span dir="ltr" className="text-xs text-ink-faint">{l.phone}</span>
                  </div>
                  {l.propertyTitle && <p className="mt-1 text-xs text-ink-soft">{l.propertyTitle}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}