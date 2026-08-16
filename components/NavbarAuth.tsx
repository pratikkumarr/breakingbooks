"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/auth/actions";
import { MobileNav } from "./MobileNav";

export function NavbarAuth() {
  const [user, setUser] = useState<any>(undefined);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!mounted) return;
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (mounted) setRole(profile?.role || null);
      }
    }
    loadAuth();
    
    return () => { mounted = false; };
  }, []);

  // To prevent layout shift, reserve exact space for the auth controls (approx 160px width for Login/Signup)
  if (user === undefined) {
    return (
      <>
        <div className="hidden sm:flex items-center gap-4 min-w-[160px] opacity-0" aria-hidden="true">
           {/* Invisible spacer to maintain layout */}
           <div className="min-h-[44px] w-[160px]"></div>
        </div>
        {/* Mobile menu button spacer */}
        <div className="sm:hidden w-11 h-11 opacity-0"></div>
      </>
    );
  }

  return (
    <>
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
              <button type="submit" className="text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-all duration-200 flex items-center gap-1 min-h-[44px] px-4 cursor-pointer">
                Log Out
              </button>
            </form>
          </>
        )}
      </div>

      <MobileNav user={user} role={role} />
    </>
  );
}
