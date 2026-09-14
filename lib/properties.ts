// طبقة البيانات — حاليًا بيانات تجريبية ثابتة (Mock Data).
// عند ربط قاعدة بيانات حقيقية لاحقًا، يكفي استبدال محتوى هذا الملف بدوال
// fetch من قاعدة البيانات (نفس الأنواع/Types يجب أن تبقى كما هي أو تُطابَق)
// دون الحاجة لتعديل أي واجهة (Component) تستهلك هذه البيانات.

export type Purpose = "sale" | "rent";

export type Property = {
  id: string;
  refNo: string;
  title: string;
  titleEn: string;
  purpose: Purpose;
  purposeEn?: string;
  type: string;
  typeEn?: string;
  price: number;
  currency: "SAR";
  city: string;
  cityEn?: string;
  district: string;
  districtEn?: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  furnished: boolean;
  featured: boolean;
  status: "جاهز" | "تحت الإنشاء";
  lat: number;
  lng: number;
  features: string[];
  image: string;
  images: string[];
  description: string;
  descriptionEn?: string;
  createdAt: string; // ISO date — يُستخدم للترتيب حسب "الأحدث"
  metaTitle?: string;
  metaDescription?: string;
};

export type AreaHighlight = {
  name: string;
  city: string;
  cityEn?: string;
  image: string;
  listingsCount: number;
};

