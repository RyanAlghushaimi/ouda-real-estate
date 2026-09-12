# عودة العقارية — منصة العرض العقاري وإدارتها

منصة عقارية كاملة: موقع عام لتصفح العقارات والبحث والتواصل، ولوحة تحكم إدارية
كاملة لإدارة العقارات والصور والبيانات المرجعية والاستفسارات وإعدادات الموقع.
مبنية بـ **Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + Supabase**
(PostgreSQL + Auth + Storage).

## المحتويات
- [نظرة عامة على الحالة](#نظرة-عامة-على-الحالة)
- [المتطلبات](#المتطلبات)
- [التثبيت](#التثبيت)
- [Environment Variables](#environment-variables)
- [إعداد Supabase من الصفر](#إعداد-supabase-من-الصفر)
- [إنشاء أول حساب Admin](#إنشاء-أول-حساب-admin)
- [التشغيل محليًا](#التشغيل-محليًا)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [خطوات بعد النشر](#خطوات-بعد-النشر)
- [بنية المشروع](#بنية-المشروع)
- [الأمان](#الأمان)

## نظرة عامة على الحالة
- ✅ الموقع العام: الرئيسية، العقارات (بحث + فلاتر + خريطة)، تفاصيل العقار.
- ✅ Authentication: تسجيل دخول admin عبر Supabase Auth، بدون تسجيل ذاتي.
- ✅ لوحة التحكم (`/admin`): نظرة عامة بإحصائيات حقيقية، إدارة العقارات
  الكاملة (CRUD + نشر/تمييز)، إدارة الصور (Supabase Storage)، إدارة المدن
  والأحياء وأنواع العقارات والمميزات، إدارة الاستفسارات (Leads)، إعدادات
  الموقع.
- ✅ SEO: Sitemap ديناميكي، Robots.txt، Canonical URLs، Open Graph، JSON-LD
  لكل عقار.
- ✅ خريطة العقارات في صفحة القائمة (Leaflet/OpenStreetMap، معزولة في مكوّن
  واحد قابل لاستبدال المزوّد لاحقًا).
- ✅ تبديل اللغة: عربي (RTL) / إنجليزي (LTR) فعليًا من الهيدر — يبدّل نصوص
  الواجهة الأساسية وحقول العقار (العنوان، الوصف، المدينة، الحي، النوع)
  عبر Cookie، دون فقدان الصفحة الحالية.
- ✅ Pagination في صفحة قائمة العقارات (`filterPropertiesPaginated`) بدل جلب
  كل العقارات دفعة واحدة.
- ✅ Clustering فعلي على الخريطة (leaflet.markercluster).
- ⏳ لم يُنفَّذ بعد: نظام Agents، Analytics.

### ملاحظات وقيود معروفة
- إضافة تبديل اللغة تطلّبت قراءة Cookie في `app/layout.tsx` (لتحديد
  `lang`/`dir`)، مما يجعل **كل الصفحات ديناميكية** (لا تُبنى كصفحات ثابتة
  وقت البناء) — قرار مقصود لصالح دعم اللغتين، قابل لإعادة التقييم لاحقًا إذا
  أصبح الأداء أولوية أهم من تبديل اللغة الفوري.
- فلاتر المدينة/النوع في صفحة العقارات تبقى بأسماء عربية حتى في وضع
  الإنجليزية، لأن القيم تُطابَق مباشرة مع الأسماء العربية المخزّنة في قاعدة
  البيانات لأغراض الفلترة؛ ترجمتها بصريًا دون كسر منطق الفلترة يحتاج تعديلًا
  إضافيًا على طبقة البيانات (تخزين قيمة فلترة محايدة عن اللغة، مثل الـslug).

## المتطلبات
- Node.js 20 أو أحدث
- npm
- حساب Supabase مجاني (https://supabase.com)

## التثبيت
```bash
git clone <repo-url>
cd awda-platform
npm install
```

## Environment Variables
انسخ `.env.example` إلى `.env.local`:

```bash
cp .env.example .env.local
```

| المتغير | مطلوب؟ | الوصف |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | لا (بدونه Mock Data) | رابط مشروع Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | لا (بدونه Mock Data) | مفتاح Anon/Public من Supabase — **ليس** Service Role |
| `NEXT_PUBLIC_SITE_URL` | لا (افتراضي localhost) | رابط النطاق الفعلي بعد النشر، لِـSitemap/Canonical/OG |

بدون أول متغيرين، يعمل الموقع العام بالكامل على بيانات تجريبية ثابتة
(`lib/properties.ts`) — مفيد للمعاينة السريعة دون أي إعداد. لوحة التحكم
(`/admin`) تحتاج Supabase مُفعّلًا لتعمل فعليًا (تعرض رسالة إعداد واضحة إن لم يكن كذلك).

**لا يوجد في هذا المشروع أي استخدام لـ Service Role Key** — كل الصلاحيات
تُفرض عبر Row Level Security + جلسة المستخدم الإداري (راجع قسم الأمان أدناه).

## إعداد Supabase من الصفر
التفاصيل الكاملة في [`supabase/README.md`](supabase/README.md). ملخص الخطوات:

1. أنشئ مشروع Supabase جديد.
2. في **SQL Editor**، شغّل بالترتيب:
   - `supabase/schema.sql`
   - `supabase/migrations/002_admin_policies_and_storage.sql`
   - `supabase/seed.sql`
3. انسخ `NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_ANON_KEY` من
   **Project Settings → API** إلى `.env.local`.
4. Storage: يُنشأ Bucket `property-images` تلقائيًا ضمن الخطوة 2 (migration
   002) بصلاحياته الصحيحة — لا حاجة لأي إعداد يدوي إضافي.
5. Authentication: مفعّل افتراضيًا في Supabase؛ لا حاجة لإعداد إضافي سوى
   إنشاء أول admin (الخطوة التالية).

## إنشاء أول حساب Admin
لا يوجد تسجيل ذاتي للوحة التحكم عمدًا. الخطوات الكاملة والآمنة موجودة في
[`supabase/README.md#5-إنشاء-أول-حساب-admin`](supabase/README.md), وباختصار:
أنشئ مستخدمًا من **Authentication → Users** في لوحة Supabase، ثم أضف صفًا له
في جدول `profiles` بـ `role = 'admin'` عبر SQL Editor. بعدها سجّل الدخول من
`/admin/login`.

## التشغيل محليًا
```bash
npm run dev
```
افتح http://localhost:3000 للموقع العام، و http://localhost:3000/admin/login
للوحة التحكم.

## Production Build
```bash
npm run build
npm start
```
تأكد من ضبط `NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_ANON_KEY` في
بيئة البناء نفسها (وليس فقط بيئة التشغيل) إن كنت تريد بيانات حقيقية بدل
Mock Data في نتيجة البناء.

## Deployment
المشروع Next.js قياسي، ينشر على أي منصة تدعم Next.js (Vercel، Netlify،
أو خادم Node.js عادي عبر `npm run build && npm start`). الخطوات العامة:

1. اربط المستودع بمنصة النشر المختارة.
2. أضف متغيرات البيئة الثلاثة (القسم أعلاه) في إعدادات المشروع بالمنصة —
   وليس في أي ملف يُرفع للمستودع.
3. اضبط `NEXT_PUBLIC_SITE_URL` على نطاق الإنتاج الفعلي (يؤثر على Sitemap
   وCanonical وOpen Graph).
4. انشر. لا توجد خطوات بناء خاصة إضافية (`next build` قياسي).

## خطوات بعد النشر
- أنشئ أول حساب admin على مشروع Supabase **الحقيقي** (وليس أي مشروع تجريبي
  استخدمته أثناء التطوير) — راجع القسم أعلاه.
- تحقق من `https://your-domain.com/sitemap.xml` و`/robots.txt` يعملان
  ويشيران للنطاق الصحيح.
- من `/admin/settings`، حدّث بيانات التواصل الفعلية للشركة (هاتف، واتساب،
  بريد، عنوان) بدل القيم الافتراضية.
- أضف على الأقل مدينة وحيًا ونوع عقار وميزة واحدة حقيقية من لوحة التحكم قبل
  حذف بيانات `seed.sql` التجريبية (إن رغبت بذلك).

## بنية المشروع
```
app/
  page.tsx                          الصفحة الرئيسية (عامة)
  properties/                       العقارات (قائمة + تفاصيل) — عامة
  sitemap.ts / robots.ts            SEO
  admin/
    login/                          تسجيل الدخول (عامة، خارج الحماية)
    (protected)/                    كل صفحات لوحة التحكم — محمية بـrequireAdmin()
      page.tsx                      نظرة عامة (إحصائيات حقيقية)
      properties/                   CRUD العقارات + إدارة الصور
      locations/                    CRUD المدن والأحياء
      property-types/               CRUD أنواع العقارات
      amenities/                    CRUD المميزات
      leads/                        إدارة الاستفسارات
      settings/                     إعدادات الموقع
components/
  SiteHeader.tsx / SiteFooter.tsx / MobileMenu.tsx / PropertyCard.tsx / LeadForm.tsx
  PropertiesMap.tsx / PropertiesMapLoader.tsx     خريطة العقارات (Leaflet، معزولة)
  ui/                                Design System (Button, Badge, EmptyState, Skeleton)
  admin/ConfirmSubmitButton.tsx      تأكيد قبل أي إجراء حذف
lib/
  properties.ts                     بيانات تجريبية (Mock) — لم تُحذف بعد
  data/properties.ts                طبقة بيانات عامة موحّدة (Mock ↔ Supabase)
  data/admin/                       طبقة بيانات إدارية (properties, images, reference, leads, settings, stats)
  supabase/client.ts                عميل Supabase العام (Anon Key، بدون Cookies)
  supabase/server.ts                عميل Supabase من جهة الخادم (Cookies/Session)
  supabase/mappers.ts                تحويل صفوف قاعدة البيانات إلى Property
  auth/requireAdmin.ts              التحقق المركزي من صلاحية admin (خادم فقط)
  validation/property.ts            Zod schema للتحقق من نموذج العقار
  site.ts                           SITE_URL المشترك
supabase/
  schema.sql                        الجداول، RLS للقراءة العامة
  migrations/002_admin_policies_and_storage.sql   صلاحيات admin + Storage + حقول SEO
  seed.sql                          بيانات تجريبية
  README.md                         خطوات الإعداد التفصيلية
DESIGN.md                           نظام التصميم (ألوان، خطوط، مكوّنات)
proxy.ts                            تجديد جلسة Supabase على /admin/* (بديل middleware في Next 16)
.env.example
```

## الأمان
- **لا Service Role Key إطلاقًا** في هذا المشروع — كل شيء عبر Anon Key محميًا بـRLS.
- **طبقتا حماية مستقلتان** لكل عملية إدارية: `requireAdmin()` على مستوى
  التطبيق (Server Actions/الصفحات)، و`is_admin()` في سياسات RLS على مستوى
  قاعدة البيانات — فشل إحداهما لا يكفي لتجاوز الأخرى.
- **لا اعتماد على إخفاء الروابط**: أي محاولة وصول مباشر لصفحة `/admin/*`
  تُعاد توجيهها لتسجيل الدخول إن لم توجد جلسة admin صالحة.
- **تحقق من المدخلات على الخادم** عبر Zod (`lib/validation/property.ts`)
  قبل أي كتابة لقاعدة البيانات — لا يُعتمد على تحقق الواجهة وحده.
- **رفع الصور**: تحقق من النوع (JPEG/PNG/WEBP) والحجم (5MB) قبل الرفع، ومسارات
  Storage منظمة حسب معرّف العقار وليست أسماء عشوائية.
