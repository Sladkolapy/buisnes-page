"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useAblyChannel } from "@/hooks/use-ably-channel";
import type Ably from "ably";

interface Msg {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  createdAt: string;
}

interface ConvoInfo {
  id: string;
  other: { id: string; name: string; avatar: string | null };
}

const CARD_RE = /\d[\d\s\-]{14,}\d/;

export default function ChatRoomPage() {
  const { data: session, status } = useSession();
  const myId = (session?.user as { id?: string })?.id;
  const router = useRouter();
  const params = useParams();
  const convoId = params.id as string;

  const [convo, setConvo] = useState<ConvoInfo | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [cardWarning, setCardWarning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/sign-in");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/chats").then((r) => r.json()),
      fetch(`/api/chats/${convoId}/messages`).then((r) => r.json()),
    ]).then(([convos, msgs]) => {
      const found = (convos as { data: ConvoInfo[] }).data.find((c) => c.id === convoId);
      setConvo(found ?? null);
      setMessages((msgs as { data: Msg[] }).data);
      setLoading(false);
    });
  }, [status, convoId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useAblyChannel(`chat:${convoId}`, "message", (msg: Ably.Message) => {
    const data = msg.data as Msg;
    setMessages((prev) => {
      if (prev.some((m) => m.id === data.id)) return prev;
      if (data.senderId === myId) return prev;
      return [...prev, data];
    });
  });

  async function handleSend() {
    if (!text.trim() || sendingRef.current) return;
    if (CARD_RE.test(text)) {
      setCardWarning(true);
      return;
    }
    setCardWarning(false);
    sendingRef.current = true;
    setSending(true);
    const trimmed = text.trim();
    setText("");

    const optimisticId = `optimistic-${Date.now()}`;
    const optimistic: Msg = {
      id: optimisticId,
      text: trimmed,
      senderId: myId ?? "",
      senderName: (session?.user as { name?: string | null })?.name ?? (session?.user as { email?: string | null })?.email ?? "Вы",
      senderAvatar: null,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    const res = await fetch(`/api/chats/${convoId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });

    if (res.ok) {
      const data = (await res.json()) as { data: { id: string } };
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? { ...m, id: data.data.id } : m)),
      );
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setText(trimmed);
    }
    sendingRef.current = false;
    setSending(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-700">
        <Link href="/chats" className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {convo && (
          <>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
              {convo.other.name[0]?.toUpperCase()}
            </span>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{convo.other.name}</p>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto py-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-zinc-400">Начните диалог</p>
        )}
        {messages.map((m) => {
          const isMine = m.senderId === myId;
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isMine
                    ? "rounded-tr-sm bg-violet-600 text-white"
                    : "rounded-tl-sm bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <p className={`mt-1 text-right text-[10px] ${isMine ? "text-violet-200" : "text-zinc-400"}`}>
                  {format(new Date(m.createdAt), "HH:mm", { locale: ru })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
        {cardWarning && (
          <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
            ⚠️ Обнаружены данные банковской карты. Никогда не передавайте реквизиты в чате.
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setCardWarning(false); }}
            onKeyDown={handleKey}
            placeholder="Сообщение…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none ring-violet-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            onClick={() => void handleSend()}
            disabled={!text.trim() || sending}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
