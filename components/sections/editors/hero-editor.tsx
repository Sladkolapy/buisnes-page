"use client";

import { SectionSettings } from "@/core/shared/section-types";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { ImagePlus, Loader2 } from "lucide-react";

interface Props { settings: SectionSettings; onChange: (s: SectionSettings) => void }

const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

export function HeroEditor({ settings, onChange }: Props) {
  const { upload, uploading } = useCloudinaryUpload("backgrounds");

  async function handleBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload(file);
    if (result) onChange({ ...settings, bgImageUrl: result.secure_url });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Заголовок</label>
        <input className={inputCls} value={settings.title ?? ""} onChange={(e) => onChange({ ...settings, title: e.target.value })} placeholder="Добро пожаловать!" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Подзаголовок</label>
        <textarea className={`${inputCls} resize-none`} rows={2} value={settings.subtitle ?? ""} onChange={(e) => onChange({ ...settings, subtitle: e.target.value })} placeholder="Профессиональные услуги для вас" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Цвет фона</label>
          <div className="flex items-center gap-2">
            <input type="color" value={settings.bgColor ?? "#7c3aed"} onChange={(e) => onChange({ ...settings, bgColor: e.target.value })} className="h-9 w-12 cursor-pointer rounded-lg border border-zinc-200" />
            <input className={`${inputCls} flex-1`} value={settings.bgColor ?? "#7c3aed"} onChange={(e) => onChange({ ...settings, bgColor: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Цвет текста</label>
          <div className="flex items-center gap-2">
            <input type="color" value={settings.textColor ?? "#ffffff"} onChange={(e) => onChange({ ...settings, textColor: e.target.value })} className="h-9 w-12 cursor-pointer rounded-lg border border-zinc-200" />
            <input className={`${inputCls} flex-1`} value={settings.textColor ?? "#ffffff"} onChange={(e) => onChange({ ...settings, textColor: e.target.value })} />
          </div>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Фоновое изображение</label>
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            Загрузить
            <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
          </label>
          {settings.bgImageUrl && (
            <div className="relative">
              <img src={settings.bgImageUrl} className="h-9 w-16 rounded-lg object-cover" alt="" />
              <button onClick={() => onChange({ ...settings, bgImageUrl: "" })} className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">×</button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Текст кнопки</label>
          <input className={inputCls} value={settings.buttonText ?? ""} onChange={(e) => onChange({ ...settings, buttonText: e.target.value })} placeholder="Записаться" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Ссылка кнопки</label>
          <input className={inputCls} value={settings.buttonUrl ?? ""} onChange={(e) => onChange({ ...settings, buttonUrl: e.target.value })} placeholder="#booking" />
        </div>
      </div>
    </div>
  );
}
