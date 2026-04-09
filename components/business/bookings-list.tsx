"use client";

import { useState, useEffect } from "react";
import { Loader2, ChevronDown } from "lucide-react";

interface BookingEntry {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  clientName?: string | null;
  clientPhone?: string | null;
  notes?: string | null;
  service: { name: string; durationMinutes: number };
  executor: { name: string };
  client?: { name?: string | null; email?: string | null } | null;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  CANCELLED: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800",
  COMPLETED: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  NO_SHOW: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждено",
  CANCELLED: "Отменено",
  COMPLETED: "Завершено",
  NO_SHOW: "Не пришёл",
};

const STATUS_NEXT: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "NO_SHOW", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export function BookingsList() {
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/business/bookings");
    const j = (await res.json()) as { data: BookingEntry[] };
    setBookings(j.data ?? []);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function changeStatus(id: string, status: string) {
    setUpdatingId(id);
    await fetch(`/api/business/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdatingId(null);
    void load();
  }

  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);
  const counts = bookings.reduce<Record<string, number>>((acc, b) => { acc[b.status] = (acc[b.status] ?? 0) + 1; return acc; }, {});

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {[{ id: "ALL", label: "Все", count: bookings.length }, ...Object.keys(STATUS_LABELS).map((s) => ({ id: s, label: STATUS_LABELS[s], count: counts[s] ?? 0 }))].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${filter === f.id ? "bg-violet-600 text-white" : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700"}`}
          >
            {f.label} {f.count > 0 && <span className="ml-0.5 opacity-70">{f.count}</span>}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-zinc-300" /></div>}
      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-400">Нет записей</p>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((b) => {
          const name = b.clientName ?? b.client?.name ?? "Клиент";
          const startDate = new Date(b.startAt);
          return (
            <div key={b.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{name}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status]}`}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {b.service.name} · {b.executor.name} · {startDate.toLocaleDateString("ru", { day: "numeric", month: "short" })} {startDate.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700">
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedId === b.id ? "rotate-180" : ""}`} />
                </button>
              </div>

              {expandedId === b.id && (
                <div className="border-t border-zinc-100 px-4 py-3 space-y-3 dark:border-zinc-800">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-500">
                    {b.clientPhone && <p><span className="text-zinc-400">Телефон: </span>{b.clientPhone}</p>}
                    {b.client?.email && <p><span className="text-zinc-400">Email: </span>{b.client.email}</p>}
                    {b.notes && <p className="col-span-2"><span className="text-zinc-400">Заметка: </span>{b.notes}</p>}
                  </div>
                  {STATUS_NEXT[b.status]?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {STATUS_NEXT[b.status].map((s) => (
                        <button
                          key={s}
                          onClick={() => void changeStatus(b.id, s)}
                          disabled={updatingId === b.id}
                          className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${STATUS_COLORS[s]}`}
                        >
                          {updatingId === b.id && <Loader2 className="h-3 w-3 animate-spin" />}
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
