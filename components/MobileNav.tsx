"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNav({ user, role }: { user: any, role: string | null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-surface"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 shadow-lg z-50">
          <Link href="/courses" onClick={() => setIsOpen(false)} className="text-base font-medium text-foreground py-3 px-2 min-h-[44px] hover:bg-surface rounded-md">
            Courses
          </Link>
          <Link href={user ? "/dashboard" : "/login"} onClick={() => setIsOpen(false)} className="text-base font-medium text-foreground py-3 px-2 min-h-[44px] hover:bg-surface rounded-md" title={!user ? "Log in to view your courses" : undefined}>
            My Courses
          </Link>
          
          <hr className="border-border" />
          
          {!user ? (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-base font-medium text-foreground py-3 px-2 min-h-[44px] hover:bg-surface rounded-md">
                Login
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)} className="text-base font-medium bg-accent text-background px-4 py-3 rounded-md text-center min-h-[44px]">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {role === "admin" && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="text-base font-medium text-foreground py-3 px-2 min-h-[44px] hover:bg-surface rounded-md">
                  Admin
                </Link>
              )}
              <form action="/auth/signout" method="POST" className="w-full">
                <button type="submit" className="text-base font-medium text-red-400 py-3 px-2 w-full text-left min-h-[44px] hover:bg-surface rounded-md">
                  Log Out
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
