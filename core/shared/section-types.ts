export type SectionType =
  | "hero"
  | "text-with-image"
  | "services-grid"
  | "gallery"
  | "map"
  | "contact-form"
  | "social-links"
  | "reviews"
  | "price-list";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SectionSettings = Record<string, any>;

export interface PageSection {
  id: string;
  profileId: string;
  type: SectionType;
  order: number;
  settings: SectionSettings;
  isVisible: boolean;
}

export const SECTION_META: Record<SectionType, { icon: string; label: string; description: string }> = {
  hero: { icon: "🦸", label: "Героический баннер", description: "Большой баннер с заголовком, подзаголовком и CTA кнопкой" },
  "text-with-image": { icon: "📰", label: "Текст с картинкой", description: "Двухколоночный блок: текст + изображение" },
  "services-grid": { icon: "🛍️", label: "Сетка услуг", description: "Карточки услуг с ценами и длительностью" },
  gallery: { icon: "🖼️", label: "Галерея", description: "Фотосетка работ с лайтбоксом" },
  map: { icon: "🗺️", label: "Карта", description: "Адрес и карта Яндекс" },
  "contact-form": { icon: "📬", label: "Форма связи", description: "Форма для заявок от клиентов" },
  "social-links": { icon: "🔗", label: "Соц. сети", description: "Иконки со ссылками на профили" },
  reviews: { icon: "⭐", label: "Отзывы", description: "Карточки отзывов клиентов" },
  "price-list": { icon: "💰", label: "Прайс-лист", description: "Таблица услуг с ценами и длительностью" },
};

export const DEFAULT_SETTINGS: Record<SectionType, SectionSettings> = {
  hero: {
    title: "Добро пожаловать!",
    subtitle: "Профессиональные услуги для вас",
    bgColor: "#7c3aed",
    bgImageUrl: "",
    buttonText: "Записаться",
    buttonUrl: "#booking",
    textColor: "#ffffff",
  },
  "text-with-image": {
    title: "О нас",
    text: "Расскажите о себе, своём опыте и подходе к работе с клиентами.",
    imageUrl: "",
    imagePosition: "right",
  },
  "services-grid": {
    title: "Наши услуги",
    services: [
      { id: "s1", name: "Услуга 1", price: 1000, duration: 60, imageUrl: "" },
      { id: "s2", name: "Услуга 2", price: 1500, duration: 90, imageUrl: "" },
      { id: "s3", name: "Услуга 3", price: 2000, duration: 120, imageUrl: "" },
    ],
  },
  gallery: {
    title: "Галерея работ",
    images: [],
    columns: 3,
  },
  map: {
    title: "Как нас найти",
    address: "Москва, ул. Примерная, 1",
    zoom: 14,
  },
  "contact-form": {
    title: "Свяжитесь с нами",
    subtitle: "Заполните форму, мы ответим в течение часа",
    showEmail: true,
    showPhone: true,
    showMessage: true,
  },
  "social-links": {
    title: "Мы в соцсетях",
    instagram: "",
    telegram: "",
    vk: "",
    whatsapp: "",
    youtube: "",
  },
  reviews: {
    title: "Отзывы клиентов",
    reviews: [
      { id: "r1", author: "Анна К.", text: "Отличная работа! Очень довольна результатом.", rating: 5, date: "2024-01-15" },
      { id: "r2", author: "Мария С.", text: "Профессионально и аккуратно. Рекомендую!", rating: 5, date: "2024-02-01" },
    ],
  },
  "price-list": {
    title: "Прайс-лист",
    items: [
      { id: "p1", service: "Услуга 1", price: "1 000 ₽", duration: "1 час" },
      { id: "p2", service: "Услуга 2", price: "1 500 ₽", duration: "1.5 часа" },
      { id: "p3", service: "Услуга 3", price: "2 000 ₽", duration: "2 часа" },
    ],
  },
};
