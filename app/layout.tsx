import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { getLocale } from "@/lib/i18n/locale";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "عودة العقارية",
  description: "منصة عودة العقارية لعرض العقارات وتسويقها",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
