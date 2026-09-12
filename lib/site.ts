// عنوان الموقع الأساسي — يُستخدم لبناء الروابط المطلقة (Canonical, Sitemap,
// Open Graph, JSON-LD). يُضبط عبر NEXT_PUBLIC_SITE_URL في الإنتاج (رابط
// النطاق الفعلي بعد النشر)؛ في التطوير المحلي يعمل افتراضيًا على localhost.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
