import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/client";

// عميل Supabase من جهة الخادم فقط — يقرأ/يكتب الجلسة عبر Cookies بالطريقة
// الموصى بها من Supabase لتطبيقات Next.js App Router (@supabase/ssr).
// يُستخدم في: صفحات لوحة التحكم (Server Components)، وServer Actions
// (تسجيل الدخول/الخروج، عمليات الإدارة). لا يُستورد هذا الملف أبدًا في أي
// مكوّن Client — فقط Anon Key هنا أيضًا، والحماية الفعلية تأتي من RLS +
// التحقق من profiles.role عبر lib/auth/requireAdmin.ts.

export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // يحدث هذا عند استدعاء setAll من مكوّن Server Component للقراءة
            // فقط (لا يمكنه تعديل الكوكيز) — غير ضار طالما middleware.ts
            // يتولى تجديد الجلسة في كل طلب لصفحات /admin.
          }
        },
      },
    }
  );
}
