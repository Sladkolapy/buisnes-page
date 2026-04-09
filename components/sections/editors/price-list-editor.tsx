"use client";

import { Plus, Trash2 } from "lucide-react";
import { SectionSettings } from "@/core/shared/section-types";

interface PriceItem { id: string; service: string; price: string; duration: string }
interface Props { settings: SectionSettings; onChange: (s: SectionSettings) => void }

const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";
function genId() { return `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

export function PriceListEditor({ settings, onChange }: Props) {
  const items: PriceItem[] = settings.items ?? [];

  function update(index: number, field: keyof PriceItem, value: string) {
    onChange({ ...settings, items: items.map((it, i) => i === index ? { ...it, [field]: value } : it) });
  }

  function add() {
    onChange({ ...settings, items: [...items, { id: genId(), service: "Услуга", price: "0 ₽", duration: "1 час" }] });
  }

  function remove(index: number) {
    onChange({ ...settings, items: items.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Заголовок</label>
        <input className={inputCls} value={settings.title ?? ""} onChange={(e) => onChange({ ...settings, title: e.target.value })} placeholder="Прайс-лист" />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-500">Позиции ({items.length})</p>
          <button onClick={add} className="flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-700">
            <Plus className="h-3 w-3" /> Добавить
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">Услуга</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">Цена</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">Длит.</th>
                <th className="w-8 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                  <td className="px-2 py-1.5">
                    <input className="w-full rounded-lg border-0 bg-transparent px-1 py-0.5 text-sm outline-none focus:bg-zinc-50 dark:focus:bg-zinc-800"
                      value={item.service} onChange={(e) => update(i, "service", e.target.value)} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input className="w-20 rounded-lg border-0 bg-transparent px-1 py-0.5 text-sm outline-none focus:bg-zinc-50 dark:focus:bg-zinc-800"
                      value={item.price} onChange={(e) => update(i, "price", e.target.value)} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input className="w-20 rounded-lg border-0 bg-transparent px-1 py-0.5 text-sm outline-none focus:bg-zinc-50 dark:focus:bg-zinc-800"
                      value={item.duration} onChange={(e) => update(i, "duration", e.target.value)} />
                  </td>
                  <td className="px-2 py-1.5">
                    <button onClick={() => remove(i)} className="text-zinc-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="py-6 text-center text-xs text-zinc-400">Нет позиций. Нажмите «Добавить»</p>
          )}
        </div>
      </div>
    </div>
  );
}
