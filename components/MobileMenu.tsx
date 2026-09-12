"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/dictionary";

export default function MobileMenu({ locale, whatsapp }: { locale: Locale; whatsapp: string }) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t(locale, "nav_home") },
    { href: "/properties", label: t(locale, "nav_properties") },
    { href: "/properties?purpose=sale", label: t(locale, "nav_for_sale") },
    { href: "/properties?purpose=rent", label: t(locale, "nav_for_rent") },
    { href: "#contact", label: t(locale, "nav_contact") },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line"
      >
        <span
          className={`h-0.5 w-5 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`h-0.5 w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
        <span
          className={`h-0.5 w-5 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div className="fixed inset-0 top-[65px] z-30 bg-bg">
          <nav className="flex flex-col gap-1 px-6 py-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-lg text-ink"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
              className="mt-6 rounded-full bg-pine px-5 py-3 text-center text-sm text-white"
            >
              {t(locale, "nav_whatsapp")}
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
