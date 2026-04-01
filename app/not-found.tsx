import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-black text-violet-600">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Страница не найдена
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Возможно, ссылка устарела или мастер удалил свою страницу
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
      >
        На главную
      </Link>
    </div>
  );
}
