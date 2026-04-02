import { create } from "zustand";
import type { Category, CategoryTree } from "@/core/shared/category-types";

const CACHE_KEY = "categories_cache_v2";
const CACHE_TTL = 60 * 60 * 1000;

interface CacheEntry { data: Category[]; ts: number }

function readCache(): Category[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.ts > CACHE_TTL) return null;
    return entry.data;
  } catch { return null; }
}

function writeCache(data: Category[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

function buildTree(flat: Category[]): CategoryTree[] {
  return flat
    .filter((c) => c.parentId === null)
    .sort((a, b) => a.order - b.order)
    .map((root) => ({
      ...root,
      children: flat
        .filter((c) => c.parentId === root.id)
        .sort((a, b) => a.order - b.order),
    }));
}

interface CategoryState {
  categories: Category[];
  categoriesTree: CategoryTree[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  getSubcategories: (parentId: string) => Category[];
  getCategoryPath: (categoryId: string) => Category[];
  rootCategories: () => Category[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  categoriesTree: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    if (get().categories.length > 0) return;

    const cached = readCache();
    if (cached) {
      set({ categories: cached, categoriesTree: buildTree(cached) });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const json = (await res.json()) as { data: Category[] };
      writeCache(json.data);
      set({ categories: json.data, categoriesTree: buildTree(json.data), loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Error" });
    }
  },

  getSubcategories: (parentId) =>
    get().categories.filter((c) => c.parentId === parentId).sort((a, b) => a.order - b.order),

  getCategoryPath: (categoryId) => {
    const cats = get().categories;
    const target = cats.find((c) => c.id === categoryId);
    if (!target) return [];
    if (target.parentId === null) return [target];
    const parent = cats.find((c) => c.id === target.parentId);
    return parent ? [parent, target] : [target];
  },

  rootCategories: () =>
    get().categories.filter((c) => c.parentId === null).sort((a, b) => a.order - b.order),
}));
