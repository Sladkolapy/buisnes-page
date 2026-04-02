"use client";

import { ChevronRight, ChevronDown } from "lucide-react";
import type { CategoryTree } from "@/core/shared/category-types";
import { useCategoryNavigation } from "@/hooks/use-category-navigation";
import { useSearchStore } from "@/stores/search-store";

interface CategoryNodeProps {
  node: CategoryTree;
  onSelect?: () => void;
}

export function CategoryNode({ node, onSelect }: CategoryNodeProps) {
  const { filters } = useSearchStore();
  const { setCategory, setSubcategory } = useCategoryNavigation();

  const isRootActive = filters.categoryId === node.id && !filters.subcategoryId;
  const hasChildren = node.children.length > 0;
  const isExpanded = filters.categoryId === node.id;

  function handleRootClick() {
    setCategory(node.id);
    onSelect?.();
  }

  function handleSubClick(subId: string) {
    setSubcategory(node.id, subId);
    onSelect?.();
  }

  return (
    <div>
      <button
        onClick={handleRootClick}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
          isRootActive
            ? "bg-violet-100 font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-400"
            : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
      >
        {node.icon && <span className="flex-shrink-0">{node.icon}</span>}
        <span className="flex-1 text-left">{node.name}</span>
        {hasChildren && (
          isExpanded
            ? <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
            : <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
        )}
      </button>

      {isExpanded && hasChildren && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-zinc-200 pl-3 dark:border-zinc-700">
          {node.children.map((child) => {
            const isActive = filters.subcategoryId === child.id;
            return (
              <button
                key={child.id}
                onClick={() => handleSubClick(child.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-violet-100 font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-400"
                    : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {child.icon && <span className="flex-shrink-0 text-xs">{child.icon}</span>}
                <span className="flex-1 text-left">{child.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
