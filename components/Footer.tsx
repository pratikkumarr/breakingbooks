import Link from "next/link";

const Youtube = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Breaking Books. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="https://www.youtube.com/@breakinngbooks" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-[#FF0000] transition-colors" aria-label="YouTube Channel">
            <Youtube size={20} />
          </a>
          <Link href="/contact" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
