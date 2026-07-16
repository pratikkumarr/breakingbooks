import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/auth/actions";

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
    <nav className="w-full border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl tracking-tight text-foreground flex items-center gap-2">
            <img src="/Logo.png" alt="Breaking Books Logo" className="h-8 w-auto object-contain" />
            Breaking Books
          </Link>
          <Link href="/courses" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Courses
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Login
              </Link>
              <Link href="/signup" className="text-sm font-medium bg-accent text-background px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Dashboard
              </Link>
              {role === "admin" && (
                <Link href="/admin" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                  Admin
                </Link>
              )}
              <form action={logout}>
                <button type="submit" className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                  Log Out
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
