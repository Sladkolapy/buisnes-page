"use client";

import { SectionSettings } from "@/core/shared/section-types";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { ImagePlus, Loader2 } from "lucide-react";

interface Props { settings: SectionSettings; onChange: (s: SectionSettings) => void }

const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

export function TextWithImageEditor({ settings, onChange }: Props) {
  const { upload, uploading } = useCloudinaryUpload("portfolio");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload(file);
    if (result) onChange({ ...settings, imageUrl: result.secure_url });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Заголовок</label>
        <input className={inputCls} value={settings.title ?? ""} onChange={(e) => onChange({ ...settings, title: e.target.value })} placeholder="О нас" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Текст</label>
        <textarea className={`${inputCls} resize-none`} rows={4} value={settings.text ?? ""} onChange={(e) => onChange({ ...settings, text: e.target.value })} placeholder="Расскажите о себе…" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Позиция картинки</label>
        <select className={inputCls} value={settings.imagePosition ?? "right"} onChange={(e) => onChange({ ...settings, imagePosition: e.target.value })}>
          <option value="left">Слева</option>
          <option value="right">Справа</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Изображение</label>
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            Загрузить
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          {settings.imageUrl && (
            <div className="relative">
              <img src={settings.imageUrl} className="h-16 w-24 rounded-xl object-cover" alt="" />
              <button onClick={() => onChange({ ...settings, imageUrl: "" })} className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">×</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
