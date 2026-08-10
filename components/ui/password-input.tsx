"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rightLabel?: React.ReactNode;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, rightLabel, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between items-center">
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </label>
          {rightLabel && <div>{rightLabel}</div>}
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id={id}
            className={`flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 pr-10 ${className || ""}`}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted/70 hover:text-foreground focus:outline-none cursor-pointer"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
