import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PropertyCard from "@/components/PropertyCard";
import { LinkButton } from "@/components/ui/Button";
import { getCities, getPropertyTypes, getAreaHighlights, filterProperties } from "@/lib/data/properties";
import { getContactSettings } from "@/lib/data/admin/settings";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionary";

export const metadata: Metadata = {
  title: "عودة العقارية | منصة العقارات للبيع والإيجار",
  description:
    "تصفح أفضل العقارات للبيع والإيجار في الرياض وجدة والدمام مع عودة العقارية. فلل، شقق، أراضٍ، ودوبلكسات بمعاينة موثوقة.",
};

export default async function Home() {
  const [properties, cities, propertyTypes, areaHighlights, contact, locale] = await Promise.all([
    filterProperties({}),
    getCities(),
    getPropertyTypes(),
    getAreaHighlights(),
    getContactSettings(),
    getLocale(),
  ]);

  const featured = properties.filter((p) => p.featured);
  const forSale = properties.filter((p) => p.purpose === "sale").slice(0, 3);
  const forRent = properties.filter((p) => p.purpose === "rent").slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[68vh] min-h-[460px] w-full overflow-hidden sm:h-[72vh] lg:h-[78vh]">

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80"
            alt="عقار فاخر"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-7xl px-5 pb-28 sm:px-6 sm:pb-24 lg:px-10">
              <p className="text-sm tracking-wide text-brass">{t(locale, "hero_kicker")}</p>
              <h1 className="mt-3 max-w-2xl font-display text-3xl leading-[1.35] text-white sm:text-5xl sm:leading-[1.3]">
                {t(locale, "hero_title")}
              </h1>
              <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
                {t(locale, "hero_subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Search bar overlapping hero */}
        <div className="relative z-10 mx-auto -mt-8 max-w-5xl px-4 sm:-mt-10 sm:px-6 lg:px-0">
          <form
            action="/properties"
            className="grid grid-cols-2 gap-2.5 rounded-2xl border border-line bg-surface p-3.5 shadow-[0_20px_50px_-25px_rgba(31,36,31,0.5)] sm:grid-cols-4 sm:gap-3 sm:p-4"
          >
            <select name="city" className="col-span-1 rounded-xl border border-line bg-bg px-3 py-3 text-sm text-ink sm:px-4">
              <option value="">{t(locale, "search_city")}</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select name="purpose" className="col-span-1 rounded-xl border border-line bg-bg px-3 py-3 text-sm text-ink sm:px-4">
              <option value="">{t(locale, "search_purpose")}</option>
              <option value="sale">{t(locale, "nav_for_sale")}</option>
              <option value="rent">{t(locale, "nav_for_rent")}</option>
            </select>
            <select name="type" className="col-span-1 rounded-xl border border-line bg-bg px-3 py-3 text-sm text-ink sm:px-4">
              <option value="">{t(locale, "search_type")}</option>
              {propertyTypes.map((pt) => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
            <button
              type="submit"
              className="col-span-1 rounded-xl bg-ink px-4 py-3 text-sm text-white transition-colors hover:bg-pine"
            >
              {t(locale, "search_submit")}
            </button>
          </form>
        </div>
      </section>

      {/* Featured properties */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-6 sm:pt-24 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-brass">{t(locale, "section_featured_kicker")}</p>
            <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{t(locale, "section_featured")}</h2>
          </div>
          <Link href="/properties" className="shrink-0 text-sm text-ink-soft transition-colors hover:text-ink">
            {t(locale, "view_all")} ←
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} p={p} locale={locale} />
          ))}
        </div>
      </section>

      {/* Featured areas */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-6 sm:pt-24 lg:px-10">
        <p className="text-sm text-brass">{t(locale, "section_areas_kicker")}</p>
        <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{t(locale, "section_areas")}</h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
          {areaHighlights.map((a) => (
            <Link
              key={a.name}
              href={`/properties?city=${encodeURIComponent(a.city)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.image}
                alt={a.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-lg text-white">{a.name}</h3>
                <p className="text-xs text-white/75">{a.listingsCount} {locale === "en" ? "listings" : "عقار متاح"}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* For sale */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-6 sm:pt-24 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">{t(locale, "section_for_sale")}</h2>
          <Link href="/properties?purpose=sale" className="shrink-0 text-sm text-ink-soft transition-colors hover:text-ink">
            {t(locale, "view_all")} ←
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {forSale.map((p) => (
            <PropertyCard key={p.id} p={p} locale={locale} />
          ))}
        </div>
      </section>

      {/* For rent */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-6 sm:pt-24 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">{t(locale, "section_for_rent")}</h2>
          <Link href="/properties?purpose=rent" className="shrink-0 text-sm text-ink-soft transition-colors hover:text-ink">
            {t(locale, "view_all")} ←
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {forRent.map((p) => (
            <PropertyCard key={p.id} p={p} locale={locale} />
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-28 sm:px-6 lg:px-10">
        <div className="grid gap-10 rounded-3xl bg-card p-6 sm:grid-cols-2 sm:p-10 lg:p-16">
          <div>
            <p className="text-sm text-brass">{t(locale, "about_kicker")}</p>
            <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{t(locale, "about_title")}</h2>
            <p className="mt-4 max-w-md leading-8 text-ink-soft">{t(locale, "about_body")}</p>
            <LinkButton href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`} variant="primary" size="lg" className="mt-6">
              {t(locale, "about_cta")}
            </LinkButton>
          </div>
          <div className="grid grid-cols-2 gap-6 self-center">
  <div>
    <div className="font-display text-3xl text-ink sm:text-4xl">+1000</div>
    <p className="mt-1 text-sm text-ink-soft">{t(locale, "stat_listed")}</p>
  </div>

  <div>
    <div className="font-display text-3xl text-ink sm:text-4xl">+1000</div>
    <p className="mt-1 text-sm text-ink-soft">{t(locale, "stat_areas")}</p>
  </div>

  <div>
    <div className="font-display text-3xl text-ink sm:text-4xl">+4000</div>
    <p className="mt-1 text-sm text-ink-soft">{t(locale, "stat_clients")}</p>
  </div>

  <div>
    <div className="font-display text-3xl text-ink sm:text-4xl">+20</div>
    <p className="mt-1 text-sm text-ink-soft">{t(locale, "stat_years")}</p>
  </div>
</div>

        </div>
      </section>

      <div className="h-16 sm:h-24" />
      <SiteFooter />
    </div>
  );
}
