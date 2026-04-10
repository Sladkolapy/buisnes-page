import { ReportStatus, UserStatus } from "@/core/shared/admin-types";

type Status = ReportStatus | UserStatus;

const CONFIG: Record<Status, { label: string; cls: string }> = {
  ACTIVE:   { label: "Активен",  cls: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
  BLOCKED:  { label: "Заблок.",  cls: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400" },
  pending:  { label: "Ожидает",  cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" },
  resolved: { label: "Решено",   cls: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
  rejected: { label: "Отклонено",cls: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, cls } = CONFIG[status] ?? { label: status, cls: "bg-zinc-100 text-zinc-600" };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
  );
}
