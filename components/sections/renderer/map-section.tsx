import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings }

export function MapSection({ settings }: Props) {
  const address = encodeURIComponent(settings.address ?? "Москва");
  const zoom = settings.zoom ?? 14;
  const src = `https://yandex.ru/map-widget/v1/?text=${address}&z=${zoom}&l=map`;

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        {settings.title && (
          <h2 className="mb-6 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 md:text-3xl">{settings.title}</h2>
        )}
        {settings.address && (
          <p className="mb-4 text-center text-sm text-zinc-500">{settings.address}</p>
        )}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700" style={{ height: 360 }}>
          <iframe
            src={src}
            width="100%"
            height="100%"
            frameBorder={0}
            allowFullScreen
            title="Яндекс карта"
          />
        </div>
      </div>
    </section>
  );
}
