import { create } from "zustand";
import { PageSection, SectionType, DEFAULT_SETTINGS, SectionSettings } from "@/core/shared/section-types";

function storageKey(profileId: string) {
  return `sections-${profileId}`;
}

function readStorage(profileId: string): PageSection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(profileId));
    return raw ? (JSON.parse(raw) as PageSection[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(profileId: string, sections: PageSection[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(profileId), JSON.stringify(sections));
}

function genId() {
  return `sec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface SectionStore {
  sections: PageSection[];
  profileId: string | null;
  loadSections: (profileId: string) => void;
  addSection: (type: SectionType) => void;
  updateSection: (id: string, settings: SectionSettings) => void;
  deleteSection: (id: string) => void;
  reorderSections: (sections: PageSection[]) => void;
  toggleSection: (id: string) => void;
  setProfileId: (id: string) => void;
}

export const useSectionStore = create<SectionStore>((set, get) => ({
  sections: [],
  profileId: null,

  setProfileId: (id) => set({ profileId: id }),

  loadSections: (profileId) => {
    const sections = readStorage(profileId);
    set({ sections: sections.sort((a, b) => a.order - b.order), profileId });
  },

  addSection: (type) => {
    const { sections, profileId } = get();
    if (!profileId) return;
    const newSection: PageSection = {
      id: genId(),
      profileId,
      type,
      order: sections.length,
      settings: { ...DEFAULT_SETTINGS[type] },
      isVisible: true,
    };
    const updated = [...sections, newSection];
    writeStorage(profileId, updated);
    set({ sections: updated });
  },

  updateSection: (id, settings) => {
    const { sections, profileId } = get();
    if (!profileId) return;
    const updated = sections.map((s) => (s.id === id ? { ...s, settings: { ...s.settings, ...settings } } : s));
    writeStorage(profileId, updated);
    set({ sections: updated });
  },

  deleteSection: (id) => {
    const { sections, profileId } = get();
    if (!profileId) return;
    const updated = sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i }));
    writeStorage(profileId, updated);
    set({ sections: updated });
  },

  reorderSections: (sections) => {
    const { profileId } = get();
    if (!profileId) return;
    const updated = sections.map((s, i) => ({ ...s, order: i }));
    writeStorage(profileId, updated);
    set({ sections: updated });
  },

  toggleSection: (id) => {
    const { sections, profileId } = get();
    if (!profileId) return;
    const updated = sections.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s));
    writeStorage(profileId, updated);
    set({ sections: updated });
  },
}));
