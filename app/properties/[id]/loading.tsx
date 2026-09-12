import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function LoadingPropertyDetail() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 pt-8 sm:px-6 sm:pt-10 lg:px-10">
        <div className="skeleton h-[280px] w-full rounded-2xl sm:h-[420px]" />
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-24 w-full rounded-2xl" />
            <div className="skeleton h-32 w-full rounded-2xl" />
          </div>
          <div className="skeleton h-56 w-full rounded-2xl" />
        </div>
      </section>
      <div className="h-24" />
      <SiteFooter />
    </div>
  );
}
