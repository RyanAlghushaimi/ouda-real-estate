import Link from "next/link";
import type { Metadata } from "next";
import { listAdminProperties } from "@/lib/data/admin/properties";
import { formatPrice } from "@/lib/properties";
import { togglePublishedAction, toggleFeaturedAction, deletePropertyAction } from "./actions";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export const metadata: Metadata = {
  title: "العقارات | لوحة تحكم عودة العقارية",
  robots: { index: false, follow: false },
};

export default async function AdminPropertiesPage() {
  const properties = await listAdminProperties();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">العقارات</h1>
        <Link
          href="/admin/properties/new"
          className="rounded-full bg-pine px-5 py-2.5 text-sm text-white transition-colors hover:bg-pine-deep"
        >
          + إضافة عقار
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">لا توجد عقارات بعد.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[900px] text-right text-sm">
            <thead className="border-b border-line bg-card text-xs text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-normal">العقار</th>
                <th className="px-4 py-3 font-normal">المدينة/الحي</th>
                <th className="px-4 py-3 font-normal">السعر</th>
                <th className="px-4 py-3 font-normal">الغرض</th>
                <th className="px-4 py-3 font-normal">الحالة</th>
                <th className="px-4 py-3 font-normal">منشور</th>
                <th className="px-4 py-3 font-normal">مميز</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={p.primaryImage ?? ""}
                        alt=""
                        className="h-10 w-14 shrink-0 rounded-lg object-cover"
                      />
                      <div>
                        <div className="text-ink">{p.title}</div>
                        <div className="text-xs text-ink-faint">#{p.refNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{p.district}، {p.city}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatPrice(p.price)} ر.س</td>
                  <td className="px-4 py-3 text-ink-soft">{p.purpose}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.status === "ready" ? "جاهز" : "تحت الإنشاء"}</td>
                  <td className="px-4 py-3">
                    <form action={togglePublishedAction.bind(null, p.id, !p.published)}>
                      <button
                        type="submit"
                        className={`rounded-full px-3 py-1 text-xs ${p.published ? "bg-pine text-white" : "bg-card text-ink-soft"}`}
                      >
                        {p.published ? "منشور" : "مسودة"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleFeaturedAction.bind(null, p.id, !p.featured)}>
                      <button
                        type="submit"
                        className={`rounded-full px-3 py-1 text-xs ${p.featured ? "bg-brass text-white" : "bg-card text-ink-soft"}`}
                      >
                        {p.featured ? "مميز" : "عادي"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/properties/${p.id}`} className="text-xs text-ink-soft hover:text-ink">
                        تعديل
                      </Link>
                      <form action={deletePropertyAction.bind(null, p.id)}>
                        <ConfirmSubmitButton
                          confirmMessage={`هل أنت متأكد من حذف "${p.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                          className="text-xs text-danger hover:opacity-70"
                        >
                          حذف
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
