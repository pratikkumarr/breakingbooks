"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
      <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Something went wrong!</h2>
      <p className="text-muted text-lg mb-8 max-w-md">
        An unexpected error occurred. We've been notified and are looking into it.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-background hover:opacity-90 transition-all"
        >
          Try again
        </button>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground hover:bg-surface transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
