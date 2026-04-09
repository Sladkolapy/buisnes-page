"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, User, Plus, Search, Shield, CalendarDays, LayoutTemplate } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CreateProfileModal } from "@/components/business-profile/create-profile-modal";
import { useBusinessProfileStore } from "@/stores/business-profile-store";

function Avatar({ email }: { email?: string | null }) {
  const initials = email ? email[0].toUpperCase() : "?";
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white select-none">
      {initials}
    </span>
  );
}

export function Header() {
  const { data: session, status } = useSession();
  const { profile, fetchProfile } = useBusinessProfileStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const role = (session?.user as { role?: string })?.role;
  const isAuth = status === "authenticated";

  useEffect(() => {
    if (isAuth) fetchProfile();
  }, [isAuth, fetchProfile]);

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center border-b border-zinc-200 bg-white/80 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Beauty Platform
        </Link>

        <div className="flex-1" />

        <nav className="hidden items-center gap-2 sm:flex">
          {role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Shield className="h-4 w-4" />
              Админ
            </Link>
          )}
          {isAuth && !profile && (
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Search className="h-4 w-4" />
              Посмотреть услуги
            </Link>
          )}
          {isAuth && (
            profile ? (
              <>
              <Link
                href="/my-business"
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <CalendarDays className="h-4 w-4" />
                Записи
              </Link>
              <Link
                href="/my-page"
                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                <LayoutTemplate className="h-4 w-4" />
                Моя страница
              </Link>
              </>
            ) : (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                <Plus className="h-4 w-4" />
                Создать страницу
              </button>
            )
          )}
        </nav>

        <ThemeToggle />

        {isAuth ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="cursor-pointer outline-none">
                <Avatar email={session!.user?.email} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 min-w-[180px] rounded-xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="px-3 py-2">
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {session!.user?.email}
                  </p>
                  <p className="text-xs text-zinc-500">{role}</p>
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-zinc-200 dark:bg-zinc-700" />
                <DropdownMenu.Item asChild>
                  <Link
                    href="/profile"
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 outline-none hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <User className="h-4 w-4" />
                    Профиль
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => signOut({ callbackUrl: "/sign-in" })}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 outline-none hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Войти
          </Link>
        )}
      </div>

      <CreateProfileModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </header>
  );
}
