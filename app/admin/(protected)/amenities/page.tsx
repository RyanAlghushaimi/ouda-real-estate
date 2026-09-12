import type { Metadata } from "next";
import { listAmenities } from "@/lib/data/admin/reference";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import {
  createAmenityAction,
  updateAmenityAction,
  deleteAmenityAction,
} from "./actions";

export const metadata: Metadata = {
  title: "المميزات | لوحة تحكم عودة العقارية",
  robots: { index: false, follow: false },
};

const inputClass =
  "rounded-lg border border-line bg-bg px-2.5 py-1.5 text-xs text-ink";

export default async function AdminAmenitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const amenities = await listAmenities();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">المميزات</h1>

      {error && (
        <p className="mt-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {amenities.map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3"
          >
            <form
              action={updateAmenityAction.bind(null, a.id)}
              className="flex flex-wrap items-center gap-2"
            >
              <input
                name="name_ar"
                defaultValue={a.name_ar}
                className={inputClass}
              />

              <input
                name="name_en"
                dir="ltr"
                defaultValue={a.name_en}
                className={inputClass}
              />

              <button
                type="submit"
                className="rounded-lg bg-ink px-3 py-1.5 text-xs text-white"
              >
                حفظ
              </button>
            </form>

            <div className="mr-auto">
              <form action={deleteAmenityAction.bind(null, a.id)}>
                <ConfirmSubmitButton
                  confirmMessage={`حذف ميزة "${a.name_ar}"؟ سيتم إزالتها من كل العقارات المرتبطة.`}
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
          إضافة ميزة جديدة
        </h2>

        <form
          action={createAmenityAction}
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
            placeholder="Amenity name"
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
