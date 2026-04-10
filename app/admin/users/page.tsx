"use client";

import { useState, useMemo } from "react";
import { Users, Search, Trash2, Ban, CheckCircle } from "lucide-react";
import { useAdminData } from "@/hooks/use-admin-data";
import { useAdminStore } from "@/stores/admin-store";
import { UserRoleBadge } from "@/components/admin/user-role-badge";
import { StatusBadge } from "@/components/admin/status-badge";
import { UserRole, UserStatus } from "@/core/shared/admin-types";

type RoleFilter = "all" | UserRole;
type StatusFilter = "all" | UserStatus;

const ROLE_OPTIONS: { key: RoleFilter; label: string }[] = [
  { key: "all", label: "Все роли" },
  { key: "CLIENT", label: "Клиенты" },
  { key: "SOLO_MASTER", label: "Мастера" },
  { key: "BUSINESS_OWNER", label: "Бизнесы" },
];

export default function UsersPage() {
  useAdminData();
  const { users, blockUser, unblockUser, deleteUser, changeUserRole } = useAdminStore();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Пользователи</h1>
          <p className="text-sm text-zinc-500">{users.length} всего, {users.filter((u) => u.status === "BLOCKED").length} заблокировано</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 py-2 pl-9 pr-4 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Поиск по email или имени…" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900">
          {ROLE_OPTIONS.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900">
          <option value="all">Все статусы</option>
          <option value="ACTIVE">Активные</option>
          <option value="BLOCKED">Заблокированные</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                {["Пользователь", "Роль", "Статус", "Регистрация", "Активность", "Действия"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((u) => (
                <tr key={u.id} className="bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">{u.name}</p>
                        <p className="text-xs text-zinc-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select value={u.role} onChange={(e) => changeUserRole(u.id, e.target.value as UserRole)}
                      className="rounded-lg border-0 bg-transparent text-xs outline-none">
                      <option value="CLIENT">Клиент</option>
                      <option value="SOLO_MASTER">Мастер</option>
                      <option value="BUSINESS_OWNER">Бизнес</option>
                      <option value="ADMIN">Админ</option>
                    </select>
                    <UserRoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{u.createdAt}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{u.lastActive}</td>
                  <td className="px-4 py-3">
                    {u.role !== "ADMIN" && (
                      <div className="flex items-center gap-1">
                        {u.status === "ACTIVE" ? (
                          <button onClick={() => blockUser(u.id)} title="Заблокировать"
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20">
                            <Ban className="h-4 w-4" />
                          </button>
                        ) : (
                          <button onClick={() => unblockUser(u.id)} title="Разблокировать"
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/20">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => { if (confirm(`Удалить ${u.name}?`)) deleteUser(u.id); }} title="Удалить"
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-400">Нет пользователей по заданным фильтрам</p>
        )}
      </div>
    </div>
  );
}
