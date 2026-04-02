import type { Category, CategoryTree } from "@/core/shared/category-types";

export const MOCK_CATEGORIES: Category[] = [
  // ─── Корневые (level 0) ────────────────────────────────────────────────
  { id: "root-1", name: "Бьюти-услуги",      slug: "beauty",   icon: "💅", order: 1, parentId: null, level: 0 },
  { id: "root-2", name: "Образование",        slug: "edu",      icon: "📚", order: 2, parentId: null, level: 0 },
  { id: "root-3", name: "Фото и видео",       slug: "photo",    icon: "📷", order: 3, parentId: null, level: 0 },
  { id: "root-4", name: "Здоровье и фитнес",  slug: "health",   icon: "🏃", order: 4, parentId: null, level: 0 },

  // ─── Бьюти-услуги (level 1) ───────────────────────────────────────────
  { id: "sub-1-1", name: "Бровист",     slug: "brows",       icon: "🪮", order: 1, parentId: "root-1", level: 1 },
  { id: "sub-1-2", name: "Парикмахер",  slug: "hair",        icon: "✂️", order: 2, parentId: "root-1", level: 1 },
  { id: "sub-1-3", name: "Маникюр",     slug: "nails",       icon: "💅", order: 3, parentId: "root-1", level: 1 },
  { id: "sub-1-4", name: "Визажист",    slug: "makeup",      icon: "💄", order: 4, parentId: "root-1", level: 1 },
  { id: "sub-1-5", name: "Косметолог",  slug: "cosmetology", icon: "🌸", order: 5, parentId: "root-1", level: 1 },
  { id: "sub-1-6", name: "Массажист",   slug: "massage",     icon: "🧘", order: 6, parentId: "root-1", level: 1 },

  // ─── Образование (level 1) ────────────────────────────────────────────
  { id: "sub-2-1", name: "Репетитор",               slug: "tutor",    icon: "�", order: 1, parentId: "root-2", level: 1 },
  { id: "sub-2-2", name: "Подготовка к школе",      slug: "school",   icon: "🏫", order: 2, parentId: "root-2", level: 1 },
  { id: "sub-2-3", name: "Иностранные языки",        slug: "langs",    icon: "🌍", order: 3, parentId: "root-2", level: 1 },

  // ─── Фото и видео (level 1) ───────────────────────────────────────────
  { id: "sub-3-1", name: "Фотограф",             slug: "photographer",  icon: "📷", order: 1, parentId: "root-3", level: 1 },
  { id: "sub-3-2", name: "Видеограф",            slug: "videographer",  icon: "🎥", order: 2, parentId: "root-3", level: 1 },
  { id: "sub-3-3", name: "Свадебный фотограф",   slug: "wedding-photo", icon: "💒", order: 3, parentId: "root-3", level: 1 },

  // ─── Здоровье и фитнес (level 1) ─────────────────────────────────────
  { id: "sub-4-1", name: "Тренер",        slug: "trainer",    icon: "💪", order: 1, parentId: "root-4", level: 1 },
  { id: "sub-4-2", name: "Нутрициолог",   slug: "nutrition",  icon: "🥗", order: 2, parentId: "root-4", level: 1 },
  { id: "sub-4-3", name: "Психолог",      slug: "psychology", icon: "🧠", order: 3, parentId: "root-4", level: 1 },
];

export function buildCategoryTree(): CategoryTree[] {
  const roots = MOCK_CATEGORIES.filter((c) => c.parentId === null);
  return roots.map((root) => ({
    ...root,
    children: MOCK_CATEGORIES.filter((c) => c.parentId === root.id),
  }));
}
