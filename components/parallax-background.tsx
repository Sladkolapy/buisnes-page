"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

interface Props {
  imageUrl?: string | null;
  editable?: boolean;
  onUpdate?: (url: string) => void;
}

export function ParallaxBackground({ imageUrl, editable = false, onUpdate }: Props) {
  const [offsetY, setOffsetY] = useState(50);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useCloudinaryUpload("backgrounds");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload(file);
    if (result) onUpdate?.(result.secure_url);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "400px" }}>
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="background"
            className="absolute inset-0 h-full w-full object-cover transition-none"
            style={{ objectPosition: `center ${offsetY}%` }}
            draggable={false}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, transparent 40%, white 100%)",
            }}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
          {editable ? (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex flex-col items-center gap-2 text-zinc-400 hover:text-violet-600"
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <ImagePlus className="h-8 w-8" />
              )}
              <span className="text-sm">Добавить фоновое изображение</span>
            </button>
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-950" />
          )}
        </div>
      )}

      {editable && imageUrl && (
        <div className="absolute bottom-16 left-1/2 z-10 flex w-56 -translate-x-1/2 flex-col items-center gap-2">
          <span className="rounded-full bg-black/50 px-3 py-0.5 text-xs text-white">
            Положение фото
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={offsetY}
            onChange={(e) => setOffsetY(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs text-white hover:bg-black/70 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ImagePlus className="h-3 w-3" />
            )}
            Сменить фото
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFileChange(e)}
      />
    </div>
  );
}
