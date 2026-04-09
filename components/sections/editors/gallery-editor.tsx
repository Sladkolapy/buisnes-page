"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { SectionSettings } from "@/core/shared/section-types";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

interface GalleryImage { id: string; url: string; alt?: string }
interface Props { settings: SectionSettings; onChange: (s: SectionSettings) => void }

const inputCls = "w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700";

function genId() { return `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

export function GalleryEditor({ settings, onChange }: Props) {
  const { upload, uploading } = useCloudinaryUpload("portfolio");
  const images: GalleryImage[] = settings.images ?? [];

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const results: GalleryImage[] = [];
    for (const file of files) {
      const result = await upload(file);
      if (result) results.push({ id: genId(), url: result.secure_url });
    }
    onChange({ ...settings, images: [...images, ...results] });
    e.target.value = "";
  }

  function remove(id: string) {
    onChange({ ...settings, images: images.filter((img) => img.id !== id) });
  }

  function updateAlt(id: string, alt: string) {
    onChange({ ...settings, images: images.map((img) => img.id === id ? { ...img, alt } : img) });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Заголовок</label>
        <input className={inputCls} value={settings.title ?? ""} onChange={(e) => onChange({ ...settings, title: e.target.value })} placeholder="Галерея работ" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500">Количество колонок</label>
        <select className={inputCls} value={settings.columns ?? 3} onChange={(e) => onChange({ ...settings, columns: Number(e.target.value) })}>
          <option value={2}>2 колонки</option>
          <option value={3}>3 колонки</option>
          <option value={4}>4 колонки</option>
        </select>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-500">Изображения ({images.length})</p>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-700">
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImagePlus className="h-3 w-3" />}
            Добавить
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {images.map((img) => (
            <div key={img.id} className="group relative">
              <img src={img.url} alt={img.alt ?? ""} className="h-20 w-full rounded-xl object-cover" />
              <button onClick={() => remove(img.id)}
                className="absolute right-1 top-1 hidden rounded-full bg-red-500 p-0.5 text-white group-hover:flex">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
