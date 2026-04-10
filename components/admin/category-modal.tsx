"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CategoryTreeItem } from "@/core/shared/admin-types";
import { useAdminStore } from "@/stores/admin-store";

interface Props {
  mode: "create" | "edit";
  initial?: Partial<CategoryTreeItem>;
  parentId?: string | null;
  onClose: () => void;
}

const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function CategoryModal({ mode, initial, parentId, onClose }: Props) {
  const { createCategory, updateCategory, categories } = useAdminStore();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "🏷️");
  const [slugManual, setSlugManual] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slugManual) setSlug(slugify(name));
  }, [name, slugManual]);

  function allSlugs(items: CategoryTreeItem[]): string[] {
    return items.flatMap((c) => [c.slug, ...allSlugs(c.children)]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Название обязательно"); return; }
    const existing = allSlugs(categories).filter((s) => s !== initial?.slug);
    if (existing.includes(slug)) { setError("Слаг уже занят"); return; }

    if (mode === "create") {
      createCategory({ name: name.trim(), slug, icon, parentId: parentId ?? null, profileCount: 0 });
    } else if (initial?.id) {
      updateCategory(initial.id, { name: name.trim(), slug, icon });
    }
    onClose();
  }

  const EMOJIS = ["🏷️", "💅", "✂️", "🪮", "💆", "🏋️", "🏃", "📷", "💍", "🤳", "🛍️", "🎨", "🍀", "⭐", "🔥", "💎"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{mode === "create" ? "Новая категория" : "Редактировать категорию"}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Название *</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Маникюр" autoFocus />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Слаг</label>
            <input className={inputCls} value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="manicure" />
          </div>
          <div>
            <label className="mb-2 block text-xs text-zinc-500">Иконка</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button key={e} type="button" onClick={() => setIcon(e)}
                  className={`h-9 w-9 rounded-lg text-xl transition ${icon === e ? "bg-violet-100 ring-2 ring-violet-500" : "hover:bg-zinc-100"}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-200 py-2 text-sm text-zinc-600 hover:bg-zinc-50">
              Отмена
            </button>
            <button type="submit"
              className="flex-1 rounded-xl bg-violet-600 py-2 text-sm font-medium text-white hover:bg-violet-700">
              {mode === "create" ? "Создать" : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
