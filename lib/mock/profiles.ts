import type { ProfileCardData, SearchFilters } from "@/core/shared/search-types";

export const MOCK_PROFILES: ProfileCardData[] = [
  { id: "p-1",  businessName: "Студия Ольги Смирновой",    avatar: null, description: "Профессиональный маникюр и педикюр. Гель-лак, наращивание. Работаю 8 лет.",           rating: 4.9, subdomain: "olga-nails",     categoryIds: ["cat-4", "cat-1"], isPublished: true },
  { id: "p-2",  businessName: "Анна Козлова | Визаж",       avatar: null, description: "Свадебный и вечерний макияж. Обучение визажу с нуля.",                                  rating: 4.8, subdomain: "anna-makeup",    categoryIds: ["cat-7"],          isPublished: true },
  { id: "p-3",  businessName: "Barber House Артём",         avatar: null, description: "Мужские стрижки, бритьё, укладки. Приятная атмосфера.",                                 rating: 4.7, subdomain: "artem-barber",   categoryIds: ["cat-3"],          isPublished: true },
  { id: "p-4",  businessName: "Юлия Бровист",               avatar: null, description: "Архитектура бровей, окрашивание, ламинирование.",                                       rating: 4.9, subdomain: "yulia-brows",    categoryIds: ["cat-2"],          isPublished: true },
  { id: "p-5",  businessName: "Студия массажа «Гармония»",  avatar: null, description: "Расслабляющий, лечебный и спортивный массаж. Выезд на дом.",                           rating: 4.6, subdomain: "harmony-massage", categoryIds: ["cat-8"],          isPublished: true },
  { id: "p-6",  businessName: "Фотограф Михаил Лебедев",   avatar: null, description: "Портретная и коммерческая съёмка. Репортаж, Love Story.",                               rating: 4.8, subdomain: "misha-photo",    categoryIds: ["cat-6"],          isPublished: true },
  { id: "p-7",  businessName: "Репетитор Екатерина",        avatar: null, description: "Английский язык для детей и взрослых. ЕГЭ, IELTS, бизнес-английский.",                 rating: 4.9, subdomain: "kate-english",   categoryIds: ["cat-5"],          isPublished: true },
  { id: "p-8",  businessName: "Косметология Натали",        avatar: null, description: "Чистки, пилинги, инъекции красоты. Индивидуальный подход.",                             rating: 4.7, subdomain: "natali-skin",    categoryIds: ["cat-9", "cat-1"], isPublished: true },
  { id: "p-9",  businessName: "Стилист Вера Романова",      avatar: null, description: "Персональный шоппинг, разбор гардероба, создание образов.",                            rating: 4.5, subdomain: "vera-style",     categoryIds: ["cat-10"],         isPublished: true },
  { id: "p-10", businessName: "Nail Art by Дарья",          avatar: null, description: "Художественный маникюр, нейл-дизайн, втирки и фольга.",                                 rating: 4.8, subdomain: "dasha-nails",    categoryIds: ["cat-4"],          isPublished: true },
  { id: "p-11", businessName: "Парикмахер Светлана",        avatar: null, description: "Стрижки, окрашивание, химическая завивка. Опыт 12 лет.",                                rating: 4.6, subdomain: "sveta-hair",     categoryIds: ["cat-3", "cat-1"], isPublished: true },
  { id: "p-12", businessName: "Фотостудия «Свет»",          avatar: null, description: "Студийная съёмка с реквизитом. Детская, семейная, деловая.",                            rating: 4.7, subdomain: "svet-studio",    categoryIds: ["cat-6"],          isPublished: true },
  { id: "p-13", businessName: "Репетитор по математике",    avatar: null, description: "ЕГЭ, ОГЭ, олимпиады. Подготовка к поступлению в вузы.",                                 rating: 4.9, subdomain: "math-pro",       categoryIds: ["cat-5"],          isPublished: true },
  { id: "p-14", businessName: "Ирина Массаж Wellness",      avatar: null, description: "Антицеллюлитный, лимфодренажный, тайский массаж.",                                      rating: 4.5, subdomain: "irina-wellness",  categoryIds: ["cat-8"],          isPublished: true },
  { id: "p-15", businessName: "Визажист Полина Star",       avatar: null, description: "Макияж для съёмок, подиума и особых случаев.",                                          rating: 4.8, subdomain: "polina-star",    categoryIds: ["cat-7"],          isPublished: true },
  { id: "p-16", businessName: "Бровист Марина Artistry",    avatar: null, description: "Перманентный макияж бровей, губ, век. Сертифицированный мастер.",                       rating: 4.9, subdomain: "marina-art",     categoryIds: ["cat-2", "cat-7"], isPublished: true },
  { id: "p-17", businessName: "Косметолог Алиса",           avatar: null, description: "Аппаратная косметология, RF-лифтинг, микротоки.",                                       rating: 4.6, subdomain: "alisa-cosmo",    categoryIds: ["cat-9"],          isPublished: true },
  { id: "p-18", businessName: "Стилист-имиджмейкер Леон",   avatar: null, description: "Создание уникального образа, капсульный гардероб.",                                     rating: 4.7, subdomain: "leon-image",     categoryIds: ["cat-10"],         isPublished: true },
  { id: "p-19", businessName: "Маникюр на дому Оля",        avatar: null, description: "Классический и аппаратный маникюр, педикюр. Выезд по Москве.",                         rating: 4.5, subdomain: "olya-home-nails", categoryIds: ["cat-4"],          isPublished: true },
  { id: "p-20", businessName: "Фотограф Андрей Волков",     avatar: null, description: "Пейзаж, архитектура, уличная фотография. Авторский стиль.",                            rating: 4.6, subdomain: "andrey-photo",   categoryIds: ["cat-6"],          isPublished: true },
  { id: "p-21", businessName: "Beauty Room Кристина",       avatar: null, description: "Комплексный уход: маникюр, брови, ресницы. Уютный кабинет.",                            rating: 4.8, subdomain: "kristina-room",  categoryIds: ["cat-1", "cat-2", "cat-4"], isPublished: true },
  { id: "p-22", businessName: "Репетитор по физике Игорь",  avatar: null, description: "Физика для 8-11 классов. ЕГЭ 90+ баллов.",                                              rating: 4.7, subdomain: "igor-physics",   categoryIds: ["cat-5"],          isPublished: true },
  { id: "p-23", businessName: "Спа-массаж «Прикосновение»", avatar: null, description: "Шоколадное обёртывание, гидромассаж, медовый массаж.",                                  rating: 4.9, subdomain: "spa-touch",      categoryIds: ["cat-8"],          isPublished: true },
  { id: "p-24", businessName: "Парикмахер Николай Premium", avatar: null, description: "Мужские и женские стрижки. Авторские техники окрашивания.",                             rating: 4.8, subdomain: "nikolas-hair",   categoryIds: ["cat-3"],          isPublished: true },
  { id: "p-25", businessName: "Косметолог Наталья Гринева", avatar: null, description: "Биоревитализация, мезотерапия, пилинги TCA.",                                           rating: 4.9, subdomain: "natalia-beauty",  categoryIds: ["cat-9"],          isPublished: true },
];

export function getMockProfiles(
  page: number,
  limit: number,
  filters: Partial<{ query: string; categoryId: string | null; sortBy: string; sortOrder: string }>,
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

  if (filters.categoryId) {
    result = result.filter((p) => p.categoryIds.includes(filters.categoryId!));
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
