"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Executor { id: string; name: string }
interface BookingEntry {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  clientName?: string | null;
  service: { name: string; durationMinutes: number };
  client?: { name?: string | null; email?: string | null } | null;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-zinc-100 text-zinc-500 border-zinc-200 line-through",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
  NO_SHOW: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждено",
  CANCELLED: "Отменено",
  COMPLETED: "Завершено",
  NO_SHOW: "Не пришёл",
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 – 20:00

function isoToMinutes(iso: string) {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

function weekDates(anchor: Date) {
  const d = new Date(anchor);
  const dow = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    return day;
  });
}

const DAY_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function BookingCalendar() {
  const [executors, setExecutors] = useState<Executor[]>([]);
  const [selectedExecutorId, setSelectedExecutorId] = useState<string | null>(null);
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<BookingEntry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const days = weekDates(weekAnchor);

  useEffect(() => {
    fetch("/api/business/executors")
      .then((r) => r.json())
      .then((j: { data: Executor[] }) => {
        setExecutors(j.data ?? []);
        if (j.data?.length) setSelectedExecutorId(j.data[0].id);
      });
  }, []);

  const loadBookings = useCallback(async () => {
    if (!selectedExecutorId) return;
    setLoading(true);
    const from = days[0].toISOString();
    const to = new Date(days[6].getTime() + 86399999).toISOString();
    const res = await fetch(`/api/business/bookings?executorId=${selectedExecutorId}&from=${from}&to=${to}`);
    const j = (await res.json()) as { data: BookingEntry[] };
    setBookings(j.data ?? []);
    setLoading(false);
  }, [selectedExecutorId, weekAnchor]); // eslint-disable-line

  useEffect(() => { void loadBookings(); }, [loadBookings]);

  async function changeStatus(id: string, status: string) {
    setUpdatingId(id);
    await fetch(`/api/business/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdatingId(null);
    setSelected(null);
    void loadBookings();
  }

  function bookingsForDay(day: Date) {
    const ds = day.toDateString();
    return bookings.filter((b) => new Date(b.startAt).toDateString() === ds);
  }

  const startMinute = 8 * 60;
  const totalMinutes = 12 * 60;
  const pxPerMin = 1.2;

  return (
    <div className="space-y-4">
      {/* Executor selector */}
      <div className="flex flex-wrap gap-2">
        {executors.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedExecutorId(e.id)}
            className={`rounded-xl px-4 py-1.5 text-sm font-medium transition ${selectedExecutorId === e.id ? "bg-violet-600 text-white" : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"}`}
          >
            {e.name}
          </button>
        ))}
        {executors.length === 0 && !loading && (
          <p className="text-sm text-zinc-400">Сначала добавьте специалистов на вкладке «Специалисты»</p>
        )}
      </div>

      {/* Week navigation */}
      <div className="flex items-center gap-3">
        <button onClick={() => setWeekAnchor(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })}
          className="rounded-lg border border-zinc-200 p-1.5 hover:bg-zinc-50 dark:border-zinc-700">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {days[0].toLocaleDateString("ru", { day: "numeric", month: "short" })} – {days[6].toLocaleDateString("ru", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <button onClick={() => setWeekAnchor(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })}
          className="rounded-lg border border-zinc-200 p-1.5 hover:bg-zinc-50 dark:border-zinc-700">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button onClick={() => setWeekAnchor(new Date())} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700">
          Сегодня
        </button>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-zinc-300" />}
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
        <div className="min-w-[700px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b border-zinc-200 dark:border-zinc-700">
            <div className="border-r border-zinc-200 px-3 py-2 dark:border-zinc-700" />
            {days.map((day, i) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div key={i} className="border-r border-zinc-200 px-2 py-2 text-center last:border-r-0 dark:border-zinc-700">
                  <p className={`text-xs font-medium ${isToday ? "text-violet-600" : "text-zinc-500"}`}>{DAY_SHORT[i]}</p>
                  <p className={`text-sm font-semibold ${isToday ? "text-violet-600" : "text-zinc-900 dark:text-zinc-100"}`}>{day.getDate()}</p>
                </div>
              );
            })}
          </div>

          {/* Time rows + bookings */}
          <div className="relative" style={{ height: `${totalMinutes * pxPerMin}px` }}>
            {/* Hour lines */}
            {HOURS.map((h) => (
              <div key={h} className="absolute inset-x-0 flex" style={{ top: `${(h * 60 - startMinute) * pxPerMin}px` }}>
                <div className="w-16 shrink-0 border-r border-zinc-200 pr-2 text-right text-xs text-zinc-400 dark:border-zinc-700" style={{ marginTop: -8 }}>
                  {String(h).padStart(2, "0")}:00
                </div>
                <div className="flex-1 border-t border-zinc-100 dark:border-zinc-800" />
              </div>
            ))}

            {/* Day columns */}
            <div className="absolute inset-0 grid grid-cols-8">
              <div className="border-r border-zinc-200 dark:border-zinc-700" />
              {days.map((day, di) => (
                <div key={di} className="relative border-r border-zinc-200 last:border-r-0 dark:border-zinc-700">
                  {bookingsForDay(day).map((b) => {
                    const top = (isoToMinutes(b.startAt) - startMinute) * pxPerMin;
                    const dur = (new Date(b.endAt).getTime() - new Date(b.startAt).getTime()) / 60000;
                    const height = Math.max(dur * pxPerMin, 24);
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelected(b)}
                        style={{ top, height, left: 2, right: 2 }}
                        className={`absolute rounded-md border px-1.5 py-0.5 text-left text-xs leading-tight overflow-hidden ${STATUS_COLORS[b.status] ?? "bg-zinc-100"}`}
                      >
                        <p className="font-medium truncate">{b.clientName ?? b.client?.name ?? "Клиент"}</p>
                        <p className="truncate opacity-80">{b.service.name}</p>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{selected.clientName ?? selected.client?.name ?? "Клиент"}</p>
                <p className="text-xs text-zinc-500">{selected.client?.email}</p>
              </div>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[selected.status]}`}>
                {STATUS_LABELS[selected.status]}
              </span>
            </div>
            <div className="mb-4 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              <p><span className="text-zinc-400">Услуга:</span> {selected.service.name}</p>
              <p><span className="text-zinc-400">Начало:</span> {new Date(selected.startAt).toLocaleString("ru", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              <p><span className="text-zinc-400">Конец:</span> {new Date(selected.endAt).toLocaleString("ru", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"].filter((s) => s !== selected.status).map((s) => (
                <button
                  key={s}
                  onClick={() => void changeStatus(selected.id, s)}
                  disabled={updatingId === selected.id}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${STATUS_COLORS[s]}`}
                >
                  {updatingId === selected.id ? <Loader2 className="h-3 w-3 animate-spin inline mr-1" /> : null}
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
