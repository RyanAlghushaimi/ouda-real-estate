# ربط قاعدة البيانات (Supabase)

## 1) إنشاء المشروع
أنشئ مشروع Supabase جديد (مجاني ضمن Free Tier) من https://supabase.com.

## 2) تشغيل الـSchema والـMigrations والـSeed
افتح **SQL Editor** داخل مشروع Supabase، وشغّل الملفات بالترتيب التالي بالضبط:

1. `supabase/schema.sql` — الجداول الأساسية، العلاقات، الفهارس، وسياسات RLS
   للقراءة العامة.
2. `supabase/migrations/002_admin_policies_and_storage.sql` — دالة `is_admin()`،
   سياسات RLS للكتابة الإدارية (عقارات، صور، leads، بيانات مرجعية، إعدادات)،
   حقلي `meta_title`/`meta_description`، وBucket صور العقارات في Storage.
3. `supabase/seed.sql` — تعبئة نفس العقارات الثمانية الموجودة أصلًا في
   `lib/properties.ts` (Mock Data)، حتى تتطابق النتيجة بصريًا بعد الربط.

كل ملفات SQL Idempotent (تستخدم `if not exists` / `on conflict do nothing`)،
فتشغيلها أكثر من مرة بالخطأ لا يكسر شيئًا.

## 3) ضبط متغيرات البيئة
انسخ `.env.example` إلى `.env.local` واملأ:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG480...
NEXT_PUBLIC_SITE_URL=https://your-domain.com   # اختياري محليًا
```

تجد أول متغيرين في **Project Settings → API** داخل لوحة Supabase. استخدم
`anon` `public` key فقط — لا يوجد ولن يوجد استخدام لـ`service_role` في هذا
المشروع إطلاقًا (راجع "ملاحظات الأمان" أدناه).

## 4) إعادة التشغيل
```bash
npm run dev
```
بمجرد ضبط المتغيرين، تبدأ كل الصفحات (العامة ولوحة التحكم) تلقائيًا بجلب
البيانات من Supabase بدل `lib/properties.ts`، دون أي تعديل إضافي في الكود —
راجع `lib/data/properties.ts` و`lib/data/admin/*` لتفاصيل آلية التبديل.

## 5) إنشاء أول حساب Admin
لا يوجد تسجيل ذاتي (Self-signup) للوحة التحكم عمدًا — الحسابات الإدارية تُنشأ
يدويًا فقط:

1. من لوحة Supabase: **Authentication → Users → Add user** — أنشئ مستخدمًا
   بالبريد الإلكتروني وكلمة مرور قوية (فعّل "Auto Confirm User").
2. انسخ الـ `UUID` الخاص بالمستخدم الجديد من نفس الصفحة.
3. في **SQL Editor** نفّذ (بعد استبدال القيم):
   ```sql
   insert into profiles (id, full_name, role)
   values ('USER-UUID-HERE', 'اسم المسؤول', 'admin');
   ```
4. سجّل الدخول من `/admin/login` بنفس البريد وكلمة المرور.

بدون الخطوة 3، سيتمكن المستخدم من تسجيل الدخول في Supabase Auth لكن
`signInAction` سيرفضه فورًا ويسجّل خروجه تلقائيًا، لأن `profiles.role` غير
موجود له.

## 6) الصور (Supabase Storage)
Bucket باسم `property-images` يُنشأ تلقائيًا عند تشغيل migration 002، بصلاحية
قراءة عامة وكتابة محصورة على `is_admin()`. من صفحة تعديل أي عقار في لوحة
التحكم (`/admin/properties/[id]`) يمكنك رفع الصور، تحديد الرئيسية، إعادة
الترتيب، الاستبدال، والحذف — كل ذلك يُخزَّن تحت مسار منظم `property-images/<uuid العقار>/<uuid الصورة>.<امتداد>`
وليس أسماء ملفات عشوائية بلا سياق.

## ملاحظات الأمان
- كل القراءة العامة محمية عبر RLS: العقارات (`published = true` فقط)،
  المدن/الأحياء/الأنواع/المميزات (قراءة كاملة، تعديل لـ`admin` فقط).
- إدخال طلب تواصل (`leads`) مسموح للجميع، وقراءته/تعديله/حذفه محصور على
  `admin` عبر `is_admin()`.
- كل عمليات الكتابة الإدارية (عقارات، صور، leads، بيانات مرجعية، إعدادات)
  محمية بطبقتين مستقلتين: (1) `requireAdmin()` في كل صفحة/Server Action على
  مستوى التطبيق، و(2) `is_admin()` في سياسات RLS على مستوى قاعدة البيانات
  نفسها — حتى لو تم تجاوز الطبقة الأولى بالخطأ.
- لا يُستخدم `service_role` key في أي كود Frontend أو `NEXT_PUBLIC_*` متغير،
  ولا في أي مكان آخر بالمشروع أصلًا — كل الصلاحيات تُفرض عبر RLS + جلسة
  المستخدم الإداري الفعلية.
