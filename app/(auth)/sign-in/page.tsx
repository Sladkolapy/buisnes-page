import { Suspense } from "react";
import SignInForm from "./sign-in-form";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Beauty Platform</h1>
          <p className="mt-1 text-sm text-zinc-500">Войдите в аккаунт</p>
        </div>
        <Suspense fallback={<div className="h-40" />}>
          <SignInForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Нет аккаунта?{" "}
          <a href="/register" className="font-medium text-violet-600 hover:underline">
            Зарегистрироваться
          </a>
        </p>
      </div>
    </main>
  );
}
