"use client";

import { ExternalLink, Copy, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBusinessProfileStore } from "@/stores/business-profile-store";

const ROLE_LABELS: Record<string, string> = {
  CLIENT: "Клиент",
  SOLO_MASTER: "Мастер",
  BUSINESS_OWNER: "Владелец бизнеса",
  ADMIN: "Администратор",
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const { profile, fetchProfile } = useBusinessProfileStore();
  const [copied, setCopied] = useState(false);
  const user = session?.user as { id?: string; email?: string | null; role?: string } | undefined;

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  function copyId() {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Профиль</h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">
            {user?.email?.[0]?.toUpperCase() ?? "?"}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
              {user?.email ?? "—"}
            </p>
            <p className="text-sm text-zinc-500">{ROLE_LABELS[user?.role ?? ""] ?? user?.role ?? "—"}</p>
            <button
              onClick={copyId}
              className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {user?.id?.slice(0, 16)}…
            </button>
          </div>
        </div>
      </div>

      {profile && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Бизнес-страница</p>
              <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{profile.name}</p>
              {profile.subdomain && (
                <p className="text-xs text-zinc-500">/{profile.subdomain}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {profile.subdomain && profile.isPublished && (
                <a
                  href={`/${profile.subdomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Открыть
                </a>
              )}
              <Link
                href="/my-page"
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700"
              >
                Редактировать
              </Link>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${profile.isPublished ? "bg-green-500" : "bg-zinc-400"}`} />
            <span className="text-xs text-zinc-500">{profile.isPublished ? "Опубликовано" : "Черновик"}</span>
            <span className="text-xs text-zinc-300 dark:text-zinc-600">·</span>
            <span className="text-xs text-zinc-500">{profile.widgets.length} виджетов</span>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Безопасность</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Сессия</p>
            <p className="text-xs text-zinc-500">JWT · активна</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Активна
          </span>
        </div>
      </div>
    </div>
  );
}
