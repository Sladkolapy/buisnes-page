"use client";

import { Users, Briefcase, Building2, Calendar, AlertCircle, Clock } from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";

const CARDS = [
  { key: "totalUsers" as const, label: "Всего пользователей", icon: Users, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
  { key: "totalMasters" as const, label: "Мастеров", icon: Briefcase, color: "text-green-600 bg-green-50 dark:bg-green-950/30" },
  { key: "totalBusinesses" as const, label: "Бизнесов", icon: Building2, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30" },
  { key: "totalBookings" as const, label: "Записей", icon: Calendar, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
  { key: "totalReports" as const, label: "Жалоб", icon: AlertCircle, color: "text-red-600 bg-red-50 dark:bg-red-950/30" },
  { key: "pendingReports" as const, label: "Ожидают решения", icon: Clock, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30" },
];

export function StatsCards() {
  const stats = useAdminStore((s) => s.stats);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {CARDS.map(({ key, label, icon: Icon, color }) => (
        <div key={key} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {stats ? stats[key].toLocaleString("ru") : "—"}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
