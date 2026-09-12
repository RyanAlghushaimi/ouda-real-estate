import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PropertyCard from "@/components/PropertyCard";
import PropertiesMapLoader from "@/components/PropertiesMapLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { getCities, getPropertyTypes, filterProperties, filterPropertiesPaginated } from "@/lib/data/properties";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionary";

export const metadata: Metadata = {
  title: "جميع العقارات | عودة العقارية",
  description: "تصفح جميع العقارات المتاحة للبيع والإيجار مع إمكانية الفلترة حسب المدينة، النوع، السعر، والمساحة.",
};

type SearchParams = {
  city?: string;
  purpose?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  sort?: string;
  view?: string;
  page?: string;
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isMapView = params.view === "map";
  const currentPage = Math.max(1, Number(params.page) || 1);

  // عرض الخريطة يحتاج كل النتائج المطابقة للفلاتر دفعة واحدة (لعرض كل
  // الـMarkers)، بينما عرض القائمة مصفّح (Paginated) لتفادي جلب كل العقارات
  // دفعة واحدة عند نموها.
  const [mapList, paginated, cities, propertyTypes, locale] = await Promise.all([
    isMapView ? filterProperties(params) : Promise.resolve([]),
    isMapView ? Promise.resolve(null) : filterPropertiesPaginated(params, currentPage, 12),
    getCities(),
    getPropertyTypes(),
    getLocale(),
  ]);

  const list = isMapView ? mapList : paginated!.items;
  const total = isMapView ? mapList.length : paginated!.total;
  const totalPages = isMapView ? 1 : paginated!.totalPages;

  const hasActiveFilters = Boolean(
    params.city || params.purpose || params.type || params.minPrice || params.maxPrice || params.bedrooms
  );

  function pageHref(page: number) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (key !== "page" && value) query.set(key, value);
    });
    if (page > 1) query.set("page", String(page));
    const qs = query.toString();
    return `/properties${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-6 sm:pt-14 lg:px-10">
        <p className="text-sm text-brass">{t(locale, "properties_kicker")}</p>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-4xl">{t(locale, "properties_title")}</h1>
        <p className="mt-3 max-w-xl text-sm text-ink-soft sm:text-base">{t(locale, "properties_subtitle")}</p>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-5 sm:mt-10 sm:px-6 lg:px-10">
        <form className="grid grid-cols-2 gap-2.5 rounded-2xl border border-line bg-surface p-3.5 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-7">
          {/* حفظ view الحالي عند إرسال الفلاتر */}
          {isMapView && <input type="hidden" name="view" value="map" />}

          <select name="city" defaultValue={params.city ?? ""} className="rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink">
            <option value="">{t(locale, "filter_all_cities")}</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select name="purpose" defaultValue={params.purpose ?? ""} className="rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink">
            <option value="">{t(locale, "filter_all_sale_rent")}</option>
            <option value="sale">{t(locale, "nav_for_sale")}</option>
            <option value="rent">{t(locale, "nav_for_rent")}</option>
          </select>

          <select name="type" defaultValue={params.type ?? ""} className="rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink">
            <option value="">{t(locale, "filter_all_types")}</option>
            {propertyTypes.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>

          <input
            type="number"
            name="minPrice"
            defaultValue={params.minPrice ?? ""}
            placeholder={t(locale, "filter_min_price")}
            className="rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint"
          />

          <input
            type="number"
            name="maxPrice"
            defaultValue={params.maxPrice ?? ""}
            placeholder={t(locale, "filter_max_price")}
            className="rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint"
          />

          <select name="bedrooms" defaultValue={params.bedrooms ?? ""} className="rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink">
            <option value="">{t(locale, "filter_bedrooms")}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>

          <select name="sort" defaultValue={params.sort ?? ""} className="rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink">
            <option value="">{t(locale, "filter_sort_newest")}</option>
            <option value="price-asc">{t(locale, "filter_sort_price_asc")}</option>
            <option value="price-desc">{t(locale, "filter_sort_price_desc")}</option>
            <option value="area-desc">{t(locale, "filter_sort_area_desc")}</option>
          </select>

          <button
            type="submit"
            className="col-span-2 rounded-xl bg-ink px-4 py-2.5 text-sm text-white transition-colors hover:bg-pine sm:col-span-1 lg:col-span-2"
          >
            {t(locale, "filter_apply")}
          </button>
          {hasActiveFilters && (
            <a
              href={isMapView ? "/properties?view=map" : "/properties"}
              className="col-span-2 rounded-xl border border-line px-4 py-2.5 text-center text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink sm:col-span-1 lg:col-span-1"
            >
              {t(locale, "filter_clear")}
            </a>
          )}
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-ink-soft">{total} {t(locale, "results_available")}</p>

          <div className="flex items-center gap-1 rounded-full border border-line p-1 text-xs">
            <Link
              href={{ pathname: "/properties", query: { ...params, view: undefined, page: undefined } }}
              className={`rounded-full px-3 py-1.5 transition-colors ${!isMapView ? "bg-ink text-white" : "text-ink-soft"}`}
            >
              {t(locale, "view_list")}
            </Link>
            <Link
              href={{ pathname: "/properties", query: { ...params, view: "map", page: undefined } }}
              className={`rounded-full px-3 py-1.5 transition-colors ${isMapView ? "bg-ink text-white" : "text-ink-soft"}`}
            >
              {t(locale, "view_map")}
            </Link>
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState
            title={t(locale, "empty_title")}
            description={t(locale, "empty_description")}
            action={<LinkButton href="/properties" variant="outline">{t(locale, "filter_clear")}</LinkButton>}
          />
        ) : isMapView ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="order-2 h-[420px] lg:order-1 lg:col-span-2 lg:h-[560px]">
              <PropertiesMapLoader properties={list} />
            </div>
            <div className="order-1 flex max-h-[560px] flex-col gap-4 overflow-y-auto lg:order-2">
              {list.map((p) => (
                <PropertyCard key={p.id} p={p} locale={locale} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {list.map((p) => (
                <PropertyCard key={p.id} p={p} locale={locale} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2">
                <Link
                  href={pageHref(currentPage - 1)}
                  aria-disabled={currentPage <= 1}
                  className={`rounded-full border border-line px-4 py-2 text-sm ${
                    currentPage <= 1 ? "pointer-events-none opacity-40" : "text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  {t(locale, "pagination_prev")}
                </Link>
                <span className="px-3 text-sm text-ink-soft">
                  {t(locale, "pagination_page")} {currentPage} / {totalPages}
                </span>
                <Link
                  href={pageHref(currentPage + 1)}
                  aria-disabled={currentPage >= totalPages}
                  className={`rounded-full border border-line px-4 py-2 text-sm ${
                    currentPage >= totalPages ? "pointer-events-none opacity-40" : "text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  {t(locale, "pagination_next")}
                </Link>
              </nav>
            )}
          </>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
