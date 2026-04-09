import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StartChatButton } from "@/components/chat/start-chat-button";
import { BookingButton } from "@/components/booking/booking-button";
import { ParallaxBackground } from "@/components/parallax-background";
import { notFound } from "next/navigation";
import { getPrisma } from "@/config/containers";
import { WidgetType, type WidgetData } from "@/core/shared/widget-types";
import { AboutWidget } from "@/components/widgets/about-widget";
import { GalleryWidget } from "@/components/widgets/gallery-widget";
import { ChecklistWidget } from "@/components/widgets/checklist-widget";
import { MapWidget } from "@/components/widgets/map-widget";
import { SocialWidget } from "@/components/widgets/social-widget";
import { NewsWidget } from "@/components/widgets/news-widget";
import { ReviewsWidget } from "@/components/widgets/reviews-widget";
import { PriceListWidget } from "@/components/widgets/price-list-widget";
import { SocialDock } from "@/components/widgets/social-dock";
import type {
  AboutContent,
  GalleryContent,
  ChecklistContent,
  MapContent,
  SocialContent,
  NewsContent,
  PriceListContent,
} from "@/core/shared/widget-types";

const prisma = getPrisma();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const profile = await prisma.businessProfile.findUnique({
    where: { subdomain },
    select: { name: true, description: true },
  });
  if (!profile) return { title: "Страница не найдена" };
  return {
    title: profile.name,
    description: profile.description ?? undefined,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const profile = await prisma.businessProfile.findUnique({
    where: { subdomain },
    include: { user: { select: { id: true } } },
    // bgColor, accentColor, backgroundUrl are in the model after migration
  });

  if (!profile || !profile.isPublished) notFound();

  const allWidgets = ((profile.widgetsJson as unknown as WidgetData[]) ?? [])
    .filter((w) => w.isVisible)
    .sort((a, b) => a.position - b.position);

  const socialWidget = allWidgets.find((w) => w.type === WidgetType.SOCIAL);
  const widgets = allWidgets.filter((w) => w.type !== WidgetType.SOCIAL);

  const bgColor = (profile as { bgColor?: string | null }).bgColor ?? "#ffffff";
  const accentColor = (profile as { accentColor?: string | null }).accentColor ?? "#7c3aed";
  const backgroundUrl = (profile as { backgroundUrl?: string | null }).backgroundUrl;

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            К поиску
          </Link>
          <Link href="/" className="text-sm font-bold text-violet-600">
            Beauty Platform
          </Link>
        </div>
      </header>

      {backgroundUrl && (
        <ParallaxBackground imageUrl={backgroundUrl} />
      )}

      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <div className="flex items-center gap-4 pb-2">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-600 text-3xl font-bold text-white">
              {profile.name[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{profile.name}</h1>
            {profile.description && (
              <p className="mt-1 text-sm text-zinc-500">{profile.description}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <BookingButton businessProfileId={profile.id} businessName={profile.name} accentColor={accentColor} />
              <StartChatButton recipientId={profile.user.id} accentColor={accentColor} />
            </div>
          </div>
        </div>

        {widgets.map((widget) => (
          <WidgetRenderer key={widget.id} widget={widget} accentColor={accentColor} />
        ))}

        {widgets.length === 0 && (
          <p className="text-center text-sm text-zinc-400">Страница пока пустая</p>
        )}
      </div>

      {socialWidget && (
        <SocialDock content={socialWidget.content as SocialContent} />
      )}
    </div>
  );
}

function WidgetRenderer({ widget, accentColor }: { widget: WidgetData; accentColor?: string }) {
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
      return <SocialWidget title={widget.title} content={widget.content as SocialContent} />;
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
