import type { Metadata } from "next";
import { listCities, listDistricts } from "@/lib/data/admin/reference";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import {
  createCityAction,
  updateCityAction,
  deleteCityAction,
  createDistrictAction,
  updateDistrictAction,
  deleteDistrictAction,
} from "./actions";

export const metadata: Metadata = {
  title: "المدن والأحياء | لوحة تحكم عودة العقارية",
  robots: { index: false, follow: false },
};

const inputClass =
  "rounded-lg border border-line bg-bg px-2.5 py-1.5 text-xs text-ink";

export default async function AdminLocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [cities, districts] = await Promise.all([
    listCities(),
    listDistricts(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">
        المدن والأحياء
      </h1>

      {error && (
        <p className="mt-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-6">
        {cities.map((city) => (
          <div
            key={city.id}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <form
                action={updateCityAction.bind(null, city.id)}
                className="flex flex-wrap items-center gap-2"
              >
                <input
                  name="name_ar"
                  defaultValue={city.name_ar}
                  className={inputClass}
                />
                <input
                  name="name_en"
                  dir="ltr"
                  defaultValue={city.name_en}
                  className={inputClass}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-ink px-3 py-1.5 text-xs text-white"
                >
                  حفظ
                </button>
                <span className="text-xs text-ink-faint">
                  /{city.slug}
                </span>
              </form>

              <div className="mr-auto">
                <form action={deleteCityAction.bind(null, city.id)}>
                  <ConfirmSubmitButton
                    confirmMessage={`حذف مدينة "${city.name_ar}"؟ سيفشل الحذف إن كانت مرتبطة بعقارات أو أحياء.`}
                    className="text-xs text-danger"
                  >
                    حذف المدينة
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-line pt-4">
              {districts
                .filter((d) => d.city_id === city.id)
                .map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-wrap items-center gap-2 rounded-lg bg-card px-3 py-2"
                  >
                    <form
                      action={updateDistrictAction.bind(null, d.id)}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <input
                        name="name_ar"
                        defaultValue={d.name_ar}
                        className={inputClass}
                      />
                      <input
                        name="name_en"
                        dir="ltr"
                        defaultValue={d.name_en}
                        className={inputClass}
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink-soft"
                      >
                        حفظ
                      </button>
                    </form>

                    <div className="mr-auto">
                      <form action={deleteDistrictAction.bind(null, d.id)}>
                        <ConfirmSubmitButton
                          confirmMessage={`حذف حي "${d.name_ar}"؟ سيفشل الحذف إن كان مرتبطًا بعقارات.`}
                          className="text-xs text-danger"
                        >
                          حذف
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </div>
                ))}

              <form
                action={createDistrictAction}
                className="flex flex-wrap items-center gap-2 pt-2"
              >
                <input
                  type="hidden"
                  name="city_id"
                  value={city.id}
                />
                <input
                  name="name_ar"
                  placeholder="اسم الحي بالعربي"
                  className={inputClass}
                />
                <input
                  name="name_en"
                  dir="ltr"
                  placeholder="District name"
                  className={inputClass}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-pine px-3 py-1.5 text-xs text-white"
                >
                  + إضافة حي
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-line bg-card p-5">
        <h2 className="font-display text-lg text-ink">
          إضافة مدينة جديدة
        </h2>

        <form
          action={createCityAction}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <input
            name="name_ar"
            placeholder="اسم المدينة بالعربي"
            className={inputClass}
          />
          <input
            name="name_en"
            dir="ltr"
            placeholder="City name"
            className={inputClass}
          />
          <button
            type="submit"
            className="rounded-lg bg-pine px-4 py-1.5 text-xs text-white"
          >
            + إضافة مدينة
          </button>
        </form>
      </div>
    </div>
  );
}
