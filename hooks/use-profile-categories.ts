"use client";

import { useCategoryStore } from "@/stores/category-store";
import type { Category } from "@/core/shared/category-types";

export function useProfileCategories(subcategoryIds: string[]): Category[] {
  const categories = useCategoryStore((s) => s.categories);
  return subcategoryIds
    .map((id) => categories.find((c) => c.id === id))
    .filter((c): c is Category => c !== undefined);
}
