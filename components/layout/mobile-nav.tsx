"use client";

import { Home, MessageCircle, User, LayoutGrid, Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export function MobileNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuth = status === "authenticated";
  const role = (session?.user as { role?: string })?.role;

  const items: NavItem[] = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/chats", label: "Чаты", icon: MessageCircle },
    ...(isAuth
      ? [{ href: "/my-page", label: "Моя страница", icon: LayoutGrid }]
      : []),
    { href: "/profile", label: "Профиль", icon: User },
    ...(role === "ADMIN"
      ? [{ href: "/admin", label: "Админ", icon: Shield }]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center border-t border-zinc-200 bg-white/90 backdrop-blur sm:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition ${
              active
                ? "text-violet-600 dark:text-violet-400"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${active ? "stroke-[2.5]" : "stroke-2"}`}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
