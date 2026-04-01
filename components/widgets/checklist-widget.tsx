import { Check } from "lucide-react";
import type { ChecklistContent } from "@/core/shared/widget-types";

export function ChecklistWidget({
  title,
  content,
}: {
  title: string;
  content: ChecklistContent;
}) {
  if (!content.items?.length) return null;
  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
      <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <ul className="space-y-2">
        {content.items.map((item) => (
          <li key={item.id} className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950/40">
              <Check className="h-3 w-3 text-violet-600 dark:text-violet-400" />
            </span>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
