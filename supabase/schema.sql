-- =========================================================================
-- عودة العقارية — Schema قاعدة البيانات (PostgreSQL / Supabase)
-- =========================================================================
-- الترتيب مهم: الجداول المرجعية (lookup) أولاً، ثم properties، ثم الجداول
-- التابعة لها (images, amenities junction)، ثم leads وsite_settings.
-- شغّل هذا الملف كاملاً في Supabase SQL Editor أو عبر `supabase db push`.
-- =========================================================================

create extension if not exists "pgcrypto"; -- لتوليد gen_random_uuid()

-- -------------------------------------------------------------------------
-- 1) المدن
-- -------------------------------------------------------------------------
create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- 2) الأحياء/المناطق — كل حي تابع لمدينة واحدة
-- -------------------------------------------------------------------------
create table if not exists districts (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  name_ar text not null,
  name_en text not null,
  slug text not null,
  image_url text, -- تُستخدم في قسم "مناطق مميزة" بالصفحة الرئيسية
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists idx_districts_city on districts(city_id);

-- -------------------------------------------------------------------------
-- 3) أنواع العقارات (فيلا، شقة، دوبلكس، أرض...)
-- -------------------------------------------------------------------------
create table if not exists property_types (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text not null unique,
  sort_order int not null default 0
);

-- -------------------------------------------------------------------------
-- 4) الغرض (بيع/إيجار) — جدول بدل Enum ثابت للسماح بالتوسع مستقبلًا
-- -------------------------------------------------------------------------
create table if not exists purposes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- 'sale' | 'rent'
  name_ar text not null,
  name_en text not null
);

-- -------------------------------------------------------------------------
-- 5) المميزات/الخدمات (مسبح، مصعد، نظام أمني...)
-- -------------------------------------------------------------------------
create table if not exists amenities (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text not null unique,
  icon text -- اسم أيقونة اختياري (lucide-react) للاستخدام مستقبلًا في الواجهة
);

-- -------------------------------------------------------------------------
-- 6) العقارات — الجدول الرئيسي
-- -------------------------------------------------------------------------
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  ref_no text not null unique,          -- رقم مرجعي يظهر للعميل، مثل AWD-1042
  slug text not null unique,            -- لروابط SEO-friendly مثل /properties/villa-al-malqa-1042

  title_ar text not null,
  title_en text,
  description_ar text not null default '',
  description_en text,

  type_id uuid not null references property_types(id),
  purpose_id uuid not null references purposes(id),

  price numeric(14,2) not null,
  currency text not null default 'SAR',

  city_id uuid not null references cities(id),
  district_id uuid not null references districts(id),

  area numeric(10,2) not null default 0,     -- المساحة بالمتر المربع
  bedrooms int not null default 0,
  bathrooms int not null default 0,
  parking int not null default 0,
  furnished boolean not null default false,

  status text not null default 'ready' check (status in ('ready', 'under_construction')),
  featured boolean not null default false,
  published boolean not null default true,   -- إخفاء/نشر العقار من لوحة التحكم لاحقًا

  lat double precision,
  lng double precision,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_properties_city on properties(city_id);
create index if not exists idx_properties_district on properties(district_id);
create index if not exists idx_properties_type on properties(type_id);
create index if not exists idx_properties_purpose on properties(purpose_id);
create index if not exists idx_properties_featured on properties(featured) where featured = true;
create index if not exists idx_properties_published on properties(published) where published = true;
create index if not exists idx_properties_price on properties(price);
create index if not exists idx_properties_created_at on properties(created_at desc);

-- تحديث updated_at تلقائيًا عند أي تعديل على العقار
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_properties_updated_at on properties;
create trigger trg_properties_updated_at
  before update on properties
  for each row execute function set_updated_at();

-- -------------------------------------------------------------------------
-- 7) صور العقار — عدة صور لكل عقار، مع صورة رئيسية وترتيب
-- -------------------------------------------------------------------------
create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  url text not null,           -- مسار الملف في Supabase Storage (bucket: property-images)
  is_primary boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_property_images_property on property_images(property_id);

-- ضمان وجود صورة رئيسية واحدة فقط لكل عقار
create unique index if not exists uniq_one_primary_image_per_property
  on property_images(property_id)
  where is_primary = true;

