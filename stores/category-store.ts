import { create } from "zustand";
import type { Category } from "@/core/shared/search-types";

const CACHE_KEY = "categories_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 час

interface CacheEntry {
  data: Category[];
  ts: number;
}

function readCache(): Category[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.ts > CACHE_TTL) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(data: Category[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() } satisfies CacheEntry));
  } catch {}
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    if (get().categories.length > 0) return;

    const cached = readCache();
    if (cached) {
      set({ categories: cached });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const json = (await res.json()) as { data: Category[] };
      writeCache(json.data);
      set({ categories: json.data, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Error" });
    }
  },
}));
