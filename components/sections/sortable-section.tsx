"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { PageSection, SectionSettings } from "@/core/shared/section-types";
import { SectionEditor } from "./section-editor";

interface Props {
  section: PageSection;
  onUpdate: (settings: SectionSettings) => void;
  onDelete: () => void;
  onToggle: () => void;
}

export function SortableSection({ section, onUpdate, onDelete, onToggle }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2">
      <button
        {...attributes}
        {...listeners}
        className="mt-3 flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:border-violet-300 hover:text-violet-500 active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-900"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1">
        <SectionEditor
          section={section}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
}
