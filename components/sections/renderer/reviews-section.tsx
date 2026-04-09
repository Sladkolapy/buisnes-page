import { Star } from "lucide-react";
import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings }

interface Review { id: string; author: string; text: string; rating: number; date: string }

export function ReviewsSection({ settings }: Props) {
  const reviews: Review[] = settings.reviews ?? [];

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        {settings.title && (
          <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 md:text-3xl">{settings.title}</h2>
        )}
        {reviews.length === 0 ? (
          <p className="text-center text-zinc-400">Отзывы не добавлены</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                    {rev.author[0]?.toUpperCase()}
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{rev.text}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{rev.author}</p>
                  <p className="text-xs text-zinc-400">
                    {new Date(rev.date).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
