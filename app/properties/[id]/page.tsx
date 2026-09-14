import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PropertyCard from "@/components/PropertyCard";
import { Badge } from "@/components/ui/Badge";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import LeadForm from "@/components/LeadForm";
import { getPropertyById, getRelatedProperties, formatPrice } from "@/lib/data/properties";
import { getContactSettings } from "@/lib/data/admin/settings";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionary";
import {
  localizedTitle,
  localizedDescription,
  localizedCity,
  localizedDistrict,
  localizedType,
} from "@/lib/i18n/property";
import { SITE_URL } from "@/lib/site";

type Params = { id: string };

// ملاحظة: تمت إزالة generateStaticParams المبني على مصفوفة ثابتة، لأن قائمة
// العقارات أصبحت تُجلب بشكل غير متزامن (Supabase أو Mock). الصفحة الآن تُصيَّر
// عند الطلب (on-demand)، وهو سلوك أنسب أثناء مرحلة الربط التدريجي بقاعدة
// البيانات؛ يمكن إعادة تفعيل التوليد الثابت لاحقًا عبر استدعاء غير متزامن
// لقائمة الـslugs عند استقرار البيانات الحقيقية.

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getPropertyById(id);
  if (!p) return { title: "عقار غير موجود | عودة العقارية" };

  // بيانات SEO المُدخلة يدويًا من لوحة التحكم (إن وُجدت) تُستخدم أولًا؛
  // وإلا يُبنى عنوان ووصف تلقائيًا من بيانات العقار نفسه.
  const title = p.metaTitle || `${p.title} - ${p.district}، ${p.city} | عودة العقارية`;
  const description = p.metaDescription || `${p.description.slice(0, 140)}…`;
  const canonicalUrl = `${SITE_URL}/properties/${p.id}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      images: [{ url: p.image }],
      type: "website",
      url: canonicalUrl,
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const p = await getPropertyById(id);
  if (!p) return notFound();

  const [related, contact, locale] = await Promise.all([
    getRelatedProperties(p),
    getContactSettings(),
    getLocale(),
  ]);

  const title = localizedTitle(p, locale);
  const description = localizedDescription(p, locale);
  const city = localizedCity(p, locale);
  const district = localizedDistrict(p, locale);
  const type = localizedType(p, locale);

  const waMessage = encodeURIComponent(`أرغب بالاستفسار عن العقار ${p.title} (رقم ${p.refNo})`);
  const waNumber = contact.whatsapp.replace(/[^0-9]/g, "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.description,
    url: `${SITE_URL}/properties/${p.id}`,
    image: p.images,
    address: {
      "@type": "PostalAddress",
      addressLocality: p.city,
      addressRegion: p.district,
      addressCountry: "SA",
    },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "SAR",
    },
  };

  return (
    <div className="min-h-screen">
      {/* Structured data لتحسين ظهور العقار في نتائج البحث */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <nav className="mx-auto max-w-6xl px-5 pt-6 text-xs text-ink-faint sm:px-6 lg:px-10">
        <span>{t(locale, "nav_home")}</span> / <span>{t(locale, "nav_properties")}</span> /{" "}
        <span className="text-ink-soft">{title}</span>
      </nav>

      <section className="mx-auto max-w-6xl px-5 pt-4 sm:px-6 lg:px-10">
        <div className="grid gap-2.5 sm:grid-cols-4">
          <div className="overflow-hidden rounded-2xl sm:col-span-3">
            <ImageWithFallback src={p.images[0]} alt={title} className="h-[260px] w-full object-cover sm:h-[420px]" />
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-rows-2 sm:grid-cols-1">
            {(p.images.length > 1 ? p.images.slice(1, 3) : [p.images[0], p.images[0]]).map((img, i) => (
              <ImageWithFallback key={i} src={img} alt="" className="h-full max-h-[130px] w-full rounded-2xl object-cover sm:max-h-none" />
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="line">#{p.refNo}</Badge>
              <Badge tone="ink">{p.purpose === "sale" ? t(locale, "for_sale_label") : t(locale, "for_rent_label")}</Badge>
              <Badge tone="pine">{type}</Badge>
            </div>

            <h1 className="mt-4 font-display text-2xl text-ink sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-ink-soft sm:text-base">{district}، {city}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-line p-5 sm:grid-cols-4">
              <div>
                <div className="text-xs text-ink-soft">{t(locale, "detail_area")}</div>
                <div className="mt-1 font-display text-lg">{p.area} {locale === "en" ? "sqm" : "م²"}</div>
              </div>
              {p.bedrooms > 0 && (
                <div>
                  <div className="text-xs text-ink-soft">{t(locale, "detail_bedrooms")}</div>
                  <div className="mt-1 font-display text-lg">{p.bedrooms}</div>
                </div>
              )}
              {p.bathrooms > 0 && (
                <div>
                  <div className="text-xs text-ink-soft">{t(locale, "detail_bathrooms")}</div>
                  <div className="mt-1 font-display text-lg">{p.bathrooms}</div>
                </div>
              )}
              {p.parking > 0 && (
                <div>
                  <div className="text-xs text-ink-soft">{t(locale, "detail_parking")}</div>
                  <div className="mt-1 font-display text-lg">{p.parking}</div>
                </div>
              )}
            </div>

            <h2 className="mt-10 font-display text-xl text-ink">{t(locale, "detail_description")}</h2>
            <p className="mt-3 leading-8 text-ink-soft">{description}</p>

            {p.features.length > 0 && (
              <>
                <h2 className="mt-10 font-display text-xl text-ink">{t(locale, "detail_features")}</h2>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm text-ink-soft">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2 className="mt-10 font-display text-xl text-ink">{t(locale, "detail_location")}</h2>
            <div className="mt-4 h-64 overflow-hidden rounded-2xl border border-line">
              <iframe
                title={t(locale, "detail_location")}
                className="h-full w-full grayscale-[15%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${p.lng - 0.02}%2C${p.lat - 0.02}%2C${p.lng + 0.02}%2C${p.lat + 0.02}&layer=mapnik&marker=${p.lat}%2C${p.lng}`}
              />
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
            <div className="font-display text-xl text-brass-deep sm:text-2xl">
              {formatPrice(p.price, locale)} {locale === "en" ? "SAR" : "ر.س"}
{p.purpose === "rent" ? ` ${t(locale, "annually")}` : ""}
            </div>
            <p className="mt-1 text-xs text-ink-faint">{t(locale, "detail_price_note")}</p>

            <a
              href={`https://wa.me/${waNumber}?text=${waMessage}`}
              className="mt-5 block rounded-full bg-pine px-4 py-3 text-center text-sm text-white transition-colors hover:bg-pine/90"
            >
              {t(locale, "detail_whatsapp")}
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="mt-3 block rounded-full border border-line px-4 py-3 text-center text-sm text-ink transition-colors hover:border-ink"
            >
              {t(locale, "detail_call")}
            </a>

            <LeadForm propertyId={p.id} locale={locale} />
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl text-ink">{t(locale, "detail_related")}</h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {related.map((r) => (
                <PropertyCard key={r.id} p={r} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="h-16 sm:h-24" />
      <SiteFooter />
    </div>
  );
}
