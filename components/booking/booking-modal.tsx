"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Loader2, Check, Clock, User } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  executors: { executorId: string; priceKopecks: number; executor: { id: string; name: string; specialization?: string | null; avatarUrl?: string | null } }[];
}

interface Executor {
  id: string;
  name: string;
  specialization?: string | null;
  avatarUrl?: string | null;
  priceKopecks: number;
}

interface Props {
  businessProfileId: string;
  businessName: string;
  accentColor?: string;
  onClose: () => void;
}

type Step = "service" | "executor" | "date" | "time" | "confirm" | "done";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

function formatPrice(kopecks: number) {
  if (!kopecks) return "По договорённости";
  return `${Math.floor(kopecks / 100).toLocaleString("ru")} ₽`;
}

function formatDuration(min: number) {
  if (min < 60) return `${min} мин`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function BookingModal({ businessProfileId, businessName, accentColor = "#7c3aed", onClose }: Props) {
  const [step, setStep] = useState<Step>("service");
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedExecutor, setSelectedExecutor] = useState<Executor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date(); d.setDate(1); return d;
  });

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/booking/services?businessProfileId=${businessProfileId}`)
      .then((r) => r.json())
      .then((j: { data: Service[] }) => { setServices(j.data ?? []); setLoadingServices(false); })
      .catch(() => setLoadingServices(false));
  }, [businessProfileId]);

  useEffect(() => {
    if (!selectedExecutor || !selectedService || !selectedDate) return;
    setLoadingSlots(true);
    fetch(`/api/booking/slots?executorId=${selectedExecutor.id}&serviceId=${selectedService.id}&date=${toDateStr(selectedDate)}`)
      .then((r) => r.json())
      .then((j: { data: string[] }) => { setSlots(j.data ?? []); setLoadingSlots(false); })
      .catch(() => setLoadingSlots(false));
  }, [selectedExecutor, selectedService, selectedDate]);

  // Calendar helpers
  const calendarDays = () => {
    const year = calendarMonth.getFullYear(), month = calendarMonth.getMonth();
    const first = new Date(year, month, 1);
    const startDow = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array(startDow).fill(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(year, month, i));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const isPast = (d: Date) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return d < today;
  };

  async function handleSubmit() {
    if (!selectedService || !selectedExecutor || !selectedDate || !selectedTime || !clientName.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessProfileId,
        executorId: selectedExecutor.id,
        serviceId: selectedService.id,
        date: toDateStr(selectedDate),
        time: selectedTime,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim() || undefined,
        notes: notes.trim() || undefined,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      const data = (await res.json()) as { data: { id: string } };
      setBookingId(data.data.id);
      setStep("done");
    }
  }

  const accent = accentColor;
  const stepTitles: Record<Step, string> = {
    service: "Выберите услугу",
    executor: "Выберите специалиста",
    date: "Выберите дату",
    time: "Выберите время",
    confirm: "Ваши данные",
    done: "Готово!",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-t-2xl bg-white sm:rounded-2xl dark:bg-zinc-900"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            {step !== "service" && step !== "done" && (
              <button
                onClick={() => {
                  const prev: Record<Step, Step> = { service: "service", executor: "service", date: "executor", time: "date", confirm: "time", done: "confirm" };
                  setStep(prev[step]);
                }}
                className="rounded-lg p-1 text-zinc-400 hover:text-zinc-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <p className="text-xs text-zinc-400">{businessName}</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{stepTitles[step]}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Step: service */}
          {step === "service" && (
            <div className="space-y-2">
              {loadingServices && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-zinc-300" /></div>}
              {!loadingServices && services.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-400">Услуги пока не добавлены</p>
              )}
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep("executor"); }}
                  className="flex w-full items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-left transition hover:border-violet-300 dark:border-zinc-700"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{s.name}</p>
                    {s.description && <p className="text-xs text-zinc-500">{s.description}</p>}
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-xs text-zinc-400"><Clock className="mb-0.5 mr-0.5 inline h-3 w-3" />{formatDuration(s.durationMinutes)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step: executor */}
          {step === "executor" && selectedService && (
            <div className="space-y-2">
              {selectedService.executors.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-400">Нет доступных специалистов</p>
              )}
              {selectedService.executors.map(({ executor, priceKopecks }) => (
                <button
                  key={executor.id}
                  onClick={() => { setSelectedExecutor({ ...executor, priceKopecks }); setStep("date"); }}
                  className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-left transition hover:border-violet-300 dark:border-zinc-700"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: accent }}>
                    {executor.avatarUrl
                      ? <img src={executor.avatarUrl} className="h-10 w-10 rounded-full object-cover" alt={executor.name} />
                      : executor.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{executor.name}</p>
                    {executor.specialization && <p className="text-xs text-zinc-500">{executor.specialization}</p>}
                  </div>
                  <p className="shrink-0 text-sm font-semibold" style={{ color: accent }}>{formatPrice(priceKopecks)}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step: date */}
          {step === "date" && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <button onClick={() => setCalendarMonth(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; })}
                  className="rounded-lg p-1 text-zinc-400 hover:text-zinc-700"><ChevronLeft className="h-5 w-5" /></button>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {MONTHS[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                </p>
                <button onClick={() => setCalendarMonth(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; })}
                  className="rounded-lg p-1 text-zinc-400 hover:text-zinc-700"><ChevronRight className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {DAYS.map(d => <div key={d} className="py-1 text-xs font-medium text-zinc-400">{d}</div>)}
                {calendarDays().map((day, i) => (
                  <div key={i}>
                    {day ? (
                      <button
                        disabled={isPast(day)}
                        onClick={() => { setSelectedDate(day); setSelectedTime(null); setStep("time"); }}
                        className={`h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm transition
                          ${isPast(day) ? "cursor-not-allowed text-zinc-300" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}
                          ${selectedDate?.toDateString() === day.toDateString() ? "text-white" : "text-zinc-800 dark:text-zinc-200"}`}
                        style={selectedDate?.toDateString() === day.toDateString() ? { backgroundColor: accent } : {}}
                      >
                        {day.getDate()}
                      </button>
                    ) : <div />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step: time */}
          {step === "time" && selectedDate && (
            <div>
              <p className="mb-3 text-sm text-zinc-500">
                {selectedDate.toLocaleDateString("ru", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              {loadingSlots && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-zinc-300" /></div>}
              {!loadingSlots && slots.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-400">Нет свободных слотов в этот день</p>
              )}
              {!loadingSlots && slots.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setSelectedTime(t); setStep("confirm"); }}
                      className="rounded-xl border border-zinc-200 py-2.5 text-sm transition hover:border-violet-300 dark:border-zinc-700"
                      style={selectedTime === t ? { backgroundColor: accent, color: "#fff", borderColor: accent } : {}}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step: confirm */}
          {step === "confirm" && selectedService && selectedExecutor && selectedDate && selectedTime && (
            <div className="space-y-4">
              <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800 space-y-1.5">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedService.name}</p>
                <p className="text-xs text-zinc-500"><User className="mr-1 inline h-3 w-3" />{selectedExecutor.name}</p>
                <p className="text-xs text-zinc-500">
                  {selectedDate.toLocaleDateString("ru", { day: "numeric", month: "long" })} в {selectedTime}
                </p>
                <p className="text-sm font-semibold" style={{ color: accent }}>{formatPrice(selectedExecutor.priceKopecks)}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">Ваше имя *</label>
                  <input value={clientName} onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800"
                    placeholder="Имя и фамилия" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">Телефон</label>
                  <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800"
                    placeholder="+7 (999) 000-00-00" type="tel" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">Комментарий</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                    className="w-full resize-none rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800"
                    placeholder="Пожелания, вопросы…" />
                </div>
              </div>

              <button
                onClick={() => void handleSubmit()}
                disabled={submitting || !clientName.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition disabled:opacity-60"
                style={{ backgroundColor: accent }}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Подтвердить запись
              </button>
            </div>
          )}

          {/* Step: done */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}20` }}>
                <Check className="h-8 w-8" style={{ color: accent }} />
              </div>
              <div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Запись создана!</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {selectedDate?.toLocaleDateString("ru", { day: "numeric", month: "long" })} в {selectedTime}
                </p>
                {selectedService && <p className="text-sm text-zinc-500">{selectedService.name} · {selectedExecutor?.name}</p>}
              </div>
              <button onClick={onClose} className="rounded-xl px-8 py-2.5 text-sm font-medium text-white" style={{ backgroundColor: accent }}>
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
