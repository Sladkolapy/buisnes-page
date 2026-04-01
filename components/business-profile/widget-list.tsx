"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff, Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { WIDGET_LABELS, WidgetType, type WidgetData } from "@/core/shared/widget-types";
import { useBusinessProfileStore } from "@/stores/business-profile-store";
import { WidgetEditor } from "./widget-editor";

function SortableWidget({
  widget,
  onEdit,
}: {
  widget: WidgetData;
  onEdit: (w: WidgetData) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: widget.id });

  const { removeWidget, toggleWidgetVisibility } = useBusinessProfileStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-zinc-400 hover:text-zinc-600 active:cursor-grabbing dark:hover:text-zinc-300"
        aria-label="Перетащить"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {widget.title}
        </p>
        <p className="text-xs text-zinc-400">{WIDGET_LABELS[widget.type as WidgetType]}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => toggleWidgetVisibility(widget.id)}
          className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-label={widget.isVisible ? "Скрыть" : "Показать"}
        >
          {widget.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
        <button
          onClick={() => onEdit(widget)}
          className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-label="Редактировать"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => removeWidget(widget.id)}
          className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
          aria-label="Удалить"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

const ADD_WIDGET_TYPES = Object.values(WidgetType);

export function WidgetList() {
  const { profile, reorderWidgets, addWidget } = useBusinessProfileStore();
  const [editingWidget, setEditingWidget] = useState<WidgetData | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const widgets = profile?.widgets ?? [];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex((w) => w.id === active.id);
    const newIndex = widgets.findIndex((w) => w.id === over.id);
    const reordered = arrayMove(widgets, oldIndex, newIndex).map((w, i) => ({
      ...w,
      position: i,
    }));
    reorderWidgets(reordered);
  }

  function handleAddWidget(type: WidgetType) {
    const defaultContent: Record<WidgetType, object> = {
      [WidgetType.ABOUT]: { text: "" },
      [WidgetType.GALLERY]: { images: [] },
      [WidgetType.CHECKLIST]: { items: [] },
      [WidgetType.MAP]: { address: "" },
      [WidgetType.SOCIAL]: {},
      [WidgetType.NEWS]: { title: "", text: "" },
      [WidgetType.REVIEWS]: {},
    };

    const widget: WidgetData = {
      id: crypto.randomUUID(),
      type,
      title: WIDGET_LABELS[type],
      content: defaultContent[type],
      position: widgets.length,
      isVisible: true,
    };

    addWidget(widget);
    setShowAddMenu(false);
    setEditingWidget(widget);
  }

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
          {widgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-700">
              <p className="text-sm text-zinc-500">Пока нет виджетов</p>
              <p className="mt-1 text-xs text-zinc-400">Добавьте первый виджет ниже</p>
            </div>
          ) : (
            widgets
              .slice()
              .sort((a, b) => a.position - b.position)
              .map((w) => (
                <SortableWidget key={w.id} widget={w} onEdit={setEditingWidget} />
              ))
          )}
        </SortableContext>
      </DndContext>

      <div className="relative">
        <button
          onClick={() => setShowAddMenu((v) => !v)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-500 transition hover:border-violet-400 hover:text-violet-600 dark:border-zinc-600 dark:hover:border-violet-500 dark:hover:text-violet-400"
        >
          <Plus className="h-4 w-4" />
          Добавить виджет
        </button>

        {showAddMenu && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="grid grid-cols-2 gap-1">
              {ADD_WIDGET_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleAddWidget(type)}
                  className="rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {WIDGET_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {editingWidget && (
        <WidgetEditor
          widget={editingWidget}
          open={!!editingWidget}
          onClose={() => setEditingWidget(null)}
        />
      )}
    </div>
  );
}
