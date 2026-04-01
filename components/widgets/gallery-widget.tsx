import type { GalleryContent } from "@/core/shared/widget-types";

export function GalleryWidget({ title, content }: { title: string; content: GalleryContent }) {
  if (!content.images?.length) return null;
  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
      <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {content.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${title} ${i + 1}`}
            className="aspect-square w-full rounded-xl object-cover"
          />
        ))}
      </div>
    </section>
  );
}
