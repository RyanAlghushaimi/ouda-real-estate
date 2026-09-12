import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-6">
        <EmptyState
          title="الصفحة غير موجودة"
          description="الرابط الذي اتبعته غير صحيح أو تم نقل الصفحة."
          action={<LinkButton href="/" variant="primary">العودة للرئيسية</LinkButton>}
        />
      </section>
      <SiteFooter />
    </div>
  );
}
