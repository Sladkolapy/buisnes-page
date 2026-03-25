import Link from "next/link";

export default function MainPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-center">
      <div className="max-w-lg space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Beauty Platform</h1>
          <p className="text-zinc-500">
            Платформа для бьюти-мастеров и их клиентов
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            Зарегистрироваться
          </Link>
          <Link
            href="/sign-in"
            className="rounded-lg border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Войти
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 text-left">
          {[
            { emoji: "✂️", title: "Мастера", desc: "Найдите своего специалиста" },
            { emoji: "🏢", title: "Бизнес", desc: "Управляйте салоном онлайн" },
            { emoji: "💬", title: "Чат", desc: "Общайтесь напрямую" },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="text-2xl">{card.emoji}</div>
              <div className="mt-2 text-sm font-semibold">{card.title}</div>
              <div className="mt-1 text-xs text-zinc-500">{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
