import type { Metadata } from "next";
import { getContactSettings, getSeoSettings } from "@/lib/data/admin/settings";
import { updateContactSettingsAction, updateSeoSettingsAction } from "./actions";

export const metadata: Metadata = {
  title: "إعدادات الموقع | لوحة تحكم عودة العقارية",
  robots: { index: false, follow: false },
};

const inputClass = "w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint";
const labelClass = "mb-1 block text-xs text-ink-soft";

export default async function AdminSettingsPage() {
  const [contact, seo] = await Promise.all([getContactSettings(), getSeoSettings()]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl text-ink">إعدادات الموقع</h1>
        <p className="mt-1 text-sm text-ink-soft">
          هذه القيم تحل محل الأرقام والروابط الثابتة (Hard-coded) في الموقع العام تدريجيًا.
        </p>
      </div>

      <form action={updateContactSettingsAction} className="space-y-4 rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-lg text-ink">بيانات التواصل والشركة</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>اسم الشركة بالعربي</label>
            <input name="companyNameAr" defaultValue={contact.companyNameAr} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>اسم الشركة بالإنجليزي</label>
            <input name="companyNameEn" dir="ltr" defaultValue={contact.companyNameEn} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>رقم الهاتف</label>
            <input name="phone" dir="ltr" defaultValue={contact.phone} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>واتساب</label>
            <input name="whatsapp" dir="ltr" defaultValue={contact.whatsapp} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>البريد الإلكتروني</label>
            <input name="email" dir="ltr" defaultValue={contact.email} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>العنوان</label>
            <input name="addressAr" defaultValue={contact.addressAr} className={inputClass} />
          </div>
        </div>

        <div className="grid gap-4 border-t border-line pt-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Instagram</label>
            <input name="instagram" dir="ltr" defaultValue={contact.social?.instagram} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>X / Twitter</label>
            <input name="twitter" dir="ltr" defaultValue={contact.social?.twitter} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Snapchat</label>
            <input name="snapchat" dir="ltr" defaultValue={contact.social?.snapchat} className={inputClass} />
          </div>
        </div>

        <button type="submit" className="rounded-full bg-pine px-5 py-2.5 text-sm text-white hover:bg-pine-deep">
          حفظ بيانات التواصل
        </button>
      </form>

      <form action={updateSeoSettingsAction} className="space-y-4 rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-lg text-ink">إعدادات SEO العامة</h2>

        <div>
          <label className={labelClass}>العنوان الافتراضي (Default Title)</label>
          <input name="defaultTitleAr" defaultValue={seo.defaultTitleAr} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>الوصف الافتراضي (Default Description)</label>
          <textarea name="defaultDescriptionAr" defaultValue={seo.defaultDescriptionAr} rows={2} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>رابط صورة Open Graph الافتراضية</label>
          <input name="ogImage" dir="ltr" defaultValue={seo.ogImage} className={inputClass} placeholder="https://..." />
        </div>

        <button type="submit" className="rounded-full bg-pine px-5 py-2.5 text-sm text-white hover:bg-pine-deep">
          حفظ إعدادات SEO
        </button>
      </form>
    </div>
  );
}
