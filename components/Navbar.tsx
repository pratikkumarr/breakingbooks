import Link from "next/link";
import { NavbarAuth } from "./NavbarAuth";

export default function Navbar() {

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
            <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-200 min-h-[44px] flex items-center">
              My Courses
            </Link>
          </div>
        </div>

        <NavbarAuth />
      </div>
    </nav>
  );
}
