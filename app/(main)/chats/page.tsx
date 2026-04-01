import { MessageCircle, Search } from "lucide-react";
import Link from "next/link";

export default function ChatsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Чаты</h1>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <Search className="h-4 w-4 flex-shrink-0 text-zinc-400" />
        <span className="text-sm text-zinc-400">Поиск по сообщениям…</span>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-700">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <MessageCircle className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Нет сообщений
        </h2>
        <p className="mt-1 max-w-xs text-sm text-zinc-500">
          Найдите мастера и начните диалог прямо с его страницы
        </p>
        <Link
          href="/"
          className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          Найти мастера
        </Link>
      </div>
    </div>
  );
}
