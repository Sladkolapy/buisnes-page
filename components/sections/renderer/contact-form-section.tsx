"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings }

const inputCls = "w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900";

export function ContactFormSection({ settings }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Contact form submit:", { name, email, phone, message });
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setName(""); setEmail(""); setPhone(""); setMessage("");
  }

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-lg">
        {settings.title && (
          <h2 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 md:text-3xl">{settings.title}</h2>
        )}
        {settings.subtitle && (
          <p className="mb-8 text-center text-sm text-zinc-500">{settings.subtitle}</p>
        )}

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
              <Check className="h-7 w-7 text-green-600" />
            </div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">Сообщение отправлено!</p>
            <p className="text-sm text-zinc-500">Мы свяжемся с вами в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Ваше имя *</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Имя Фамилия" />
            </div>
            {settings.showEmail && (
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="example@mail.ru" />
              </div>
            )}
            {settings.showPhone && (
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Телефон</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+7 (999) 000-00-00" />
              </div>
            )}
            {settings.showMessage && (
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Сообщение</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputCls} resize-none`} rows={4} placeholder="Ваш вопрос или пожелание…" />
              </div>
            )}
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white transition hover:bg-violet-700">
              <Send className="h-4 w-4" /> Отправить
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
