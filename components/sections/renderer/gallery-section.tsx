"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings }

const COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

export function GallerySection({ settings }: Props) {
  const images: { id: string; url: string; alt?: string }[] = settings.images ?? [];
  const cols = COLS[settings.columns ?? 3] ?? COLS[3];
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        {settings.title && (
          <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 md:text-3xl">{settings.title}</h2>
        )}
        {images.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700">
            <span className="text-zinc-400">Изображения не добавлены</span>
          </div>
        ) : (
          <div className={`grid gap-3 ${cols}`}>
            {images.map((img) => (
              <button key={img.id} onClick={() => setLightbox(img.url)} className="overflow-hidden rounded-2xl">
                <img src={img.url} alt={img.alt ?? ""} className="aspect-square w-full object-cover transition hover:scale-105" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setLightbox(null)}>
          <button className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30" onClick={() => setLightbox(null)}>
            <X className="h-6 w-6" />
          </button>
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
