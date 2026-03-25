"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  { value: "CLIENT", label: "Клиент" },
  { value: "SOLO_MASTER", label: "Мастер (частный)" },
  { value: "BUSINESS_OWNER", label: "Владелец бизнеса" },
] as const;

export default function RegisterForm() {
  const router = useRouter();
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [role, setRole] = useState<string>("CLIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const body =
      tab === "email"
        ? { email: value, role }
        : { phone: value, role };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error ?? "Что-то пошло не так");
      return;
    }

    router.push("/sign-in");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
        <TabButton active={tab === "email"} onClick={() => setTab("email")}>
          Email
        </TabButton>
        <TabButton active={tab === "phone"} onClick={() => setTab("phone")}>
          Телефон
        </TabButton>
      </div>

      <input
        type={tab === "email" ? "email" : "tel"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={tab === "email" ? "you@example.com" : "+7 900 000 00 00"}
        required
        className="w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none ring-violet-500 transition focus:ring-2 dark:border-zinc-700"
      />

      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Кто вы?
        </label>
        <div className="space-y-2">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                role === r.value
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="accent-violet-600"
              />
              <span className="text-sm">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-violet-600 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
      >
        {loading ? "Регистрируем…" : "Зарегистрироваться"}
      </button>
    </form>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-md py-1 text-sm font-medium transition ${
        active
          ? "bg-violet-600 text-white shadow-sm"
          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}
