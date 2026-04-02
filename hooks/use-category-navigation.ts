"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useSearchStore } from "@/stores/search-store";

export function useCategoryNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setFilters, fetchProfiles } = useSearchStore();

  const buildParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      return params.toString();
    },
    [searchParams],
  );

  const setCategory = useCallback(
    (categoryId: string) => {
      const qs = buildParams({ categoryId, subcategoryId: null });
      router.replace(`/?${qs}`, { scroll: false });
      setFilters({ categoryId, subcategoryId: null });
      fetchProfiles({ categoryId, subcategoryId: null });
    },
    [buildParams, fetchProfiles, router, setFilters],
  );

  const setSubcategory = useCallback(
    (categoryId: string, subcategoryId: string) => {
      const qs = buildParams({ categoryId, subcategoryId });
      router.replace(`/?${qs}`, { scroll: false });
      setFilters({ categoryId, subcategoryId });
      fetchProfiles({ categoryId, subcategoryId });
    },
    [buildParams, fetchProfiles, router, setFilters],
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("categoryId");
    params.delete("subcategoryId");
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    setFilters({ categoryId: null, subcategoryId: null });
    fetchProfiles({ categoryId: null, subcategoryId: null });
  }, [buildParams, fetchProfiles, router, searchParams, setFilters]);

  return { setCategory, setSubcategory, clearFilters };
}
