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
import type {
  AboutContent,
  GalleryContent,
  ChecklistContent,
  MapContent,
  SocialContent,
  NewsContent,
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
  });

  if (!profile || !profile.isPublished) notFound();

  const widgets = ((profile.widgetsJson as unknown as WidgetData[]) ?? [])
    .filter((w) => w.isVisible)
    .sort((a, b) => a.position - b.position);

  return (
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
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{profile.name}</h1>
          {profile.description && (
            <p className="mt-1 text-sm text-zinc-500">{profile.description}</p>
          )}
        </div>
      </div>

      {widgets.map((widget) => (
        <WidgetRenderer key={widget.id} widget={widget} />
      ))}

      {widgets.length === 0 && (
        <p className="text-center text-sm text-zinc-400">Страница пока пустая</p>
      )}
    </div>
  );
}

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
      return <SocialWidget title={widget.title} content={widget.content as SocialContent} />;
    case WidgetType.NEWS:
      return <NewsWidget title={widget.title} content={widget.content as NewsContent} />;
    case WidgetType.REVIEWS:
      return <ReviewsWidget title={widget.title} />;
    default:
      return null;
  }
}
