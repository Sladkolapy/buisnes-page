"use client";

import { useEffect, useState } from "react";
import { Plus, Eye, RotateCcw, Save } from "lucide-react";
import Link from "next/link";
import { useSections } from "@/hooks/use-sections";
import { useBusinessProfileStore } from "@/stores/business-profile-store";
import { SectionList } from "@/components/sections/section-list";
import { SectionLibrary } from "@/components/sections/library/section-library";
import { SectionType } from "@/core/shared/section-types";
import { createDefaultSections } from "@/lib/mock/default-sections";

export default function BuilderPage() {
  const { profile } = useBusinessProfileStore();
  const { sections, loadSections, addSection, updateSection, deleteSection, reorderSections, toggleSection } = useSections();
  const [showLibrary, setShowLibrary] = useState(false);
  const [saved, setSaved] = useState(false);

  const profileId = profile?.id ?? "preview-profile";

  useEffect(() => {
    loadSections(profileId);
  }, [profileId, loadSections]);

  function handleAddSection(type: SectionType) {
    addSection(type);
    setShowLibrary(false);
  }

  function handleLoadDefaults() {
    if (!confirm("Загрузить шаблон по умолчанию? Текущие секции будут заменены.")) return;
    const defaults = createDefaultSections(profileId);
    reorderSections(defaults);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sectionCount = sections.length;
  const visibleCount = sections.filter((s) => s.isVisible).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Конструктор страницы</h1>
          <p className="text-sm text-zinc-500">
            {sectionCount === 0
              ? "Нет секций — добавьте первую"
              : `${sectionCount} секций, ${visibleCount} видимых`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {sectionCount === 0 && (
            <button
              onClick={handleLoadDefaults}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              <RotateCcw className="h-4 w-4" />
              Шаблон
            </button>
          )}
          <Link
            href="/my-page/builder/preview"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
          >
            <Eye className="h-4 w-4" />
            Просмотр
          </Link>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white transition ${saved ? "bg-green-600" : "bg-zinc-700 hover:bg-zinc-800"}`}
          >
            <Save className="h-4 w-4" />
            {saved ? "Сохранено!" : "Сохранить"}
          </button>
          <button
            onClick={() => setShowLibrary(true)}
            className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" />
            Добавить секцию
          </button>
        </div>
      </div>

      {/* Info banner for first visit */}
      {sectionCount === 0 && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/20">
          <p className="text-sm font-medium text-violet-800 dark:text-violet-300">💡 Как начать?</p>
          <p className="mt-1 text-xs text-violet-600 dark:text-violet-400">
            Нажмите «Шаблон» для быстрого старта с готовыми секциями, или «Добавить секцию» для ручной настройки.
            Данные сохраняются в localStorage для тестирования.
          </p>
        </div>
      )}

      {/* Section List */}
      <SectionList
        sections={sections}
        onReorder={reorderSections}
        onUpdate={(id, settings) => updateSection(id, settings)}
        onDelete={deleteSection}
        onToggle={toggleSection}
      />

      {/* Add button at bottom (when sections exist) */}
      {sectionCount > 0 && (
        <button
          onClick={() => setShowLibrary(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 py-4 text-sm text-zinc-400 transition hover:border-violet-300 hover:text-violet-500 dark:border-zinc-700"
        >
          <Plus className="h-4 w-4" />
          Добавить секцию
        </button>
      )}

      {/* Section Library Modal */}
      {showLibrary && (
        <SectionLibrary
          onAdd={handleAddSection}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}
