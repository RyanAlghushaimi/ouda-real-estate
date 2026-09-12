"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";

import {
  createProperty,
  updateProperty,
  deleteProperty,
  setPropertyPublished,
  setPropertyFeatured,
} from "@/lib/data/admin/properties";

import {
  uploadPropertyImage,
  replacePropertyImage,
  deletePropertyImage,
  setPrimaryImage,
  reorderImages,
} from "@/lib/data/admin/images";

import { parsePropertyFormData } from "@/lib/validation/property";

export type PropertyFormState =
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string>;
    }
  | null;

function validationError(
  result: ReturnType<typeof parsePropertyFormData>
): PropertyFormState {
  if (result.success) return null;

  const fieldErrors: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "form");

    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return {
  ok: false,
  error: Object.entries(fieldErrors)
    .map(([field, message]) => `${field}: ${message}`)
    .join(" | "),
  fieldErrors,
};

}

/* -------------------------------------------------------------------------- */
/* Properties                                                                 */
/* -------------------------------------------------------------------------- */

export async function createPropertyAction(
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  await requireAdmin();

  const parsed = parsePropertyFormData(formData);

  if (!parsed.success) {
    return validationError(parsed);
  }

  const result = await createProperty(parsed.data);

  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
    };
  }

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePath("/");

  redirect("/admin/properties");
}

export async function updatePropertyAction(
  id: string,
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  await requireAdmin();

  const parsed = parsePropertyFormData(formData);

  if (!parsed.success) {
    return validationError(parsed);
  }

  const result = await updateProperty(id, parsed.data);

  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
    };
  }

  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${id}`);
  revalidatePath("/properties");
  revalidatePath("/");

  redirect("/admin/properties");
}

export async function deletePropertyAction(id: string) {
  await requireAdmin();

  const result = await deleteProperty(id);

  if (!result.ok) {
    redirect(
      `/admin/properties?error=${encodeURIComponent(result.error)}`
    );
  }

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePath("/");

  redirect("/admin/properties");
}

export async function togglePublishedAction(
  id: string,
  published: boolean
) {
  await requireAdmin();

  const result = await setPropertyPublished(id, published);

  if (!result.ok) {
    redirect(
      `/admin/properties?error=${encodeURIComponent(result.error)}`
    );
  }

  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${id}`);
  revalidatePath("/properties");
  revalidatePath("/");

  redirect("/admin/properties");
}

export async function toggleFeaturedAction(
  id: string,
  featured: boolean
) {
  await requireAdmin();

  const result = await setPropertyFeatured(id, featured);

  if (!result.ok) {
    redirect(
      `/admin/properties?error=${encodeURIComponent(result.error)}`
    );
  }

  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${id}`);
  revalidatePath("/properties");
  revalidatePath("/");

  redirect("/admin/properties");
}

/* -------------------------------------------------------------------------- */
/* Images                                                                     */
/* -------------------------------------------------------------------------- */

export async function uploadImageAction(
  propertyId: string,
  formData: FormData
) {
  await requireAdmin();

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      ok: false as const,
      error: "اختر صورة أولاً",
    };
  }

  const result = await uploadPropertyImage(propertyId, file);

  if (result.ok) {
    revalidatePath(`/admin/properties/${propertyId}`);
  }

  return result;
}

export async function replaceImageAction(
  imageId: string,
  _propertyId: string,
  formData: FormData
) {
  await requireAdmin();

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      ok: false as const,
      error: "اختر صورة أولاً",
    };
  }

  const result = await replacePropertyImage(imageId, file);

  if (result.ok) {
    revalidatePath(`/admin/properties/${_propertyId}`);
  }

  return result;
}

export async function deleteImageAction(
  imageId: string,
  propertyId: string
) {
  await requireAdmin();

  const result = await deletePropertyImage(imageId);

  if (result.ok) {
    revalidatePath(`/admin/properties/${propertyId}`);
  }

  return result;
}

export async function setPrimaryImageAction(
  propertyId: string,
  imageId: string
) {
  await requireAdmin();

  const result = await setPrimaryImage(propertyId, imageId);

  if (result.ok) {
    revalidatePath(`/admin/properties/${propertyId}`);
  }

  return result;
}

export async function reorderImagesAction(
  propertyId: string,
  orderedImageIds: string[]
) {
  await requireAdmin();

  const result = await reorderImages(propertyId, orderedImageIds);

  if (result.ok) {
    revalidatePath(`/admin/properties/${propertyId}`);
  }

  return result;
}
