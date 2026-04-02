"use client";

import { useCategories } from "@/hooks/use-categories";
import { useCategoryNavigation } from "@/hooks/use-category-navigation";
import { useSearchStore } from "@/stores/search-store";
import { CategoryNode } from "./category-node";
import { SkeletonCategories } from "@/components/ui/skeleton-categories";

interface CategoryTreeProps {
  onSelect?: () => void;
}

export function CategoryTree({ onSelect }: CategoryTreeProps) {
  const { categoriesTree, loading } = useCategories();
  const { filters } = useSearchStore();
  const { clearFilters } = useCategoryNavigation();

  if (loading) return <SkeletonCategories />;

  return (
    <nav className="space-y-0.5">
      <button
        onClick={() => { clearFilters(); onSelect?.(); }}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
          !filters.categoryId
            ? "bg-violet-100 font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-400"
            : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
      >
        <span className="flex-shrink-0">🏠</span>
        <span>Все категории</span>
      </button>

      {categoriesTree.map((node) => (
        <CategoryNode key={node.id} node={node} onSelect={onSelect} />
      ))}
    </nav>
  );
}
