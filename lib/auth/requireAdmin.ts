import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  email: string | null;
  fullName: string | null;
};

/**
 * يتحقق أن هناك مستخدمًا مسجّل دخوله فعليًا (عبر Supabase Auth session في
 * الكوكيز) وأن له صفٌ في profiles بـ role = 'admin'. لا يعتمد إطلاقًا على أي
 * قيمة قادمة من الـClient (كإخفاء رابط أو localStorage) — القرار الوحيد
 * الموثوق هو الاستعلام عن profiles.role من الخادم في كل استدعاء.
 *
 * يجب استدعاء هذه الدالة في:
 * - layout.tsx الخاص بمجموعة الصفحات المحمية تحت /admin.
 * - بداية كل Server Action إداري (إضافة/تعديل/حذف عقار، صور، leads، إلخ)
 *   قبل تنفيذ أي عملية كتابة — وليس الاعتماد على حماية الصفحة فقط.
 *
 * عند فشل التحقق، يُعاد توجيه المستخدم فورًا إلى /admin/login دون كشف أي
 * تفاصيل عن سبب الرفض.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    // جلسة صحيحة لكن بدون صلاحية admin — نسجّل خروجه بدل تركه في حالة معلّقة.
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return { userId: user.id, email: user.email ?? null, fullName: profile.full_name };
}
