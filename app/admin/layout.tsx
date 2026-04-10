import { Header } from "@/components/layout/header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 pt-6 pb-10">
        <AdminSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
