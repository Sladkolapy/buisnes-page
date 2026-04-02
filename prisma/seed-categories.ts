import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const data = [
  {
    id: "root-1", name: "Бьюти-услуги",     slug: "beauty",  icon: "💅", order: 1, parentId: null,
    children: [
      { id: "sub-1-1", name: "Бровист",    slug: "brows",       icon: "🪮", order: 1 },
      { id: "sub-1-2", name: "Парикмахер", slug: "hair",        icon: "✂️", order: 2 },
      { id: "sub-1-3", name: "Маникюр",    slug: "nails",       icon: "💅", order: 3 },
      { id: "sub-1-4", name: "Визажист",   slug: "makeup",      icon: "💄", order: 4 },
      { id: "sub-1-5", name: "Косметолог", slug: "cosmetology", icon: "🌸", order: 5 },
      { id: "sub-1-6", name: "Массажист",  slug: "massage",     icon: "🧘", order: 6 },
    ],
  },
  {
    id: "root-2", name: "Образование",       slug: "edu",     icon: "📚", order: 2, parentId: null,
    children: [
      { id: "sub-2-1", name: "Репетитор",            slug: "tutor",  icon: "📖", order: 1 },
      { id: "sub-2-2", name: "Подготовка к школе",   slug: "school", icon: "🏫", order: 2 },
      { id: "sub-2-3", name: "Иностранные языки",    slug: "langs",  icon: "🌍", order: 3 },
    ],
  },
  {
    id: "root-3", name: "Фото и видео",      slug: "photo",   icon: "📷", order: 3, parentId: null,
    children: [
      { id: "sub-3-1", name: "Фотограф",            slug: "photographer",  icon: "📷", order: 1 },
      { id: "sub-3-2", name: "Видеограф",           slug: "videographer",  icon: "🎥", order: 2 },
      { id: "sub-3-3", name: "Свадебный фотограф",  slug: "wedding-photo", icon: "💒", order: 3 },
    ],
  },
  {
    id: "root-4", name: "Здоровье и фитнес", slug: "health",  icon: "🏃", order: 4, parentId: null,
    children: [
      { id: "sub-4-1", name: "Тренер",      slug: "trainer",    icon: "💪", order: 1 },
      { id: "sub-4-2", name: "Нутрициолог", slug: "nutrition",  icon: "🥗", order: 2 },
      { id: "sub-4-3", name: "Психолог",    slug: "psychology", icon: "🧠", order: 3 },
    ],
  },
];

async function main() {
  console.log("Seeding categories...");

  for (const root of data) {
    await prisma.category.upsert({
      where: { id: root.id },
      update: { name: root.name, slug: root.slug, icon: root.icon, order: root.order },
      create: { id: root.id, name: root.name, slug: root.slug, icon: root.icon, order: root.order, parentId: null },
    });

    for (const child of root.children) {
      await prisma.category.upsert({
        where: { id: child.id },
        update: { name: child.name, slug: child.slug, icon: child.icon, order: child.order },
        create: { id: child.id, name: child.name, slug: child.slug, icon: child.icon, order: child.order, parentId: root.id },
      });
    }
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
