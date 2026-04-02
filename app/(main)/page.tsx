"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/search-bar";
import { CategoryTree } from "@/components/search/category-tree";
import { CategoryBreadcrumbs } from "@/components/search/category-breadcrumbs";
import { CategoryFilterChip } from "@/components/search/category-filter-chip";
import { MobileCategorySheet } from "@/components/search/mobile-category-sheet";
import { ProfileCard } from "@/components/search/profile-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { useSearchStore } from "@/stores/search-store";
import { useCategories } from "@/hooks/use-categories";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

function pluralProfiles(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} мастеров`;
  if (mod10 === 1) return `${n} мастер`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} мастера`;
  return `${n} мастеров`;
}

function FeedContent() {
  const searchParams = useSearchParams();
  const { profiles, filters, loading, hasMore, total, setFilters, fetchProfiles, reset } =
    useSearchStore();

  useCategories();

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const categoryId = searchParams.get("categoryId") ?? null;
    const subcategoryId = searchParams.get("subcategoryId") ?? null;
    const city = searchParams.get("city") ?? null;
    const sortBy = (searchParams.get("sortBy") as typeof filters.sortBy) ?? filters.sortBy;
    setFilters({ query: q, categoryId, subcategoryId, city, sortBy });
    fetchProfiles({ query: q, categoryId, subcategoryId, city, sortBy });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerRef = useInfiniteScroll(hasMore, loading, () => {
    void useSearchStore.getState().loadMore();
  });

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
      {/* Sidebar — desktop */}
      <aside className="hidden w-56 flex-shrink-0 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Категории</p>
        <CategoryTree />
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1 space-y-3">
        {/* Search + mobile category trigger */}
        <div className="flex gap-2">
          <div className="flex-1"><SearchBar /></div>
          <div className="lg:hidden"><MobileCategorySheet /></div>
        </div>

        {/* Breadcrumbs */}
        <CategoryBreadcrumbs />

        {/* Active filter chip */}
        <CategoryFilterChip />

        {/* Results count */}
        {!loading && total > 0 && (
          <p className="text-xs text-zinc-400">{pluralProfiles(total)}</p>
        )}

        {/* Grid */}
        {loading && profiles.length === 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : profiles.length === 0 ? (
          <EmptyState onReset={reset} />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {profiles.map((p) => <ProfileCard key={p.id} profile={p} />)}
              {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
            </div>
            <div ref={triggerRef} className="h-4" />
          </>
        )}
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      }
    >
      <FeedContent />
    </Suspense>
  );
}
