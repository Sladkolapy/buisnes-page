import type { SocialContent } from "@/core/shared/widget-types";

const SOCIALS: {
  key: keyof SocialContent;
  label: string;
  color: string;
  icon: string;
}[] = [
  { key: "instagram", label: "Instagram", color: "bg-pink-100 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400", icon: "📷" },
  { key: "telegram", label: "Telegram", color: "bg-sky-100 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400", icon: "✈️" },
  { key: "vk", label: "ВКонтакте", color: "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400", icon: "🔵" },
  { key: "whatsapp", label: "WhatsApp", color: "bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400", icon: "💬" },
];

export function SocialWidget({ title, content }: { title: string; content: SocialContent }) {
  const links = SOCIALS.filter((s) => content[s.key]);
  if (!links.length) return null;

  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
      <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {links.map(({ key, label, color, icon }) => (
          <a
            key={key}
            href={content[key]}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:opacity-80 ${color}`}
          >
            <span>{icon}</span>
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}
