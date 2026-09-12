import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-6">
        <EmptyState
          title="هذا العقار لم يعد متاحًا"
          description="ربما تم بيعه أو إيجاره، أو أن الرابط غير صحيح. تصفح بقية العقارات المتاحة حاليًا."
          action={<LinkButton href="/properties" variant="primary">عرض جميع العقارات</LinkButton>}
        />
      </section>
      <SiteFooter />
    </div>
  );
}
