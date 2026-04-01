import { MapPin, ExternalLink } from "lucide-react";
import type { MapContent } from "@/core/shared/widget-types";

export function MapWidget({ title, content }: { title: string; content: MapContent }) {
  if (!content.address) return null;

  const mapsUrl = content.lat && content.lng
    ? `https://yandex.ru/maps/?pt=${content.lng},${content.lat}&z=16&l=map`
    : `https://yandex.ru/maps/?text=${encodeURIComponent(content.address)}`;

  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
      <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2 text-sm text-zinc-600 transition hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
      >
        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-500" />
        <span className="flex-1">{content.address}</span>
        <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 opacity-60" />
      </a>
      {content.lat && content.lng && (
        <iframe
          src={`https://yandex.ru/map-widget/v1/?pt=${content.lng},${content.lat}&z=15&l=map`}
          className="mt-3 h-48 w-full rounded-xl border-0"
          title={content.address}
          loading="lazy"
          allowFullScreen
        />
      )}
    </section>
  );
}
