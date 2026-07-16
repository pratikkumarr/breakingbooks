import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/auth/actions";
import { MobileNav } from "./MobileNav";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role;
  }

  return (
    <nav className="w-full border-b border-border bg-background sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl tracking-tight text-foreground flex items-center gap-3">
            <div className="flex items-center justify-center bg-surface border border-border p-1 rounded-full shadow-sm w-10 h-10 shrink-0">
              <img src="/Logo.png" alt="Breaking Books Logo" className="h-full w-full object-contain rounded-full" />
            </div>
            <span className="inline">Breaking Books</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/courses" className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-200 min-h-[44px] flex items-center">
              Courses
            </Link>
            <Link href={user ? "/dashboard" : "/login"} className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-200 min-h-[44px] flex items-center" title={!user ? "Log in to view your courses" : undefined}>
              My Courses
            </Link>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-200 min-h-[44px] flex items-center">
                Login
              </Link>
              <Link href="/signup" className="text-sm font-medium bg-accent text-background px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-200 min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {role === "admin" && (
                <Link href="/admin" className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-200 min-h-[44px] flex items-center">
                  Admin
                </Link>
              )}
              <form action={logout}>
                <button type="submit" className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center gap-1 min-h-[44px]">
                  Log Out
                </button>
              </form>
            </>
          )}
        </div>

        <MobileNav user={user} role={role} />
      </div>
    </nav>
  );
}
