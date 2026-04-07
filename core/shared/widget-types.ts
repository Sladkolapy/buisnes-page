export enum WidgetType {
  ABOUT = "ABOUT",
  GALLERY = "GALLERY",
  CHECKLIST = "CHECKLIST",
  MAP = "MAP",
  SOCIAL = "SOCIAL",
  NEWS = "NEWS",
  REVIEWS = "REVIEWS",
  PRICE_LIST = "PRICE_LIST",
}

export const WIDGET_LABELS: Record<WidgetType, string> = {
  [WidgetType.ABOUT]: "О себе",
  [WidgetType.GALLERY]: "Галерея",
  [WidgetType.CHECKLIST]: "Чек-лист",
  [WidgetType.MAP]: "Карта",
  [WidgetType.SOCIAL]: "Соцсети",
  [WidgetType.NEWS]: "Новости",
  [WidgetType.REVIEWS]: "Отзывы",
  [WidgetType.PRICE_LIST]: "Прайс-лист",
};

export type AboutContent = { text: string };
export type GalleryContent = { images: string[] };
export type ChecklistContent = { items: { id: string; text: string; checked: boolean }[] };
export type MapContent = { address: string; lat?: string; lng?: string };
export type SocialContent = {
  instagram?: string;
  telegram?: string;
  vk?: string;
  whatsapp?: string;
};
export type NewsContent = { title: string; text: string };
export type ReviewsContent = Record<string, never>;

export type PriceListItem = {
  id: string;
  name: string;
  price: string;
  unit?: string;
  description?: string;
};
export type PriceListContent = { items: PriceListItem[] };

export type WidgetContent =
  | AboutContent
  | GalleryContent
  | ChecklistContent
  | MapContent
  | SocialContent
  | NewsContent
  | ReviewsContent
  | PriceListContent;

export interface WidgetData {
  id: string;
  type: WidgetType;
  title: string;
  content: WidgetContent;
  position: number;
  isVisible: boolean;
  width?: "full" | "half";
}

export interface BusinessProfileData {
  id: string;
  userId: string;
  name: string;
  description?: string;
  subdomain?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  bgColor?: string;
  accentColor?: string;
  isPublished: boolean;
  widgets: WidgetData[];
}
