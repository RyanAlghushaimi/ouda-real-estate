import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PropertyForm from "../PropertyForm";
import ImagesManager from "./ImagesManager";
import { updatePropertyAction, deletePropertyAction, type PropertyFormState } from "../actions";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { getAdminPropertyEditData } from "@/lib/data/admin/properties";
import { listPropertyImages } from "@/lib/data/admin/images";
import { listCities, listDistricts, listPropertyTypes, listPurposes, listAmenities } from "@/lib/data/admin/reference";

export const metadata: Metadata = {
  title: "تعديل عقار | لوحة تحكم عودة العقارية",
  robots: { index: false, follow: false },
};

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [property, images, cities, districts, types, purposes, amenities] = await Promise.all([
    getAdminPropertyEditData(id),
    listPropertyImages(id),
    listCities(),
    listDistricts(),
    listPropertyTypes(),
    listPurposes(),
    listAmenities(),
  ]);

  if (!property) return notFound();

  async function boundUpdateAction(prev: PropertyFormState, formData: FormData) {
    "use server";
    return updatePropertyAction(id, prev, formData);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">تعديل: {property.titleAr}</h1>
        <form action={deletePropertyAction.bind(null, id)}>
          <ConfirmSubmitButton
            confirmMessage={`هل أنت متأكد من حذف "${property.titleAr}"؟ لا يمكن التراجع عن هذا الإجراء.`}
            className="rounded-full border border-danger/30 px-4 py-2 text-xs text-danger"
          >
            حذف العقار نهائيًا
          </ConfirmSubmitButton>
        </form>
      </div>

      <div className="mt-6">
        <PropertyForm
          action={boundUpdateAction}
          cities={cities}
          districts={districts}
          types={types}
          purposes={purposes}
          amenities={amenities}
          initial={property}
          submitLabel="حفظ التعديلات"
        />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl text-ink">صور العقار</h2>
        <div className="mt-4">
          <ImagesManager propertyId={id} initialImages={images} />
        </div>
      </div>
    </div>
  );
}
