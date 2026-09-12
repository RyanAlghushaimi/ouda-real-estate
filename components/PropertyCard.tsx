import Link from "next/link";
import type { Property } from "@/lib/properties";
import { formatPrice } from "@/lib/properties";
import { Badge } from "@/components/ui/Badge";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { Locale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionary";
import { localizedTitle, localizedCity, localizedDistrict } from "@/lib/i18n/property";

export default function PropertyCard({ p, locale = "ar" }: { p: Property; locale?: Locale }) {
  return (
    <Link
      href={`/properties/${p.id}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-surface transition-shadow duration-300 hover:shadow-[0_18px_40px_-20px_rgba(31,36,31,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={p.image}
          alt={localizedTitle(p, locale)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <Badge tone="ink">{p.purpose === "sale" ? t(locale, "for_sale_label") : t(locale, "for_rent_label")}</Badge>
          {p.featured && <Badge tone="brass">{locale === "en" ? "Featured" : "مميز"}</Badge>}
        </div>
        {p.status === "تحت الإنشاء" && (
          <div className="absolute inset-x-3 bottom-3">
            <Badge tone="pine">{locale === "en" ? "Under Construction" : "تحت الإنشاء"}</Badge>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-display text-lg text-ink line-clamp-1">{localizedTitle(p, locale)}</h3>
        <p className="mt-1 text-sm text-ink-soft line-clamp-1">
          {localizedDistrict(p, locale)}، {localizedCity(p, locale)}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4">
          <span className="font-display text-base text-brass-deep sm:text-lg">
            {formatPrice(p.price)} {locale === "en" ? "SAR" : "ر.س"}{p.purpose === "rent" ? ` ${t(locale, "annually")}` : ""}
          </span>
          <span className="shrink-0 text-xs text-ink-faint">#{p.refNo}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
          {p.bedrooms > 0 && <span>{p.bedrooms} {locale === "en" ? "beds" : "غرف"}</span>}
          {p.bathrooms > 0 && <span>{p.bathrooms} {locale === "en" ? "baths" : "حمامات"}</span>}
          <span>{p.area} {locale === "en" ? "sqm" : "م²"}</span>
        </div>
      </div>
    </Link>
  );
}
