interface EmptyStateProps {
  onReset?: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-700">
      <div className="text-5xl">🔍</div>
      <h2 className="mt-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
        Ничего не найдено
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Попробуйте изменить запрос или сбросить фильтры
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-5 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}
