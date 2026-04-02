"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import { X, Scissors, Building2, Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useBusinessProfileStore } from "@/stores/business-profile-store";
import { useCategories } from "@/hooks/use-categories";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS = [
  { value: "SOLO_MASTER",    label: "Частный мастер", desc: "Фрилансер, работаю на себя", icon: Scissors },
  { value: "BUSINESS_OWNER", label: "Бизнес / Салон",  desc: "У меня команда или салон",   icon: Building2 },
] as const;

export function CreateProfileModal({ open, onClose }: Props) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const { createProfile, isLoading } = useBusinessProfileStore();
  const { categoriesTree } = useCategories();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"SOLO_MASTER" | "BUSINESS_OWNER">("SOLO_MASTER");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function toggleSub(id: string) {
    setSelectedSubs((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
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

  function handleClose() {
    setStep(1);
    setName("");
    setDescription("");
    setSelectedSubs([]);
    setError(null);
    onClose();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              <Dialog.Title className="text-lg font-semibold">
                {step === 1 ? "Создать страницу" : "Выберите специализацию"}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Step indicator */}
          <div className="mt-3 flex gap-1.5">
            {([1, 2] as const).map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition ${
                  s <= step ? "bg-violet-600" : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              />
            ))}
          </div>

          {step === 1 ? (
            <div className="mt-5 space-y-4">
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

              <button
                type="button"
                disabled={!name.trim()}
                onClick={() => setStep(2)}
                className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                Далее
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <p className="text-xs text-zinc-500">
                Выберите подкатегории, которые лучше всего описывают ваши услуги
              </p>

              <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                {categoriesTree.map((root) => (
                  <div key={root.id}>
                    <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                      {root.icon && <span>{root.icon}</span>}
                      {root.name}
                    </p>
                    <div className="space-y-1 pl-2">
                      {root.children.map((sub) => (
                        <label
                          key={sub.id}
                          className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        >
                          <Checkbox.Root
                            checked={selectedSubs.includes(sub.id)}
                            onCheckedChange={() => toggleSub(sub.id)}
                            className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-zinc-300 bg-white transition data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 dark:border-zinc-600 dark:bg-zinc-800"
                          >
                            <Checkbox.Indicator>
                              <Check className="h-3 w-3 text-white" />
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                          {sub.icon && <span className="text-sm">{sub.icon}</span>}
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">{sub.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedSubs.length > 0 && (
                <p className="text-xs text-violet-600">
                  Выбрано: {selectedSubs.length}
                </p>
              )}

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                {isLoading ? "Создаём…" : "Создать страницу"}
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
