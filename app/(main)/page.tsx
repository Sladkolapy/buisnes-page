import { Search } from "lucide-react";

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <Search className="h-4 w-4 flex-shrink-0 text-zinc-400" />
        <span className="text-sm text-zinc-400">Поиск мастеров и услуг…</span>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-700">
        <div className="text-4xl">✂️</div>
        <h2 className="mt-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Лента поиска
        </h2>
        <p className="mt-1 text-sm text-zinc-500">Скоро здесь появятся мастера и услуги</p>
      </div>
    </div>
  );
}