export const properties: Property[] = [
  {
    id: "1",
    refNo: "AWD-1042",
    title: "فيلا فاخرة بتصميم عصري",
    titleEn: "Modern Luxury Villa",
    purpose: "sale",
    type: "فيلا",
    typeEn: "Villa",
    price: 2450000,
    currency: "SAR",
    city: "الرياض",
    cityEn: "Riyadh",
    district: "حي الملقا",
    districtEn: "Al Malqa",
    area: 520,
    bedrooms: 6,
    bathrooms: 7,
    parking: 4,
    furnished: false,
    featured: true,
    status: "جاهز",
    lat: 24.7930,
    lng: 46.6280,
    features: ["مسبح خاص", "مصعد داخلي", "غرفة سائق", "نظام أمني", "حديقة خارجية", "مجلس رجال منفصل"],
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    description:
      "فيلا حديثة تجمع بين الفخامة والراحة، تصميم داخلي مفتوح، مسبح خاص، ومساحات خارجية واسعة تناسب العائلات الكبيرة. تقع في موقع هادئ ضمن حي الملقا مع قرب مباشر من الخدمات والمدارس.",
    createdAt: "2026-08-20",
    descriptionEn:
      "A modern villa combining luxury and comfort, with an open interior layout, private pool, and generous outdoor space suited to large families.",
  },
  {
    id: "2",
    refNo: "AWD-1043",
    title: "شقة بإطلالة بانورامية",
    titleEn: "Panoramic View Apartment",
    purpose: "rent",
    type: "شقة",
    typeEn: "Apartment",
    price: 65000,
    currency: "SAR",
    city: "جدة",
    cityEn: "Jeddah",
    district: "حي الشاطئ",
    districtEn: "Al Shati",
    area: 210,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    furnished: true,
    featured: true,
    status: "جاهز",
    lat: 21.6100,
    lng: 39.1050,
    features: ["إطلالة بحرية", "مفروشة بالكامل", "مسبح مشترك", "صالة رياضية", "أمن على مدار الساعة"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
    description:
      "شقة مفروشة بالكامل تطل مباشرة على البحر، تشطيبات راقية وقرب من أهم الخدمات والمرافق في جدة. مناسبة للسكن العائلي أو الإيجار قصير المدى.",
    createdAt: "2026-08-28",
    descriptionEn:
      "A fully furnished apartment with a direct sea view, upscale finishing, and close proximity to key services in Jeddah.",
  },
  {
    id: "3",
    refNo: "AWD-1044",
    title: "أرض تجارية في موقع استراتيجي",
    titleEn: "Commercial Land - Prime Location",
    purpose: "sale",
    type: "أرض",
    typeEn: "Land",
    price: 8900000,
    currency: "SAR",
    city: "الدمام",
    cityEn: "Dammam",
    district: "حي الشاطئ الغربي",
    districtEn: "West Al Shati",
    area: 1500,
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    furnished: false,
    featured: true,
    status: "جاهز",
    lat: 26.4400,
    lng: 50.1000,
    features: ["واجهتين", "على طريق رئيسي", "صك إلكتروني", "مناسبة للاستثمار التجاري"],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"],
    description:
      "أرض تجارية على شارعين، مطلة على طريق رئيسي، مناسبة لمشاريع استثمارية أو تجارية متعددة، ضمن أحد أكثر المواقع طلبًا في الدمام.",
    createdAt: "2026-07-15",
    descriptionEn:
      "A commercial land plot with two frontages on a main road, suitable for various investment or commercial projects in Dammam.",
  },
  {
    id: "4",
    refNo: "AWD-1045",
    title: "دوبلكس عائلي هادئ",
    titleEn: "Family Duplex",
    purpose: "sale",
    type: "دوبلكس",
    typeEn: "Duplex",
    price: 1350000,
    currency: "SAR",
    city: "الرياض",
    cityEn: "Riyadh",
    district: "حي النرجس",
    districtEn: "Al Narjis",
    area: 340,
    bedrooms: 5,
    bathrooms: 5,
    parking: 2,
    furnished: false,
    featured: false,
    status: "جاهز",
    lat: 24.8300,
    lng: 46.6600,
    features: ["مدخلين منفصلين", "غرفة غسيل", "قريب من المدارس", "حديقة أمامية"],
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80"],
    description:
      "دوبلكس مستقل في حي هادئ وراقٍ، قريب من المدارس والحدائق، تصميم عملي يناسب العائلات ويحتوي على مدخلين منفصلين.",
    createdAt: "2026-08-05",
    descriptionEn:
      "An independent duplex in a quiet, upscale neighborhood, close to schools and parks, with a practical layout for families.",
  },
  {
    id: "5",
    refNo: "AWD-1046",
    title: "استوديو مفروش وسط المدينة",
    titleEn: "Furnished Downtown Studio",
    purpose: "rent",
    type: "شقة",
    typeEn: "Apartment",
    price: 32000,
    currency: "SAR",
    city: "الرياض",
    cityEn: "Riyadh",
    district: "حي العليا",
    districtEn: "Al Olaya",
    area: 65,
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    furnished: true,
    featured: false,
    status: "جاهز",
    lat: 24.6950,
    lng: 46.6850,
    features: ["مفروش بالكامل", "إنترنت مجاني", "قريب من المترو"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"],
    description: "استوديو أنيق ومفروش بالكامل في قلب العليا، خيار مثالي للعزاب والمهنيين القريبين من موقع العمل.",
    createdAt: "2026-09-01",
    descriptionEn:
      "An elegant, fully furnished studio in the heart of Al Olaya, ideal for singles and professionals.",
  },
  {
    id: "6",
    refNo: "AWD-1047",
    title: "فيلا راقية بحديقة خاصة",
    titleEn: "Villa with Private Garden",
    purpose: "sale",
    type: "فيلا",
    typeEn: "Villa",
    price: 3200000,
    currency: "SAR",
    city: "جدة",
    cityEn: "Jeddah",
    district: "حي الحمراء",
    districtEn: "Al Hamra",
    area: 610,
    bedrooms: 7,
    bathrooms: 8,
    parking: 5,
    furnished: false,
    featured: true,
    status: "تحت الإنشاء",
    lat: 21.5750,
    lng: 39.1550,
    features: ["حديقة خاصة واسعة", "مطبخ خارجي", "غرفة خادمة", "تكييف مركزي"],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80"],
    description: "فيلا مستقلة بتشطيبات فاخرة وحديقة واسعة، تقع في أحد أرقى أحياء جدة، تسليم خلال 8 أشهر.",
    createdAt: "2026-06-10",
    descriptionEn:
      "An independent villa with luxury finishing and a spacious garden, located in one of Jeddah's most prestigious neighborhoods.",
  },
  {
    id: "7",
    refNo: "AWD-1048",
    title: "شقة عصرية بغرفتين",
    titleEn: "Modern 2-Bedroom Apartment",
    purpose: "rent",
    type: "شقة",
    typeEn: "Apartment",
    price: 42000,
    currency: "SAR",
    city: "الرياض",
    cityEn: "Riyadh",
    district: "حي الملقا",
    districtEn: "Al Malqa",
    area: 130,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    furnished: false,
    featured: false,
    status: "جاهز",
    lat: 24.8000,
    lng: 46.6200,
    features: ["مطبخ راكب", "مصعد", "موقف مغطى"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80"],
    description: "شقة عصرية بتشطيب راقٍ في حي الملقا، مناسبة للأزواج أو العائلات الصغيرة.",
    createdAt: "2026-08-12",
    descriptionEn:
      "A modern apartment with upscale finishing in Al Malqa, suitable for couples or small families.",
  },
  {
    id: "8",
    refNo: "AWD-1049",
    title: "أرض سكنية للبيع",
    titleEn: "Residential Land for Sale",
    purpose: "sale",
    type: "أرض",
    typeEn: "Land",
    price: 950000,
    currency: "SAR",
    city: "الدمام",
    cityEn: "Dammam",
    district: "حي الفيصلية",
    districtEn: "Al Faisaliah",
    area: 400,
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    furnished: false,
    featured: false,
    status: "جاهز",
    lat: 26.4200,
    lng: 50.0850,
    features: ["مخطط معتمد", "قريبة من الخدمات"],
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=1200&q=80"],
    description: "أرض سكنية ضمن مخطط معتمد في حي الفيصلية، مناسبة لبناء سكن خاص أو للاستثمار.",
    createdAt: "2026-07-30",
    descriptionEn:
      "A residential land plot within an approved master plan in Al Faisaliah, suitable for private construction or investment.",
  },
];

export const areaHighlights: AreaHighlight[] = [
  {
    name: "الرياض",
    city: "الرياض",
    cityEn: "Riyadh",
    image: "https://assets.aqar.fm/blog/2020/10/%D8%A8%D8%B1%D8%AC-%D8%A7%D9%84%D9%85%D9%85%D9%84%D9%83%D8%A9.jpg",
    listingsCount: properties.filter((p) => p.city === "الرياض").length,
  },
  {
    name: "جدة",
    city: "جدة",
    cityEn: "Jeddah",
    image: "https://cdn.sa.emaar.com/wp-content/uploads/2020/12/JE-0614-camera-03-706x385.jpg",
    listingsCount: properties.filter((p) => p.city === "جدة").length,
  },
  {
    name: "بريدة",
    city: "بريدة",
    cityEn: "Buraiyda",
    image: "https://dealapp.sa/blog/wp-content/uploads/2020/04/%D8%A8%D8%B1%D9%8A%D8%AF%D8%A9.jpg",
    listingsCount: properties.filter((p) => p.city === "بريدة").length,
  },
];

export const cities = Array.from(new Set(properties.map((p) => p.city)));
export const propertyTypes = Array.from(new Set(properties.map((p) => p.type)));

export function formatPrice(n: number, locale: "ar" | "en" = "ar") {
  return new Intl.NumberFormat(
    locale === "en" ? "en-US" : "ar-SA"
  ).format(n);
}


export function getPropertyById(id: string) {
  return properties.find((p) => p.id === id);
}

export function getRelatedProperties(p: Property, limit = 3) {
  return properties
    .filter((item) => item.id !== p.id && (item.city === p.city || item.type === p.type))
    .slice(0, limit);
}

export type PropertyFilters = {
  city?: string;
  purpose?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  sort?: string;
};

export function filterProperties(filters: PropertyFilters): Property[] {
  let list = properties.filter((p) => {
    if (filters.city && p.city !== filters.city) return false;
    if (filters.purpose && p.purpose !== filters.purpose) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (filters.bedrooms) {
      const min = Number(filters.bedrooms);
      if (p.bedrooms < min) return false;
    }
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "area-desc":
      list = [...list].sort((a, b) => b.area - a.area);
      break;
    default:
      list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  return list;
}
