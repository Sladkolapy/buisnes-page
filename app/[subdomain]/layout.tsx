import Link from "next/link";

export default function PublicProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 flex h-12 w-full items-center border-b border-zinc-200 bg-white/80 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            Beauty Platform
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Найти мастера
          </Link>
        </div>
      </header>
      {children}
    </>
  );
}
