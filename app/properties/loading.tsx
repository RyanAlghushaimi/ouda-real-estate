import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PropertyGridSkeleton } from "@/components/ui/Skeleton";

export default function LoadingProperties() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-6 sm:pt-14 lg:px-10">
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton mt-3 h-9 w-64 rounded" />
      </section>
      <section className="mx-auto mt-8 max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="skeleton h-16 w-full rounded-2xl" />
      </section>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-10">
        <PropertyGridSkeleton />
      </section>
      <SiteFooter />
    </div>
  );
}
