import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings }
interface PriceItem { id: string; service: string; price: string; duration: string }

export function PriceListSection({ settings }: Props) {
  const items: PriceItem[] = settings.items ?? [];

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-3xl">
        {settings.title && (
          <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 md:text-3xl">{settings.title}</h2>
        )}
        {items.length === 0 ? (
          <p className="text-center text-zinc-400">Прайс-лист не заполнен</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                  <th className="px-5 py-3 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">Услуга</th>
                  <th className="px-5 py-3 text-right text-sm font-semibold text-zinc-700 dark:text-zinc-300">Цена</th>
                  <th className="px-5 py-3 text-right text-sm font-semibold text-zinc-700 dark:text-zinc-300">Длит.</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className={`border-b border-zinc-100 last:border-0 dark:border-zinc-800 ${i % 2 === 0 ? "" : "bg-zinc-50/50 dark:bg-zinc-800/30"}`}>
                    <td className="px-5 py-3.5 text-sm text-zinc-900 dark:text-zinc-100">{item.service}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-violet-600">{item.price}</td>
                    <td className="px-5 py-3.5 text-right text-sm text-zinc-500">{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
