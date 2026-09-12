import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale";

const content = {
  ar: {
    back: "العودة إلى الرئيسية",
    title: "من نحن",
    sections: [
      {
        title: "عودة العقارية",
        text: "عودة العقارية منصة متخصصة في عرض وتسويق العقارات، ونسعى إلى تقديم تجربة واضحة وسهلة تساعد العملاء على الوصول إلى العقار المناسب وفق احتياجاتهم وتطلعاتهم.",
      },
      {
        title: "رؤيتنا",
        text: "أن نكون منصة عقارية موثوقة تجمع بين جودة العرض وسهولة الوصول إلى المعلومات، مع تقديم تجربة رقمية عصرية تلبي احتياجات الباحثين عن العقارات في المملكة العربية السعودية.",
      },
      {
        title: "رسالتنا",
        text: "نعمل على تسهيل رحلة البحث عن العقار من خلال عرض معلومات العقارات بطريقة منظمة وواضحة، وتوفير قنوات تواصل مباشرة مع فريقنا.",
      },
      {
        title: "ما نقدمه",
        text: "نوفر مجموعة من الخدمات العقارية التي تشمل عرض العقارات السكنية والتجارية، وتسهيل التواصل والاستفسارات، ومساعدة العملاء في الوصول إلى الخيارات العقارية المناسبة لهم.",
      },
    ],
  },

  en: {
    back: "Back to Home",
    title: "About Us",
    sections: [
      {
        title: "Ouda Real Estate",
        text: "Ouda Real Estate is a platform specialized in showcasing and marketing properties. We aim to provide a clear and convenient experience that helps clients find properties that match their needs and expectations.",
      },
      {
        title: "Our Vision",
        text: "Our vision is to become a trusted real estate platform that combines quality property listings with easy access to information, while providing a modern digital experience for property seekers across the Kingdom of Saudi Arabia.",
      },
      {
        title: "Our Mission",
        text: "We aim to simplify the property search journey by presenting real estate information in a clear and organized way and providing direct communication channels with our team.",
      },
      {
        title: "What We Offer",
        text: "We provide a range of real estate services, including residential and commercial property listings, direct communication and inquiries, and assistance in finding suitable property options.",
      },
    ],
  },
} as const;

export default async function AboutPage() {
  const locale = await getLocale();
  const isArabic = locale === "ar";
  const page = content[locale];

  return (
    <main
      className="min-h-screen bg-bg text-ink"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-pine transition-colors hover:text-brass"
        >
          {page.back}
        </Link>

        <h1 className="mb-8 text-4xl font-semibold tracking-tight sm:text-5xl">
          {page.title}
        </h1>

        <div className="space-y-8 text-base leading-8 text-ink-soft">
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-2xl font-semibold text-ink">
                {section.title}
              </h2>

              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
