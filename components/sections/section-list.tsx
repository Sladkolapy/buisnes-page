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
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PageSection } from "@/core/shared/section-types";
import { SortableSection } from "./sortable-section";

interface Props {
  sections: PageSection[];
  onReorder: (sections: PageSection[]) => void;
  onUpdate: (id: string, settings: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function SectionList({ sections, onReorder, onUpdate, onDelete, onToggle }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    onReorder(arrayMove(sections, oldIndex, newIndex));
  }

  if (sections.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-zinc-200 py-16 text-center dark:border-zinc-700">
        <p className="text-2xl">🧩</p>
        <p className="mt-2 text-sm font-medium text-zinc-500">Нет секций</p>
        <p className="text-xs text-zinc-400">Нажмите «Добавить секцию» чтобы начать</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onUpdate={(settings) => onUpdate(section.id, settings)}
              onDelete={() => onDelete(section.id)}
              onToggle={() => onToggle(section.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
