import type { Metadata } from "next";
import PropertyForm from "../PropertyForm";
import { createPropertyAction } from "../actions";
import { listCities, listDistricts, listPropertyTypes, listPurposes, listAmenities } from "@/lib/data/admin/reference";

export const metadata: Metadata = {
  title: "إضافة عقار | لوحة تحكم عودة العقارية",
  robots: { index: false, follow: false },
};

export default async function NewPropertyPage() {
  const [cities, districts, types, purposes, amenities] = await Promise.all([
    listCities(),
    listDistricts(),
    listPropertyTypes(),
    listPurposes(),
    listAmenities(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">إضافة عقار جديد</h1>
      <p className="mt-1 text-sm text-ink-soft">بعد الحفظ يمكنك رفع الصور من صفحة تعديل العقار.</p>

      <div className="mt-6">
        <PropertyForm
          action={createPropertyAction}
          cities={cities}
          districts={districts}
          types={types}
          purposes={purposes}
          amenities={amenities}
          submitLabel="حفظ وإنشاء العقار"
        />
      </div>
    </div>
  );
}
