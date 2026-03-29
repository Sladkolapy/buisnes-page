"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const body = tab === "email" ? { email: value } : { phone: value };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setLoading(false);
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error ?? "Что-то пошло не так");
      return;
    }

    const result = await signIn("credentials", {
      ...body,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      router.push("/sign-in");
      return;
    }

    router.push("/welcome");
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

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-violet-600 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
      >
        {loading ? "Создаём аккаунт…" : "Зарегистрироваться"}
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
