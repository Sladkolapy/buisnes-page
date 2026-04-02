import type { ProfileCardData, SearchFilters } from "@/core/shared/search-types";
import { MOCK_CATEGORIES } from "./categories";

export const MOCK_PROFILES: ProfileCardData[] = [
  // Бьюти-услуги
  { id: "p-1",  businessName: "Студия Ольги Смирновой",    avatar: null, description: "Профессиональный маникюр и педикюр. Гель-лак, наращивание. Работаю 8 лет.",   rating: 4.9, subdomain: "olga-nails",      categoryIds: ["root-1"], subcategoryIds: ["sub-1-3"],          isPublished: true },
  { id: "p-2",  businessName: "Анна Козлова | Визаж",       avatar: null, description: "Свадебный и вечерний макияж. Обучение визажу с нуля.",                        rating: 4.8, subdomain: "anna-makeup",     categoryIds: ["root-1"], subcategoryIds: ["sub-1-4"],          isPublished: true },
  { id: "p-3",  businessName: "Barber House Артём",         avatar: null, description: "Мужские стрижки, бритьё, укладки. Приятная атмосфера.",                       rating: 4.7, subdomain: "artem-barber",    categoryIds: ["root-1"], subcategoryIds: ["sub-1-2"],          isPublished: true },
  { id: "p-4",  businessName: "Юлия Бровист",               avatar: null, description: "Архитектура бровей, окрашивание, ламинирование.",                             rating: 4.9, subdomain: "yulia-brows",     categoryIds: ["root-1"], subcategoryIds: ["sub-1-1"],          isPublished: true },
  { id: "p-5",  businessName: "Студия массажа «Гармония»",  avatar: null, description: "Расслабляющий, лечебный и спортивный массаж. Выезд на дом.",                 rating: 4.6, subdomain: "harmony-massage", categoryIds: ["root-1"], subcategoryIds: ["sub-1-6"],          isPublished: true },
  { id: "p-8",  businessName: "Косметология Натали",        avatar: null, description: "Чистки, пилинги, инъекции красоты. Индивидуальный подход.",                   rating: 4.7, subdomain: "natali-skin",     categoryIds: ["root-1"], subcategoryIds: ["sub-1-5"],          isPublished: true },
  { id: "p-10", businessName: "Nail Art by Дарья",          avatar: null, description: "Художественный маникюр, нейл-дизайн, втирки и фольга.",                       rating: 4.8, subdomain: "dasha-nails",     categoryIds: ["root-1"], subcategoryIds: ["sub-1-3"],          isPublished: true },
  { id: "p-11", businessName: "Парикмахер Светлана",        avatar: null, description: "Стрижки, окрашивание, химическая завивка. Опыт 12 лет.",                      rating: 4.6, subdomain: "sveta-hair",      categoryIds: ["root-1"], subcategoryIds: ["sub-1-2"],          isPublished: true },
  { id: "p-15", businessName: "Визажист Полина Star",       avatar: null, description: "Макияж для съёмок, подиума и особых случаев.",                                rating: 4.8, subdomain: "polina-star",     categoryIds: ["root-1"], subcategoryIds: ["sub-1-4"],          isPublished: true },
  { id: "p-16", businessName: "Бровист Марина Artistry",    avatar: null, description: "Перманентный макияж бровей, губ, век. Сертифицированный мастер.",             rating: 4.9, subdomain: "marina-art",      categoryIds: ["root-1"], subcategoryIds: ["sub-1-1", "sub-1-4"], isPublished: true },
  { id: "p-17", businessName: "Косметолог Алиса",           avatar: null, description: "Аппаратная косметология, RF-лифтинг, микротоки.",                             rating: 4.6, subdomain: "alisa-cosmo",     categoryIds: ["root-1"], subcategoryIds: ["sub-1-5"],          isPublished: true },
  { id: "p-19", businessName: "Маникюр на дому Оля",        avatar: null, description: "Классический и аппаратный маникюр, педикюр. Выезд по Москве.",               rating: 4.5, subdomain: "olya-home-nails", categoryIds: ["root-1"], subcategoryIds: ["sub-1-3"],          isPublished: true },
  { id: "p-25", businessName: "Косметолог Наталья Гринева", avatar: null, description: "Биоревитализация, мезотерапия, пилинги TCA.",                                 rating: 4.9, subdomain: "natalia-beauty",  categoryIds: ["root-1"], subcategoryIds: ["sub-1-5"],          isPublished: true },

  // Образование
  { id: "p-7",  businessName: "Репетитор Екатерина",        avatar: null, description: "Английский язык для детей и взрослых. ЕГЭ, IELTS, бизнес-английский.",       rating: 4.9, subdomain: "kate-english",    categoryIds: ["root-2"], subcategoryIds: ["sub-2-3"],          isPublished: true },
  { id: "p-13", businessName: "Репетитор по математике",    avatar: null, description: "ЕГЭ, ОГЭ, олимпиады. Подготовка к поступлению в вузы.",                       rating: 4.9, subdomain: "math-pro",        categoryIds: ["root-2"], subcategoryIds: ["sub-2-1"],          isPublished: true },
  { id: "p-22", businessName: "Репетитор по физике Игорь",  avatar: null, description: "Физика для 8-11 классов. ЕГЭ 90+ баллов.",                                    rating: 4.7, subdomain: "igor-physics",    categoryIds: ["root-2"], subcategoryIds: ["sub-2-1"],          isPublished: true },
  { id: "p-26", businessName: "Школа подготовки «Знайка»",  avatar: null, description: "Подготовка к школе для детей 5-7 лет. Чтение, счёт, письмо.",                 rating: 4.8, subdomain: "znaika-school",   categoryIds: ["root-2"], subcategoryIds: ["sub-2-2"],          isPublished: true },

  // Фото и видео
  { id: "p-6",  businessName: "Фотограф Михаил Лебедев",   avatar: null, description: "Портретная и коммерческая съёмка. Репортаж, Love Story.",                     rating: 4.8, subdomain: "misha-photo",     categoryIds: ["root-3"], subcategoryIds: ["sub-3-1"],          isPublished: true },
  { id: "p-12", businessName: "Фотостудия «Свет»",          avatar: null, description: "Студийная съёмка с реквизитом. Детская, семейная, деловая.",                  rating: 4.7, subdomain: "svet-studio",     categoryIds: ["root-3"], subcategoryIds: ["sub-3-1"],          isPublished: true },
  { id: "p-20", businessName: "Фотограф Андрей Волков",     avatar: null, description: "Пейзаж, архитектура, уличная фотография. Авторский стиль.",                   rating: 4.6, subdomain: "andrey-photo",    categoryIds: ["root-3"], subcategoryIds: ["sub-3-1"],          isPublished: true },
  { id: "p-27", businessName: "Видеограф Дмитрий",          avatar: null, description: "Свадебное видео, клипы, корпоративные ролики.",                               rating: 4.7, subdomain: "dmitry-video",    categoryIds: ["root-3"], subcategoryIds: ["sub-3-2"],          isPublished: true },
  { id: "p-28", businessName: "Свадебный фотограф Аня",     avatar: null, description: "Нежные и атмосферные свадебные фотоистории.",                                 rating: 4.9, subdomain: "anya-wedding",    categoryIds: ["root-3"], subcategoryIds: ["sub-3-3"],          isPublished: true },

  // Здоровье и фитнес
  { id: "p-14", businessName: "Ирина Массаж Wellness",      avatar: null, description: "Антицеллюлитный, лимфодренажный, тайский массаж.",                           rating: 4.5, subdomain: "irina-wellness",  categoryIds: ["root-1", "root-4"], subcategoryIds: ["sub-1-6", "sub-4-1"], isPublished: true },
  { id: "p-23", businessName: "Спа-массаж «Прикосновение»", avatar: null, description: "Шоколадное обёртывание, гидромассаж, медовый массаж.",                       rating: 4.9, subdomain: "spa-touch",       categoryIds: ["root-4"], subcategoryIds: ["sub-4-1"],          isPublished: true },
  { id: "p-29", businessName: "Нутрициолог Ксения",         avatar: null, description: "Составление рациона питания, работа с весом, спортивное питание.",            rating: 4.8, subdomain: "ksenia-nutrition", categoryIds: ["root-4"], subcategoryIds: ["sub-4-2"],          isPublished: true },
  { id: "p-30", businessName: "Психолог Олег Семёнов",      avatar: null, description: "Когнитивно-поведенческая терапия. Тревожность, депрессия, отношения.",        rating: 4.9, subdomain: "oleg-psy",        categoryIds: ["root-4"], subcategoryIds: ["sub-4-3"],          isPublished: true },
];

