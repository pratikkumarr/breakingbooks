import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminNav } from "./admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--surface)] p-4 md:p-6 flex flex-col">
        <div className="mb-4 md:mb-8">
          <Link href="/admin" className="text-xl font-bold text-[var(--foreground)] tracking-tight">
            Admin Panel
          </Link>
        </div>

        <AdminNav />

        <div className="pt-4 border-t border-[var(--border)] mt-4 md:mt-auto">
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center justify-center md:justify-start gap-3 px-3 py-2 w-full rounded-md text-red-400 hover:text-red-300 hover:bg-[var(--background)] transition-colors duration-200 min-h-[44px]"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
