"use client";

import { X } from "lucide-react";
import { useCategoryStore } from "@/stores/category-store";
import { useCategoryNavigation } from "@/hooks/use-category-navigation";
import { useSearchStore } from "@/stores/search-store";

export function CategoryFilterChip() {
  const { filters } = useSearchStore();
  const { categories } = useCategoryStore();
  const { clearFilters, setCategory } = useCategoryNavigation();

  if (!filters.categoryId) return null;

  const rootCat = categories.find((c) => c.id === filters.categoryId);
  const subCat = filters.subcategoryId
    ? categories.find((c) => c.id === filters.subcategoryId)
    : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="flex cursor-pointer items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 transition hover:bg-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:hover:bg-violet-950/60"
        onClick={() => subCat ? setCategory(filters.categoryId!) : clearFilters()}
      >
        {rootCat?.icon && <span>{rootCat.icon}</span>}
        {rootCat?.name}
        {!subCat && (
          <button
            onClick={(e) => { e.stopPropagation(); clearFilters(); }}
            className="ml-1 rounded-full hover:text-violet-900"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </span>

      {subCat && (
        <>
          <span className="text-xs text-zinc-400">/</span>
          <span className="flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white">
            {subCat.icon && <span>{subCat.icon}</span>}
            {subCat.name}
            <button
              onClick={clearFilters}
              className="ml-1 rounded-full hover:text-violet-200"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </>
      )}
    </div>
  );
}
