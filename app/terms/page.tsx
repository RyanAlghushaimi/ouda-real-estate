import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale";

const content = {
  ar: {
    back: "العودة إلى الرئيسية",
    title: "الشروط والأحكام",
    sections: [
      {
        title: "استخدام الموقع",
        text: "باستخدامك موقع عودة العقارية، فإنك توافق على الالتزام بهذه الشروط والأحكام وجميع الأنظمة واللوائح المعمول بها.",
      },
      {
        title: "معلومات العقارات",
        text: "نبذل جهودًا معقولة للمحافظة على دقة المعلومات المنشورة عن العقارات، إلا أن الأسعار والتوفر والمواصفات قد تتغير دون إشعار مسبق، لذلك يوصى بالتأكد من المعلومات قبل اتخاذ أي قرار.",
      },
      {
        title: "طلبات التواصل",
        text: "إرسال نموذج التواصل أو الاستفسار عن عقار لا يعني إتمام عملية بيع أو شراء أو حجز، وإنما يمثل طلبًا للتواصل والاستفسار.",
      },
      {
        title: "مسؤولية المستخدم",
        text: "يتحمل المستخدم مسؤولية صحة المعلومات التي يقدمها من خلال الموقع، ويلتزم باستخدام الموقع وخدماته بطريقة نظامية ومشروعة.",
      },
      {
        title: "الملكية الفكرية",
        text: "جميع المحتويات والعلامات التجارية والتصاميم والعناصر الموجودة في الموقع مملوكة لعودة العقارية أو مستخدمة بموجب حقوق تسمح بذلك، ولا يجوز نسخها أو إعادة استخدامها دون إذن.",
      },
      {
        title: "الروابط والخدمات الخارجية",
        text: "قد يحتوي الموقع على روابط أو خدمات تابعة لأطراف أخرى. ولا تتحمل عودة العقارية مسؤولية محتوى أو ممارسات المواقع والخدمات الخارجية.",
      },
      {
        title: "حدود المسؤولية",
        text: "يتم توفير محتوى الموقع لأغراض المعلومات والتواصل العقاري. ولا ينبغي اعتبار المعلومات المنشورة بحد ذاتها عرضًا تعاقديًا نهائيًا أو ضمانًا لإتمام أي معاملة.",
      },
      {
        title: "تحديث الشروط",
        text: "تحتفظ عودة العقارية بحق تعديل هذه الشروط عند الحاجة، وتصبح التعديلات نافذة عند نشرها على الموقع.",
      },
    ],
  },

  en: {
    back: "Back to Home",
    title: "Terms and Conditions",
    sections: [
      {
        title: "Use of the Website",
        text: "By using the Ouda Real Estate website, you agree to comply with these terms and conditions and all applicable laws and regulations.",
      },
      {
        title: "Property Information",
        text: "We make reasonable efforts to maintain accurate property information. However, prices, availability, and specifications may change without prior notice, and users are encouraged to verify information before making any decision.",
      },
      {
        title: "Contact Requests",
        text: "Submitting a contact form or property inquiry does not constitute a completed sale, purchase, or reservation. It represents a request for communication and information.",
      },
      {
        title: "User Responsibility",
        text: "Users are responsible for the accuracy of the information they provide through the website and agree to use the website and its services lawfully and appropriately.",
      },
      {
        title: "Intellectual Property",
        text: "All content, trademarks, designs, and elements available on the website are owned by Ouda Real Estate or used under applicable rights and may not be copied or reused without permission.",
      },
      {
        title: "External Links and Services",
        text: "The website may contain links to or services provided by third parties. Ouda Real Estate is not responsible for the content or practices of external websites and services.",
      },
      {
        title: "Limitation of Liability",
        text: "Website content is provided for informational and real estate communication purposes. Published information should not by itself be considered a final contractual offer or a guarantee that any transaction will be completed.",
      },
      {
        title: "Changes to These Terms",
        text: "Ouda Real Estate reserves the right to update these terms when necessary. Changes become effective when published on the website.",
      },
    ],
  },
} as const;

export default async function TermsPage() {
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
