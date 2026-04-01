"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import type { ProfileCardData } from "@/core/shared/search-types";
import { useCategoryStore } from "@/stores/category-store";

interface ProfileCardProps {
  profile: ProfileCardData;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
    </span>
  );
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const categories = useCategoryStore((s) => s.categories);

  const categoryLabels = profile.categoryIds
    .map((id) => categories.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <Link
      href={`/${profile.subdomain}`}
      className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-violet-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-violet-700"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-violet-600 text-lg font-bold text-white">
          {profile.businessName[0]?.toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-zinc-900 group-hover:text-violet-700 dark:text-zinc-100 dark:group-hover:text-violet-400">
            {profile.businessName}
          </p>
          {profile.rating > 0 && <StarRating rating={profile.rating} />}
        </div>
      </div>

      {categoryLabels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {categoryLabels.map((cat) => (
            <span
              key={cat!.id}
              className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950/30 dark:text-violet-400"
            >
              {cat!.icon && <span>{cat!.icon}</span>}
              {cat!.name}
            </span>
          ))}
        </div>
      )}

      {profile.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
          {profile.description}
        </p>
      )}

      <span className="mt-auto inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white transition group-hover:bg-violet-700">
        Записаться
      </span>
    </Link>
  );
}
