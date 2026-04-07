"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Globe, ExternalLink } from "lucide-react";
import { useBusinessProfileStore } from "@/stores/business-profile-store";
import { WidgetList } from "./widget-list";
import { ParallaxBackground } from "@/components/parallax-background";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

type Tab = "basic" | "widgets" | "publish";

interface BasicForm {
  name: string;
  description: string;
}

export function ProfileEditor() {
  const { profile, setProfile, saveProfile, isLoading } = useBusinessProfileStore();
  const [tab, setTab] = useState<Tab>("basic");
  const [saved, setSaved] = useState(false);
  const { upload: uploadAvatar, uploading: uploadingAvatar } = useCloudinaryUpload("avatars");

  const { register, handleSubmit } = useForm<BasicForm>({
    defaultValues: {
      name: profile?.name ?? "",
      description: profile?.description ?? "",
    },
  });

  if (!profile) return null;

  async function onBasicSubmit(data: BasicForm) {
    if (!profile) return;
    setProfile({ ...profile, name: data.name, description: data.description });
    await saveProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function togglePublish() {
    if (!profile) return;
    setProfile({ ...profile, isPublished: !profile.isPublished });
    await saveProfile();
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "basic", label: "Основное" },
    { key: "widgets", label: "Виджеты" },
    { key: "publish", label: "Публикация" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
          {profile.subdomain && (
            <a
              href={`/${profile.subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-sm text-violet-600 hover:underline"
            >
              <Globe className="h-3.5 w-3.5" />
              /{profile.subdomain}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            profile.isPublished
              ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          {profile.isPublished ? "Опубликовано" : "Черновик"}
        </span>
      </div>

      <div className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
              tab === key
                ? "bg-violet-600 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "basic" && (
        <form onSubmit={handleSubmit(onBasicSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Название / Имя
            </label>
            <input
              {...register("name", { required: true })}
              className="w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Описание
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full resize-none rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700"
              placeholder="Коротко о вас или вашем бизнесе…"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Аватар
            </label>
            <div className="flex items-center gap-4">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="avatar"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-600 dark:bg-violet-950/40">
                  {profile.name[0]?.toUpperCase()}
                </div>
              )}
              <label className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                {uploadingAvatar ? "Загружаем…" : "Загрузить фото"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingAvatar}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !profile) return;
                    const result = await uploadAvatar(file);
                    if (result) setProfile({ ...profile, avatarUrl: result.secure_url });
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Фоновое изображение страницы
            </label>
            <ParallaxBackground
              imageUrl={profile.backgroundUrl}
              editable
              onUpdate={async (url) => {
                if (!profile) return;
                setProfile({ ...profile, backgroundUrl: url });
                await saveProfile();
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saved ? "Сохранено!" : isLoading ? "Сохраняем…" : "Сохранить"}
          </button>
        </form>
      )}

      {tab === "widgets" && (
        <div className="space-y-4">
          <WidgetList />
          <button
            onClick={async () => {
              await saveProfile();
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saved ? "Сохранено!" : isLoading ? "Сохраняем…" : "Сохранить виджеты"}
          </button>
        </div>
      )}

      {tab === "publish" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {profile.isPublished ? "Страница опубликована" : "Страница не опубликована"}
                </p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {profile.isPublished
                    ? "Клиенты могут найти вас по ссылке"
                    : "Страница доступна только вам"}
                </p>
              </div>
              <button
                onClick={togglePublish}
                disabled={isLoading}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  profile.isPublished
                    ? "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                    : "bg-violet-600 text-white hover:bg-violet-700"
                } disabled:opacity-50`}
              >
                {profile.isPublished ? "Снять с публикации" : "Опубликовать"}
              </button>
            </div>
          </div>

          {profile.subdomain && (
            <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Ссылка на вашу страницу
              </p>
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                <span className="flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {typeof window !== "undefined" ? window.location.origin : ""}/{profile.subdomain}
                </span>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/${profile.subdomain}`,
                    )
                  }
                  className="text-xs text-violet-600 hover:underline"
                >
                  Копировать
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
