"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as { id?: string; email?: string | null; role?: string } | undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Профиль</h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">
            {user?.email?.[0]?.toUpperCase() ?? "?"}
          </span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              {user?.email ?? "—"}
            </p>
            <p className="text-sm text-zinc-500">{user?.role ?? "—"}</p>
            <p className="mt-0.5 text-xs text-zinc-400">ID: {user?.id ?? "—"}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-500">Расширенный профиль — скоро</p>
      </div>
    </div>
  );
}
