"use client";

import dynamic from "next/dynamic";
import type { Property } from "@/lib/properties";

const PropertiesMap = dynamic(() => import("./PropertiesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center rounded-2xl border border-line bg-card text-sm text-ink-soft">
      جارٍ تحميل الخريطة...
    </div>
  ),
});

export default function PropertiesMapLoader({ properties }: { properties: Property[] }) {
  return <PropertiesMap properties={properties} />;
}
