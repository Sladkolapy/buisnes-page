export function ReviewsWidget({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
      <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-zinc-400">
        <span className="text-3xl">⭐</span>
        <p className="mt-2">Отзывы появятся здесь после интеграции</p>
      </div>
    </section>
  );
}
