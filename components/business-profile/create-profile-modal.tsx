"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Scissors, Building2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useBusinessProfileStore } from "@/stores/business-profile-store";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS = [
  {
    value: "SOLO_MASTER",
    label: "Частный мастер",
    desc: "Фрилансер, работаю на себя",
    icon: Scissors,
  },
  {
    value: "BUSINESS_OWNER",
    label: "Бизнес / Салон",
    desc: "У меня команда или салон",
    icon: Building2,
  },
] as const;

export function CreateProfileModal({ open, onClose }: Props) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const { createProfile, isLoading } = useBusinessProfileStore();
  const [role, setRole] = useState<"SOLO_MASTER" | "BUSINESS_OWNER">("SOLO_MASTER");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createProfile({ name, description: description || undefined, role });
      await updateSession();
      onClose();
      router.push("/my-page");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">Создать страницу</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map(({ value, label, desc, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition ${
                    role === value
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                      : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${role === value ? "text-violet-600" : "text-zinc-400"}`} />
                  <span className="text-sm font-semibold leading-tight">{label}</span>
                  <span className="text-xs text-zinc-500">{desc}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {role === "SOLO_MASTER" ? "Ваше имя" : "Название салона / бизнеса"}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "SOLO_MASTER" ? "Анна Козлова" : "Beauty Studio"}
                required
                className="w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 transition focus:ring-2 dark:border-zinc-700"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Описание <span className="text-zinc-400">(опционально)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Коротко о себе или о вашем бизнесе…"
                rows={3}
                className="w-full resize-none rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 transition focus:ring-2 dark:border-zinc-700"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              {isLoading ? "Создаём…" : "Создать страницу"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
