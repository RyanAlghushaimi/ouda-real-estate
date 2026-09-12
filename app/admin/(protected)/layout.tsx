import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { signOutAction } from "@/app/admin/login/actions";

// كل صفحات لوحة التحكم تعتمد على جلسة المستخدم (Cookies) وتُقرأ من قاعدة
// بيانات قد تتغيّر لحظيًا (عقارات، leads) — فلا معنى لتوليدها كصفحات ثابتة
// وقت البناء. هذا السطر يجعل كل الشجرة تحت هذا الـlayout ديناميكية دائمًا.
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/properties", label: "العقارات" },
  { href: "/admin/leads", label: "الاستفسارات" },
  { href: "/admin/locations", label: "المدن والأحياء" },
  { href: "/admin/property-types", label: "أنواع العقارات" },
  { href: "/admin/amenities", label: "المميزات" },
  { href: "/admin/settings", label: "إعدادات الموقع" },
];

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  // كل صفحة تحت هذا الـlayout محمية: requireAdmin() يعيد التوجيه إلى
  // /admin/login فورًا إن لم توجد جلسة صالحة أو لم يكن للمستخدم role='admin'
  // في profiles — بغض النظر عن كون الرابط معروضًا في الواجهة أم لا.
  const session = await requireAdmin();

  return (
    <div dir="rtl" className="min-h-screen bg-bg">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-l border-line bg-surface p-6 lg:block">
          <div className="font-display text-xl text-ink">عودة العقارية</div>
          <p className="text-xs text-ink-soft">لوحة التحكم</p>

          <nav className="mt-8 space-y-1 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-ink-soft transition-colors hover:bg-card hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-line bg-surface px-5 py-4 sm:px-6">
            <p className="text-sm text-ink-soft">
              مرحبًا، <span className="text-ink">{session.fullName ?? session.email}</span>
            </p>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-line px-4 py-2 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                تسجيل الخروج
              </button>
            </form>
          </header>

          <main className="p-5 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
