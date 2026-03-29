"use client";

import { Scissors, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function WelcomePage() {
  const { data: session } = useSession();
  const firstName = session?.user?.email?.split("@")[0] ?? "вас";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <div className="text-4xl">👋</div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Добро пожаловать, {firstName}!
          </h1>
          <p className="text-sm text-zinc-500">
            Расскажите, как вы планируете использовать платформу
          </p>
        </div>

        <div className="grid gap-3">
          <Link
            href="/my-page/create"
            className="group flex items-center gap-4 rounded-2xl border-2 border-zinc-200 bg-white p-5 text-left transition hover:border-violet-400 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-violet-600 dark:hover:bg-violet-950/20"
          >
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition group-hover:bg-violet-200 dark:bg-violet-950/40 dark:text-violet-400">
              <Scissors className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                Я мастер или владею бизнесом
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Создам свою страницу, добавлю услуги и приму запись
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="group flex items-center gap-4 rounded-2xl border-2 border-zinc-200 bg-white p-5 text-left transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400">
              <Search className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                Посмотреть существующие услуги
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Найду мастера и запишусь на услугу
              </p>
            </div>
          </Link>
        </div>

        <p className="text-xs text-zinc-400">
          Это можно изменить позже в настройках профиля
        </p>
      </div>
    </div>
  );
}
