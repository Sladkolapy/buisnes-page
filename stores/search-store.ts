import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_FILTERS, type ProfileCardData, type SearchFilters } from "@/core/shared/search-types";

interface SearchResponse {
  data: ProfileCardData[];
  pagination: { page: number; limit: number; total: number; hasMore: boolean };
}

interface SearchState {
  profiles: ProfileCardData[];
  filters: SearchFilters;
  loading: boolean;
  hasMore: boolean;
  page: number;
  total: number;

  setFilters: (filters: Partial<SearchFilters>) => void;
  fetchProfiles: (filters?: Partial<SearchFilters>) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

function buildUrl(filters: SearchFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.subcategoryId) params.set("subcategoryId", filters.subcategoryId);
  if (filters.city) params.set("city", filters.city);
  params.set("sortBy", filters.sortBy);
  params.set("sortOrder", filters.sortOrder);
  params.set("page", String(page));
  params.set("limit", "20");
  return `/api/search?${params.toString()}`;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      profiles: [],
      filters: DEFAULT_FILTERS,
      loading: false,
      hasMore: false,
      page: 1,
      total: 0,

      setFilters: (partial) => {
        const filters = { ...get().filters, ...partial };
        set({ filters });
      },

      fetchProfiles: async (partial) => {
        const filters = partial ? { ...get().filters, ...partial } : get().filters;
        set({ filters, loading: true, page: 1, profiles: [] });
        try {
          const res = await fetch(buildUrl(filters, 1));
          const json = (await res.json()) as SearchResponse;
          set({
            profiles: json.data,
            total: json.pagination.total,
            hasMore: json.pagination.hasMore,
            page: 1,
            loading: false,
          });
        } catch {
          set({ loading: false });
        }
      },

      loadMore: async () => {
        const { filters, page, loading, hasMore } = get();
        if (loading || !hasMore) return;
        const nextPage = page + 1;
        set({ loading: true });
        try {
          const res = await fetch(buildUrl(filters, nextPage));
          const json = (await res.json()) as SearchResponse;
          set((s) => ({
            profiles: [...s.profiles, ...json.data],
            total: json.pagination.total,
            hasMore: json.pagination.hasMore,
            page: nextPage,
            loading: false,
          }));
        } catch {
          set({ loading: false });
        }
      },

      reset: () => {
        set({ filters: DEFAULT_FILTERS, profiles: [], page: 1, total: 0, hasMore: false });
      },
    }),
    {
      name: "search-filters",
      partialize: (s) => ({ filters: s.filters }),
    },
  ),
);
