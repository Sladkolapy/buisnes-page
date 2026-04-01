export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-3 w-4/5 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
