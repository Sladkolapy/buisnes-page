"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useBusinessProfileStore } from "@/stores/business-profile-store";
import { ParallaxBackground } from "@/components/parallax-background";
import { AboutWidget } from "@/components/widgets/about-widget";
import { GalleryWidget } from "@/components/widgets/gallery-widget";
import { ChecklistWidget } from "@/components/widgets/checklist-widget";
import { MapWidget } from "@/components/widgets/map-widget";
import { SocialDock } from "@/components/widgets/social-dock";
import { NewsWidget } from "@/components/widgets/news-widget";
import { ReviewsWidget } from "@/components/widgets/reviews-widget";
import { PriceListWidget } from "@/components/widgets/price-list-widget";
import {
  WidgetType,
  type WidgetData,
  type AboutContent,
  type GalleryContent,
  type ChecklistContent,
  type MapContent,
  type SocialContent,
  type NewsContent,
  type PriceListContent,
} from "@/core/shared/widget-types";

function WidgetRenderer({ widget }: { widget: WidgetData }) {
  switch (widget.type) {
    case WidgetType.ABOUT:
      return <AboutWidget title={widget.title} content={widget.content as AboutContent} />;
    case WidgetType.GALLERY:
      return <GalleryWidget title={widget.title} content={widget.content as GalleryContent} />;
    case WidgetType.CHECKLIST:
      return <ChecklistWidget title={widget.title} content={widget.content as ChecklistContent} />;
    case WidgetType.MAP:
      return <MapWidget title={widget.title} content={widget.content as MapContent} />;
    case WidgetType.SOCIAL:
      return null;
    case WidgetType.NEWS:
      return <NewsWidget title={widget.title} content={widget.content as NewsContent} />;
    case WidgetType.PRICE_LIST:
      return <PriceListWidget title={widget.title} content={widget.content as PriceListContent} />;
    case WidgetType.REVIEWS:
      return <ReviewsWidget title={widget.title} />;
    default:
      return null;
  }
}

export default function PreviewPage() {
  const { profile, isLoading, initialized, fetchProfile } = useBusinessProfileStore();

  useEffect(() => {
    if (!initialized) fetchProfile();
  }, [initialized, fetchProfile]);

  if (isLoading || !initialized) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center gap-4 py-32">
        <p className="text-zinc-500">Профиль не создан</p>
        <Link href="/my-page" className="text-sm text-violet-600 hover:underline">
          Создать профиль
        </Link>
      </div>
    );
  }

  const bgColor = profile.bgColor ?? "#ffffff";
  const accentColor = profile.accentColor ?? "#7c3aed";

  const allWidgets = [...profile.widgets]
    .filter((w) => w.isVisible)
    .sort((a, b) => a.position - b.position);

  const socialWidget = allWidgets.find((w) => w.type === WidgetType.SOCIAL);
  const widgets = allWidgets.filter((w) => w.type !== WidgetType.SOCIAL);

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh" }}>
      {/* Sticky top bar */}
      <div className="sticky top-14 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link
            href="/my-page"
            className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            К редактору
          </Link>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
            Предпросмотр — клиенты видят опубликованную версию
          </span>
          <Link
            href="/my-page"
            className="flex items-center gap-1.5 text-sm text-violet-600 hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" />
            Редактировать
          </Link>
        </div>
      </div>

      {/* Background image */}
      {profile.backgroundUrl && (
        <ParallaxBackground imageUrl={profile.backgroundUrl} />
      )}

      {/* Profile header */}
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <div className="flex items-center gap-4 pb-2">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {profile.name[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{profile.name}</h1>
            {profile.description && (
              <p className="mt-1 text-sm text-zinc-500">{profile.description}</p>
            )}
            <div className="mt-3">
              <button
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white"
                style={{ backgroundColor: accentColor }}
                disabled
              >
                Написать
              </button>
            </div>
          </div>
        </div>

        {/* Widgets */}
        <div className="space-y-4">
          {widgets.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center">
              <p className="text-sm text-zinc-400">Виджеты не добавлены</p>
              <Link href="/my-page" className="mt-2 block text-xs text-violet-600 hover:underline">
                Добавить виджеты
              </Link>
            </div>
          )}
          {widgets.map((widget) => (
            <WidgetRenderer key={widget.id} widget={widget} />
          ))}
        </div>

        {!profile.isPublished && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
            ⚠️ Страница не опубликована — клиенты её не видят. Нажмите «Опубликовать» в конструкторе.
          </div>
        )}
      </div>

      {socialWidget && (
        <SocialDock content={socialWidget.content as SocialContent} />
      )}
    </div>
  );
}
