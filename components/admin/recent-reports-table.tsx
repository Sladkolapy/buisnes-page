"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { StatusBadge } from "./status-badge";

export function RecentReportsTable() {
  const reports = useAdminStore((s) => s.reports).slice(0, 5);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Последние жалобы</h3>
        <Link href="/admin/reports" className="flex items-center gap-1 text-xs text-violet-600 hover:underline">
          Все жалобы <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Жалобщик</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">На кого</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Причина</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Статус</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">{r.reporterName}</td>
                <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">{r.reportedUserName}</td>
                <td className="px-4 py-2.5 text-zinc-500">{r.reason}</td>
                <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-2.5 text-xs text-zinc-400">{r.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
