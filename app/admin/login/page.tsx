import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "تسجيل الدخول | لوحة تحكم عودة العقارية",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-[0_20px_50px_-25px_rgba(31,36,31,0.25)]">
        <div className="text-center">
          <div className="font-display text-xl text-ink">عودة العقارية</div>
          <p className="mt-1 text-sm text-ink-soft">لوحة التحكم</p>
        </div>

        {!isSupabaseConfigured() ? (
          <p className="mt-8 rounded-xl border border-dashed border-line bg-card p-4 text-center text-sm text-ink-soft">
            لم يتم إعداد قاعدة البيانات بعد. راجع <code>supabase/README.md</code> لإكمال
            الإعداد وإنشاء أول حساب admin قبل تسجيل الدخول.
          </p>
        ) : (
          <div className="mt-8">
            <LoginForm />
          </div>
        )}
      </div>
    </div>
  );
}
