"use client";

const FALLBACK = "https://placehold.co/600x450?text=%D8%B5%D9%88%D8%B1%D8%A9+%D8%BA%D9%8A%D8%B1+%D9%85%D8%AA%D9%88%D9%81%D8%B1%D8%A9";

export default function ImageWithFallback({
  src,
  alt,
  className,
  loading,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || FALLBACK}
      alt={alt}
      loading={loading}
      className={className}
      onError={(e) => {
        if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK;
      }}
    />
  );
}
