"use client";

import { useFormStatus } from "react-dom";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Toast } from "@/components/ui/toast";

export function MarkCompleteButton({ isCompleted }: { isCompleted: boolean }) {
  const { pending } = useFormStatus();
  const [showToast, setShowToast] = useState(false);
  const prevIsCompleted = useRef(isCompleted);

  useEffect(() => {
    if (!prevIsCompleted.current && isCompleted) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5100);
      return () => clearTimeout(timer);
    }
    prevIsCompleted.current = isCompleted;
  }, [isCompleted]);

  return (
    <>
      {showToast && <Toast message="Lesson complete!" />}
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md min-h-[44px] border border-border bg-background hover:bg-surface text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {pending ? (
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
    </>
  );
}
