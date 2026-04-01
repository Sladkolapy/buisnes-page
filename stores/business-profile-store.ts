"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BusinessProfileData, WidgetData } from "@/core/shared/widget-types";

interface BusinessProfileState {
  profile: BusinessProfileData | null;
  isLoading: boolean;
  initialized: boolean;
  error: string | null;

  setProfile: (profile: BusinessProfileData | null) => void;
  addWidget: (widget: WidgetData) => void;
  updateWidget: (id: string, patch: Partial<WidgetData>) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (widgets: WidgetData[]) => void;
  toggleWidgetVisibility: (id: string) => void;

  fetchProfile: () => Promise<void>;
  createProfile: (data: { name: string; description?: string; role: string }) => Promise<void>;
  saveProfile: () => Promise<void>;
}

export const useBusinessProfileStore = create<BusinessProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      initialized: false,
      error: null,

      setProfile: (profile) => set({ profile }),

      addWidget: (widget) =>
        set((s) => ({
          profile: s.profile
            ? { ...s.profile, widgets: [...s.profile.widgets, widget] }
            : s.profile,
        })),

      updateWidget: (id, patch) =>
        set((s) => ({
          profile: s.profile
            ? {
                ...s.profile,
                widgets: s.profile.widgets.map((w) =>
                  w.id === id ? { ...w, ...patch } : w,
                ),
              }
            : s.profile,
        })),

      removeWidget: (id) =>
        set((s) => ({
          profile: s.profile
            ? {
                ...s.profile,
                widgets: s.profile.widgets
                  .filter((w) => w.id !== id)
                  .map((w, i) => ({ ...w, position: i })),
              }
            : s.profile,
        })),

      reorderWidgets: (widgets) =>
        set((s) => ({
          profile: s.profile ? { ...s.profile, widgets } : s.profile,
        })),

      toggleWidgetVisibility: (id) =>
        set((s) => ({
          profile: s.profile
            ? {
                ...s.profile,
                widgets: s.profile.widgets.map((w) =>
                  w.id === id ? { ...w, isVisible: !w.isVisible } : w,
                ),
              }
            : s.profile,
        })),

      fetchProfile: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });
        try {
          const res = await fetch("/api/business-profile");
          if (res.status === 404) {
            set({ profile: null, isLoading: false, initialized: true });
            return;
          }
          if (!res.ok) throw new Error("Failed to fetch profile");
          const data = (await res.json()) as BusinessProfileData;
          set({ profile: data, isLoading: false, initialized: true });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false, initialized: true });
        }
      },

      createProfile: async ({ name, description, role }) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch("/api/business-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description, role }),
          });
          if (!res.ok) {
            const d = (await res.json()) as { error?: string };
            throw new Error(d.error ?? "Failed to create profile");
          }
          const data = (await res.json()) as BusinessProfileData;
          set({ profile: data, isLoading: false, initialized: true });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
          throw e;
        }
      },

      saveProfile: async () => {
        const { profile } = get();
        if (!profile) return;
        set({ isLoading: true, error: null });
        try {
          const res = await fetch("/api/business-profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile),
          });
          if (!res.ok) throw new Error("Failed to save profile");
          const data = (await res.json()) as BusinessProfileData;
          set({ profile: data, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
          throw e;
        }
      },
    }),
    {
      name: "business-profile-draft",
      partialize: (s) => ({ profile: s.profile }),
    },
  ),
);