export function getMockProfiles(
  page: number,
  limit: number,
  filters: Partial<Pick<SearchFilters, "query" | "categoryId" | "subcategoryId" | "sortBy" | "sortOrder">>,
): { data: ProfileCardData[]; total: number } {
  let result = [...MOCK_PROFILES];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.businessName.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q),
    );
  }

  if (filters.subcategoryId) {
    result = result.filter((p) => p.subcategoryIds.includes(filters.subcategoryId!));
  } else if (filters.categoryId) {
    const childIds = MOCK_CATEGORIES
      .filter((c) => c.parentId === filters.categoryId)
      .map((c) => c.id);
    result = result.filter(
      (p) =>
        p.categoryIds.includes(filters.categoryId!) ||
        p.subcategoryIds.some((id) => childIds.includes(id)),
    );
  }

  if (filters.sortBy === "name") {
    result.sort((a, b) =>
      filters.sortOrder === "asc"
        ? a.businessName.localeCompare(b.businessName, "ru")
        : b.businessName.localeCompare(a.businessName, "ru"),
    );
  } else if (filters.sortBy === "rating") {
    result.sort((a, b) =>
      filters.sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating,
    );
  }

  const total = result.length;
  const data = result.slice((page - 1) * limit, page * limit);
  return { data, total };
}
