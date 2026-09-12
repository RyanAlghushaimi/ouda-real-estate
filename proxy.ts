import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// يُشغَّل فقط على /admin/* (راجع matcher أدناه). مهمته الوحيدة تجديد Access/
// Refresh Tokens الخاصة بجلسة Supabase Auth في الكوكيز قبل وصول الطلب إلى
// أي Server Component — وهو الأسلوب الموصى به رسميًا من Supabase لتطبيقات
// Next.js App Router. القرار الفعلي بالسماح بالدخول من عدمه يبقى دائمًا في
// requireAdmin() على الخادم (lib/auth/requireAdmin.ts)، وليس هنا.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // بدون إعداد Supabase بعد، لا يوجد جلسة لتجديدها — نُكمل بدون أي تأثير.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
