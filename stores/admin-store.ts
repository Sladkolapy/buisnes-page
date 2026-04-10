import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DashboardStats, DailyStats, CategoryTreeItem, ReportItem, UserItem, ReportStatus, UserRole,
} from "@/core/shared/admin-types";
import {
  generateDailyStats, generateCategories, generateReports, generateUsers, generateStats,
} from "@/lib/mock/admin-data";

function genId() { return `id-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

interface AdminState {
  stats: DashboardStats | null;
  dailyStats: DailyStats[];
  categories: CategoryTreeItem[];
  reports: ReportItem[];
  users: UserItem[];
  initialized: boolean;

  initMockData: () => void;
  fetchStats: () => void;
  fetchDailyStats: () => void;
  fetchCategories: () => void;
  fetchReports: () => void;
  fetchUsers: () => void;

  updateReportStatus: (id: string, status: ReportStatus) => void;
  deleteUser: (id: string) => void;
  blockUser: (id: string) => void;
  unblockUser: (id: string) => void;
  changeUserRole: (id: string, role: UserRole) => void;

  createCategory: (data: Omit<CategoryTreeItem, "id" | "children" | "level">) => void;
  updateCategory: (id: string, data: Partial<CategoryTreeItem>) => void;
  deleteCategory: (id: string) => void;
}

function flattenRemoveId(items: CategoryTreeItem[], id: string): CategoryTreeItem[] {
  return items.reduce<CategoryTreeItem[]>((acc, item) => {
    if (item.id === id) return acc;
    return [...acc, { ...item, children: flattenRemoveId(item.children, id) }];
  }, []);
}

function flattenUpdateId(items: CategoryTreeItem[], id: string, data: Partial<CategoryTreeItem>): CategoryTreeItem[] {
  return items.map((item) => {
    if (item.id === id) return { ...item, ...data };
    return { ...item, children: flattenUpdateId(item.children, id, data) };
  });
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      stats: null,
      dailyStats: [],
      categories: [],
      reports: [],
      users: [],
      initialized: false,

      initMockData: () => {
        if (get().initialized) return;
        const daily = generateDailyStats();
        set({
          dailyStats: daily,
          categories: generateCategories(),
          reports: generateReports(),
          users: generateUsers(),
          stats: generateStats(daily),
          initialized: true,
        });
      },

      fetchStats: () => {
        const { dailyStats, users, reports } = get();
        set({
          stats: {
            totalUsers: users.length,
            totalMasters: users.filter((u) => u.role === "SOLO_MASTER").length,
            totalBusinesses: users.filter((u) => u.role === "BUSINESS_OWNER").length,
            totalBookings: dailyStats.reduce((s, d) => s + d.bookings, 0),
            totalReports: reports.length,
            pendingReports: reports.filter((r) => r.status === "pending").length,
            revenueThisMonth: dailyStats.slice(-30).reduce((s, d) => s + d.revenue, 0),
          },
        });
      },
      fetchDailyStats: () => {},
      fetchCategories: () => {},
      fetchReports: () => {},
      fetchUsers: () => {},

      updateReportStatus: (id, status) => {
        set((s) => ({ reports: s.reports.map((r) => r.id === id ? { ...r, status } : r) }));
        get().fetchStats();
      },

      deleteUser: (id) => {
        set((s) => ({ users: s.users.filter((u) => u.id !== id) }));
        get().fetchStats();
      },
      blockUser: (id) => {
        set((s) => ({ users: s.users.map((u) => u.id === id ? { ...u, status: "BLOCKED" } : u) }));
      },
      unblockUser: (id) => {
        set((s) => ({ users: s.users.map((u) => u.id === id ? { ...u, status: "ACTIVE" } : u) }));
      },
      changeUserRole: (id, role) => {
        set((s) => ({ users: s.users.map((u) => u.id === id ? { ...u, role } : u) }));
        get().fetchStats();
      },

      createCategory: (data) => {
        const newCat: CategoryTreeItem = { ...data, id: genId(), children: [], level: data.parentId ? 1 : 0 };
        if (!newCat.parentId) {
          set((s) => ({ categories: [...s.categories, newCat] }));
        } else {
          set((s) => ({
            categories: flattenUpdateId(s.categories, newCat.parentId!, {
              children: [...(s.categories.find((c) => c.id === newCat.parentId)?.children ?? []), newCat],
            }),
          }));
        }
      },
      updateCategory: (id, data) => {
        set((s) => ({ categories: flattenUpdateId(s.categories, id, data) }));
      },
      deleteCategory: (id) => {
        set((s) => ({ categories: flattenRemoveId(s.categories, id) }));
      },
    }),
    { name: "admin-data" }
  )
);
