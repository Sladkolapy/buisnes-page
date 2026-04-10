"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, X, Eye } from "lucide-react";
import { useAdminData } from "@/hooks/use-admin-data";
import { useAdminStore } from "@/stores/admin-store";
import { StatusBadge } from "@/components/admin/status-badge";
import { ReportStatus } from "@/core/shared/admin-types";

type Filter = "all" | ReportStatus;

export default function ReportsPage() {
  useAdminData();
  const { reports, updateReportStatus, blockUser } = useAdminStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [viewMsg, setViewMsg] = useState<string | null>(null);

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "pending", label: "Ожидает" },
    { key: "resolved", label: "Решено" },
    { key: "rejected", label: "Отклонено" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Жалобы</h1>
          <p className="text-sm text-zinc-500">{reports.filter((r) => r.status === "pending").length} ожидают решения</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${filter === key ? "bg-violet-600 text-white" : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                {["Жалобщик", "На кого", "Причина", "Сообщение", "Статус", "Дата", "Действия"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((r) => (
                <tr key={r.id} className="bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{r.reporterName}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{r.reportedUserName}</td>
                  <td className="px-4 py-3 text-zinc-500">{r.reason}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setViewMsg(r.fullMessage)}
                      className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700">
                      <Eye className="h-3.5 w-3.5" /> Читать
                    </button>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{r.createdAt}</td>
                  <td className="px-4 py-3">
                    {r.status === "pending" && (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateReportStatus(r.id, "resolved")}
                          className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400">
                          <CheckCircle className="h-3.5 w-3.5" /> Решено
                        </button>
                        <button onClick={() => updateReportStatus(r.id, "rejected")}
                          className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800">
                          <X className="h-3.5 w-3.5" /> Отклонить
                        </button>
                        <button onClick={() => { blockUser(r.reportedUserId); updateReportStatus(r.id, "resolved"); }}
                          className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/30">
                          Заблокировать
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-400">Жалоб нет</p>
        )}
      </div>

      {/* Message Modal */}
      {viewMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setViewMsg(null)}>
          <div className="max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Текст жалобы</h3>
              <button onClick={() => setViewMsg(null)}><X className="h-5 w-5 text-zinc-400" /></button>
            </div>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{viewMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
