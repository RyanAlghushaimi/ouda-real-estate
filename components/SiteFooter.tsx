import Link from "next/link";
import { getContactSettings } from "@/lib/data/admin/settings";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionary";

export default async function SiteFooter() {
  const [contact, locale] = await Promise.all([
    getContactSettings(),
    getLocale(),
  ]);

  const companyName =
    locale === "en" ? contact.companyNameEn : contact.companyNameAr;

  return (
    <footer id="contact" className="border-t border-line bg-ink text-bg">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-4 lg:px-10">
        <div>
          <div className="font-display text-2xl">{companyName}</div>
          <p className="mt-3 max-w-xs text-sm leading-7 text-bg/70">
            {t(locale, "footer_tagline")}
          </p>
        </div>

        <div>
          <div className="text-sm text-brass">
            {t(locale, "footer_browse")}
          </div>

          <ul className="mt-4 space-y-2 text-sm text-bg/80">
            <li>
              <Link
                href="/properties"
                className="hover:text-white"
              >
                {t(locale, "footer_all_properties")}
              </Link>
            </li>

            <li>
              <Link
                href="/properties?purpose=sale"
                className="hover:text-white"
              >
                {t(locale, "footer_for_sale")}
              </Link>
            </li>

            <li>
              <Link
                href="/properties?purpose=rent"
                className="hover:text-white"
              >
                {t(locale, "footer_for_rent")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm text-brass">
            {t(locale, "footer_company")}
          </div>

          <ul className="mt-4 space-y-2 text-sm text-bg/80">
            <li>
              <Link href="/about" className="hover:text-white">
                {t(locale, "footer_about")}
              </Link>
            </li>

            <li>
              <Link href="/privacy" className="hover:text-white">
                {t(locale, "footer_privacy")}
              </Link>
            </li>

            <li>
              <Link href="/terms" className="hover:text-white">
                {t(locale, "footer_terms")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm text-brass">
            {t(locale, "footer_contact")}
          </div>

          <ul className="mt-4 space-y-2 text-sm text-bg/80">
            <li dir="ltr" className="text-right">
              {contact.phone}
            </li>

            <li dir="ltr" className="text-right">
              {contact.email}
            </li>

            <li>{contact.addressAr}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-bg/50">
        © {new Date().getFullYear()} {companyName}.{" "}
        {t(locale, "footer_rights")}.
      </div>
    </footer>
  );
}
