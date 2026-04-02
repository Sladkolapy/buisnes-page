export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  order: number;
  parentId: string | null;
  level: 0 | 1;
}

export interface CategoryTree extends Category {
  children: Category[];
}

export interface ProfileCategory {
  profileId: string;
  categoryId: string;
}
