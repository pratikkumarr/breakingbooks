"use client";

import { useFormStatus } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { Loader2, Check } from "lucide-react";
import { Toast } from "@/components/ui/toast";

export function EnrollButton({ isEnrolled }: { isEnrolled: boolean }) {
  const { pending } = useFormStatus();
  const [showToast, setShowToast] = useState(false);
  const prevIsEnrolled = useRef(isEnrolled);

  useEffect(() => {
    if (!prevIsEnrolled.current && isEnrolled) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5100);
      return () => clearTimeout(timer);
    }
    prevIsEnrolled.current = isEnrolled;
  }, [isEnrolled]);

  if (isEnrolled) {
    return (
      <>
        {showToast && <Toast message="You're enrolled! Start learning." />}
        <button
          disabled
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-muted cursor-default opacity-75"
        >
          Enrolled ✓
        </button>
      </>
    );
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 transition-colors duration-200 cursor-pointer bg-accent text-background hover:opacity-90 min-w-[140px]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        "Enroll in Course"
      )}
    </button>
  );
}
