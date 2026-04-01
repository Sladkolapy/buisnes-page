import type { NewsContent } from "@/core/shared/widget-types";

export function NewsWidget({ title, content }: { title: string; content: NewsContent }) {
  if (!content.title && !content.text) return null;
  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
      <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      {content.title && (
        <p className="font-medium text-zinc-900 dark:text-zinc-100">{content.title}</p>
      )}
      {content.text && (
        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {content.text}
        </p>
      )}
    </section>
  );
}
