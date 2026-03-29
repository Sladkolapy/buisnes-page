import { MessageCircle } from "lucide-react";

export default function ChatsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Чаты</h1>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-700">
        <MessageCircle className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
        <h2 className="mt-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Нет сообщений
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Чат с мастерами появится здесь
        </p>
      </div>
    </div>
  );
}
