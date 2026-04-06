"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface ConvoItem {
  id: string;
  other: { id: string; name: string; avatar: string | null; subdomain: string | null };
  lastMessage: { text: string; createdAt: string } | null;
  updatedAt: string;
}

export default function ChatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [convos, setConvos] = useState<ConvoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/sign-in");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/chats")
      .then((r) => r.json())
      .then((d: { data: ConvoItem[] }) => { setConvos(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Чаты</h1>

      {convos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-700">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            <MessageCircle className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-zinc-800 dark:text-zinc-200">
            Нет сообщений
          </h2>
          <p className="mt-1 max-w-xs text-sm text-zinc-500">
            Найдите мастера и начните диалог прямо с его страницы
          </p>
          <Link
            href="/"
            className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            Найти мастера
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white divide-y divide-zinc-100 dark:divide-zinc-800 dark:border-zinc-700 dark:bg-zinc-900">
          {convos.map((c) => (
            <Link
              key={c.id}
              href={`/chats/${c.id}`}
              className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                {c.other.name[0]?.toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {c.other.name}
                </p>
                {c.lastMessage && (
                  <p className="truncate text-xs text-zinc-500">{c.lastMessage.text}</p>
                )}
              </div>
              {c.lastMessage && (
                <span className="flex-shrink-0 text-xs text-zinc-400">
                  {formatDistanceToNow(new Date(c.lastMessage.createdAt), { locale: ru, addSuffix: false })}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
