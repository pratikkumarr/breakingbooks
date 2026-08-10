"use client";

import { useFormStatus } from "react-dom";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function MarkCompleteButton({ isCompleted }: { isCompleted: boolean }) {
  const { pending } = useFormStatus();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (pending) {
      timeoutId = setTimeout(() => setShowLoading(true), 200);
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(timeoutId);
  }, [pending]);

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md min-h-[44px] border border-border bg-background hover:bg-surface text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {showLoading ? (
        <>
          <Loader2 className="w-5 h-5 text-muted animate-spin" />
          <span className="text-muted">Updating...</span>
        </>
      ) : isCompleted ? (
        <>
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <span className="text-foreground">Completed</span>
        </>
      ) : (
        <>
          <Circle className="w-5 h-5 text-muted" />
          <span className="text-foreground">Mark Complete</span>
        </>
      )}
    </button>
  );
}
