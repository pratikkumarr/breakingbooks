import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Breaking Books. All rights reserved.
        </p>
        <Link href="/contact" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
          Contact Us
        </Link>
      </div>
    </footer>
  );
}
