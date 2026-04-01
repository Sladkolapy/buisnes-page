export interface SearchFilters {
  query: string;
  categoryId: string | null;
  city: string | null;
  sortBy: "date" | "rating" | "name";
  sortOrder: "asc" | "desc";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  order: number;
}

export interface ProfileCardData {
  id: string;
  businessName: string;
  avatar: string | null;
  description: string | null;
  rating: number;
  subdomain: string;
  categoryIds: string[];
  isPublished: boolean;
}

export const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  categoryId: null,
  city: null,
  sortBy: "date",
  sortOrder: "desc",
};
