"use client";

import { useState } from "react";
import { Calendar, Users, Scissors, ClipboardList } from "lucide-react";
import { ExecutorsPanel } from "@/components/business/executors-panel";
import { ServicesPanel } from "@/components/business/services-panel";
import { BookingCalendar } from "@/components/business/booking-calendar";
import { BookingsList } from "@/components/business/bookings-list";

type Tab = "calendar" | "bookings" | "executors" | "services";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "calendar", label: "Календарь", icon: <Calendar className="h-4 w-4" /> },
  { id: "bookings", label: "Записи", icon: <ClipboardList className="h-4 w-4" /> },
  { id: "executors", label: "Специалисты", icon: <Users className="h-4 w-4" /> },
  { id: "services", label: "Услуги", icon: <Scissors className="h-4 w-4" /> },
];

export default function MyBusinessPage() {
  const [tab, setTab] = useState<Tab>("calendar");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Управление записями</h1>
        <p className="text-sm text-zinc-500">График, специалисты и услуги вашего бизнеса</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-900">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition
              ${tab === t.id
                ? "bg-white shadow-sm text-violet-700 dark:bg-zinc-800 dark:text-violet-400"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === "calendar" && <BookingCalendar />}
      {tab === "bookings" && <BookingsList />}
      {tab === "executors" && <ExecutorsPanel />}
      {tab === "services" && <ServicesPanel />}
    </div>
  );
}
