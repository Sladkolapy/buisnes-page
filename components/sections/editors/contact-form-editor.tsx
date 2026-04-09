"use client";

import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings; onChange: (s: SectionSettings) => void }
const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

export function ContactFormEditor({ settings, onChange }: Props) {
  function toggle(field: string) {
    onChange({ ...settings, [field]: !settings[field] });
  }

  const toggleCls = (on: boolean) =>
    `flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer transition ${on ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/20" : "border-zinc-200 text-zinc-500 dark:border-zinc-700"}`;

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Заголовок</label>
        <input className={inputCls} value={settings.title ?? ""} onChange={(e) => onChange({ ...settings, title: e.target.value })} placeholder="Свяжитесь с нами" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Текст над формой</label>
        <textarea className={`${inputCls} resize-none`} rows={2} value={settings.subtitle ?? ""} onChange={(e) => onChange({ ...settings, subtitle: e.target.value })} placeholder="Заполните форму, мы ответим в течение часа" />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-zinc-500">Поля формы</p>
        <div className="space-y-2">
          <button className={toggleCls(settings.showEmail)} onClick={() => toggle("showEmail")}>
            <span className={`h-4 w-4 rounded border flex items-center justify-center ${settings.showEmail ? "border-violet-500 bg-violet-600" : "border-zinc-300"}`}>
              {settings.showEmail && <span className="text-white text-[10px]">✓</span>}
            </span>
            Email
          </button>
          <button className={toggleCls(settings.showPhone)} onClick={() => toggle("showPhone")}>
            <span className={`h-4 w-4 rounded border flex items-center justify-center ${settings.showPhone ? "border-violet-500 bg-violet-600" : "border-zinc-300"}`}>
              {settings.showPhone && <span className="text-white text-[10px]">✓</span>}
            </span>
            Телефон
          </button>
          <button className={toggleCls(settings.showMessage)} onClick={() => toggle("showMessage")}>
            <span className={`h-4 w-4 rounded border flex items-center justify-center ${settings.showMessage ? "border-violet-500 bg-violet-600" : "border-zinc-300"}`}>
              {settings.showMessage && <span className="text-white text-[10px]">✓</span>}
            </span>
            Сообщение
          </button>
        </div>
      </div>
    </div>
  );
}
