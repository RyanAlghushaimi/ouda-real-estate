"use server";

import { createLead, type CreateLeadResult } from "@/lib/data/properties";

// Server Action — تعمل فقط على الخادم، لا تُعرّض أي مفاتيح أو منطق حساس
// للمتصفح. تُستدعى مباشرة من عنصر <form action={submitLeadAction}> في صفحة
// تفاصيل العقار (وأي نموذج تواصل آخر لاحقًا).
export async function submitLeadAction(
  _prevState: CreateLeadResult | null,
  formData: FormData
): Promise<CreateLeadResult> {
  const name = String(formData.get("name") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const propertyId = formData.get("propertyId");

  return createLead({
    name,
    phone,
    propertyId: propertyId ? String(propertyId) : undefined,
    source: "website",
  });
}
