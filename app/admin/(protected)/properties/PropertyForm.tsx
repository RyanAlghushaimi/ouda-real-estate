"use client";

import { useActionState, useState } from "react";
import type { City, District, PropertyTypeRow, Purpose, AmenityRow } from "@/lib/data/admin/reference";
import type { PropertyEditData } from "@/lib/data/admin/properties";
import type { PropertyFormState } from "./actions";

type Props = {
  action: (prevState: PropertyFormState, formData: FormData) => Promise<PropertyFormState>;
  cities: City[];
  districts: District[];
  types: PropertyTypeRow[];
  purposes: Purpose[];
  amenities: AmenityRow[];
  initial?: PropertyEditData;
  submitLabel: string;
};

const inputClass =
  "w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint";
const labelClass = "mb-1 block text-xs text-ink-soft";

export default function PropertyForm({
  action,
  cities,
  districts,
  types,
  purposes,
  amenities,
  initial,
  submitLabel,
}: Props) {
  const [state, formAction, pending] = useActionState<PropertyFormState, FormData>(action, null);
  const [selectedCity, setSelectedCity] = useState(initial?.cityId ?? "");

  const visibleDistricts = districts.filter((d) => d.city_id === selectedCity);
  const fieldError = (name: string) => (state && !state.ok ? state.fieldErrors?.[name] : undefined);

  return (
    <form action={formAction} className="space-y-8">
      {state && !state.ok && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

            {/* المعرّفات الأساسية — تظهر للعرض فقط عند تعديل عقار موجود */}
      {initial && (
        <section className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>رقم العقار (Ref No)</label>
            <input
              type="text"
              value={initial.refNo}
              readOnly
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>الرابط (Slug)</label>
            <input
              type="text"
              value={initial.slug}
              readOnly
              dir="ltr"
              className={inputClass}
            />
          </div>
        </section>
      )}


      {/* العناوين والوصف */}
      <section className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>العنوان بالعربي</label>
          <input name="titleAr" defaultValue={initial?.titleAr} className={inputClass} />
          {fieldError("titleAr") && <p className="mt-1 text-xs text-danger">{fieldError("titleAr")}</p>}
        </div>
        <div>
          <label className={labelClass}>العنوان بالإنجليزي</label>
          <input name="titleEn" dir="ltr" defaultValue={initial?.titleEn} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>الوصف بالعربي</label>
          <textarea name="descriptionAr" defaultValue={initial?.descriptionAr} rows={4} className={inputClass} />
          {fieldError("descriptionAr") && (
            <p className="mt-1 text-xs text-danger">{fieldError("descriptionAr")}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>الوصف بالإنجليزي</label>
          <textarea name="descriptionEn" dir="ltr" defaultValue={initial?.descriptionEn} rows={4} className={inputClass} />
        </div>
      </section>

      {/* التصنيف والموقع */}
      <section className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className={labelClass}>نوع العقار</label>
          <select name="typeId" defaultValue={initial?.typeId} className={inputClass}>
            <option value="">اختر النوع</option>
            {types.map((t) => (
  <option key={t.id} value={t.id}>
    {t.name_ar}
  </option>
))}

          </select>
          {fieldError("typeId") && <p className="mt-1 text-xs text-danger">{fieldError("typeId")}</p>}
        </div>
        <div>
          <label className={labelClass}>الغرض</label>
          <select name="purposeId" defaultValue={initial?.purposeId} className={inputClass}>
            <option value="">اختر الغرض</option>
            {purposes.map((p) => (
              <option key={p.id} value={p.id}>{p.name_ar}</option>
            ))}
          </select>
          {fieldError("purposeId") && <p className="mt-1 text-xs text-danger">{fieldError("purposeId")}</p>}
        </div>
        <div>
          <label className={labelClass}>الحالة</label>
          <select name="status" defaultValue={initial?.status ?? "ready"} className={inputClass}>
            <option value="ready">جاهز</option>
            <option value="under_construction">تحت الإنشاء</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>المدينة</label>
          <select
            name="cityId"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className={inputClass}
          >
            <option value="">اختر المدينة</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name_ar}</option>
            ))}
          </select>
          {fieldError("cityId") && <p className="mt-1 text-xs text-danger">{fieldError("cityId")}</p>}
        </div>
        <div>
          <label className={labelClass}>الحي</label>
          <select name="districtId" defaultValue={initial?.districtId} className={inputClass}>
            <option value="">اختر الحي</option>
            {visibleDistricts.map((d) => (
              <option key={d.id} value={d.id}>{d.name_ar}</option>
            ))}
          </select>
          {fieldError("districtId") && <p className="mt-1 text-xs text-danger">{fieldError("districtId")}</p>}
        </div>
      </section>

      {/* الأرقام */}
      <section className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-3 lg:grid-cols-6">
        <div>
          <label className={labelClass}>السعر (ر.س)</label>
          <input type="number" name="price" defaultValue={initial?.price} className={inputClass} />
          {fieldError("price") && <p className="mt-1 text-xs text-danger">{fieldError("price")}</p>}
        </div>
        <div>
          <label className={labelClass}>المساحة (م²)</label>
          <input type="number" name="area" defaultValue={initial?.area} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>غرف النوم</label>
          <input type="number" name="bedrooms" defaultValue={initial?.bedrooms ?? 0} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>الحمامات</label>
          <input type="number" name="bathrooms" defaultValue={initial?.bathrooms ?? 0} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>المواقف</label>
          <input type="number" name="parking" defaultValue={initial?.parking ?? 0} className={inputClass} />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" name="furnished" defaultChecked={initial?.furnished} />
            مفروش
          </label>
        </div>
      </section>

      {/* الموقع الجغرافي */}
      <section className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Latitude</label>
          <input type="number" step="any" name="lat" dir="ltr" defaultValue={initial?.lat ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Longitude</label>
          <input type="number" step="any" name="lng" dir="ltr" defaultValue={initial?.lng ?? ""} className={inputClass} />
        </div>
      </section>

      {/* المميزات */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <label className={labelClass}>المميزات</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {amenities.map((a) => (
            <label key={a.id} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs text-ink-soft">
              <input
                type="checkbox"
                name="amenityIds"
                value={a.id}
                defaultChecked={initial?.amenityIds.includes(a.id)}
              />
              {a.name_ar}
            </label>
          ))}
        </div>
      </section>

      {/* SEO */}
      <section className="grid gap-4 rounded-2xl border border-line bg-surface p-5">
        <div>
          <label className={labelClass}>Meta Title</label>
          <input name="metaTitle" defaultValue={initial?.metaTitle} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Meta Description</label>
          <textarea name="metaDescription" defaultValue={initial?.metaDescription} rows={2} className={inputClass} />
        </div>
      </section>

      {/* الحالة والنشر */}
      <section className="flex flex-wrap items-center gap-6 rounded-2xl border border-line bg-surface p-5">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} />
          منشور (يظهر في الموقع العام)
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured} />
          عقار مميز
        </label>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-pine px-6 py-3 text-sm text-white transition-colors hover:bg-pine-deep disabled:opacity-60"
      >
        {pending ? "جارٍ الحفظ..." : submitLabel}
      </button>
    </form>
  );
}
