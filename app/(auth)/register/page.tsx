import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Beauty Platform</h1>
          <p className="mt-1 text-sm text-zinc-500">Создайте аккаунт</p>
        </div>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-zinc-500">
          Уже есть аккаунт?{" "}
          <a href="/sign-in" className="font-medium text-violet-600 hover:underline">
            Войти
          </a>
        </p>
      </div>
    </main>
  );
}
