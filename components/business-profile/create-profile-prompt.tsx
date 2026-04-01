"use client";

import { Scissors, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateProfileModal } from "./create-profile-modal";

export function CreateProfilePrompt() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <div className="text-4xl">✂️</div>
            <h2 className="mt-3 text-xl font-bold text-zinc-900 dark:text-zinc-100">
              У вас пока нет страницы
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Создайте страницу, чтобы принимать клиентов и показывать свои работы
            </p>
          </div>

          <div className="grid gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="group flex items-center gap-4 rounded-2xl border-2 border-zinc-200 bg-white p-5 text-left transition hover:border-violet-400 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-violet-600 dark:hover:bg-violet-950/20"
            >
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition group-hover:bg-violet-200 dark:bg-violet-950/40 dark:text-violet-400">
                <Scissors className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Создать страницу
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Настройте профиль, добавьте услуги и виджеты
                </p>
              </div>
            </button>

            <Link
              href="/"
              className="group flex items-center gap-4 rounded-2xl border-2 border-zinc-200 bg-white p-5 text-left transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400">
                <Search className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Посмотреть услуги
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Найдите мастера в вашем городе
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <CreateProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
