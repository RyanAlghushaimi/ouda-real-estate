import { setLocaleAction } from "@/app/actions/locale";
import type { Locale } from "@/lib/i18n/locale";

export default function LanguageToggle({ locale }: { locale: Locale }) {
  const target: Locale = locale === "ar" ? "en" : "ar";

  return (
    <form action={setLocaleAction.bind(null, target)}>
      <button
        type="submit"
        className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink"
      >
        {locale === "ar" ? "EN" : "عربي"}
      </button>
    </form>
  );
}
