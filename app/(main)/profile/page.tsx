"use client";

import { ExternalLink, Copy, Check, Pencil, Camera, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useBusinessProfileStore } from "@/stores/business-profile-store";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

const ROLE_LABELS: Record<string, string> = {
  CLIENT: "Клиент",
  SOLO_MASTER: "Мастер",
  BUSINESS_OWNER: "Владелец бизнеса",
  ADMIN: "Администратор",
};

interface UserProfile {
  name: string | null;
  avatarUrl: string | null;
  email: string | null;
  phone: string | null;
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const { profile, fetchProfile } = useBusinessProfileStore();
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [savingName, setSavingName] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const { upload: uploadToCloud, uploading: uploadingAvatar } = useCloudinaryUpload("avatars");

  const user = session?.user as {
    id?: string; email?: string | null; phone?: string | null; role?: string;
    name?: string | null; avatarUrl?: string | null;
  } | undefined;

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d: { data: UserProfile }) => setUserProfile(d.data))
      .catch(() => null);
  }, []);

  function copyId() {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  function openNameEdit() {
    setNameValue(userProfile?.name ?? user?.name ?? "");
    setEditingName(true);
  }

  async function saveName() {
    setSavingName(true);
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameValue.trim() }),
    });
    if (res.ok) {
      const data = (await res.json()) as { data: { name: string | null } };
      setUserProfile((p) => p ? { ...p, name: data.data.name } : p);
      await updateSession();
      setEditingName(false);
    }
    setSavingName(false);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadToCloud(file);
    if (result) {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: result.secure_url }),
      });
      if (res.ok) {
        setUserProfile((p) => p ? { ...p, avatarUrl: result.secure_url } : p);
        await updateSession();
      }
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  const displayName = userProfile?.name ?? user?.name ?? null;
  const avatarUrl = userProfile?.avatarUrl ?? user?.avatarUrl ?? null;
  const initials = displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Профиль</h1>

      {/* Avatar + Name card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-violet-600">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                  {initials}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-60 dark:border-zinc-900"
            >
              {uploadingAvatar ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name + meta */}
          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") void saveName(); if (e.key === "Escape") setEditingName(false); }}
                  className="flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <button
                  onClick={() => void saveName()}
                  disabled={savingName || !nameValue.trim()}
                  className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {savingName ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                </button>
                <button onClick={() => setEditingName(false)} className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {displayName ?? <span className="text-zinc-400">Имя не указано</span>}
                </p>
                <button
                  onClick={openNameEdit}
                  className="rounded p-0.5 text-zinc-400 hover:text-violet-600"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <p className="mt-0.5 text-sm text-zinc-500">{ROLE_LABELS[user?.role ?? ""] ?? "—"}</p>
            <p className="text-xs text-zinc-400">{user?.email ?? user?.phone ?? ""}</p>
            <button
              onClick={copyId}
              className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {user?.id?.slice(0, 16)}…
            </button>
          </div>
        </div>
      </div>

      {/* Business page card */}
      {profile && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Бизнес-страница</p>
              <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{profile.name}</p>
              {profile.subdomain && (
                <p className="text-xs text-zinc-500">/{profile.subdomain}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {profile.subdomain && profile.isPublished && (
                <a
                  href={`/${profile.subdomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Открыть
                </a>
              )}
              <Link
                href="/my-page"
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700"
              >
                Редактировать
              </Link>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${profile.isPublished ? "bg-green-500" : "bg-zinc-400"}`} />
            <span className="text-xs text-zinc-500">{profile.isPublished ? "Опубликовано" : "Черновик"}</span>
            <span className="text-xs text-zinc-300 dark:text-zinc-600">·</span>
            <span className="text-xs text-zinc-500">{profile.widgets.length} виджетов</span>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Безопасность</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Сессия</p>
            <p className="text-xs text-zinc-500">JWT · активна</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Активна
          </span>
        </div>
      </div>
    </div>
  );
}
