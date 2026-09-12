import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { getContactSettings } from "@/lib/data/admin/settings";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionary";

export default async function SiteHeader() {
  const [contact, locale] = await Promise.all([getContactSettings(), getLocale()]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-[65px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-display text-xl text-ink sm:text-2xl">عودة</span>
          <span className="text-xs tracking-wide text-ink-soft">العقارية</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          <Link href="/" className="transition-colors hover:text-ink">{t(locale, "nav_home")}</Link>
          <Link href="/properties" className="transition-colors hover:text-ink">{t(locale, "nav_properties")}</Link>
          <Link href="/properties?purpose=sale" className="transition-colors hover:text-ink">{t(locale, "nav_for_sale")}</Link>
          <Link href="/properties?purpose=rent" className="transition-colors hover:text-ink">{t(locale, "nav_for_rent")}</Link>
          <Link href="#contact" className="transition-colors hover:text-ink">{t(locale, "nav_contact")}</Link>
        </nav>

        <div className="flex items-center gap-3">
	<LanguageToggle locale={locale} />
	<ThemeToggle />
          <a
            href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
            className="hidden rounded-full bg-pine px-5 py-2.5 text-sm text-white transition-colors hover:bg-pine/90 md:inline-block"
          >
            {t(locale, "nav_whatsapp")}
          </a>
          <MobileMenu locale={locale} whatsapp={contact.whatsapp} />
        </div>
      </div>
    </header>
  );
}
