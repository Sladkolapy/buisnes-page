import { UserRole } from "@/core/shared/admin-types";

const CONFIG: Record<UserRole, { label: string; cls: string }> = {
  CLIENT:         { label: "Клиент",  cls: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" },
  SOLO_MASTER:    { label: "Мастер",  cls: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
  BUSINESS_OWNER: { label: "Бизнес",  cls: "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400" },
  ADMIN:          { label: "Админ",   cls: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400" },
};

export function UserRoleBadge({ role }: { role: UserRole }) {
  const { label, cls } = CONFIG[role] ?? { label: role, cls: "bg-zinc-100 text-zinc-600" };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
  );
}
