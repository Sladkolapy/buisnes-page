"use client";

import { ChevronRight } from "lucide-react";
import { useCategoryStore } from "@/stores/category-store";
import { useCategoryNavigation } from "@/hooks/use-category-navigation";
import { useSearchStore } from "@/stores/search-store";

export function CategoryBreadcrumbs() {
  const { filters } = useSearchStore();
  const { getCategoryPath } = useCategoryStore();
  const { clearFilters, setCategory } = useCategoryNavigation();

  if (!filters.categoryId) return null;

  const path = filters.subcategoryId
    ? getCategoryPath(filters.subcategoryId)
    : getCategoryPath(filters.categoryId);

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-zinc-500">
      <button
        onClick={clearFilters}
        className="hover:text-violet-600 dark:hover:text-violet-400"
      >
        Все
      </button>
      {path.map((cat, i) => (
        <span key={cat.id} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
          {i < path.length - 1 ? (
            <button
              onClick={() => setCategory(cat.id)}
              className="hover:text-violet-600 dark:hover:text-violet-400"
            >
              {cat.name}
            </button>
          ) : (
            <span className="font-medium text-zinc-800 dark:text-zinc-200">{cat.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
