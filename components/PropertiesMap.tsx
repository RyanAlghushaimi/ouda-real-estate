"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import type { Property } from "@/lib/properties";
import { formatPrice } from "@/lib/properties";

// هذا المكوّن (وClusterLayer المساعد بالأسفل) هما الحد الفاصل الوحيد الذي
// يعرف تفاصيل مزوّد الخرائط (Leaflet + OpenStreetMap tiles + Clustering).
// أي استبدال لمزوّد الخرائط مستقبلًا (Google Maps، Mapbox، ...) يقتصر
// تعديله على هذا الملف فقط — بقية الواجهة (properties/page.tsx) تتعامل معه
// كـ<PropertiesMap properties={...} /> بلا أي معرفة بتفاصيل التنفيذ الداخلي.

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** يبني Cluster Group إمبراتيفيًا عبر leaflet.markercluster (لا توجد نسخة
 * React مستقرة متوافقة مع React 19 / react-leaflet v5 وقت الكتابة)، ويربطه
 * بخريطة react-leaflet عبر useMap(). Popups مبنية كـHTML مباشر لأنها تُدار
 * خارج شجرة React من قبل Leaflet نفسه. */
function ClusterLayer({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({ maxClusterRadius: 50 });

    properties.forEach((p) => {
      const marker = L.marker([p.lat, p.lng], { icon: markerIcon });
      const popupHtml = `
        <div style="min-width:160px;text-align:right;direction:rtl;font-family:inherit">
          <div style="font-weight:500;color:#1F241F">${escapeHtml(p.title)}</div>
          <div style="margin-top:4px;font-size:12px;color:#58604F">${escapeHtml(p.district)}، ${escapeHtml(p.city)}</div>
          <div style="margin-top:4px;font-size:13px;color:#7A5F30">${formatPrice(p.price)} ر.س</div>
          <a href="/properties/${encodeURIComponent(p.id)}" style="margin-top:8px;display:block;font-size:12px;color:#2E4436;text-decoration:underline">
            عرض التفاصيل ←
          </a>
        </div>
      `;
      marker.bindPopup(popupHtml);
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, properties]);

  return null;
}

export default function PropertiesMap({ properties }: { properties: Property[] }) {
  const withCoords = properties.filter((p) => p.lat && p.lng);

  if (withCoords.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-line bg-card text-sm text-ink-soft">
        لا توجد إحداثيات كافية لعرض العقارات على الخريطة.
      </div>
    );
  }

  const center: [number, number] = [withCoords[0].lat, withCoords[0].lng];

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
      style={{ minHeight: 420 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClusterLayer properties={withCoords} />
    </MapContainer>
  );
}
