import { useSectionStore } from "@/stores/section-store";

export function useSections() {
  const {
    sections,
    profileId,
    loadSections,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    toggleSection,
  } = useSectionStore();

  const visibleSections = sections.filter((s) => s.isVisible);

  return {
    sections,
    visibleSections,
    profileId,
    loadSections,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    toggleSection,
  };
}
