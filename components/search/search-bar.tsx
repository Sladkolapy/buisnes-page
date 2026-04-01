"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useSearchStore } from "@/stores/search-store";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilters, fetchProfiles } = useSearchStore();

  const syncUrl = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("q", query);
      else params.delete("q");
      router.replace(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    setFilters({ query: value });
    syncUrl(value);
    fetchProfiles({ query: value });
  }, 300);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleSearch(e.target.value);
  }

  function handleClear() {
    setFilters({ query: "" });
    syncUrl("");
    fetchProfiles({ query: "" });
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-violet-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-violet-500">
      <Search className="h-4 w-4 flex-shrink-0 text-zinc-400" />
      <input
        defaultValue={filters.query}
        onChange={handleChange}
        placeholder="Поиск мастеров и услуг…"
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
      />
      {filters.query && (
        <button onClick={handleClear} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
