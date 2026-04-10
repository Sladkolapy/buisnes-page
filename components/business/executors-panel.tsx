"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Service { id: string; name: string; durationMinutes: number }
interface ScheduleDay { dayOfWeek: number; startTime: string; endTime: string; isWorking: boolean; lunchStart: string | null; lunchEnd: string | null }
interface Executor {
  id: string;
  name: string;
  specialization?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  services: { serviceId: string; priceKopecks: number; service: { name: string } }[];
  schedules: ScheduleDay[];
}

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2.5 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

function formatPrice(k: number) { return k ? `${Math.floor(k / 100)} ₽` : "—"; }

export function ExecutorsPanel() {
  const [executors, setExecutors] = useState<Executor[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", specialization: "" });
  const [scheduleForm, setScheduleForm] = useState<ScheduleDay[]>(
    Array.from({ length: 7 }, (_, i) => ({ dayOfWeek: i, startTime: "09:00", endTime: "18:00", isWorking: i < 5, lunchStart: "13:00", lunchEnd: "14:00" }))
  );
  const [serviceForm, setServiceForm] = useState<{ serviceId: string; priceKopecks: number }[]>([]);

  async function load() {
    setLoading(true);
    const [eRes, sRes] = await Promise.all([
      fetch("/api/business/executors"),
      fetch("/api/business/services"),
    ]);
    const eData = (await eRes.json()) as { data: Executor[] };
    const sData = (await sRes.json()) as { data: Service[] };
    setExecutors(eData.data ?? []);
    setAllServices(sData.data ?? []);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  function openCreate() {
    setForm({ name: "", specialization: "" });
    setScheduleForm(Array.from({ length: 7 }, (_, i) => ({ dayOfWeek: i, startTime: "09:00", endTime: "18:00", isWorking: i < 5, lunchStart: "13:00", lunchEnd: "14:00" })));
    setServiceForm([]);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(e: Executor) {
    setForm({ name: e.name, specialization: e.specialization ?? "" });
    const sched = Array.from({ length: 7 }, (_, i) => {
      const found = e.schedules.find((s) => s.dayOfWeek === i);
      return found ?? { dayOfWeek: i, startTime: "09:00", endTime: "18:00", isWorking: i < 5, lunchStart: "13:00", lunchEnd: "14:00" };
    });
    setScheduleForm(sched);
    setServiceForm(e.services.map((s) => ({ serviceId: s.serviceId, priceKopecks: s.priceKopecks })));
    setEditId(e.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    if (!editId) {
      const res = await fetch("/api/business/executors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, specialization: form.specialization || undefined }),
      });
      const created = (await res.json()) as { data: { id: string } };
      await fetch(`/api/business/executors/${created.data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedules: scheduleForm, serviceIds: serviceForm }),
      });
    } else {
      await fetch(`/api/business/executors/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, specialization: form.specialization || null, schedules: scheduleForm, serviceIds: serviceForm }),
      });
    }
    setSaving(false);
    setShowForm(false);
    void load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить специалиста?")) return;
    setDeletingId(id);
    await fetch(`/api/business/executors/${id}`, { method: "DELETE" });
    setDeletingId(null);
    void load();
  }

  function toggleService(serviceId: string) {
    setServiceForm((prev) =>
      prev.some((s) => s.serviceId === serviceId)
        ? prev.filter((s) => s.serviceId !== serviceId)
        : [...prev, { serviceId, priceKopecks: 0 }]
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{executors.length} специалист(ов)</p>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
          <Plus className="h-4 w-4" /> Добавить
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-zinc-200 p-5 space-y-4 dark:border-zinc-700">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{editId ? "Редактировать специалиста" : "Новый специалист"}</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Имя *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Анна Иванова" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Специализация</label>
              <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className={inputCls} placeholder="Мастер маникюра" />
            </div>
          </div>

          {/* Schedule */}
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-500">Рабочий график</p>
            <div className="space-y-1.5">
              {scheduleForm.map((day, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    onClick={() => setScheduleForm(scheduleForm.map((d, di) => di === i ? { ...d, isWorking: !d.isWorking } : d))}
                    className={`w-8 shrink-0 rounded text-xs font-medium py-0.5 transition ${day.isWorking ? "bg-violet-600 text-white" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"}`}
                  >
                    {DAY_LABELS[i]}
                  </button>
                  {day.isWorking ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <input type="time" value={day.startTime}
                        onChange={(e) => setScheduleForm(scheduleForm.map((d, di) => di === i ? { ...d, startTime: e.target.value } : d))}
                        className="rounded-lg border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800" />
                      <span className="text-xs text-zinc-400">—</span>
                      <input type="time" value={day.endTime}
                        onChange={(e) => setScheduleForm(scheduleForm.map((d, di) => di === i ? { ...d, endTime: e.target.value } : d))}
                        className="rounded-lg border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800" />
                      <span className="ml-1 text-xs text-zinc-400">обед</span>
                      <input type="time" value={day.lunchStart ?? ""}
                        onChange={(e) => setScheduleForm(scheduleForm.map((d, di) => di === i ? { ...d, lunchStart: e.target.value || null } : d))}
                        className="rounded-lg border border-orange-200 px-2 py-1 text-xs dark:border-orange-800 dark:bg-zinc-800" />
                      <span className="text-xs text-zinc-400">—</span>
                      <input type="time" value={day.lunchEnd ?? ""}
                        onChange={(e) => setScheduleForm(scheduleForm.map((d, di) => di === i ? { ...d, lunchEnd: e.target.value || null } : d))}
                        className="rounded-lg border border-orange-200 px-2 py-1 text-xs dark:border-orange-800 dark:bg-zinc-800" />
                      <button
                        type="button"
                        onClick={() => setScheduleForm(scheduleForm.map((d, di) => di === i ? { ...d, lunchStart: d.lunchStart ? null : "13:00", lunchEnd: d.lunchEnd ? null : "14:00" } : d))}
                        className={`rounded px-1.5 py-0.5 text-xs transition ${day.lunchStart ? "text-orange-500 hover:bg-orange-50" : "text-zinc-400 hover:bg-zinc-100"}`}
                        title={day.lunchStart ? "Убрать обед" : "Добавить обед"}
                      >
                        {day.lunchStart ? "✕ обед" : "+ обед"}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-400">Выходной</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          {allServices.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-zinc-500">Услуги и цены</p>
              <div className="space-y-1.5">
                {allServices.map((s) => {
                  const entry = serviceForm.find((f) => f.serviceId === s.id);
                  return (
                    <div key={s.id} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleService(s.id)}
                        className={`flex-1 rounded-lg border px-3 py-1.5 text-left text-xs transition ${entry ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/20" : "border-zinc-200 text-zinc-600 dark:border-zinc-700"}`}
                      >
                        {s.name}
                      </button>
                      {entry && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number" min={0} placeholder="0"
                            value={entry.priceKopecks ? Math.floor(entry.priceKopecks / 100) : ""}
                            onChange={(e) => setServiceForm(serviceForm.map((f) =>
                              f.serviceId === s.id ? { ...f, priceKopecks: Number(e.target.value) * 100 } : f
                            ))}
                            className="w-20 rounded-lg border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                          />
                          <span className="text-xs text-zinc-400">₽</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button onClick={() => void handleSave()} disabled={saving || !form.name.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Сохранить
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-zinc-300" /></div>}
      {!loading && executors.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center">
          <p className="text-sm text-zinc-400">Специалисты не добавлены</p>
          <p className="mt-1 text-xs text-zinc-400">Добавьте специалистов, которые ведут запись</p>
        </div>
      )}

      <div className="space-y-2">
        {executors.map((e) => (
          <div key={e.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                {e.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{e.name}</p>
                {e.specialization && <p className="text-xs text-zinc-500">{e.specialization}</p>}
                <p className="text-xs text-zinc-400">{e.services.length} услуг · {e.schedules.filter((s) => s.isWorking).length} раб. дней</p>
              </div>
              <button onClick={() => openEdit(e)} className="rounded-lg p-1.5 text-zinc-400 hover:text-violet-600">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => void handleDelete(e.id)} disabled={deletingId === e.id}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-red-500 disabled:opacity-40">
                {deletingId === e.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
              <button onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700">
                {expandedId === e.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            {expandedId === e.id && (
              <div className="border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-zinc-500">График</p>
                    {e.schedules.map((s) => (
                      <div key={s.dayOfWeek} className="flex items-center gap-2 text-xs">
                        <span className="w-5 shrink-0 text-zinc-400">{DAY_LABELS[s.dayOfWeek]}</span>
                        {s.isWorking ? (
                          <span className="text-zinc-700 dark:text-zinc-300">
                            {s.startTime}–{s.endTime}
                            {s.lunchStart && s.lunchEnd && (
                              <span className="ml-1.5 text-orange-500">(обед {s.lunchStart}–{s.lunchEnd})</span>
                            )}
                          </span>
                        ) : <span className="text-zinc-400">Выходной</span>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-zinc-500">Услуги</p>
                    {e.services.map((s) => (
                      <div key={s.serviceId} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-700 dark:text-zinc-300">{s.service.name}</span>
                        <span className="text-zinc-400">{formatPrice(s.priceKopecks)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
