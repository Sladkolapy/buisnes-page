export interface SearchFilters {
  query: string;
  categoryId: string | null;
  subcategoryId: string | null;
  city: string | null;
  sortBy: "date" | "rating" | "name";
  sortOrder: "asc" | "desc";
}

export interface ProfileCardData {
  id: string;
  businessName: string;
  avatar: string | null;
  description: string | null;
  rating: number;
  subdomain: string;
  categoryIds: string[];
  subcategoryIds: string[];
  isPublished: boolean;
}

export const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  categoryId: null,
  subcategoryId: null,
  city: null,
  sortBy: "date",
  sortOrder: "desc",
};
