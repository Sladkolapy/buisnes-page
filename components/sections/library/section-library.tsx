"use client";

import { X } from "lucide-react";
import { SectionType, SECTION_META } from "@/core/shared/section-types";

const SECTION_ORDER: SectionType[] = [
  "hero",
  "text-with-image",
  "services-grid",
  "gallery",
  "price-list",
  "reviews",
  "map",
  "contact-form",
  "social-links",
];

interface Props {
  onAdd: (type: SectionType) => void;
  onClose: () => void;
}

export function SectionLibrary({ onAdd, onClose }: Props) {
  function handle(type: SectionType) {
    onAdd(type);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">Добавить секцию</p>
            <p className="text-xs text-zinc-400">Выберите тип блока для страницы</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 max-h-[70vh] overflow-y-auto">
          {SECTION_ORDER.map((type) => {
            const meta = SECTION_META[type];
            return (
              <button
                key={type}
                onClick={() => handle(type)}
                className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 text-left transition hover:border-violet-400 hover:bg-violet-50 dark:border-zinc-700 dark:hover:border-violet-500 dark:hover:bg-violet-950/20"
              >
                <span className="text-2xl">{meta.icon}</span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{meta.label}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{meta.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
