"use client";

import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings; onChange: (s: SectionSettings) => void }
const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

export function MapEditor({ settings, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Заголовок</label>
        <input className={inputCls} value={settings.title ?? ""} onChange={(e) => onChange({ ...settings, title: e.target.value })} placeholder="Как нас найти" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Адрес</label>
        <input className={inputCls} value={settings.address ?? ""} onChange={(e) => onChange({ ...settings, address: e.target.value })} placeholder="Москва, ул. Примерная, 1" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Широта (необязательно)</label>
          <input type="number" step="any" className={inputCls} value={settings.lat ?? ""} onChange={(e) => onChange({ ...settings, lat: Number(e.target.value) })} placeholder="55.751244" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Долгота (необязательно)</label>
          <input type="number" step="any" className={inputCls} value={settings.lng ?? ""} onChange={(e) => onChange({ ...settings, lng: Number(e.target.value) })} placeholder="37.618423" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Масштаб карты (1–17)</label>
        <input type="number" min={1} max={17} className={inputCls} value={settings.zoom ?? 14} onChange={(e) => onChange({ ...settings, zoom: Number(e.target.value) })} />
      </div>
      <p className="text-xs text-zinc-400">Карта строится по адресу через Яндекс.Карты</p>
    </div>
  );
}
