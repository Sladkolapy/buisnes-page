import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings }

function formatDuration(min: number) {
  if (min < 60) return `${min} мин`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
}

export function ServicesGridSection({ settings }: Props) {
  const services = settings.services ?? [];

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        {settings.title && (
          <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 md:text-3xl">{settings.title}</h2>
        )}
        {services.length === 0 ? (
          <p className="text-center text-zinc-400">Услуги не добавлены</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc: { id: string; name: string; price: number; duration: number; imageUrl: string }) => (
              <div key={svc.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {svc.imageUrl ? (
                  <img src={svc.imageUrl} alt={svc.name} className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-violet-50 dark:bg-violet-950/20">
                    <span className="text-3xl">🛍️</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{svc.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-violet-600">{svc.price.toLocaleString("ru")} ₽</span>
                    <span className="text-sm text-zinc-400">{formatDuration(svc.duration)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
