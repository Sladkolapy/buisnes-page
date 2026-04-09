"use client";

import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings; onChange: (s: SectionSettings) => void }
const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

const NETWORKS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { key: "telegram", label: "Telegram", placeholder: "https://t.me/username" },
  { key: "vk", label: "ВКонтакте", placeholder: "https://vk.com/username" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/79991234567" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
];

export function SocialLinksEditor({ settings, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Заголовок</label>
        <input className={inputCls} value={settings.title ?? ""} onChange={(e) => onChange({ ...settings, title: e.target.value })} placeholder="Мы в соцсетях" />
      </div>
      {NETWORKS.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="mb-1 block text-xs text-zinc-500">{label}</label>
          <input className={inputCls} value={settings[key] ?? ""} onChange={(e) => onChange({ ...settings, [key]: e.target.value })} placeholder={placeholder} />
        </div>
      ))}
    </div>
  );
}
