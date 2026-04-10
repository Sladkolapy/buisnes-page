"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";
import { CategoryTreeItem } from "@/core/shared/admin-types";
import { useAdminStore } from "@/stores/admin-store";
import { CategoryModal } from "./category-modal";

interface Props { items: CategoryTreeItem[]; depth?: number }

export function CategoryTree({ items, depth = 0 }: Props) {
  const { deleteCategory } = useAdminStore();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editItem, setEditItem] = useState<CategoryTreeItem | null>(null);
  const [addParent, setAddParent] = useState<string | null | undefined>(undefined);

  function toggle(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleDelete(item: CategoryTreeItem) {
    if (!confirm(`Удалить категорию «${item.name}»?`)) return;
    deleteCategory(item.id);
  }

  return (
    <>
      <ul className={depth > 0 ? "ml-6 border-l border-zinc-100 pl-4 dark:border-zinc-800" : ""}>
        {items.map((item) => (
          <li key={item.id} className="py-1">
            <div className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
              <button onClick={() => toggle(item.id)} className="shrink-0 text-zinc-400">
                {item.children.length > 0
                  ? collapsed.has(item.id) ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  : <span className="inline-block h-4 w-4" />}
              </button>
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">{item.name}</span>
              <span className="hidden text-xs text-zinc-400 sm:block">/{item.slug}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                {item.profileCount}
              </span>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => setAddParent(item.id)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-200 hover:text-violet-600 dark:hover:bg-zinc-700" title="Добавить подкатегорию">
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setEditItem(item)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700" title="Редактировать">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(item)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20" title="Удалить">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {item.children.length > 0 && !collapsed.has(item.id) && (
              <CategoryTree items={item.children} depth={depth + 1} />
            )}
          </li>
        ))}
      </ul>

      {editItem && (
        <CategoryModal mode="edit" initial={editItem} onClose={() => setEditItem(null)} />
      )}
      {addParent !== undefined && (
        <CategoryModal mode="create" parentId={addParent} onClose={() => setAddParent(undefined)} />
      )}
    </>
  );
}
