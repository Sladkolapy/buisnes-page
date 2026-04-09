import { PageSection, DEFAULT_SETTINGS } from "@/core/shared/section-types";

function genId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultSections(profileId: string): PageSection[] {
  return [
    {
      id: genId("hero"),
      profileId,
      type: "hero",
      order: 0,
      settings: {
        ...DEFAULT_SETTINGS.hero,
        title: "Добро пожаловать!",
        subtitle: "Запишитесь к нам прямо сейчас",
      },
      isVisible: true,
    },
    {
      id: genId("about"),
      profileId,
      type: "text-with-image",
      order: 1,
      settings: {
        ...DEFAULT_SETTINGS["text-with-image"],
        title: "О нас",
        text: "Мы — команда профессионалов с многолетним опытом работы. Наша цель — сделать каждого клиента счастливым.",
        imagePosition: "right",
      },
      isVisible: true,
    },
    {
      id: genId("services"),
      profileId,
      type: "services-grid",
      order: 2,
      settings: { ...DEFAULT_SETTINGS["services-grid"] },
      isVisible: true,
    },
    {
      id: genId("gallery"),
      profileId,
      type: "gallery",
      order: 3,
      settings: { ...DEFAULT_SETTINGS.gallery },
      isVisible: true,
    },
    {
      id: genId("contacts"),
      profileId,
      type: "contact-form",
      order: 4,
      settings: { ...DEFAULT_SETTINGS["contact-form"] },
      isVisible: true,
    },
  ];
}
