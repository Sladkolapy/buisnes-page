"use client";

import { Plus, Trash2, Star } from "lucide-react";
import { SectionSettings } from "@/core/shared/section-types";

interface Review { id: string; author: string; text: string; rating: number; date: string }
interface Props { settings: SectionSettings; onChange: (s: SectionSettings) => void }

const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";
function genId() { return `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

export function ReviewsEditor({ settings, onChange }: Props) {
  const reviews: Review[] = settings.reviews ?? [];

  function update(index: number, field: keyof Review, value: string | number) {
    onChange({ ...settings, reviews: reviews.map((r, i) => i === index ? { ...r, [field]: value } : r) });
  }

  function add() {
    onChange({
      ...settings,
      reviews: [...reviews, { id: genId(), author: "Клиент", text: "Отличная работа!", rating: 5, date: new Date().toISOString().slice(0, 10) }],
    });
  }

  function remove(index: number) {
    onChange({ ...settings, reviews: reviews.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Заголовок</label>
        <input className={inputCls} value={settings.title ?? ""} onChange={(e) => onChange({ ...settings, title: e.target.value })} placeholder="Отзывы клиентов" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-500">Отзывы ({reviews.length})</p>
          <button onClick={add} className="flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-700">
            <Plus className="h-3 w-3" /> Добавить
          </button>
        </div>

        {reviews.map((rev, i) => (
          <div key={rev.id} className="rounded-xl border border-zinc-200 p-3 space-y-2 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-500">Отзыв {i + 1}</p>
              <button onClick={() => remove(i)} className="text-zinc-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Автор</label>
                <input className={inputCls} value={rev.author} onChange={(e) => update(i, "author", e.target.value)} placeholder="Имя клиента" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Дата</label>
                <input type="date" className={inputCls} value={rev.date} onChange={(e) => update(i, "date", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Рейтинг</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => update(i, "rating", star)}>
                    <Star className={`h-5 w-5 ${star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Текст отзыва</label>
              <textarea className={`${inputCls} resize-none`} rows={2} value={rev.text} onChange={(e) => update(i, "text", e.target.value)} placeholder="Текст отзыва…" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
