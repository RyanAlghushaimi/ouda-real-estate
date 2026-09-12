import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// هذا الملف ينشئ عميل Supabase باستخدام Anon Key فقط — وهو المفتاح العام
// الآمن للاستخدام في المتصفح والخادم على حد سواء، لأن كل الصلاحيات الفعلية
// تُفرض عبر Row Level Security (RLS) في قاعدة البيانات نفسها (راجع
// supabase/schema.sql). لا يوجد ولن يوجد أي استخدام لـ Service Role Key هنا؛
// ذلك المفتاح (عند الحاجة له لاحقًا في لوحة التحكم) يجب أن يبقى فقط في متغيرات
// بيئة الخادم (Server Environment Variables) ولا يُستورد إطلاقًا في أي كود
// يمكن تحميله على المتصفح.

let cachedClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * يُعيد عميل Supabase وحيد (Singleton) إذا كانت متغيرات البيئة مضبوطة،
 * أو null إذا لم تُضبط بعد — بحيث يمكن لطبقة البيانات (lib/data) الرجوع
 * تلقائيًا إلى البيانات التجريبية (Mock Data) دون توقف المشروع.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!cachedClient) {
    cachedClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      { auth: { persistSession: false } }
    );
  }

  return cachedClient;
}
