import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
      <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">404 - Page Not Found</h2>
      <p className="text-muted text-lg mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-background hover:opacity-90 transition-all duration-200"
      >
        Return Home
      </Link>
    </div>
  );
}
