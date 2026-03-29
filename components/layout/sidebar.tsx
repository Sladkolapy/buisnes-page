"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { Settings, X, Mail, LayoutGrid } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

const MASTER_ROLES = ["SOLO_MASTER", "BUSINESS_OWNER"];

export function Sidebar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const role = (session?.user as { role?: string })?.role ?? "";
  const email = session?.user?.email ?? "";
  const initials = email ? email[0].toUpperCase() : "?";
  const isMaster = MASTER_ROLES.includes(role);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="fixed bottom-24 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:bottom-6"
          aria-label="Настройки"
        >
          <Settings className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l border-zinc-200 bg-white shadow-xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
            <Dialog.Title className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Настройки
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-lg p-1 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
            {session?.user && (
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-lg font-bold text-white">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {email || "Без email"}
                  </p>
                  <p className="text-xs text-zinc-500">{role}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Внешний вид
              </p>
              {mounted && (
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-700">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    Тёмная тема
                  </span>
                  <Switch.Root
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                    className="relative h-6 w-11 cursor-pointer rounded-full bg-zinc-300 transition data-[state=checked]:bg-violet-600 dark:bg-zinc-600"
                  >
                    <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[22px]" />
                  </Switch.Root>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Аккаунт
              </p>

              <button className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <Mail className="h-4 w-4 text-zinc-400" />
                {email ? "Изменить почту" : "Привязать почту"}
              </button>

              {isMaster && (
                <Dialog.Close asChild>
                  <Link
                    href="/my-page"
                    className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-400 dark:hover:bg-violet-950/50"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Моя страница
                  </Link>
                </Dialog.Close>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
