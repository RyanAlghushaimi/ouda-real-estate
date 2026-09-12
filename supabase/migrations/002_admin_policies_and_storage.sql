-- =========================================================================
-- Migration 002 — صلاحيات لوحة التحكم + Storage للصور + حقول SEO
-- =========================================================================
-- شغّل هذا الملف بعد schema.sql وseed.sql (وبعد إنشاء أول admin كما في
-- supabase/README.md). يضيف:
--   1) دالة is_admin() للتحقق من صلاحية المستخدم الحالي دون تكرار المنطق.
--   2) سياسات RLS للكتابة (إضافة/تعديل/حذف) لكل الجداول الإدارية، مقصورة
--      على admin فقط — القراءة العامة الموجودة في schema.sql لا تتأثر.
--   3) حقلي meta_title / meta_description على properties لدعم SEO لكل عقار
--      (تغيير إضافي بسيط على الجدول، لا يكسر أي عمود موجود).
--   4) Storage bucket باسم property-images + سياساته.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1) دالة التحقق من صلاحية admin — تُستخدم داخل كل سياسات الكتابة أدناه
-- -------------------------------------------------------------------------
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- -------------------------------------------------------------------------
-- 2) حقول SEO إضافية على العقار (Meta Title / Meta Description)
-- -------------------------------------------------------------------------
alter table properties
  add column if not exists meta_title text,
  add column if not exists meta_description text;

-- -------------------------------------------------------------------------
-- 3) سياسات الكتابة الإدارية
-- -------------------------------------------------------------------------

-- العقارات: admin يقرأ الكل (بما فيها غير المنشور)، ويكتب/يعدّل/يحذف
create policy "admin can read all properties" on properties
  for select using (is_admin());

create policy "admin can insert properties" on properties
  for insert with check (is_admin());

create policy "admin can update properties" on properties
  for update using (is_admin()) with check (is_admin());

create policy "admin can delete properties" on properties
  for delete using (is_admin());

-- صور العقارات
create policy "admin can read all property_images" on property_images
  for select using (is_admin());

create policy "admin can insert property_images" on property_images
  for insert with check (is_admin());

create policy "admin can update property_images" on property_images
  for update using (is_admin()) with check (is_admin());

create policy "admin can delete property_images" on property_images
  for delete using (is_admin());

-- ربط العقارات بالمميزات
create policy "admin can read all property_amenities" on property_amenities
  for select using (is_admin());

create policy "admin can insert property_amenities" on property_amenities
  for insert with check (is_admin());

create policy "admin can delete property_amenities" on property_amenities
  for delete using (is_admin());

-- الاستفسارات (Leads) — القراءة والتعديل والحذف للإدارة فقط (الإدخال العام
-- مسموح مسبقًا عبر سياسة "public can create leads" في schema.sql)
create policy "admin can read leads" on leads
  for select using (is_admin());

create policy "admin can update leads" on leads
  for update using (is_admin()) with check (is_admin());

create policy "admin can delete leads" on leads
  for delete using (is_admin());

-- البيانات المرجعية: المدن، الأحياء، الأنواع، المميزات
create policy "admin can insert cities" on cities
  for insert with check (is_admin());
create policy "admin can update cities" on cities
  for update using (is_admin()) with check (is_admin());
create policy "admin can delete cities" on cities
  for delete using (is_admin());

create policy "admin can insert districts" on districts
  for insert with check (is_admin());
create policy "admin can update districts" on districts
  for update using (is_admin()) with check (is_admin());
create policy "admin can delete districts" on districts
  for delete using (is_admin());

create policy "admin can insert property_types" on property_types
  for insert with check (is_admin());
create policy "admin can update property_types" on property_types
  for update using (is_admin()) with check (is_admin());
create policy "admin can delete property_types" on property_types
  for delete using (is_admin());

create policy "admin can insert amenities" on amenities
  for insert with check (is_admin());
create policy "admin can update amenities" on amenities
  for update using (is_admin()) with check (is_admin());
create policy "admin can delete amenities" on amenities
  for delete using (is_admin());

-- إعدادات الموقع — القراءة العامة موجودة مسبقًا، التعديل للإدارة فقط
create policy "admin can insert site_settings" on site_settings
  for insert with check (is_admin());
create policy "admin can update site_settings" on site_settings
  for update using (is_admin()) with check (is_admin());

-- -------------------------------------------------------------------------
-- 4) Storage — Bucket صور العقارات
-- -------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

-- قراءة عامة لكل الصور (Bucket نفسه public، وهذه السياسة توضّح النية صراحة)
create policy "public read property-images bucket"
  on storage.objects for select
  using (bucket_id = 'property-images');

-- رفع/تعديل/حذف الصور للإدارة فقط
create policy "admin manage property-images bucket"
  on storage.objects for all
  using (bucket_id = 'property-images' and is_admin())
  with check (bucket_id = 'property-images' and is_admin());
