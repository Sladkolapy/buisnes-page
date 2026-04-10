"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, Loader2, Globe, ExternalLink, Copy } from "lucide-react";
import { useBusinessProfileStore } from "@/stores/business-profile-store";

const SUBDOMAIN_RE = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

type CheckStatus = "idle" | "checking" | "free" | "taken" | "own" | "invalid" | "reserved";

function slugify(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const STATUS_UI: Record<CheckStatus, { color: string; text: string; icon?: React.ReactNode }> = {
  idle:     { color: "text-zinc-400", text: "" },
  checking: { color: "text-zinc-400", text: "Проверяем…", icon: <Loader2 className="h-4 w-4 animate-spin" /> },
  free:     { color: "text-green-600 dark:text-green-400", text: "Поддомен свободен", icon: <CheckCircle2 className="h-4 w-4" /> },
  own:      { color: "text-green-600 dark:text-green-400", text: "Это ваш текущий поддомен", icon: <CheckCircle2 className="h-4 w-4" /> },
  taken:    { color: "text-red-500", text: "Уже занят", icon: <XCircle className="h-4 w-4" /> },
  invalid:  { color: "text-amber-500", text: "Только буквы, цифры и дефис, минимум 3 символа", icon: <XCircle className="h-4 w-4" /> },
  reserved: { color: "text-red-500", text: "Зарезервированное слово", icon: <XCircle className="h-4 w-4" /> },
};

export function SubdomainEditor() {
  const { profile, setProfile, saveProfile, isLoading } = useBusinessProfileStore();
  const [value, setValue] = useState(profile?.subdomain ?? "");
  const [status, setStatus] = useState<CheckStatus>("idle");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://example.com";
  const previewUrl = value ? `${origin}/${value}` : null;

  useEffect(() => {
    if (profile?.subdomain) setValue(profile.subdomain);
  }, [profile?.subdomain]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = value.trim();

    if (!trimmed) { setStatus("idle"); return; }
    if (!SUBDOMAIN_RE.test(trimmed)) { setStatus("invalid"); return; }

    setStatus("checking");
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/business-profile/subdomain?value=${encodeURIComponent(trimmed)}`);
        const data = (await res.json()) as { available: boolean; valid: boolean; reason: string };
        if (!data.valid) { setStatus(data.reason === "reserved" ? "reserved" : "invalid"); return; }
        setStatus(data.reason === "own" ? "own" : data.available ? "free" : "taken");
      } catch { setStatus("idle"); }
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [value]);

  const canSave = (status === "free" || status === "own") && value !== profile?.subdomain;

  async function handleSave() {
    if (!canSave || !profile) return;
    setSaving(true);
    try {
      const res = await fetch("/api/business-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain: value.trim() }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setStatus("taken");
        setSaving(false);
        return;
      }
      const updated = (await res.json()) as typeof profile;
      setProfile(updated);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch {
      setStatus("taken");
    } finally {
      setSaving(false);
    }
  }

  function handleCopy() {
    if (!previewUrl) return;
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const { color, text, icon } = STATUS_UI[status];

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-violet-600" />
        <p className="font-medium text-zinc-900 dark:text-zinc-100">Адрес вашей страницы</p>
      </div>

      <p className="text-sm text-zinc-500">
        Придумайте уникальный адрес — только латинские буквы, цифры и дефис (минимум 3 символа).
      </p>

      {/* Input row */}
      <div className="flex items-center gap-0 overflow-hidden rounded-xl border border-zinc-200 focus-within:ring-2 focus-within:ring-violet-500 dark:border-zinc-700">
        <span className="shrink-0 select-none border-r border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
          {origin}/
        </span>
        <input
          value={value}
          onChange={(e) => setValue(slugify(e.target.value))}
          placeholder="my-salon"
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Status */}
      {status !== "idle" && (
        <div className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
          {icon}
          {text}
        </div>
      )}

      {/* Preview link */}
      {previewUrl && (status === "free" || status === "own") && (
        <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
          <span className="flex-1 truncate text-zinc-600 dark:text-zinc-400">{previewUrl}</span>
          <button onClick={handleCopy} className="shrink-0 text-xs text-violet-600 hover:underline">
            {copied ? "Скопировано!" : <Copy className="h-3.5 w-3.5" />}
          </button>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-zinc-400 hover:text-zinc-700">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!canSave || saving || isLoading}
        className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-40"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
        {savedMsg ? "Сохранено!" : "Сохранить адрес"}
      </button>

      <p className="text-xs text-zinc-400">
        После сохранения страница будет доступна по новому адресу. Старые ссылки перестанут работать.
      </p>
    </div>
  );
}
