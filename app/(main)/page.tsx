"use client";

import { Search, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ProfileCard {
  id: string;
  name: string;
  description: string | null;
  subdomain: string | null;
  avatarUrl: string | null;
  user: { role: string };
}

interface FeedResponse {
  profiles: ProfileCard[];
  total: number;
  page: number;
  pages: number;
}

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  SOLO_MASTER: { label: "Мастер", cls: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400" },
  BUSINESS_OWNER: { label: "Бизнес", cls: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
};

function pluralProfiles(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} страниц`;
  if (mod10 === 1) return `${n} страница`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} страницы`;
  return `${n} страниц`;
}

export default function FeedPage() {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function load(q: string, p = 1, append = false) {
    if (p === 1) setLoading(true); else setLoadingMore(true);
    try {
      const res = await fetch(`/api/feed?q=${encodeURIComponent(q)}&page=${p}`);
      const data = (await res.json()) as FeedResponse;
      setProfiles((prev) => (append ? [...prev, ...data.profiles] : data.profiles));
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => { load(""); }, []);

  function handleSearch(val: string) {
    setQuery(val);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load(val, 1), 350);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <Search className="h-4 w-4 flex-shrink-0 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Поиск мастеров и услуг…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        </div>
      ) : profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-700">
          <div className="text-4xl">✂️</div>
          <h2 className="mt-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {query ? "Ничего не найдено" : "Пока нет мастеров"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {query ? "Попробуйте другой запрос" : "Станьте первым — создайте свою страницу"}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-zinc-400">{pluralProfiles(total)}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((p) => {
              const badge = ROLE_BADGE[p.user.role];
              return (
                <Link
                  key={p.id}
                  href={p.subdomain ? `/${p.subdomain}` : "#"}
                  className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-violet-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-violet-700"
                >
                  <div className="flex items-center gap-3">
                    {p.avatarUrl ? (
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-lg font-bold text-white">
                        {p.name[0]?.toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-zinc-900 group-hover:text-violet-700 dark:text-zinc-100 dark:group-hover:text-violet-400">
                        {p.name}
                      </p>
                      {badge && (
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.cls}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 text-zinc-300 transition group-hover:text-violet-400" />
                  </div>
                  {p.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
                      {p.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>

          {page < pages && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => load(query, page + 1, true)}
                disabled={loadingMore}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {loadingMore ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                Загрузить ещё
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
