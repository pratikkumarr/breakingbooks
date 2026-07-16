"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Users } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/courses", label: "Courses" },
    { href: "/admin/users", label: "Users" },
  ];

  const getIcon = (label: string) => {
    switch (label) {
      case "Dashboard": return <LayoutDashboard size={18} />;
      case "Courses": return <BookOpen size={18} />;
      case "Users": return <Users size={18} />;
      default: return null;
    }
  };

  return (
    <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 flex-nowrap">
      {links.map((link) => {
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href);
          
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 min-h-[44px] whitespace-nowrap ${
              isActive
                ? "text-[var(--foreground)] bg-[var(--background)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
            }`}
          >
            {getIcon(link.label)}
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
