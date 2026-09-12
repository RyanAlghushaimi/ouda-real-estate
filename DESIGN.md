# نظام التصميم (Design System) — عودة العقارية

## الألوان
| الاسم | القيمة | الاستخدام |
|---|---|---|
| ink | #1F241F | نص أساسي، عناوين، خلفية الفوتر |
| ink-soft | #58604F | نص ثانوي |
| ink-faint | #838A76 | نص باهت جدًا (وسوم صغيرة، placeholders) |
| bg | #F6F3EC | خلفية الصفحة العامة |
| surface | #FFFFFF | خلفية البطاقات والنماذج |
| card | #EFEAE0 | خلفية الأقسام البارزة (About، الإحصائيات) |
| line | #DCD4C3 | الحدود والفواصل |
| brass / brass-deep | #93753F / #7A5F30 | اللون المميز (Accent) — الأسعار، الشارات |
| pine / pine-deep | #2E4436 / #1F3025 | أزرار الإجراء الأساسي (واتساب، اتصال) |

## الخطوط
- **العناوين (Display)**: Amiri — خط عربي كلاسيكي فاخر، يُستخدم في `h1/h2/h3` وكل عنصر بصف `font-display`.
- **النصوص والواجهة**: IBM Plex Sans Arabic — يدعم RTL بشكل ممتاز وأوزان متعددة.

## المكوّنات المشتركة (`components/ui`)
- `Button.tsx` — `Button` و`LinkButton` بأربعة أنماط (primary, secondary, outline, ghost) وثلاثة أحجام.
- `Badge.tsx` — شارات صغيرة (مميز، للبيع، الحالة...) بأربعة ألوان.
- `EmptyState.tsx` — حالة "لا توجد نتائج" موحدة تُستخدم في صفحة العقارات، صفحة تفاصيل عقار غير موجود، وصفحة 404.
- `Skeleton.tsx` — هياكل تحميل (Skeleton) لبطاقات العقارات، تُستخدم في `loading.tsx`.

## نقاط الكسر (Breakpoints) — من Tailwind الافتراضية
- الجوال: أقل من `sm` (640px) — عمود واحد، قوائم منسدلة بدل التنقل الأفقي، Hamburger Menu.
- `sm` (≥640px): عمودين للبطاقات.
- `lg` (≥1024px): ثلاثة أعمدة، تنقل أفقي كامل في الهيدر.

## المسافات والزوايا
- نصف قطر البطاقات: `rounded-2xl` (1rem) بشكل عام، `rounded-3xl` للأقسام الكبيرة.
- حشوة البطاقات: `p-4` على الجوال، `p-5` وما فوق على الشاشات الأكبر.

## حالات الواجهة
- **تحميل**: `app/properties/loading.tsx` و`app/properties/[id]/loading.tsx` باستخدام Skeleton.
- **لا نتائج**: `EmptyState` في صفحة العقارات عند عدم تطابق أي عقار مع الفلاتر.
- **عقار غير موجود**: `app/properties/[id]/not-found.tsx`.
- **صفحة غير موجودة عامة**: `app/not-found.tsx`.

## طبقة البيانات (`lib/data/properties.ts`)
كل الواجهات (Home، Properties، Property Detail) تستورد بيانات العقارات من هذا الملف حصرًا
(وليس من `lib/properties.ts` مباشرة)، عبر دوال غير متزامنة: `filterProperties()`,
`getPropertyById()`, `getRelatedProperties()`, `getCities()`, `getPropertyTypes()`,
`getAreaHighlights()`, `createLead()`. الملف يتحول تلقائيًا بين البيانات التجريبية
(`lib/properties.ts`) وSupabase حسب توفر متغيرات البيئة — راجع `supabase/README.md`.
