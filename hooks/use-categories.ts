"use client";

import { useEffect } from "react";
import { useCategoryStore } from "@/stores/category-store";

export function useCategories() {
  const { categories, categoriesTree, loading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, categoriesTree, loading, error };
}
