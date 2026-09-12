import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale";

const content = {
  ar: {
    back: "العودة إلى الرئيسية",
    title: "سياسة الخصوصية",
    sections: [
      {
        title: "مقدمة",
        text: "نحرص في عودة العقارية على احترام خصوصية زوار الموقع وحماية بياناتهم الشخصية. توضح هذه السياسة كيفية جمع المعلومات واستخدامها وحمايتها عند استخدام موقعنا وخدماتنا.",
      },
      {
        title: "المعلومات التي نجمعها",
        text: "قد نجمع المعلومات التي يقدمها المستخدم بشكل مباشر عند التواصل معنا أو إرسال طلب، مثل الاسم ورقم الهاتف والبريد الإلكتروني والمعلومات المتعلقة بالطلب العقاري.",
      },
      {
        title: "كيفية استخدام المعلومات",
        text: "نستخدم المعلومات لتقديم خدماتنا والرد على الاستفسارات والتواصل مع العملاء بخصوص طلباتهم وتحسين تجربة استخدام الموقع وتطوير خدماتنا.",
      },
      {
        title: "حماية المعلومات",
        text: "نتخذ إجراءات تقنية وتنظيمية مناسبة للمساعدة في حماية المعلومات من الوصول غير المصرح به أو الاستخدام أو التغيير أو الإفصاح غير المصرح به.",
      },
      {
        title: "مشاركة المعلومات",
        text: "لا نبيع البيانات الشخصية للمستخدمين. وقد تتم مشاركة المعلومات عند الضرورة لتقديم الخدمة أو عندما يكون ذلك مطلوبًا بموجب الأنظمة واللوائح المعمول بها.",
      },
      {
        title: "الاحتفاظ بالبيانات",
        text: "نحتفظ بالمعلومات الشخصية للمدة اللازمة لتحقيق الأغراض التي جُمعت من أجلها أو حسبما تقتضيه الأنظمة واللوائح المعمول بها.",
      },
      {
        title: "حقوق المستخدم",
        text: "يمكن للمستخدم التواصل معنا للاستفسار عن بياناته الشخصية أو طلب تصحيح المعلومات غير الدقيقة، وذلك وفقًا للأنظمة واللوائح المعمول بها.",
      },
      {
        title: "التواصل معنا",
        text: "للاستفسارات المتعلقة بالخصوصية أو البيانات الشخصية، يمكنكم التواصل معنا من خلال بيانات الاتصال المتوفرة في الموقع.",
      },
    ],
  },

  en: {
    back: "Back to Home",
    title: "Privacy Policy",
    sections: [
      {
        title: "Introduction",
        text: "At Ouda Real Estate, we respect the privacy of our website visitors and are committed to protecting their personal information. This policy explains how we collect, use, and protect information when you use our website and services.",
      },
      {
        title: "Information We Collect",
        text: "We may collect information that users provide directly when contacting us or submitting an inquiry, such as name, phone number, email address, and information related to their property request.",
      },
      {
        title: "How We Use Information",
        text: "We use information to provide our services, respond to inquiries, communicate with customers regarding their requests, improve the website experience, and develop our services.",
      },
      {
        title: "Information Security",
        text: "We take appropriate technical and organizational measures to help protect information against unauthorized access, use, alteration, or disclosure.",
      },
      {
        title: "Sharing Information",
        text: "We do not sell users' personal information. Information may be shared when necessary to provide a service or when required by applicable laws and regulations.",
      },
      {
        title: "Data Retention",
        text: "We retain personal information for as long as necessary to fulfill the purposes for which it was collected or as required by applicable laws and regulations.",
      },
      {
        title: "User Rights",
        text: "Users may contact us to inquire about their personal information or request correction of inaccurate information, subject to applicable laws and regulations.",
      },
      {
        title: "Contact Us",
        text: "For questions regarding privacy or personal information, you can contact us using the contact information available on our website.",
      },
    ],
  },
} as const;

export default async function PrivacyPage() {
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
