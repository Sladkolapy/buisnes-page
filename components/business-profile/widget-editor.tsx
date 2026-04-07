"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  WidgetType,
  type WidgetData,
  type AboutContent,
  type ChecklistContent,
  type GalleryContent,
  type MapContent,
  type NewsContent,
  type SocialContent,
  type PriceListContent,
} from "@/core/shared/widget-types";
import { GalleryWidget } from "@/components/widgets/gallery-widget";
import { PriceListWidget } from "@/components/widgets/price-list-widget";
import { useBusinessProfileStore } from "@/stores/business-profile-store";

interface Props {
  widget: WidgetData;
  open: boolean;
  onClose: () => void;
}

export function WidgetEditor({ widget, open, onClose }: Props) {
  const { updateWidget } = useBusinessProfileStore();
  const [title, setTitle] = useState(widget.title);
  const [content, setContent] = useState(widget.content);

  function save() {
    updateWidget(widget.id, { title, content });
    onClose();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Редактировать виджет</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Заголовок виджета
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700"
              />
            </div>

            <WidgetContentForm type={widget.type} content={content} onChange={setContent} />
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Отмена
            </button>
            <button
              onClick={save}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              Сохранить
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function WidgetContentForm({
  type,
  content,
  onChange,
}: {
  type: WidgetType;
  content: WidgetData["content"];
  onChange: (c: WidgetData["content"]) => void;
}) {
  const inputCls =
    "w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

  if (type === WidgetType.ABOUT) {
    const c = content as AboutContent;
    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Текст
        </label>
        <textarea
          value={c.text}
          onChange={(e) => onChange({ ...c, text: e.target.value })}
          rows={5}
          className={`${inputCls} resize-none`}
          placeholder="Расскажите о себе…"
        />
      </div>
    );
  }

  if (type === WidgetType.NEWS) {
    const c = content as NewsContent;
    return (
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Заголовок новости
          </label>
          <input
            value={c.title}
            onChange={(e) => onChange({ ...c, title: e.target.value })}
            className={inputCls}
            placeholder="Акция, событие…"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Текст
          </label>
          <textarea
            value={c.text}
            onChange={(e) => onChange({ ...c, text: e.target.value })}
            rows={4}
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>
    );
  }

  if (type === WidgetType.CHECKLIST) {
    const c = content as ChecklistContent;
    return (
      <div className="space-y-2">
        <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Пункты
        </label>
        {c.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              value={item.text}
              onChange={(e) =>
                onChange({
                  ...c,
                  items: c.items.map((i) =>
                    i.id === item.id ? { ...i, text: e.target.value } : i,
                  ),
                })
              }
              className={`${inputCls} flex-1`}
              placeholder="Пункт списка"
            />
            <button
              onClick={() =>
                onChange({ ...c, items: c.items.filter((i) => i.id !== item.id) })
              }
              className="rounded-lg p-1.5 text-zinc-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            onChange({
              ...c,
              items: [...c.items, { id: crypto.randomUUID(), text: "", checked: false }],
            })
          }
          className="flex items-center gap-1 text-xs text-violet-600 hover:underline"
        >
          <Plus className="h-3 w-3" /> Добавить пункт
        </button>
      </div>
    );
  }

  if (type === WidgetType.MAP) {
    const c = content as MapContent;
    return (
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Адрес
          </label>
          <input
            value={c.address}
            onChange={(e) => onChange({ ...c, address: e.target.value })}
            className={inputCls}
            placeholder="Москва, ул. Пушкина, д. 1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Широта
            </label>
            <input
              value={c.lat ?? ""}
              onChange={(e) => onChange({ ...c, lat: e.target.value })}
              className={inputCls}
              placeholder="55.7558"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Долгота
            </label>
            <input
              value={c.lng ?? ""}
              onChange={(e) => onChange({ ...c, lng: e.target.value })}
              className={inputCls}
              placeholder="37.6176"
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === WidgetType.SOCIAL) {
    const c = content as SocialContent;
    const fields: { key: keyof SocialContent; label: string; placeholder: string }[] = [
      { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
      { key: "telegram", label: "Telegram", placeholder: "https://t.me/username" },
      { key: "vk", label: "ВКонтакте", placeholder: "https://vk.com/username" },
      { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/79001234567" },
    ];
    return (
      <div className="space-y-3">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {label}
            </label>
            <input
              value={c[key] ?? ""}
              onChange={(e) => onChange({ ...c, [key]: e.target.value || undefined })}
              className={inputCls}
              placeholder={placeholder}
              type="url"
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === WidgetType.GALLERY) {
    const c = content as GalleryContent;
    return (
      <GalleryWidget
        title=""
        content={c}
        editable
        onUpdate={(images) => onChange({ ...c, images })}
      />
    );
  }

  if (type === WidgetType.PRICE_LIST) {
    const c = content as PriceListContent;
    return (
      <PriceListWidget
        title=""
        content={c}
        editable
        onUpdate={(updated) => onChange(updated)}
      />
    );
  }

  if (type === WidgetType.REVIEWS) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
        Отзывы будут подключены позже
      </div>
    );
  }

  return null;
}
