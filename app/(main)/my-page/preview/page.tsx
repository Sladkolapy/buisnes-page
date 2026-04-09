"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useSections } from "@/hooks/use-sections";
import { useBusinessProfileStore } from "@/stores/business-profile-store";
import { SectionRenderer } from "@/components/sections/section-renderer";

export default function PreviewPage() {
  const { profile, fetchProfile, initialized } = useBusinessProfileStore();
  const { visibleSections, loadSections } = useSections();

  useEffect(() => {
    if (!initialized) fetchProfile();
  }, [initialized, fetchProfile]);

  useEffect(() => {
    if (profile?.id) loadSections(profile.id);
  }, [profile?.id, loadSections]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Preview bar */}
      <div className="sticky top-14 z-40 border-b border-zinc-200 bg-white/80 px-4 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/my-page" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700">
              <ArrowLeft className="h-4 w-4" /> Назад
            </Link>
            <span className="hidden text-xs text-zinc-400 sm:block">Предпросмотр страницы</span>
          </div>
          <Link href="/my-page" className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700">
            <Pencil className="h-4 w-4" /> Редактировать
          </Link>
        </div>
      </div>

      {/* Sections */}
      {visibleSections.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
          <p className="text-5xl">🧩</p>
          <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">Страница в разработке</p>
          <p className="text-sm text-zinc-400">Добавьте секции в конструкторе</p>
          <Link href="/my-page" className="mt-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700">
            Открыть конструктор
          </Link>
        </div>
      ) : (
        visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))
      )}
    </div>
  );
}
