export interface DashboardStats {
  totalUsers: number;
  totalMasters: number;
  totalBusinesses: number;
  totalBookings: number;
  totalReports: number;
  pendingReports: number;
  revenueThisMonth: number;
}

export interface DailyStats {
  date: string;
  users: number;
  bookings: number;
  revenue: number;
  masters: number;
}

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parentId: string | null;
  level: number;
  children: CategoryTreeItem[];
  profileCount: number;
}

export type ReportStatus = "pending" | "resolved" | "rejected";

export interface ReportItem {
  id: string;
  reporterName: string;
  reportedUserName: string;
  reportedUserId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  messagePreview: string;
  fullMessage: string;
}

export type UserRole = "CLIENT" | "SOLO_MASTER" | "BUSINESS_OWNER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface UserItem {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastActive: string;
  avatarUrl?: string;
}
