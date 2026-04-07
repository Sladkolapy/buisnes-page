"use client";

import { useRef, useState } from "react";
import { X, ZoomIn, Plus, Trash2, Loader2 } from "lucide-react";
import type { GalleryContent } from "@/core/shared/widget-types";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

interface Props {
  title: string;
  content: GalleryContent;
  editable?: boolean;
  onUpdate?: (images: string[]) => void;
}

export function GalleryWidget({ title, content, editable = false, onUpdate }: Props) {
  const images = content.images ?? [];
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, remove, uploading } = useCloudinaryUpload("portfolio");

  async function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const results = await Promise.all(files.map((f) => upload(f)));
    const urls = results.filter(Boolean).map((r) => r!.secure_url);
    onUpdate?.([...images, ...urls]);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleRemove(src: string, idx: number) {
    const publicId = src.match(/beauty-platform\/portfolio\/[^/]+\/[^.]+/)?.[0];
    if (publicId) await remove(publicId);
    onUpdate?.(images.filter((_, i) => i !== idx));
  }

  return (
    <>
      <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
          {editable && (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Добавить
            </button>
          )}
        </div>

        {images.length === 0 && (
          <p className="text-sm text-zinc-400">{editable ? "Загрузите первое фото" : "Нет фотографий"}</p>
        )}

        <div className="grid grid-cols-3 gap-2">
          {images.map((src, i) => (
            <div key={i} className="group relative aspect-square">
              <img
                src={src}
                alt={`${title} ${i + 1}`}
                className="h-full w-full cursor-zoom-in rounded-xl object-cover transition group-hover:brightness-90"
                onClick={() => setLightbox(src)}
              />
              <button
                className="absolute right-1.5 top-1.5 hidden rounded-full bg-black/60 p-1 text-white group-hover:flex"
                onClick={() => setLightbox(src)}
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              {editable && (
                <button
                  className="absolute bottom-1.5 right-1.5 hidden rounded-full bg-red-600/90 p-1 text-white group-hover:flex"
                  onClick={() => void handleRemove(src, i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {editable && (
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void handleAdd(e)}
          />
        )}
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightbox}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
