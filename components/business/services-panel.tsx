"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Clock, ChevronDown } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  isActive: boolean;
  executors: { executor: { name: string } }[];
}

const DURATIONS = [15, 30, 45, 60, 90, 120, 150, 180, 240, 300];

function formatDuration(min: number) {
  if (min < 60) return `${min} мин`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
}

interface FormState { name: string; description: string; durationMinutes: number }
const defaultForm: FormState = { name: "", description: "", durationMinutes: 60 };

export function ServicesPanel() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/business/services");
    const j = (await res.json()) as { data: Service[] };
    setServices(j.data ?? []);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  function openCreate() { setForm(defaultForm); setEditId(null); setShowForm(true); }
  function openEdit(s: Service) {
    setForm({ name: s.name, description: s.description ?? "", durationMinutes: s.durationMinutes });
    setEditId(s.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    const url = editId ? `/api/business/services/${editId}` : "/api/business/services";
    const method = editId ? "PATCH" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, description: form.description || undefined, durationMinutes: form.durationMinutes }),
    });
    setSaving(false);
    setShowForm(false);
    void load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить услугу?")) return;
    setDeletingId(id);
    await fetch(`/api/business/services/${id}`, { method: "DELETE" });
    setDeletingId(null);
    void load();
  }

  const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2.5 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{services.length} услуг(и)</p>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
          <Plus className="h-4 w-4" /> Добавить
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-zinc-200 p-5 space-y-3 dark:border-zinc-700">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{editId ? "Редактировать" : "Новая услуга"}</p>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Название *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Стрижка, маникюр, консультация…" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Описание</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} placeholder="Краткое описание услуги" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Длительность</label>
            <div className="relative">
              <select
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                className={`${inputCls} appearance-none pr-8`}
              >
                {DURATIONS.map((d) => <option key={d} value={d}>{formatDuration(d)}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
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
      {!loading && services.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center">
          <p className="text-sm text-zinc-400">Услуги не добавлены</p>
          <p className="mt-1 text-xs text-zinc-400">Добавьте услуги, которые предоставляете клиентам</p>
        </div>
      )}
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{s.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-0.5 text-xs text-zinc-400">
                  <Clock className="h-3 w-3" /> {formatDuration(s.durationMinutes)}
                </span>
                {s.executors.length > 0 && (
                  <span className="text-xs text-zinc-400">· {s.executors.length} специалист(ов)</span>
                )}
              </div>
            </div>
            <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-zinc-400 hover:text-violet-600">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => void handleDelete(s.id)} disabled={deletingId === s.id}
              className="rounded-lg p-1.5 text-zinc-400 hover:text-red-500 disabled:opacity-40">
              {deletingId === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