-- -------------------------------------------------------------------------
-- 8) ربط العقارات بالمميزات (علاقة Many-to-Many)
-- -------------------------------------------------------------------------
create table if not exists property_amenities (
  property_id uuid not null references properties(id) on delete cascade,
  amenity_id uuid not null references amenities(id) on delete cascade,
  primary key (property_id, amenity_id)
);

-- -------------------------------------------------------------------------
-- 9) الاستفسارات/طلبات المعاينة (Leads)
-- -------------------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  message text,
  source text not null default 'website', -- website | whatsapp | phone
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_property on leads(property_id);
create index if not exists idx_leads_status on leads(status);

-- -------------------------------------------------------------------------
-- 10) ملفات المستخدمين (Profiles) — تمتد فوق auth.users من Supabase Auth
--     تُستخدم لاحقًا لصلاحيات لوحة التحكم (admin / agent) بشكل منفصل عن
--     المستخدمين العاديين (الذين لا يحتاجون حسابًا أصلًا في هذه المرحلة).
-- -------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'agent' check (role in ('admin', 'agent')),
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- 11) إعدادات الموقع (بيانات الشركة، أرقام التواصل، الشبكات الاجتماعية)
-- -------------------------------------------------------------------------
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- Row Level Security (RLS)
-- =========================================================================
-- المبدأ: كل بيانات العرض العام (عقارات منشورة، صورها، المميزات، المدن...)
-- قابلة للقراءة للجميع (anon + authenticated)، بينما الكتابة محصورة على
-- الأدوار الإدارية فقط عبر Service Role أو مستخدم بصلاحية admin في profiles.
-- الاستفسارات (leads) يُسمح بإضافتها للجميع (نموذج تواصل عام) لكن لا يمكن
-- قراءتها إلا من قبل الإدارة.

alter table cities enable row level security;
alter table districts enable row level security;
alter table property_types enable row level security;
alter table purposes enable row level security;
alter table amenities enable row level security;
alter table properties enable row level security;
alter table property_images enable row level security;
alter table property_amenities enable row level security;
alter table leads enable row level security;
alter table profiles enable row level security;
alter table site_settings enable row level security;

-- قراءة عامة للجداول المرجعية والعقارات المنشورة فقط
create policy "public read cities" on cities for select using (true);
create policy "public read districts" on districts for select using (true);
create policy "public read property_types" on property_types for select using (true);
create policy "public read purposes" on purposes for select using (true);
create policy "public read amenities" on amenities for select using (true);

create policy "public read published properties" on properties
  for select using (published = true);

create policy "public read images of published properties" on property_images
  for select using (
    exists (
      select 1 from properties p
      where p.id = property_images.property_id and p.published = true
    )
  );

create policy "public read amenities of published properties" on property_amenities
  for select using (
    exists (
      select 1 from properties p
      where p.id = property_amenities.property_id and p.published = true
    )
  );

-- السماح لأي زائر بإرسال استفسار (Lead) عبر نموذج الموقع، دون قراءة الاستفسارات
create policy "public can create leads" on leads
  for insert with check (true);

-- قراءة site_settings العامة فقط (مثل رقم الواتساب والهاتف المعروضين للجميع)
create policy "public read site_settings" on site_settings
  for select using (true);

-- يحتاج المستخدم المسجّل دخوله لقراءة صفّه الخاص في profiles للتحقق من
-- role الخاص به (راجع lib/auth/requireAdmin.ts) — دون قدرته على قراءة صفوف
-- بقية المستخدمين.
create policy "users can read own profile" on profiles
  for select using (auth.uid() = id);

-- ملاحظة: سياسات الكتابة (إضافة/تعديل/حذف عقارات، قراءة/تحديث leads، إدارة
-- profiles وsite_settings) ستُضاف عند بناء لوحة التحكم، وستُقيَّد بالتحقق من
-- role = 'admin' في جدول profiles، أو تُنفَّذ عبر Service Role من الخادم فقط
-- (لا يُستخدم Service Role Key مطلقًا في الـFrontend).

-- =========================================================================
-- 12) زيارات الموقع
-- =========================================================================

create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  session_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_page_views_created_at
  on page_views(created_at desc);

create index if not exists idx_page_views_path
  on page_views(path);

alter table page_views enable row level security;

create policy "public can create page views"
  on page_views
  for insert
  with check (true);
