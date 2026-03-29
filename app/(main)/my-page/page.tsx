"use client";

import { LayoutGrid } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MASTER_ROLES = ["SOLO_MASTER", "BUSINESS_OWNER"];

export default function MyPagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as { role?: string })?.role ?? "";

  useEffect(() => {
    if (status === "authenticated" && !MASTER_ROLES.includes(role)) {
      router.replace("/");
    }
  }, [status, role, router]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Моя страница</h1>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-700">
        <LayoutGrid className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
        <h2 className="mt-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Конструктор страницы
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Здесь вы сможете настроить свою бизнес-страницу
        </p>
        <span className="mt-4 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-400">
          Скоро
        </span>
      </div>
    </div>
  );
}
