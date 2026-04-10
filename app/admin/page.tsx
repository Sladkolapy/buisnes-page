"use client";

import { useEffect } from "react";
import { Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAdminData } from "@/hooks/use-admin-data";
import { StatsCards } from "@/components/admin/stats-cards";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { UsersGrowthChart } from "@/components/admin/users-growth-chart";
import { BookingsChart } from "@/components/admin/bookings-chart";
import { PopularServicesChart } from "@/components/admin/popular-services-chart";
import { RecentReportsTable } from "@/components/admin/recent-reports-table";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useAdminData();

  const role = (session?.user as { role?: string })?.role;

  useEffect(() => {
    if (status === "authenticated" && role !== "ADMIN") router.replace("/");
  }, [status, role, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-violet-600" />
        <h1 className="text-2xl font-bold tracking-tight">Дашборд</h1>
      </div>

      <StatsCards />

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart />
        <UsersGrowthChart />
        <BookingsChart />
        <PopularServicesChart />
      </div>

      <RecentReportsTable />
    </div>
  );
}
