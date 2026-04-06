"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MessageCircle, Loader2 } from "lucide-react";

interface Props {
  recipientId: string;
}

export function StartChatButton({ recipientId }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }
    const myId = (session?.user as { id?: string })?.id;
    if (myId === recipientId) return;

    setLoading(true);
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId }),
    });
    if (res.ok) {
      const data = (await res.json()) as { data: { id: string } };
      router.push(`/chats/${data.data.id}`);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MessageCircle className="h-4 w-4" />
      )}
      Написать
    </button>
  );
}
