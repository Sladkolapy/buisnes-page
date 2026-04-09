"use client";

import { Plus, Trash2 } from "lucide-react";
import { SectionSettings } from "@/core/shared/section-types";

interface ServiceItem { id: string; name: string; price: number; duration: number; imageUrl: string }
interface Props { settings: SectionSettings; onChange: (s: SectionSettings) => void }

const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

function genId() { return `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

export function ServicesGridEditor({ settings, onChange }: Props) {
  const services: ServiceItem[] = settings.services ?? [];

  function update(index: number, field: keyof ServiceItem, value: string | number) {
    const updated = services.map((s, i) => i === index ? { ...s, [field]: value } : s);
    onChange({ ...settings, services: updated });
  }

  function add() {
    onChange({ ...settings, services: [...services, { id: genId(), name: "Новая услуга", price: 0, duration: 60, imageUrl: "" }] });
  }

  function remove(index: number) {
    onChange({ ...settings, services: services.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Заголовок секции</label>
        <input className={inputCls} value={settings.title ?? ""} onChange={(e) => onChange({ ...settings, title: e.target.value })} placeholder="Наши услуги" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-500">Услуги ({services.length})</p>
          <button onClick={add} className="flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-700">
            <Plus className="h-3 w-3" /> Добавить
          </button>
        </div>

        {services.map((svc, i) => (
          <div key={svc.id} className="rounded-xl border border-zinc-200 p-3 space-y-2 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Услуга {i + 1}</p>
              <button onClick={() => remove(i)} className="text-zinc-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <input className={inputCls} value={svc.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="Название" />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Цена (₽)</label>
                <input type="number" min={0} className={inputCls} value={svc.price} onChange={(e) => update(i, "price", Number(e.target.value))} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Длит. (мин)</label>
                <input type="number" min={0} className={inputCls} value={svc.duration} onChange={(e) => update(i, "duration", Number(e.target.value))} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">URL картинки</label>
              <input className={inputCls} value={svc.imageUrl} onChange={(e) => update(i, "imageUrl", e.target.value)} placeholder="https://…" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
