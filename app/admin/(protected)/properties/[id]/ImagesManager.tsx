"use client";

import { useRef, useState, useTransition } from "react";
import type { PropertyImageRow } from "@/lib/data/admin/images";
import {
  uploadImageAction,
  replaceImageAction,
  deleteImageAction,
  setPrimaryImageAction,
  reorderImagesAction,
} from "../actions";

export default function ImagesManager({
  propertyId,
  initialImages,
}: {
  propertyId: string;
  initialImages: PropertyImageRow[];
}) {
  const [images, setImages] = useState(initialImages);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleUpload(formData: FormData) {
    setError(null);
    const result = await uploadImageAction(propertyId, formData);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    // إعادة تحميل الصفحة الأبسط لعرض الصورة الجديدة (revalidatePath يكفي
    // للـServer Component الأب، لكن هذا المكوّن Client يحتاج بيانات جديدة)
    window.location.reload();
  }

  function handleDelete(imageId: string) {
    if (!window.confirm("حذف هذه الصورة نهائيًا؟")) return;
    startTransition(async () => {
      await deleteImageAction(imageId, propertyId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    });
  }

  function handleSetPrimary(imageId: string) {
    startTransition(async () => {
      await setPrimaryImageAction(propertyId, imageId);
      setImages((prev) => prev.map((img) => ({ ...img, is_primary: img.id === imageId })));
    });
  }

  function persistOrder(newOrder: PropertyImageRow[]) {
    setImages(newOrder);
    startTransition(async () => {
      const result = await reorderImagesAction(
        propertyId,
        newOrder.map((img) => img.id)
      );
      if (!result.ok) setError(result.error);
    });
  }

  function moveByOffset(index: number, offset: number) {
    const target = index + offset;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  // ---- سحب وإفلات (Drag & Drop) لإعادة الترتيب ----
  function handleDragStart(index: number) {
    dragIndexRef.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(index: number) {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    setDragOverIndex(null);
    if (from === null || from === index) return;

    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    persistOrder(next);
  }

  async function handleReplace(imageId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const result = await replaceImageAction(imageId, propertyId, formData);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    window.location.reload();
  }

  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.src = "https://placehold.co/400x300?text=%D8%B5%D9%88%D8%B1%D8%A9+%D8%BA%D9%8A%D8%B1+%D9%85%D8%AA%D9%88%D9%81%D8%B1%D8%A9";
  }

  return (
    <div className="space-y-5">
      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-2 text-xs text-danger">{error}</p>
      )}

      <form
        action={handleUpload}
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-line bg-card p-4"
      >
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="text-xs text-ink-soft"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="معاينة" className="h-14 w-20 rounded-lg object-cover" />
        )}
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-2 text-xs text-white transition-colors hover:bg-pine"
        >
          رفع صورة
        </button>
        <span className="text-xs text-ink-faint">JPEG / PNG / WEBP — حتى 5 ميجابايت</span>
      </form>

      {images.length === 0 ? (
        <p className="text-sm text-ink-soft">لا توجد صور بعد لهذا العقار.</p>
      ) : (
        <div>
          <p className="mb-3 text-xs text-ink-faint">
            اسحب أي صورة وأفلتها لإعادة الترتيب، أو استخدم الأسهم.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((img, i) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={() => handleDrop(i)}
                onDragEnd={() => setDragOverIndex(null)}
                className={`cursor-move overflow-hidden rounded-2xl border bg-surface transition-colors ${
                  dragOverIndex === i ? "border-brass" : "border-line"
                }`}
              >
                <div className="relative aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" onError={handleImgError} className="h-full w-full object-cover" />
                  {img.is_primary && (
                    <span className="absolute right-2 top-2 rounded-full bg-brass px-2 py-0.5 text-[10px] text-white">
                      رئيسية
                    </span>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] text-white">
                    {i + 1}
                  </span>
                </div>
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      disabled={isPending || i === 0}
                      onClick={() => moveByOffset(i, -1)}
                      className="rounded-lg border border-line px-2 py-1 text-xs text-ink-soft disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={isPending || i === images.length - 1}
                      onClick={() => moveByOffset(i, 1)}
                      className="rounded-lg border border-line px-2 py-1 text-xs text-ink-soft disabled:opacity-30"
                    >
                      ↓
                    </button>
                    {!img.is_primary && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleSetPrimary(img.id)}
                        className="flex-1 rounded-lg border border-line px-2 py-1 text-xs text-ink-soft"
                      >
                        اجعلها رئيسية
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer rounded-lg border border-line px-2 py-1 text-center text-xs text-ink-soft">
                      استبدال
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReplace(img.id, file);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(img.id)}
                      className="rounded-lg border border-danger/30 px-2 py-1 text-xs text-danger"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
