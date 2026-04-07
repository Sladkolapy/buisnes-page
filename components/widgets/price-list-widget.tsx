"use client";

import { Plus, Trash2, GripVertical, Info } from "lucide-react";
import { useRef, useState } from "react";
import type { PriceListContent, PriceListItem } from "@/core/shared/widget-types";

interface Props {
  title: string;
  content: PriceListContent;
  editable?: boolean;
  onUpdate?: (content: PriceListContent) => void;
}

const UNIT_OPTIONS = ["", "от", "до", "за", "в час", "в день"];

export function PriceListWidget({ title, content, editable = false, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const dragIdx = useRef<number | null>(null);

  const items = content.items ?? [];

  function update(newItems: PriceListItem[]) {
    onUpdate?.({ ...content, items: newItems });
  }

  function addItem() {
    const newItem: PriceListItem = {
      id: crypto.randomUUID(),
      name: "",
      price: "",
      unit: "от",
    };
    update([...items, newItem]);
    setEditingId(newItem.id);
  }

  function removeItem(id: string) {
    update(items.filter((i) => i.id !== id));
  }

  function updateItem(id: string, patch: Partial<PriceListItem>) {
    update(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function handleDragStart(idx: number) {
    dragIdx.current = idx;
  }

  function handleDrop(idx: number) {
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const reordered = [...items];
    const [moved] = reordered.splice(dragIdx.current, 1);
    reordered.splice(idx, 0, moved);
    update(reordered);
    dragIdx.current = null;
  }

  if (items.length === 0 && !editable) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {title && (
        <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        </div>
      )}

      {editable && items.length > 0 && (
        <div className="border-b border-zinc-100 bg-amber-50 px-5 py-2.5 dark:border-zinc-800 dark:bg-amber-950/20">
          <p className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Первые 3 строки будут видны в ленте при поиске мастеров
          </p>
        </div>
      )}

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {items.map((item, idx) => (
          <div
            key={item.id}
            draggable={editable}
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className={`group px-5 ${editable ? "py-3" : "py-3.5"}`}
          >
            {editable && editingId === item.id ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    placeholder="Название услуги"
                    className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-transparent px-3 py-1.5 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700"
                  />
                  <div className="flex shrink-0 gap-1">
                    <select
                      value={item.unit ?? ""}
                      onChange={(e) => updateItem(item.id, { unit: e.target.value || undefined })}
                      className="rounded-lg border border-zinc-200 bg-transparent px-2 py-1.5 text-sm outline-none dark:border-zinc-700"
                    >
                      {UNIT_OPTIONS.map((u) => (
                        <option key={u} value={u}>{u || "—"}</option>
                      ))}
                    </select>
                    <input
                      value={item.price}
                      onChange={(e) => updateItem(item.id, { price: e.target.value })}
                      placeholder="1 500 ₽"
                      className="w-28 rounded-lg border border-zinc-200 bg-transparent px-3 py-1.5 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={item.description ?? ""}
                    onChange={(e) => updateItem(item.id, { description: e.target.value || undefined })}
                    placeholder="Описание (необязательно)"
                    className="flex-1 rounded-lg border border-zinc-200 bg-transparent px-3 py-1.5 text-xs outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700"
                  />
                  <button
                    onClick={() => setEditingId(null)}
                    className="shrink-0 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
                  >
                    ОК
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 rounded-lg p-1.5 text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                {editable && (
                  <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-zinc-300 group-hover:text-zinc-400" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className={`text-sm text-zinc-800 dark:text-zinc-200 ${editable ? "cursor-pointer hover:text-violet-700" : ""}`}
                      onClick={() => editable && setEditingId(item.id)}
                    >
                      {item.name || <span className="text-zinc-400 italic">Без названия</span>}
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.unit && <span className="mr-1 font-normal text-zinc-500">{item.unit}</span>}
                      {item.price || <span className="text-zinc-400">—</span>}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-0.5 text-xs text-zinc-400">{item.description}</p>
                  )}
                </div>
                {editable && (
                  <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingId(item.id)}
                      className="rounded p-1 text-zinc-400 hover:text-violet-600"
                      title="Редактировать"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-.708.477l-3.535 1.06 1.06-3.535A2 2 0 019 13z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded p-1 text-zinc-400 hover:text-red-500"
                      title="Удалить"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {editable && (
        <div className="border-t border-zinc-100 px-5 py-3 dark:border-zinc-800">
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700"
          >
            <Plus className="h-4 w-4" />
            Добавить услугу
          </button>
        </div>
      )}

      {items.length === 0 && editable && (
        <div className="px-5 pb-4 text-center text-sm text-zinc-400">
          Нажмите «Добавить услугу» чтобы начать
        </div>
      )}
    </div>
  );
}
