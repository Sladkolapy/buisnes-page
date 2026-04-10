import {
  DailyStats,
  CategoryTreeItem,
  ReportItem,
  UserItem,
  DashboardStats,
} from "@/core/shared/admin-types";

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dateStr(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export function generateDailyStats(): DailyStats[] {
  return Array.from({ length: 30 }, (_, i) => ({
    date: dateStr(29 - i),
    users: rnd(5, 50),
    masters: rnd(1, 15),
    bookings: rnd(10, 100),
    revenue: rnd(5000, 50000),
  }));
}

export function generateCategories(): CategoryTreeItem[] {
  return [
    {
      id: "cat-1", name: "Бьюти-услуги", slug: "beauty", icon: "💅", parentId: null, level: 0, profileCount: 142,
      children: [
        { id: "cat-1-1", name: "Бровист", slug: "brows", icon: "🪮", parentId: "cat-1", level: 1, profileCount: 38, children: [] },
        { id: "cat-1-2", name: "Парикмахер", slug: "haircut", icon: "✂️", parentId: "cat-1", level: 1, profileCount: 55, children: [] },
        { id: "cat-1-3", name: "Маникюр", slug: "manicure", icon: "💅", parentId: "cat-1", level: 1, profileCount: 49, children: [] },
      ],
    },
    {
      id: "cat-2", name: "Фитнес и здоровье", slug: "fitness", icon: "🏋️", parentId: null, level: 0, profileCount: 87,
      children: [
        { id: "cat-2-1", name: "Персональный тренер", slug: "trainer", icon: "🏃", parentId: "cat-2", level: 1, profileCount: 42, children: [] },
        { id: "cat-2-2", name: "Массаж", slug: "massage", icon: "💆", parentId: "cat-2", level: 1, profileCount: 45, children: [] },
      ],
    },
    {
      id: "cat-3", name: "Фотография", slug: "photo", icon: "📷", parentId: null, level: 0, profileCount: 64,
      children: [
        { id: "cat-3-1", name: "Свадебная фотография", slug: "wedding-photo", icon: "💍", parentId: "cat-3", level: 1, profileCount: 28, children: [] },
        { id: "cat-3-2", name: "Портретная съемка", slug: "portrait", icon: "🤳", parentId: "cat-3", level: 1, profileCount: 36, children: [] },
      ],
    },
  ];
}

export function generateReports(): ReportItem[] {
  const reasons = ["Спам", "Мошенничество", "Оскорбительный контент", "Нарушение правил", "Неадекватное поведение"];
  const statuses: ReportItem["status"][] = ["pending", "pending", "resolved", "rejected", "pending", "resolved", "pending", "rejected", "resolved", "pending"];
  const names = ["Анна К.", "Иван П.", "Мария С.", "Дмитрий В.", "Елена Н.", "Сергей А.", "Ольга Т.", "Павел Ш.", "Наталья Г.", "Алексей Р."];
  return Array.from({ length: 10 }, (_, i) => ({
    id: `rpt-${i + 1}`,
    reporterName: names[i],
    reportedUserName: names[(i + 3) % 10],
    reportedUserId: `usr-${(i + 3) % 10 + 1}`,
    reason: reasons[i % reasons.length],
    status: statuses[i],
    createdAt: dateStr(rnd(0, 14)),
    messagePreview: "Этот пользователь нарушает правила платформы…",
    fullMessage: "Этот пользователь систематически нарушает правила платформы. Он отправляет спам, обманывает клиентов и ведёт себя неподобающим образом. Прошу принять меры.",
  }));
}

export function generateUsers(): UserItem[] {
  const roles: UserItem["role"][] = ["CLIENT", "CLIENT", "CLIENT", "SOLO_MASTER", "SOLO_MASTER", "BUSINESS_OWNER", "CLIENT", "SOLO_MASTER", "BUSINESS_OWNER", "CLIENT", "CLIENT", "SOLO_MASTER", "CLIENT", "BUSINESS_OWNER", "CLIENT", "SOLO_MASTER", "CLIENT", "CLIENT", "BUSINESS_OWNER", "ADMIN"];
  const statuses: UserItem["status"][] = ["ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "BLOCKED", "ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "BLOCKED", "ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "BLOCKED", "ACTIVE", "ACTIVE", "ACTIVE"];
  const firstNames = ["Анна", "Иван", "Мария", "Дмитрий", "Елена", "Сергей", "Ольга", "Павел", "Наталья", "Алексей", "Ксения", "Михаил", "Татьяна", "Артём", "Виктория", "Никита", "Юлия", "Андрей", "Светлана", "Роман"];
  const lastNames = ["Козлова", "Петров", "Смирнова", "Васильев", "Новикова", "Алексеев", "Тимофеева", "Шустов", "Горбунова", "Романов", "Волкова", "Фёдоров", "Кузнецова", "Орлов", "Морозова", "Зайцев", "Соколова", "Макаров", "Борисова", "Савченко"];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `usr-${i + 1}`,
    email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@example.com`,
    name: `${firstNames[i]} ${lastNames[i]}`,
    role: roles[i],
    status: statuses[i],
    createdAt: dateStr(rnd(10, 200)),
    lastActive: dateStr(rnd(0, 30)),
  }));
}

export function generateStats(daily: DailyStats[]): DashboardStats {
  const users = generateUsers();
  return {
    totalUsers: users.length,
    totalMasters: users.filter((u) => u.role === "SOLO_MASTER").length,
    totalBusinesses: users.filter((u) => u.role === "BUSINESS_OWNER").length,
    totalBookings: daily.reduce((s, d) => s + d.bookings, 0),
    totalReports: 10,
    pendingReports: 5,
    revenueThisMonth: daily.slice(-30).reduce((s, d) => s + d.revenue, 0),
  };
}
