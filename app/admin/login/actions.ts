"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export type SignInState = { ok: false; error: string } | null;

export async function signInAction(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "لم يتم إعداد قاعدة البيانات بعد — راجع supabase/README.md" };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "البريد الإلكتروني وكلمة المرور مطلوبان" };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "تعذّر الاتصال بقاعدة البيانات" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { ok: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  }

  // التحقق من صلاحية admin يتم هنا، على الخادم، مباشرة بعد نجاح تسجيل
  // الدخول — لا يُسمح بإنشاء جلسة صالحة لحساب ليس له صف admin في profiles.
  const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", data.user.id)
  .maybeSingle();

if (profileError || !profile || profile.role !== "admin") {
  await supabase.auth.signOut();

  return {
    ok: false,
    error: `فشل التحقق من صلاحية المدير: ${
      profileError?.message ?? "لم يتم العثور على admin"
    }`,
  };
}


  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
