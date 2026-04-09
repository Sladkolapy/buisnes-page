"use client";

import { useState } from "react";
import { Pencil, Eye, EyeOff, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { PageSection, SECTION_META, SectionSettings } from "@/core/shared/section-types";
import { HeroEditor } from "./editors/hero-editor";
import { TextWithImageEditor } from "./editors/text-with-image-editor";
import { ServicesGridEditor } from "./editors/services-grid-editor";
import { GalleryEditor } from "./editors/gallery-editor";
import { MapEditor } from "./editors/map-editor";
import { ContactFormEditor } from "./editors/contact-form-editor";
import { SocialLinksEditor } from "./editors/social-links-editor";
import { ReviewsEditor } from "./editors/reviews-editor";
import { PriceListEditor } from "./editors/price-list-editor";
import { SectionPreview } from "./preview/section-preview";

interface Props {
  section: PageSection;
  onUpdate: (settings: SectionSettings) => void;
  onDelete: () => void;
  onToggle: () => void;
}

function EditorSwitch({ section, onChange }: { section: PageSection; onChange: (s: SectionSettings) => void }) {
  const props = { settings: section.settings, onChange };
  switch (section.type) {
    case "hero": return <HeroEditor {...props} />;
    case "text-with-image": return <TextWithImageEditor {...props} />;
    case "services-grid": return <ServicesGridEditor {...props} />;
    case "gallery": return <GalleryEditor {...props} />;
    case "map": return <MapEditor {...props} />;
    case "contact-form": return <ContactFormEditor {...props} />;
    case "social-links": return <SocialLinksEditor {...props} />;
    case "reviews": return <ReviewsEditor {...props} />;
    case "price-list": return <PriceListEditor {...props} />;
    default: return null;
  }
}

export function SectionEditor({ section, onUpdate, onDelete, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const meta = SECTION_META[section.type];

  return (
    <div className={`rounded-2xl border bg-white dark:bg-zinc-900 ${section.isVisible ? "border-zinc-200 dark:border-zinc-700" : "border-zinc-100 opacity-60 dark:border-zinc-800"}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="text-lg">{meta.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{meta.label}</p>
          <p className="truncate text-xs text-zinc-400">{meta.description}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {expanded && (
            <div className="mr-1 flex rounded-lg border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setMode("edit")}
                className={`flex items-center gap-1 rounded-l-lg px-2 py-1 text-xs transition ${mode === "edit" ? "bg-violet-600 text-white" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}
              >
                <Pencil className="h-3 w-3" /> Ред.
              </button>
              <button
                onClick={() => setMode("preview")}
                className={`flex items-center gap-1 rounded-r-lg px-2 py-1 text-xs transition ${mode === "preview" ? "bg-violet-600 text-white" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}
              >
                <Eye className="h-3 w-3" /> Вид
              </button>
            </div>
          )}
          <button onClick={onToggle} className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700" title={section.isVisible ? "Скрыть" : "Показать"}>
            {section.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button onClick={() => { if (confirm("Удалить секцию?")) onDelete(); }}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          {mode === "edit" ? (
            <div className="p-4">
              <EditorSwitch section={section} onChange={onUpdate} />
            </div>
          ) : (
            <div className="overflow-hidden rounded-b-2xl">
              <SectionPreview section={section} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
