"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { SkeletonCategories } from "@/components/ui/skeleton-categories";

interface CategorySelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { categories, loading } = useCategories();

  if (loading) return <SkeletonCategories />;

  return (
    <Select.Root
      value={value ?? "all"}
      onValueChange={(v) => onChange(v === "all" ? null : v)}
    >
      <Select.Trigger className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
        <Select.Value>
          {value
            ? (categories.find((c) => c.id === value)?.icon ?? "") +
              " " +
              (categories.find((c) => c.id === value)?.name ?? "")
            : "Все категории"}
        </Select.Value>
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-50 min-w-[200px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          <Select.Viewport className="p-1">
            <SelectItem value="all" label="Все категории" icon={null} />
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} label={cat.name} icon={cat.icon} />
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function SelectItem({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: string | null;
}) {
  return (
    <Select.Item
      value={value}
      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 outline-none hover:bg-violet-50 data-[highlighted]:bg-violet-50 dark:text-zinc-300 dark:hover:bg-violet-950/30 dark:data-[highlighted]:bg-violet-950/30"
    >
      {icon && <span>{icon}</span>}
      <Select.ItemText>{label}</Select.ItemText>
      <Select.ItemIndicator className="ml-auto">
        <Check className="h-4 w-4 text-violet-600" />
      </Select.ItemIndicator>
    </Select.Item>
  );
}
