"use client";

import { useState } from "react";
import { Plus, Tags } from "lucide-react";
import { useAdminData } from "@/hooks/use-admin-data";
import { useAdminStore } from "@/stores/admin-store";
import { CategoryTree } from "@/components/admin/category-tree";
import { CategoryModal } from "@/components/admin/category-modal";
import { CategoryTreeItem } from "@/core/shared/admin-types";

function countAll(items: CategoryTreeItem[]): number {
  return items.reduce((s, c) => s + 1 + countAll(c.children), 0);
}

export default function CategoriesPage() {
  useAdminData();
  const categories = useAdminStore((s) => s.categories);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tags className="h-6 w-6 text-violet-600" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Категории</h1>
            <p className="text-sm text-zinc-500">{countAll(categories)} категорий в дереве</p>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
          <Plus className="h-4 w-4" /> Добавить категорию
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        {categories.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">Категорий нет. Создайте первую.</p>
        ) : (
          <CategoryTree items={categories} />
        )}
      </div>

      {showCreate && (
        <CategoryModal mode="create" parentId={null} onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
