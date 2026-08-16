"use client";

import { useFormStatus } from "react-dom";
import React from "react";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pendingText?: string;
  variant?: "default" | "outline" | "ghost";
}

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  variant = "default",
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  let variantClasses = "";
  if (variant === "default") {
    variantClasses = "bg-accent text-background hover:opacity-90";
  } else if (variant === "outline") {
    variantClasses = "border border-border bg-surface text-foreground hover:bg-border/30";
  } else if (variant === "ghost") {
    variantClasses = "bg-transparent text-foreground hover:bg-surface";
  }

  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 transition-colors duration-200 cursor-pointer ${variantClasses} ${className || ""}`}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
