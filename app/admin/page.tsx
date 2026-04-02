"use client";

import { Shield, Ban, CheckCircle, ExternalLink, Tags } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserRow {
  id: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
  blockReason: string | null;
  createdAt: string;
  businessProfile: {
    id: string;
    name: string;
    subdomain: string | null;
    isPublished: boolean;
  } | null;
}

const ROLE_LABELS: Record<string, string> = {
  CLIENT: "Клиент",
  SOLO_MASTER: "Мастер",
  BUSINESS_OWNER: "Бизнес",
  ADMIN: "Админ",
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [blockingId, setBlockingId] = useState<string | null>(null);

  const role = (session?.user as { role?: string })?.role;

  useEffect(() => {
    if (status === "authenticated" && role !== "ADMIN") router.replace("/");
  }, [status, role, router]);

  useEffect(() => {
    if (role !== "ADMIN") return;
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        setUsers(d as UserRow[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [role]);

  async function handleAction(userId: string, action: "block" | "unblock", reason?: string) {
    setActionLoading(userId);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });
    if (res.ok) {
      const updated = (await res.json()) as {
        id: string;
        status: string;
        blockReason: string | null;
      };
      setUsers((prev) =>
        prev.map((u) =>
          u.id === updated.id
            ? { ...u, status: updated.status, blockReason: updated.blockReason }
            : u,
        ),
      );
    }
    setActionLoading(null);
    setBlockingId(null);
    setBlockReason("");
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-violet-600" />
          <h1 className="text-2xl font-bold tracking-tight">Панель администратора</h1>
        </div>
        <Link
          href="/admin/categories"
          className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-100 dark:border-violet-800/40 dark:bg-violet-950/20 dark:text-violet-400 dark:hover:bg-violet-950/30"
        >
          <Tags className="h-4 w-4" />
          Управление категориями
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["CLIENT", "SOLO_MASTER", "BUSINESS_OWNER", "ADMIN"] as const).map((r) => {
          const count = users.filter((u) => u.role === r).length;
          return (
            <div
              key={r}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{count}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{ROLE_LABELS[r]}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Пользователь
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Роль
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Статус
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Страница
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {user.email ?? user.phone}
                    </p>
                    <p className="text-xs text-zinc-400">{user.id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium dark:bg-zinc-800">
                      {ROLE_LABELS[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      }`}
                    >
                      {user.status === "ACTIVE" ? "Активен" : "Заблокирован"}
                    </span>
                    {user.blockReason && (
                      <p className="mt-0.5 text-xs text-zinc-400">{user.blockReason}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.businessProfile ? (
                      user.businessProfile.subdomain ? (
                        <a
                          href={`/${user.businessProfile.subdomain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-violet-600 hover:underline"
                        >
                          {user.businessProfile.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-500">{user.businessProfile.name}</span>
                      )
                    ) : (
                      <span className="text-xs text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== "ADMIN" &&
                      (user.status === "ACTIVE" ? (
                        blockingId === user.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={blockReason}
                              onChange={(e) => setBlockReason(e.target.value)}
                              placeholder="Причина…"
                              className="w-32 rounded-lg border border-zinc-200 px-2 py-1 text-xs outline-none ring-red-400 focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800"
                            />
                            <button
                              onClick={() =>
                                handleAction(user.id, "block", blockReason || undefined)
                              }
                              disabled={actionLoading === user.id}
                              className="rounded-lg bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                            >
                              OK
                            </button>
                            <button
                              onClick={() => setBlockingId(null)}
                              className="text-xs text-zinc-400 hover:text-zinc-600"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setBlockingId(user.id)}
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Заблокировать
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleAction(user.id, "unblock")}
                          disabled={actionLoading === user.id}
                          className="flex items-center gap-1 rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-green-50 disabled:opacity-50 dark:border-green-900 dark:hover:bg-green-950/30"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Разблокировать
                        </button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
