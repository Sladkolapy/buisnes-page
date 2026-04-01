export function SkeletonCategories() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex items-center gap-2 rounded-lg px-3 py-2"
        >
          <div className="h-5 w-5 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      ))}
    </div>
  );
}
