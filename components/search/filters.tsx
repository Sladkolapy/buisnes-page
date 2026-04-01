"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSearchStore } from "@/stores/search-store";
import { CategorySelect } from "./category-select";

interface FiltersProps {
  onClose?: () => void;
}

const SORT_OPTIONS = [
  { value: "date", label: "По дате" },
  { value: "rating", label: "По рейтингу" },
  { value: "name", label: "По названию" },
] as const;

export function Filters({ onClose }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilters, fetchProfiles, reset } = useSearchStore();

  function syncUrl(updates: Partial<typeof filters>) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { ...filters, ...updates };
    if (merged.categoryId) params.set("categoryId", merged.categoryId);
    else params.delete("categoryId");
    if (merged.city) params.set("city", merged.city);
    else params.delete("city");
    params.set("sortBy", merged.sortBy);
    params.set("sortOrder", merged.sortOrder);
    router.replace(`/?${params.toString()}`, { scroll: false });
  }

  function handleCategory(categoryId: string | null) {
    setFilters({ categoryId });
    syncUrl({ categoryId });
    fetchProfiles({ categoryId });
    onClose?.();
  }

  function handleCity(e: React.ChangeEvent<HTMLInputElement>) {
    const city = e.target.value || null;
    setFilters({ city });
    syncUrl({ city });
  }

  function handleCityBlur() {
    fetchProfiles();
  }

  function handleSort(sortBy: typeof filters.sortBy) {
    setFilters({ sortBy });
    syncUrl({ sortBy });
    fetchProfiles({ sortBy });
  }

  function handleReset() {
    reset();
    router.replace("/", { scroll: false });
    fetchProfiles({ query: "", categoryId: null, city: null, sortBy: "date", sortOrder: "desc" });
    onClose?.();
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Категория
        </p>
        <CategorySelect value={filters.categoryId} onChange={handleCategory} />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Город
        </p>
        <input
          value={filters.city ?? ""}
          onChange={handleCity}
          onBlur={handleCityBlur}
          placeholder="Например, Москва"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-violet-500"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Сортировка
        </p>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <input
                type="radio"
                name="sortBy"
                value={opt.value}
                checked={filters.sortBy === opt.value}
                onChange={() => handleSort(opt.value)}
                className="accent-violet-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleReset}
        className="w-full rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}
