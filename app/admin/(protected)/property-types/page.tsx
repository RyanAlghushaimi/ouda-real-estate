import type { Metadata } from "next";
import { listPropertyTypes } from "@/lib/data/admin/reference";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { createPropertyTypeAction, updatePropertyTypeAction, deletePropertyTypeAction } from "./actions";

export const metadata: Metadata = {
  title: "أنواع العقارات | لوحة تحكم عودة العقارية",
  robots: { index: false, follow: false },
};

const inputClass =
  "rounded-lg border border-line bg-bg px-2.5 py-1.5 text-xs text-ink";

export default async function AdminPropertyTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const types = await listPropertyTypes();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">
        أنواع العقارات
      </h1>

      {error && (
        <p className="mt-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-2">
        {types.map((t) => (
          <div
            key={t.id}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3"
          >
            <form
              action={updatePropertyTypeAction.bind(null, t.id)}
              className="flex flex-1 flex-wrap items-center gap-2"
            >
              <input
                name="name_ar"
                defaultValue={t.name_ar}
                className={inputClass}
              />

              <input
                name="name_en"
                dir="ltr"
                defaultValue={t.name_en}
                className={inputClass}
              />

              <span className="text-xs text-ink-faint">
                /{t.slug}
              </span>

              <button
                type="submit"
                className="rounded-lg bg-ink px-3 py-1.5 text-xs text-white"
              >
                حفظ
              </button>
            </form>

            <div className="mr-auto">
              <form action={deletePropertyTypeAction.bind(null, t.id)}>
                <ConfirmSubmitButton
                  confirmMessage={`حذف نوع "${t.name_ar}"؟ سيفشل الحذف إن كان مرتبطًا بعقارات.`}
                  className="text-xs text-danger"
                >
                  حذف
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-line bg-card p-5">
        <h2 className="font-display text-lg text-ink">
          إضافة نوع جديد
        </h2>

        <form
          action={createPropertyTypeAction}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <input
            name="name_ar"
            placeholder="الاسم بالعربي"
            className={inputClass}
          />

          <input
            name="name_en"
            dir="ltr"
            placeholder="Type name"
            className={inputClass}
          />

          <button
            type="submit"
            className="rounded-lg bg-pine px-4 py-1.5 text-xs text-white"
          >
            + إضافة
          </button>
        </form>
      </div>
    </div>
  );
}
